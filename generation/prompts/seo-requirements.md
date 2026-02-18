# SEO Requirements for Generated Websites

This document defines the SEO standards that Claude Code MUST follow when generating websites. These requirements ensure generated sites rank well in search engines.

---

## 1. Core Web Vitals Targets

Generated sites MUST meet Google's Core Web Vitals thresholds:

| Metric | Target | What It Measures |
|--------|--------|------------------|
| **LCP** (Largest Contentful Paint) | ≤ 2.5 seconds | Perceived load speed |
| **INP** (Interaction to Next Paint) | ≤ 200 milliseconds | Responsiveness/interactivity |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | Visual stability |

### How to achieve these targets:

**For LCP:**
- Optimize the largest visible element (usually hero image or headline)
- Use `loading="eager"` for above-the-fold images
- Preload critical fonts: `<link rel="preload" href="font.woff2" as="font" crossorigin>`
- Inline critical CSS in `<head>` or keep CSS minimal
- No render-blocking JavaScript

**For INP:**
- Minimal JavaScript (vanilla JS only, no frameworks)
- No heavy event listeners on page load
- Use `requestAnimationFrame()` for animations
- Debounce scroll/resize handlers

**For CLS:**
- Always specify `width` and `height` attributes on images
- Reserve space for dynamic content with CSS `aspect-ratio`
- Use `font-display: swap` for web fonts
- Never inject content above existing content

---

## 2. HTML Structure Requirements

### Document Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- SEO Meta Tags (REQUIRED) -->
    <title>[Page Title] | [Site Name]</title>
    <meta name="description" content="[150-160 character description]">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="[full canonical URL]">

    <!-- Open Graph (REQUIRED for social sharing) -->
    <meta property="og:title" content="[Title]">
    <meta property="og:description" content="[Description]">
    <meta property="og:image" content="[Image URL - 1200x630px]">
    <meta property="og:url" content="[Page URL]">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="[Site Name]">

    <!-- Twitter Card (REQUIRED for Twitter/X sharing) -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="[Title]">
    <meta name="twitter:description" content="[Description]">
    <meta name="twitter:image" content="[Image URL]">

    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">

    <!-- Preconnect to external resources -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <link rel="stylesheet" href="/css/styles.css">
</head>
```

### Heading Hierarchy
- ONE `<h1>` per page (the main topic)
- Logical hierarchy: h1 → h2 → h3 (never skip levels)
- Headings should contain relevant keywords naturally

```html
<h1>Wedding Photography in Austin, Texas</h1>
  <h2>Our Services</h2>
    <h3>Engagement Sessions</h3>
    <h3>Wedding Day Coverage</h3>
  <h2>Portfolio</h2>
  <h2>About Sarah Chen</h2>
  <h2>Contact Us</h2>
```

### Semantic HTML Elements
ALWAYS use semantic elements:
```html
<header>     <!-- Site header with navigation -->
<nav>        <!-- Navigation menus -->
<main>       <!-- Main content (one per page) -->
<article>    <!-- Self-contained content -->
<section>    <!-- Thematic grouping -->
<aside>      <!-- Related but separate content -->
<footer>     <!-- Site footer -->
```

---

## 3. Title Tag & Meta Description

### Title Tag Rules
- Format: `[Primary Keyword] - [Secondary Info] | [Brand]`
- Length: 50-60 characters (Google truncates after ~60)
- Unique for every page
- Front-load important keywords

**Examples:**
```html
<!-- Homepage -->
<title>Sarah Chen Photography | Wedding Photographer in Austin, TX</title>

<!-- Service page -->
<title>Wedding Photography Packages & Pricing | Sarah Chen Photography</title>

<!-- About page -->
<title>About Sarah Chen | Award-Winning Austin Wedding Photographer</title>
```

### Meta Description Rules
- Length: 150-160 characters
- Include primary keyword naturally
- Include a call-to-action
- Unique for every page
- Describe the page's value proposition

**Example:**
```html
<meta name="description" content="Capturing your love story in Austin, TX. Sarah Chen offers wedding photography packages starting at $2,500. Book your free consultation today.">
```

---

## 4. Image Optimization

### Required Attributes
```html
<img
    src="/images/hero.webp"
    alt="Bride and groom kissing at sunset at Barton Creek wedding venue"
    width="1200"
    height="800"
    loading="lazy"
>
```

### Rules:
1. **Alt text**: Descriptive, includes context. Not "image1.jpg" or "photo"
2. **Width/height**: ALWAYS specified to prevent CLS
3. **Loading**: Use `loading="lazy"` for below-fold images, `loading="eager"` for hero
4. **Format**: Prefer WebP with JPEG fallback
5. **File names**: Descriptive (`austin-wedding-photographer.webp` not `IMG_001.webp`)

### Responsive Images (when applicable)
```html
<picture>
    <source srcset="/images/hero-large.webp" media="(min-width: 1200px)">
    <source srcset="/images/hero-medium.webp" media="(min-width: 768px)">
    <img src="/images/hero-small.webp" alt="Description" width="800" height="600">
</picture>
```

---

## 5. Internal Linking

### Rules:
1. Every page should be reachable within 3 clicks from homepage
2. Use descriptive anchor text (not "click here")
3. Link to related content naturally
4. Include breadcrumb navigation for multi-page sites

**Good:**
```html
<a href="/services/wedding-photography">View our wedding photography packages</a>
```

**Bad:**
```html
<a href="/services/wedding-photography">Click here</a>
```

### Navigation Structure
```html
<nav aria-label="Main navigation">
    <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/portfolio">Portfolio</a></li>
        <li><a href="/services">Services</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
    </ul>
