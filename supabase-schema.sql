-- Crafted Sites Database Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- LEADS TABLE
-- People who filled out the landing page form
-- ===========================================
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  current_website TEXT,
  source TEXT DEFAULT 'landing_page',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster email lookups
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_status ON leads(status);

-- ===========================================
-- DISCOVERY TABLE
-- Questionnaire responses
-- ===========================================
CREATE TABLE discovery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,

  -- Step 1: Style
  style_directions TEXT[] DEFAULT '{}',
  style_reasons TEXT[] DEFAULT '{}',
  inspiration_urls TEXT[] DEFAULT '{}',

  -- Step 2: Avoid
  avoid_features TEXT[] DEFAULT '{}',
  dealbreakers TEXT,

  -- Step 3: Challenges
  challenges TEXT[] DEFAULT '{}',
  other_frustrations TEXT[] DEFAULT '{}',
  problem_impact TEXT,

  -- Step 4: Needs
  pages_needed TEXT[] DEFAULT '{}',
  other_pages TEXT,
  must_have_features TEXT[] DEFAULT '{}',
  other_features TEXT,
  service_count TEXT,
  services_list TEXT,

  -- Step 5: Goals
  website_goals TEXT[] DEFAULT '{}',
  wants_booking TEXT,
  has_booking TEXT,
  additional_notes TEXT,

  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for lead lookups
CREATE INDEX idx_discovery_lead_id ON discovery(lead_id);

-- ===========================================
-- PROJECTS TABLE
-- Track website build progress
-- ===========================================
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  discovery_id UUID REFERENCES discovery(id) ON DELETE SET NULL,

  -- Status tracking
  status TEXT DEFAULT 'intake' CHECK (status IN ('intake', 'design', 'development', 'review', 'revision', 'launched')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  current_step TEXT,

  -- URLs
  preview_url TEXT,
  live_url TEXT,

  -- Timeline
  estimated_launch DATE,
  actual_launch DATE,

  -- Details
  package TEXT DEFAULT 'standard',
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for lead lookups
CREATE INDEX idx_projects_lead_id ON projects(lead_id);
CREATE INDEX idx_projects_status ON projects(status);

-- ===========================================
-- ACTIVITY LOG TABLE
-- Track what's happening on each project
-- ===========================================
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activity_project_id ON activity_log(project_id);

-- ===========================================
-- ROW LEVEL SECURITY (RLS)
-- ===========================================
-- Enable RLS on all tables
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE discovery ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous inserts for leads (from landing page)
CREATE POLICY "Allow anonymous lead inserts" ON leads
  FOR INSERT TO anon
  WITH CHECK (true);

-- Policy: Allow anonymous inserts for discovery (from questionnaire)
CREATE POLICY "Allow anonymous discovery inserts" ON discovery
  FOR INSERT TO anon
  WITH CHECK (true);

-- Policy: Allow authenticated users to read their own data
CREATE POLICY "Users can read own lead data" ON leads
  FOR SELECT TO authenticated
  USING (email = auth.jwt() ->> 'email');

CREATE POLICY "Users can read own discovery data" ON discovery
  FOR SELECT TO authenticated
  USING (lead_id IN (SELECT id FROM leads WHERE email = auth.jwt() ->> 'email'));

CREATE POLICY "Users can read own projects" ON projects
  FOR SELECT TO authenticated
  USING (lead_id IN (SELECT id FROM leads WHERE email = auth.jwt() ->> 'email'));

CREATE POLICY "Users can read own activity" ON activity_log
  FOR SELECT TO authenticated
  USING (project_id IN (
    SELECT id FROM projects WHERE lead_id IN (
      SELECT id FROM leads WHERE email = auth.jwt() ->> 'email'
    )
  ));

-- Policy: Service role can do everything (for admin)
CREATE POLICY "Service role full access leads" ON leads
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access discovery" ON discovery
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access projects" ON projects
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access activity" ON activity_log
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- ===========================================
-- HELPER FUNCTION: Update timestamp
-- ===========================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for auto-updating timestamps
CREATE TRIGGER update_leads_timestamp
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_projects_timestamp
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ===========================================
-- SAMPLE DATA (Optional - for testing)
-- ===========================================
-- Uncomment to insert test data:
/*
INSERT INTO leads (first_name, last_name, email, phone, current_website, status)
VALUES ('John', 'Smith', 'john@example.com', '555-123-4567', 'oldsite.com', 'new');
*/

