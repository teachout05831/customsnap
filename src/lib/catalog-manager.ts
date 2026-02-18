/**
 * Catalog Manager
 *
 * Utilities for reading, writing, and managing the website catalog.
 * Use this when finalizing a website to ensure it's tracked and unique.
 */

import type {
  WebsiteCatalog,
  WebsiteBuild,
  WebsiteCharacteristics,
  Industry,
  LayoutType,
  ColorScheme,
  HeroStyle
} from './catalog';

import {
  calculateSimilarity,
  checkForDuplicates,
  suggestVariations,
  createBuild,
  getCatalogStats
} from './catalog';

// Path to the catalog file (relative to project root)
const CATALOG_PATH = 'generation/website-catalog.json';

/**
 * Load the catalog from disk
 * In a real app, this would read from the file system or database
 */
export async function loadCatalog(): Promise<WebsiteCatalog> {
  // In Node.js environment:
  // const fs = await import('fs/promises');
  // const data = await fs.readFile(CATALOG_PATH, 'utf-8');
  // return JSON.parse(data);

  // For now, return a placeholder that would be replaced with actual file reading
  throw new Error('loadCatalog must be implemented based on your runtime environment');
}

/**
 * Save the catalog to disk
 */
export async function saveCatalog(catalog: WebsiteCatalog): Promise<void> {
  catalog.lastUpdated = new Date().toISOString().split('T')[0];

  // In Node.js environment:
  // const fs = await import('fs/promises');
  // await fs.writeFile(CATALOG_PATH, JSON.stringify(catalog, null, 2));

  throw new Error('saveCatalog must be implemented based on your runtime environment');
}

/**
 * Add a new build to the catalog
 * Checks for duplicates before adding
 */
export async function addBuild(
  catalog: WebsiteCatalog,
  clientName: string,
  industry: Industry,
  characteristics: WebsiteCharacteristics,
  options: {
    templateBase?: string;
    allowSimilar?: boolean;
    similarityThreshold?: number;
  } = {}
): Promise<{
  success: boolean;
  build?: WebsiteBuild;
  error?: string;
  similarBuilds?: Array<{ build: WebsiteBuild; similarity: number }>;
  suggestions?: WebsiteCharacteristics[];
}> {
  const { allowSimilar = false, similarityThreshold = 0.7, templateBase } = options;

  // Check for duplicates
  const duplicateCheck = checkForDuplicates(
    characteristics,
    catalog.builds,
    similarityThreshold
  );

  if (duplicateCheck.isDuplicate && !allowSimilar) {
    // Generate suggestions for making it unique
    const suggestions = suggestVariations(characteristics, catalog.builds, catalog);

    return {
      success: false,
      error: `Build is too similar to existing builds (${Math.round(duplicateCheck.similarBuilds[0].similarity * 100)}% match)`,
      similarBuilds: duplicateCheck.similarBuilds,
      suggestions
    };
  }

  // Create the build
  const build = createBuild(clientName, industry, characteristics, templateBase);
  catalog.builds.push(build);

  return {
    success: true,
    build,
    similarBuilds: duplicateCheck.similarBuilds
  };
}

/**
 * Finalize a build (mark as complete)
 */
export function finalizeBuild(catalog: WebsiteCatalog, buildId: string, url?: string): boolean {
  const build = catalog.builds.find(b => b.id === buildId);
  if (!build) return false;

  build.status = 'finalized';
  build.finalizedAt = new Date().toISOString();
  if (url) build.url = url;

  return true;
}

/**
 * Mark a build as live
 */
export function markBuildLive(catalog: WebsiteCatalog, buildId: string, url: string): boolean {
  const build = catalog.builds.find(b => b.id === buildId);
  if (!build) return false;

  build.status = 'live';
  build.url = url;

  return true;
}

/**
 * Get builds by industry
 */
export function getBuildsByIndustry(catalog: WebsiteCatalog, industry: Industry): WebsiteBuild[] {
  return catalog.builds.filter(b => b.industry === industry);
}

/**
 * Get builds by status
 */
export function getBuildsByStatus(
  catalog: WebsiteCatalog,
  status: WebsiteBuild['status']
): WebsiteBuild[] {
  return catalog.builds.filter(b => b.status === status);
}

