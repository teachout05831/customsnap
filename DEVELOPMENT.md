# Crafted Sites - Development Documentation

## Overview

Crafted Sites is a website building service platform that captures leads, guides them through a discovery questionnaire, and provides a customer portal where clients can track their project progress.

---

## Current Pages & Routes

### Customer-Facing

| Route | Purpose | Status |
|-------|---------|--------|
| `/` | Root redirect | Done |
| `/landing/4` | Main landing page with lead capture form | Done |
| `/discovery` | Discovery questionnaire (served from `public/discovery.html`) | Done |
| `/thank-you` | Confirmation page with portal access link | Done |
| `/portal` | Customer login (email-based) | Done |
| `/portal/dashboard` | Customer dashboard showing project progress | Done |

### Admin Panel

| Route | Purpose | Status |
|-------|---------|--------|
| `/admin` | Admin login (username: admin, password: crafted123) | Done |
| `/admin/dashboard` | Admin dashboard with Projects, Leads, Discovery tabs | Done |

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/leads` | POST | Create new lead |
| `/api/leads` | GET | List all leads |
| `/api/discovery` | POST | Save discovery form + create project |
| `/api/discovery` | GET | List all discovery entries |
| `/api/portal/auth` | POST | Customer email lookup/login |
| `/api/portal/project` | GET | Fetch project data for dashboard |
| `/api/admin/auth` | POST | Admin password login |
| `/api/admin/projects` | GET | List all projects with lead info |
| `/api/admin/projects` | PUT | Update project status/progress/preview |
| `/api/test` | GET | Test Supabase connection |

---

## Customer Flow

```
┌─────────────────┐
│  Landing Page   │
│  /landing/4     │
│                 │
│  Collects:      │
│  - Name         │
│  - Email        │
│  - Phone        │
│  - Website      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Discovery     │
│   /discovery    │
│                 │
│  Collects:      │
│  - Style prefs  │
│  - Challenges   │
│  - Pages needed │
│  - Features     │
│  - Goals        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Thank You     │
│   /thank-you    │
│                 │
│  Shows:         │
│  - Confirmation │
│  - Summary      │
│  - Portal link  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Portal Login   │
│   /portal       │
│                 │
│  Customer enters│
│  their email    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Dashboard     │
│ /portal/dashboard│
│                 │
│  Shows:         │
│  - Progress bar │
│  - Milestones   │
│  - Preview area │
│  - Activity log │
└─────────────────┘
```

---

## Database Schema (Supabase)

### Tables

**leads**
- `id` (uuid, primary key)
- `first_name`, `last_name`, `email`, `phone`
- `current_website`
- `source` (e.g., "landing_page")
- `status` (new, contacted, qualified, converted)
- `created_at`, `updated_at`

**discovery**
- `id` (uuid, primary key)
- `lead_id` (foreign key to leads)
- `style_directions`, `style_reasons`
- `inspiration_urls`, `avoid_features`, `dealbreakers`
- `challenges`, `other_frustrations`, `problem_impact`
- `pages_needed`, `other_pages`
- `must_have_features`, `other_features`
- `service_count`, `services_list`
- `website_goals`, `wants_booking`, `has_booking`
- `additional_notes`, `completed_at`
- `created_at`

**projects**
- `id` (uuid, primary key)
- `lead_id` (foreign key to leads)
- `discovery_id` (foreign key to discovery)
- `status` (intake, design, development, review, complete)
- `progress` (0-100)
- `current_step` (text description)
- `preview_url` (optional)
- `created_at`, `updated_at`

**activity_log**
- `id` (uuid, primary key)
- `lead_id` (foreign key to leads)
- `project_id` (foreign key to projects)
- `action` (title of activity)
- `description` (details)
- `created_at`

---

## Project Status Flow

```
intake → design → development → review → complete
  20%      40%        60%         80%      100%
```

---

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React, TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Icons:** Lucide React
- **UI Components:** shadcn/ui

---

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

## Game Plan - Completed & Remaining Features

### Phase 1: Admin Panel - COMPLETE

- [x] Create `/admin` login page (username: admin, password: crafted123)
- [x] Create `/admin/dashboard` - overview with tabs for Projects, Leads, Discovery
- [x] Project management with inline editing:
  - Update status (intake → design → development → review → complete)
  - Update progress percentage (with slider)
  - Set current step message (shown to customers)
  - Set preview URL
- [x] Activity log auto-created when status changes

### Phase 2: Core Features - COMPLETE

- [x] API endpoint: `PUT /api/admin/projects` - update project
- [x] Activity log entries created on status change
- [x] Preview URL field in project edit form
- [x] Preview shown in customer dashboard (iframe or "Coming Soon")

### Phase 3: Future Enhancements

- [ ] Email notifications when project status changes
- [ ] File upload for logo/assets
- [ ] Comments/messaging between admin and customer
- [ ] Multiple revision rounds tracking
- [ ] Invoice/payment integration
- [ ] Manual activity log posting (custom notes)

---

## Running Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev -- -p 4000

# Build for production
npm run build
```

---

## File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── leads/route.ts
│   │   ├── discovery/route.ts
│   │   ├── portal/
│   │   │   ├── auth/route.ts
│   │   │   └── project/route.ts
│   │   └── test/route.ts
│   ├── landing/4/page.tsx
│   ├── thank-you/page.tsx
│   ├── portal/
│   │   ├── page.tsx (login)
│   │   └── dashboard/page.tsx
│   └── admin/ (TODO)
├── lib/
│   └── supabase.ts
├── components/
└── types/

public/
├── discovery.html
└── admin-designs/ (mockups)
```

---

## Notes

- Customer "accounts" are created automatically when they submit the landing page form
- Login is email-based (no password) - looks up lead by email
- Session is stored in sessionStorage (client-side only)
- RLS policies are currently permissive for development - tighten for production
