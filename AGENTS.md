# Website Builder - Agent Instructions

This file contains long-term knowledge for AI agents working on this project.

## Project Overview

A Next.js-based website builder platform that:
1. Hosts a main marketing site for web development services
2. Creates and manages preview sites for prospective clients
3. Uses templates and AI assistance to rapidly build client mockups
4. Allows export of approved designs to production deployment

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| UI Components | Shadcn UI |
| Icons | Lucide React |
| Package Manager | npm |

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (marketing)/        # Public marketing pages (future)
│   ├── (dashboard)/        # Admin dashboard (future)
│   ├── preview/            # Client preview sites
│   │   └── [clientSlug]/   # Dynamic client preview
│   └── api/                # API routes (future)
├── components/
│   ├── ui/                 # Shadcn UI components
│   ├── templates/          # Template section components
│   │   ├── headers/
│   │   ├── heroes/
│   │   ├── services/
│   │   ├── testimonials/
│   │   ├── contact/
│   │   └── footers/
│   └── dashboard/          # Dashboard components (future)
├── templates/              # Full page templates
│   └── service-business/   # Service business template
├── data/
│   └── clients/            # Client JSON configuration files
├── lib/                    # Utility functions
├── types/                  # TypeScript type definitions
└── hooks/                  # Custom React hooks
```

## Key Patterns

### Client Data
- Client configurations stored as JSON in `src/data/clients/[slug].json`
- Loaded via `getClientBySlug()` from `src/lib/clients.ts`
- Type definitions in `src/types/index.ts`

### Templates
- Templates are React components that accept a `ClientData` prop
- Templates compose section components (Header, Hero, Services, etc.)
- Section components are reusable across different templates

### Preview Routes
- Dynamic route: `/preview/[clientSlug]`
- Loads client data and renders appropriate template
- Server-side rendered with `generateStaticParams`

## Coding Standards

### TypeScript
- Always define prop interfaces
- Use strict types, avoid `any`
- Export types from `src/types/index.ts`

### Components
- Use function components with TypeScript
- Props interface named `[ComponentName]Props`
- Default exports for page components
- Named exports for reusable components

### Styling
- Tailwind CSS classes only, no external CSS files
- Use `cn()` utility for conditional classes
- Mobile-first responsive design
- Use CSS variables for theme colors when needed

### File Naming
- Components: PascalCase (e.g., `ServiceHero.tsx`)
- Utilities: camelCase (e.g., `clients.ts`)
- Pages: `page.tsx` (Next.js convention)

## Common Gotchas

1. **Windows Environment**: Use PowerShell commands, not bash
2. **Path Separators**: Use forward slashes in imports even on Windows
3. **Shadcn Components**: Import from `@/components/ui/[component]`
4. **Lucide Icons**: Import individually, e.g., `import { Phone } from 'lucide-react'`
5. **Client JSON**: Must match `ClientData` type exactly

## Testing Checklist

Before completing any story:
- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] Feature works at expected URL
- [ ] Mobile responsive (if UI)
- [ ] No TypeScript errors
- [ ] No console errors in browser

## Ralph Workflow Files

| File | Purpose |
|------|---------|
| `prd.json` | Task registry with stories and acceptance criteria |
| `progress.txt` | Short-term learning log between iterations |
| `prompt.md` | System prompt for Ralph iterations |
| `AGENTS.md` | This file - long-term project knowledge |

When you learn something important about this codebase, update this file.
