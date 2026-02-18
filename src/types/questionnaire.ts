// Discovery Questionnaire Types

export type StyleDirection =
  | 'modern-clean'
  | 'bold-colorful'
  | 'warm-friendly'
  | 'professional-polished';

export type ServiceCount = '1-3' | '4-8' | '9+';

export type Timeline =
  | 'asap'
  | 'one-month'
  | 'two-three-months'
  | 'no-rush';

export interface DiscoveryQuestionnaire {
  // Metadata
  currentStep: number;
  completedAt?: string;

  // Step 1: Style & Inspiration
  styleDirection?: StyleDirection;
  styleReasons: string[];
  inspirationUrls?: string[];

  // Step 2: What to Avoid
  avoidFeatures: string[];
  dealbreakers?: string;

  // Step 3: Challenges
  biggestChallenge?: string;
  otherFrustrations?: string[];
  problemImpact?: string;

  // Step 4: Website Needs
  pagesNeeded: string[];
  mustHaveFeatures: string[];
  serviceCount?: ServiceCount;

  // Step 5: Goals
  primaryGoal?: string;
  timeline?: Timeline;
  additionalNotes?: string;
}

// Initial state with defaults
export const initialQuestionnaire: DiscoveryQuestionnaire = {
  currentStep: 1,
  styleReasons: [],
  avoidFeatures: [],
  pagesNeeded: ['home', 'about', 'services', 'contact'], // Pre-checked defaults
  mustHaveFeatures: [],
};

// Option definitions for each step
export const STYLE_OPTIONS = [
  {
    id: 'modern-clean',
    label: 'Modern & Clean',
    description: 'Minimal, lots of white space, simple elegance',
  },
  {
    id: 'bold-colorful',
    label: 'Bold & Colorful',
    description: 'Vibrant colors, energetic, eye-catching',
  },
  {
    id: 'warm-friendly',
    label: 'Warm & Friendly',
    description: 'Earthy tones, inviting, approachable',
  },
  {
    id: 'professional-polished',
    label: 'Professional & Polished',
    description: 'Corporate feel, sleek, trustworthy',
  },
] as const;

export const STYLE_REASONS = [
  { id: 'clean-layout', label: 'Clean layout' },
  { id: 'strong-colors', label: 'Strong colors' },
  { id: 'good-photos', label: 'Good photos' },
  { id: 'easy-navigation', label: 'Easy navigation' },
  { id: 'modern-look', label: 'Modern look' },
  { id: 'trustworthy-feel', label: 'Trustworthy feel' },
] as const;

export const AVOID_OPTIONS = [
  { id: 'cluttered', label: 'Cluttered/busy' },
  { id: 'outdated', label: 'Looks outdated' },
  { id: 'hard-to-navigate', label: 'Hard to navigate' },
  { id: 'slow-loading', label: 'Slow loading' },
  { id: 'too-much-text', label: 'Too much text' },
  { id: 'annoying-popups', label: 'Annoying popups' },
  { id: 'cheap-unprofessional', label: 'Cheap/unprofessional' },
  { id: 'stock-photos', label: 'Stock photo overload' },
] as const;

export const CHALLENGE_OPTIONS = [
  {
    id: 'more-leads',
    label: 'Need more leads/customers',
    description: 'I want more people reaching out',
  },
  {
    id: 'build-credibility',
    label: 'Want to build credibility',
    description: 'Establish trust with potential customers',
  },
  {
    id: 'stand-out',
    label: 'Need to stand out from competition',
    description: 'Differentiate from competitors',
  },
  {
    id: 'explain-services',
    label: 'Hard to explain what I do',
    description: 'Need clarity in messaging',
  },
  {
    id: 'professional-presence',
    label: 'Just need a professional presence',
    description: 'Simple, clean online presence',
  },
] as const;

export const FRUSTRATION_OPTIONS = [
  { id: 'site-outdated', label: 'Current site is outdated' },
  { id: 'no-google', label: 'Not showing up on Google' },
  { id: 'not-mobile', label: "Site doesn't work on mobile" },
  { id: 'embarrassed', label: 'Embarrassed to share link' },
  { id: 'no-website', label: "Don't have a website yet" },
  { id: 'hard-to-update', label: 'Hard to update myself' },
] as const;

export const PAGE_OPTIONS = [
  { id: 'home', label: 'Home', default: true, disabled: true },
  { id: 'about', label: 'About Us', default: true },
  { id: 'services', label: 'Services/What We Do', default: true },
  { id: 'contact', label: 'Contact', default: true },
  { id: 'gallery', label: 'Gallery/Portfolio' },
  { id: 'testimonials', label: 'Reviews/Testimonials' },
  { id: 'faq', label: 'FAQ' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'team', label: 'Team' },
  { id: 'blog', label: 'Blog' },
] as const;

export const FEATURE_OPTIONS = [
  { id: 'contact-form', label: 'Contact form' },
  { id: 'click-to-call', label: 'Click-to-call' },
  { id: 'map', label: 'Map/directions' },
  { id: 'photo-gallery', label: 'Photo gallery' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'online-booking', label: 'Online booking' },
  { id: 'quote-request', label: 'Quote request' },
  { id: 'social-links', label: 'Social links' },
] as const;

export const SERVICE_COUNT_OPTIONS = [
  { id: '1-3', label: '1-3 services' },
  { id: '4-8', label: '4-8 services' },
  { id: '9+', label: '9+ services' },
] as const;

export const GOAL_OPTIONS = [
  {
    id: 'more-calls-leads',
    label: 'Get more phone calls & leads',
    description: 'Drive inquiries and contact requests',
  },
  {
    id: 'book-appointments',
    label: 'Book more appointments',
    description: 'Fill up your schedule',
  },
  {
    id: 'build-trust',
    label: 'Build trust & credibility',
    description: 'Establish expertise and reliability',
  },
  {
    id: 'showcase-work',
    label: 'Showcase my work',
    description: 'Display portfolio and projects',
  },
  {
    id: 'sell-online',
    label: 'Sell products/services online',
    description: 'Enable online transactions',
  },
] as const;

export const TIMELINE_OPTIONS = [
  { id: 'asap', label: 'ASAP (within 2 weeks)' },
  { id: 'one-month', label: 'Within a month' },
  { id: 'two-three-months', label: '2-3 months' },
  { id: 'no-rush', label: 'No rush - just want it done right' },
] as const;

// Validation helpers
export function isStep1Valid(data: DiscoveryQuestionnaire): boolean {
  return !!data.styleDirection && data.styleReasons.length > 0;
}

export function isStep2Valid(data: DiscoveryQuestionnaire): boolean {
  return data.avoidFeatures.length > 0;
}

export function isStep3Valid(data: DiscoveryQuestionnaire): boolean {
  return !!data.biggestChallenge;
}

export function isStep4Valid(data: DiscoveryQuestionnaire): boolean {
  return data.pagesNeeded.length > 0 &&
         data.mustHaveFeatures.length > 0 &&
         !!data.serviceCount;
}

export function isStep5Valid(data: DiscoveryQuestionnaire): boolean {
  return !!data.primaryGoal && !!data.timeline;
}

export function isStepValid(step: number, data: DiscoveryQuestionnaire): boolean {
  switch (step) {
    case 1: return isStep1Valid(data);
    case 2: return isStep2Valid(data);
    case 3: return isStep3Valid(data);
    case 4: return isStep4Valid(data);
    case 5: return isStep5Valid(data);
    default: return false;
  }
}
