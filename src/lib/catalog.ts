/**
 * Website Catalog System
 *
 * Tracks finalized website builds to ensure variety and prevent repetition.
 * Each build is cataloged with its key characteristics so we can:
 * 1. Avoid building the same design twice
 * 2. Ensure variety across clients
 * 3. Track which patterns work best
 * 4. Guide AI generation toward unique combinations
 */

export interface WebsiteCharacteristics {
  layout: LayoutType;
  colorScheme: ColorScheme;
  heroStyle: HeroStyle;
  navigation: NavigationStyle;
  primaryCTA: CTAStyle;
  sections: SectionType[];
}

export interface WebsiteBuild {
  id: string;
  clientName: string;
  industry: Industry;
  templateBase: string | null; // null if fully custom
  characteristics: WebsiteCharacteristics;
  createdAt: string;
  finalizedAt: string | null;
  status: 'draft' | 'in-review' | 'finalized' | 'live';
  url?: string;
  notes?: string;
}

export interface WebsiteTemplate {
  name: string;
  file: string;
  status: 'template';
  characteristics: WebsiteCharacteristics;
}

export interface WebsiteCatalog {
  version: string;
  description: string;
  lastUpdated: string;
  templates: Record<string, WebsiteTemplate>;
  builds: WebsiteBuild[];
  characteristics: {
    layouts: LayoutType[];
    colorSchemes: ColorScheme[];
    heroStyles: HeroStyle[];
    navigationStyles: NavigationStyle[];
    ctaStyles: CTAStyle[];
    sectionTypes: SectionType[];
    industries: Industry[];
  };
}

// Type definitions for characteristics
export type LayoutType =
  | 'split-hero'
  | 'centered-hero'
  | 'full-width-hero'
  | 'video-hero'
  | 'carousel-hero';

export type ColorScheme =
  | 'light-gradient'
  | 'light-solid'
  | 'light-warm-accent'
  | 'light-cool-accent'
  | 'light-teal'
  | 'light-purple-gradient'
  | 'dark-solid'
  | 'dark-glow'
  | 'dark-gradient';

export type HeroStyle =
  | 'text-left-image-right'
  | 'text-right-image-left'
  | 'centered-with-product-shot'
  | 'centered-with-floating-stats'
  | 'centered-with-highlight-underline'
  | 'centered-text-only'
  | 'text-left-image-right-with-badge'
  | 'full-background-image'
  | 'video-background';

export type NavigationStyle =
  | 'sticky-minimal'
  | 'sticky-with-phone'
  | 'sticky-with-announcement'
  | 'transparent-scroll-change'
  | 'hamburger-only'
  | 'sidebar';

export type CTAStyle =
  | 'solid-button'
  | 'gradient-button'
  | 'gradient-pill'
  | 'pill-button'
  | 'outline-button'
  | 'ghost-button';

export type SectionType =
  | 'hero'
  | 'announcement'
  | 'social-proof'
  | 'social-proof-bar'
  | 'trust-bar'
  | 'logos'
  | 'services-grid'
  | 'services-numbered'
  | 'features-grid'
  | 'bento-grid'
  | 'stats-bar'
  | 'about-split'
  | 'showcase-split'
  | 'testimonials'
  | 'testimonial-featured'
  | 'case-studies-dark'
  | 'case-studies-light'
  | 'how-it-works'
  | 'process-steps'
  | 'process'
  | 'team-grid'
  | 'pricing'
  | 'faq'
  | 'contact-form'
  | 'service-areas'
  | 'templates-grid'
  | 'cta'
  | 'footer';

export type Industry =
  | 'plumbing'
  | 'hvac'
  | 'electrical'
  | 'roofing'
  | 'landscaping'
  | 'cleaning'
  | 'pest-control'
  | 'auto-repair'
  | 'dental'
  | 'medical'
  | 'legal'
  | 'accounting'
  | 'real-estate'
  | 'restaurant'
  | 'retail'
  | 'fitness'
  | 'salon-spa'
  | 'photography'
  | 'consulting'
  | 'marketing-agency'
  | 'tech-saas'
  | 'construction'
  | 'home-services-general';

/**
 * Calculate similarity score between two website builds
 * Returns a number from 0 (completely different) to 1 (identical)
 */
export function calculateSimilarity(
  build1: WebsiteCharacteristics,
  build2: WebsiteCharacteristics
): number {
  let score = 0;
  let maxScore = 0;

  // Layout match (weight: 3)
  maxScore += 3;
  if (build1.layout === build2.layout) score += 3;

  // Color scheme match (weight: 2)
  maxScore += 2;
  if (build1.colorScheme === build2.colorScheme) score += 2;

  // Hero style match (weight: 3)
  maxScore += 3;
  if (build1.heroStyle === build2.heroStyle) score += 3;

  // Navigation match (weight: 1)
  maxScore += 1;
  if (build1.navigation === build2.navigation) score += 1;

  // CTA style match (weight: 1)
  maxScore += 1;
  if (build1.primaryCTA === build2.primaryCTA) score += 1;

  // Section overlap (weight: 5)
  maxScore += 5;
  const sections1 = new Set(build1.sections);
  const sections2 = new Set(build2.sections);
  const intersection = [...sections1].filter(s => sections2.has(s));
  const union = new Set([...sections1, ...sections2]);
  const sectionSimilarity = intersection.length / union.size;
  score += sectionSimilarity * 5;

  return score / maxScore;
}

/**
 * Check if a proposed build is too similar to existing builds
 */
