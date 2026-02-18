// Client status throughout the sales pipeline
export type ClientStatus =
  | "prospect"      // Just created, working on demo
  | "demo_sent"     // Demo link sent to client
  | "approved"      // Client approved, ready to build
  | "in_progress"   // Building production site
  | "deployed"      // Live and done
  | "rejected";     // Client said no

// Template categories for different business types
export type TemplateCategory =
  | "service-business"  // Plumbers, electricians, HVAC, etc.
  | "restaurant"        // Restaurants, cafes, bars
  | "professional"      // Lawyers, accountants, consultants
  | "retail"            // Local shops, boutiques
  | "portfolio";        // Creative businesses, freelancers

// Color scheme for a client site
export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background?: string;
  text?: string;
}

// Hero section content
export interface HeroContent {
  headline: string;
  subheadline?: string;
  cta?: string;
  ctaLink?: string;
  backgroundImage?: string;
}

// Service item for services section
export interface ServiceItem {
  name: string;
  description: string;
  icon?: string;
  image?: string;
}

// Testimonial item
export interface TestimonialItem {
  name: string;
  role?: string;
  company?: string;
  content: string;
  avatar?: string;
  rating?: number;
}

// Contact information
export interface ContactInfo {
  phone?: string;
  email?: string;
  address?: string;
  hours?: string;
  mapUrl?: string;
}

// Social media links
export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
}

// Full client content structure
export interface ClientContent {
  hero: HeroContent;
  about?: {
    title?: string;
    text: string;
    image?: string;
  };
  services?: ServiceItem[];
  testimonials?: TestimonialItem[];
  contact: ContactInfo;
  social?: SocialLinks;
}

// Page definition for multi-page sites
export interface PageConfig {
  slug: string;
  title: string;
  sections: string[]; // Which sections to show on this page
}

// Full client configuration
export interface ClientConfig {
  id: string;
  slug: string;
  name: string;
  email?: string;
  phone?: string;
  status: ClientStatus;

  // Their existing website (if any)
  currentSite?: string;

  // Design configuration
  template: TemplateCategory;
  colors: ColorScheme;
  logo?: string;
  favicon?: string;

  // Content
  content: ClientContent;

  // Multi-page configuration
  pages?: PageConfig[];

  // Metadata
  createdAt: string;
  updatedAt: string;
}

// Template configuration
export interface TemplateConfig {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  thumbnail: string;
  defaultColors: ColorScheme;
  sections: string[];
}