/**
 * Generate a recommendation for a new build based on industry
 * Suggests characteristics that haven't been used much for that industry
 */
export function recommendCharacteristics(
  catalog: WebsiteCatalog,
  industry: Industry
): {
  recommended: Partial<WebsiteCharacteristics>;
  avoid: Partial<WebsiteCharacteristics>;
  reasoning: string[];
} {
  const industryBuilds = getBuildsByIndustry(catalog, industry);
  const reasoning: string[] = [];

  // Track what's been used for this industry
  const usedLayouts = new Set<LayoutType>();
  const usedColorSchemes = new Set<ColorScheme>();
  const usedHeroStyles = new Set<HeroStyle>();

  for (const build of industryBuilds) {
    usedLayouts.add(build.characteristics.layout);
    usedColorSchemes.add(build.characteristics.colorScheme);
    usedHeroStyles.add(build.characteristics.heroStyle);
  }

  // Find unused options
  const unusedLayouts = catalog.characteristics.layouts.filter(l => !usedLayouts.has(l));
  const unusedColorSchemes = catalog.characteristics.colorSchemes.filter(c => !usedColorSchemes.has(c));
  const unusedHeroStyles = catalog.characteristics.heroStyles.filter(h => !usedHeroStyles.has(h));

  const recommended: Partial<WebsiteCharacteristics> = {};
  const avoid: Partial<WebsiteCharacteristics> = {};

  // Recommend unused or least used options
  if (unusedLayouts.length > 0) {
    recommended.layout = unusedLayouts[0];
    reasoning.push(`Layout "${unusedLayouts[0]}" hasn't been used for ${industry} yet`);
  }

  if (unusedColorSchemes.length > 0) {
    recommended.colorScheme = unusedColorSchemes[0];
    reasoning.push(`Color scheme "${unusedColorSchemes[0]}" is fresh for ${industry}`);
  }

  if (unusedHeroStyles.length > 0) {
    recommended.heroStyle = unusedHeroStyles[0];
    reasoning.push(`Hero style "${unusedHeroStyles[0]}" would be unique for ${industry}`);
  }

  // Avoid most commonly used
  if (usedLayouts.size > 0) {
    const mostUsedLayout = [...usedLayouts][0]; // In a real impl, count occurrences
    avoid.layout = mostUsedLayout;
  }

  if (industryBuilds.length === 0) {
    reasoning.push(`This is the first ${industry} build - any style works!`);
  }

  return { recommended, avoid, reasoning };
}

/**
 * Print a summary of catalog stats
 */
export function printCatalogSummary(catalog: WebsiteCatalog): string {
  const stats = getCatalogStats(catalog);

  let summary = `
=== WEBSITE CATALOG SUMMARY ===
Total Builds: ${stats.totalBuilds}
Templates: ${Object.keys(catalog.templates).length}

--- Builds by Industry ---
${Object.entries(stats.buildsByIndustry)
    .sort((a, b) => b[1] - a[1])
    .map(([industry, count]) => `  ${industry}: ${count}`)
    .join('\n') || '  (none yet)'}

--- Builds by Layout ---
${Object.entries(stats.buildsByLayout)
    .sort((a, b) => b[1] - a[1])
    .map(([layout, count]) => `  ${layout}: ${count}`)
    .join('\n') || '  (none yet)'}

--- Unused Characteristics ---
  Layouts: ${stats.leastUsedCharacteristics.layouts.join(', ') || '(all used)'}
  Color Schemes: ${stats.leastUsedCharacteristics.colorSchemes.join(', ') || '(all used)'}
  Hero Styles: ${stats.leastUsedCharacteristics.heroStyles.join(', ') || '(all used)'}

--- Most Used Sections ---
${stats.mostUsedSections
    .slice(0, 5)
    .map(({ section, count }) => `  ${section}: ${count}`)
    .join('\n') || '  (none yet)'}
`.trim();

  return summary;
}

/**
 * Export type for use in components
 */
export type { WebsiteCatalog, WebsiteBuild, WebsiteCharacteristics, Industry };