export function checkForDuplicates(
  proposed: WebsiteCharacteristics,
  existingBuilds: WebsiteBuild[],
  threshold: number = 0.7
): { isDuplicate: boolean; similarBuilds: Array<{ build: WebsiteBuild; similarity: number }> } {
  const similarBuilds: Array<{ build: WebsiteBuild; similarity: number }> = [];

  for (const build of existingBuilds) {
    const similarity = calculateSimilarity(proposed, build.characteristics);
    if (similarity >= threshold) {
      similarBuilds.push({ build, similarity });
    }
  }

  // Sort by similarity descending
  similarBuilds.sort((a, b) => b.similarity - a.similarity);

  return {
    isDuplicate: similarBuilds.length > 0,
    similarBuilds
  };
}

/**
 * Suggest variations to make a build more unique
 */
export function suggestVariations(
  proposed: WebsiteCharacteristics,
  existingBuilds: WebsiteBuild[],
  catalog: WebsiteCatalog
): WebsiteCharacteristics[] {
  const variations: WebsiteCharacteristics[] = [];

  // Find which characteristics are most commonly used
  const usedLayouts = new Map<LayoutType, number>();
  const usedColorSchemes = new Map<ColorScheme, number>();
  const usedHeroStyles = new Map<HeroStyle, number>();

  for (const build of existingBuilds) {
    usedLayouts.set(build.characteristics.layout, (usedLayouts.get(build.characteristics.layout) || 0) + 1);
    usedColorSchemes.set(build.characteristics.colorScheme, (usedColorSchemes.get(build.characteristics.colorScheme) || 0) + 1);
    usedHeroStyles.set(build.characteristics.heroStyle, (usedHeroStyles.get(build.characteristics.heroStyle) || 0) + 1);
  }

  // Find least used options
  const leastUsedLayout = catalog.characteristics.layouts
    .sort((a, b) => (usedLayouts.get(a) || 0) - (usedLayouts.get(b) || 0))[0];

  const leastUsedColorScheme = catalog.characteristics.colorSchemes
    .sort((a, b) => (usedColorSchemes.get(a) || 0) - (usedColorSchemes.get(b) || 0))[0];

  const leastUsedHeroStyle = catalog.characteristics.heroStyles
    .sort((a, b) => (usedHeroStyles.get(a) || 0) - (usedHeroStyles.get(b) || 0))[0];

  // Create variations with least-used characteristics
  if (leastUsedLayout !== proposed.layout) {
    variations.push({ ...proposed, layout: leastUsedLayout });
  }

  if (leastUsedColorScheme !== proposed.colorScheme) {
    variations.push({ ...proposed, colorScheme: leastUsedColorScheme });
  }

  if (leastUsedHeroStyle !== proposed.heroStyle) {
    variations.push({ ...proposed, heroStyle: leastUsedHeroStyle });
  }

  // Suggest a variation that combines multiple changes
  variations.push({
    ...proposed,
    layout: leastUsedLayout,
    colorScheme: leastUsedColorScheme,
    heroStyle: leastUsedHeroStyle
  });

  return variations;
}

/**
 * Generate a unique ID for a new build
 */
export function generateBuildId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `build-${timestamp}-${random}`;
}

/**
 * Create a new build entry
 */
export function createBuild(
  clientName: string,
  industry: Industry,
  characteristics: WebsiteCharacteristics,
  templateBase?: string
): WebsiteBuild {
  return {
    id: generateBuildId(),
    clientName,
    industry,
    templateBase: templateBase || null,
    characteristics,
    createdAt: new Date().toISOString(),
    finalizedAt: null,
    status: 'draft'
  };
}

/**
 * Get statistics about the catalog
 */
export function getCatalogStats(catalog: WebsiteCatalog): {
  totalBuilds: number;
  buildsByIndustry: Record<string, number>;
  buildsByLayout: Record<string, number>;
  buildsByColorScheme: Record<string, number>;
  mostUsedSections: Array<{ section: SectionType; count: number }>;
  leastUsedCharacteristics: {
    layouts: LayoutType[];
    colorSchemes: ColorScheme[];
    heroStyles: HeroStyle[];
  };
} {
  const buildsByIndustry: Record<string, number> = {};
  const buildsByLayout: Record<string, number> = {};
  const buildsByColorScheme: Record<string, number> = {};
  const sectionCounts: Record<string, number> = {};

  for (const build of catalog.builds) {
    // Count by industry
    buildsByIndustry[build.industry] = (buildsByIndustry[build.industry] || 0) + 1;

    // Count by layout
    buildsByLayout[build.characteristics.layout] = (buildsByLayout[build.characteristics.layout] || 0) + 1;

    // Count by color scheme
    buildsByColorScheme[build.characteristics.colorScheme] = (buildsByColorScheme[build.characteristics.colorScheme] || 0) + 1;

    // Count sections
    for (const section of build.characteristics.sections) {
      sectionCounts[section] = (sectionCounts[section] || 0) + 1;
    }
  }

  // Find most used sections
  const mostUsedSections = Object.entries(sectionCounts)
    .map(([section, count]) => ({ section: section as SectionType, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Find least used characteristics
  const usedLayouts = new Set(catalog.builds.map(b => b.characteristics.layout));
  const usedColorSchemes = new Set(catalog.builds.map(b => b.characteristics.colorScheme));
  const usedHeroStyles = new Set(catalog.builds.map(b => b.characteristics.heroStyle));

  const leastUsedCharacteristics = {
    layouts: catalog.characteristics.layouts.filter(l => !usedLayouts.has(l)),
    colorSchemes: catalog.characteristics.colorSchemes.filter(c => !usedColorSchemes.has(c)),
    heroStyles: catalog.characteristics.heroStyles.filter(h => !usedHeroStyles.has(h))
  };

  return {
    totalBuilds: catalog.builds.length,
    buildsByIndustry,
    buildsByLayout,
    buildsByColorScheme,
    mostUsedSections,
    leastUsedCharacteristics
  };
}
