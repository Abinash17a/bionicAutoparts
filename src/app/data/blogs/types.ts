// src/app/data/blogs/types.ts

export interface BlogImage {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

export interface BlogTable {
  caption?: string;
  headers: string[];
  rows: string[][];
}

export interface BlogCallout {
  type: 'info' | 'tip' | 'warning' | 'alert' | 'technical';
  title: string;
  text: string;
}

export interface BlogContentSection {
  id: string;
  heading: string;
  subheading?: string;
  shortAnswer?: string; // Direct answer near beginning of section for AI and quick scanning
  paragraphs: string[];
  bulletPoints?: string[];
  numberedSteps?: string[];
  table?: BlogTable;
  callout?: BlogCallout;
  image?: BlogImage;
}

export interface BlogFaq {
  question: string;
  answer: string;
  supportingDetail?: string;
}

export interface BlogCommercialLink {
  title: string;
  href: string;
  description: string;
  badge?: string;
}

export interface BlogCta {
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  secondaryText?: string;
  secondaryHref?: string;
}

export interface BlogArticle {
  id: number;
  slug: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  subtitle?: string;
  date: string;
  lastUpdated?: string;
  readTime: string;
  category: string;
  author: {
    name: string;
    role: string;
  };
  reviewedBy?: string;
  heroImage: BlogImage;
  keyTakeaway: {
    shortAnswer: string;
    keyPoints: string[];
  };
  introduction: string[];
  sections: BlogContentSection[];
  faqs: BlogFaq[];
  relatedCommercialLinks: BlogCommercialLink[];
  relatedArticles: number[]; // Blog IDs of related articles
  cta: BlogCta;

  // Backwards compatibility with BlogList, sitemap, and existing page consumers
  image: string;
  description: string;
}

export interface BlogSummary {
  id: number;
  slug: string;
  title: string;
  date: string;
  readTime?: string;
  category?: string;
  image: string;
  heroImage?: {
    src: string;
    alt: string;
  };
  description: string;
  metaDescription?: string;
}
