# Website Catalog System

## Purpose

This system tracks all finalized website builds to ensure **variety** and prevent building the same design twice. Each website is cataloged with its key characteristics.

## How It Works

### 1. Characteristics Tracked

Every website is tagged with:

| Characteristic | Options |
|----------------|---------|
| **Layout** | split-hero, centered-hero, full-width-hero, video-hero, carousel-hero |
| **Color Scheme** | light-gradient, light-solid, dark-glow, dark-gradient, etc. |
| **Hero Style** | text-left-image-right, centered-with-product-shot, full-background-image, etc. |
| **Navigation** | sticky-minimal, sticky-with-phone, transparent-scroll-change, etc. |
| **CTA Style** | solid-button, gradient-button, pill-button, outline-button |
| **Sections** | Array of section types used (hero, services-grid, testimonials, etc.) |
| **Industry** | plumbing, hvac, dental, restaurant, etc. |

### 2. Similarity Detection

When you're about to finalize a new website, the system:

1. Compares it against all existing builds
2. Calculates a similarity score (0-100%)
3. **Flags if >70% similar** to an existing build
4. Suggests variations to make it unique

### 3. Usage Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    BUILD A NEW WEBSITE                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Check recommendations for the industry                   │
│     └─> Shows unused layouts, colors, hero styles           │
│                                                              │
│  2. Design the website with unique characteristics           │
│                                                              │
│  3. Before finalizing, run duplicate check                   │
│     └─> If >70% similar: get suggestions                    │
│     └─> If unique: proceed to finalize                      │
│                                                              │
│  4. Add to catalog with all characteristics                  │
│                                                              │
│  5. Mark as 'finalized' or 'live' when published            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Quick Reference

### When Starting a New Build

Before designing, check what's been used:

```typescript
import { recommendCharacteristics } from '@/lib/catalog-manager';

const { recommended, avoid, reasoning } = recommendCharacteristics(catalog, 'plumbing');

// Output example:
// recommended: { layout: 'video-hero', colorScheme: 'dark-glow' }
// avoid: { layout: 'split-hero' } // already used 3 times
// reasoning: ['Layout "video-hero" hasn\'t been used for plumbing yet']
```

### When Finalizing a Build

Before marking complete, check for duplicates:

```typescript
import { addBuild } from '@/lib/catalog-manager';

const result = await addBuild(catalog, 'ABC Plumbing', 'plumbing', {
  layout: 'split-hero',
  colorScheme: 'light-teal',
  heroStyle: 'text-left-image-right',
  navigation: 'sticky-with-phone',
  primaryCTA: 'solid-button',
  sections: ['hero', 'trust-bar', 'services-grid', 'testimonials', 'contact-form', 'footer']
});

if (!result.success) {
  console.log('Too similar to:', result.similarBuilds);
  console.log('Try these variations:', result.suggestions);
}
```

## Catalog File Structure

```
generation/
├── website-catalog.json    # The main catalog (commit this!)
├── templates/              # HTML template files
│   ├── 01-modern-agency.html
│   ├── 02-bold-dark-saas.html
│   └── ...
└── CATALOG_USAGE.md        # This file
```

## Manual Entry (Without Code)

If you're building a website manually, add it to `website-catalog.json`:

```json
{
  "builds": [
    {
      "id": "build-abc123",
      "clientName": "ABC Plumbing",
      "industry": "plumbing",
      "templateBase": "03-clean-minimal-service",
      "characteristics": {
        "layout": "split-hero",
        "colorScheme": "light-teal",
        "heroStyle": "text-left-image-right-with-badge",
        "navigation": "sticky-with-phone",
        "primaryCTA": "solid-button",
        "sections": ["hero", "trust-bar", "services-grid", "about-split", "testimonials", "contact-form", "footer"]
      },
      "createdAt": "2026-01-19T10:00:00Z",
      "finalizedAt": "2026-01-20T15:00:00Z",
      "status": "live",
      "url": "https://abcplumbing.com"
    }
  ]
}
```

## Best Practices

1. **Always check recommendations** before starting a new industry build
2. **Vary at least 2-3 characteristics** from similar industry builds
3. **Track even drafts** - mark them as "draft" status
4. **Update status** when sites go live
5. **Add notes** for client preferences or special requirements

## Keeping it Simple

If you don't want to use the TypeScript utilities, just:

1. Open `website-catalog.json`
2. Check what layouts/colors have been used for the industry
3. Pick different ones
4. Add your build to the `builds` array when done

The goal is simple: **don't build the same looking website twice**.
