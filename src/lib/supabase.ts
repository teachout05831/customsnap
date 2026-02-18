import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  current_website?: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted';
  created_at: string;
  updated_at: string;
}

export interface Discovery {
  id: string;
  lead_id?: string;
  style_directions: string[];
  style_reasons: string[];
  inspiration_urls: string[];
  avoid_features: string[];
  dealbreakers?: string;
  challenges: string[];
  other_frustrations: string[];
  problem_impact?: string;
  pages_needed: string[];
  must_have_features: string[];
  service_count?: string;
  services_list?: string;
  website_goals: string[];
  wants_booking?: string;
  has_booking?: string;
  additional_notes?: string;
  completed_at: string;
  created_at: string;
}

export interface Project {
  id: string;
  lead_id: string;
  discovery_id?: string;
  status: 'intake' | 'design' | 'development' | 'review' | 'launched';
  progress: number;
  preview_url?: string;
  live_url?: string;
  estimated_launch?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerUser {
  id: string;
  lead_id: string;
  email: string;
  password_hash?: string; // For simple auth, we'll use Supabase Auth instead
  last_login?: string;
  created_at: string;
}