</nav>
```

---

## 6. Structured Data (JSON-LD)

ALWAYS include appropriate Schema.org markup in `<head>`:

### For Local Businesses
```html
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Sarah Chen Photography",
    "description": "Professional wedding photographer in Austin, Texas",
    "url": "https://www.sarahchenphotography.com",
    "telephone": "+1-512-555-0123",
    "email": "hello@sarahchenphotography.com",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "123 Main Street",
        "addressLocality": "Austin",
        "addressRegion": "TX",
        "postalCode": "78701",
        "addressCountry": "US"
    },
    "geo": {
        "@type": "GeoCoordinates",
        "latitude": 30.2672,
        "longitude": -97.7431
    },
    "openingHours": "Mo-Fr 09:00-17:00",
    "priceRange": "$$",
    "image": "https://www.sarahchenphotography.com/images/logo.png",
    "sameAs": [
        "https://www.instagram.com/sarahchenphotography",
        "https://www.facebook.com/sarahchenphotography"
    ]
}
</script>
```

### For Portfolio/Creative Sites
```html
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Sarah Chen Photography",
    "url": "https://www.sarahchenphotography.com",
    "description": "Professional wedding photography portfolio"
}
</script>
```

### For Service Pages
```html
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Wedding Photography",
    "provider": {
        "@type": "LocalBusiness",
        "name": "Sarah Chen Photography"
    },
    "description": "Full-day wedding photography coverage",
    "areaServed": {
        "@type": "City",
        "name": "Austin, Texas"
    }
}
</script>
```

---

## 7. URL Structure

### Rules:
1. Use hyphens, not underscores: `/wedding-photography` not `/wedding_photography`
2. Lowercase only
3. Short and descriptive
4. Include relevant keywords
5. No special characters or spaces

**Good URLs:**
```
/
/portfolio
/services/wedding-photography
/about
/contact
/blog/austin-wedding-venues
```

**Bad URLs:**
```
/page?id=123
/Wedding_Photography
/services/wedding photography
/p/12345
```

---

## 8. Mobile Optimization

### Required Viewport Meta
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### CSS Requirements:
- Mobile-first approach (base styles for mobile, media queries for larger)
- Minimum font size: 16px for body text
- Minimum tap target: 44x44 pixels
- No horizontal scrolling

```css
/* Mobile-first base styles */
body {
    font-size: 16px;
    line-height: 1.6;
}

/* Touch targets */
button,
a.button,
input[type="submit"] {
    min-height: 44px;
    min-width: 44px;
    padding: 12px 24px;
}

/* Responsive breakpoints */
@media (min-width: 768px) {
    /* Tablet styles */
}

@media (min-width: 1024px) {
    /* Desktop styles */
}
```

---

## 9. Page Speed Optimization

### CSS:
- One CSS file only (`styles.css`)
- Minified in production
- No unused CSS
- Critical CSS inlined for above-the-fold content (optional but recommended)

### JavaScript:
- One JS file only (`main.js`)
- Loaded with `defer` attribute
- Minified in production
- No render-blocking scripts

```html
<script src="/js/main.js" defer></script>
```

### Fonts:
- Maximum 2 font families
- Use `font-display: swap`
- Preload critical fonts

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
```

---

## 10. Required Files for Every Generated Site

### robots.txt
```
User-agent: *
Allow: /

Sitemap: https://[domain]/sitemap.xml
```

### sitemap.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://[domain]/</loc>
        <lastmod>2026-01-19</lastmod>
        <changefreq>monthly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://[domain]/about</loc>
        <lastmod>2026-01-19</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <!-- Additional pages... -->
</urlset>
```

### 404.html
A custom 404 page that:
- Maintains site branding
- Provides navigation back to main pages
- Suggests helpful links

---

## 11. Accessibility (Also Helps SEO)

1. **ARIA labels** on interactive elements:
```html
<button aria-label="Open menu">☰</button>
<nav aria-label="Main navigation">...</nav>
```

2. **Skip link** for keyboard users:
```html
<a href="#main-content" class="skip-link">Skip to main content</a>
```

3. **Focus styles** visible:
```css
:focus {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
}
```

4. **Color contrast**: WCAG AA minimum (4.5:1 for text, 3:1 for large text)

5. **Form labels** always associated:
```html
<label for="email">Email Address</label>
<input type="email" id="email" name="email" required>
```

---

## 12. Content Guidelines

### For Generated Copy:
1. Use the primary keyword in the first 100 words
2. Natural keyword usage (no stuffing)
3. Clear, concise sentences
4. Break up text with headings every 300 words
5. Include relevant internal links

### Minimum Content Length:
- Homepage: 300+ words
- Service pages: 500+ words
- About page: 300+ words
- Blog posts: 800+ words

---

## Checklist for Every Generated Site

- [ ] Unique title tag on every page (50-60 chars)
- [ ] Unique meta description on every page (150-160 chars)
- [ ] One H1 per page with primary keyword
- [ ] Logical heading hierarchy (h1→h2→h3)
- [ ] All images have descriptive alt text
- [ ] All images have width/height attributes
- [ ] Semantic HTML elements used throughout
- [ ] JSON-LD structured data included
- [ ] Open Graph meta tags included
- [ ] Twitter Card meta tags included
- [ ] Mobile responsive with proper viewport
- [ ] robots.txt file included
- [ ] sitemap.xml file included
- [ ] 404.html custom error page included
- [ ] All internal links working
- [ ] Clean URL structure
- [ ] Minimum 16px body font size
- [ ] 44px minimum touch targets
- [ ] Proper color contrast ratios
- [ ] No render-blocking resources
