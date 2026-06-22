export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  category: string;
  tags: string[];
  published: boolean;
  featured: boolean;
  readTime: number;
  seoTitle: string | null;
  seoDesc: string | null;
  publishedAt: Date;
  updatedAt: Date;
}

export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  category: string;
  client: string | null;
  industry: string | null;
  results: Record<string, string> | null;
  tags: string[];
  published: boolean;
  featured: boolean;
  seoTitle: string | null;
  seoDesc: string | null;
  publishedAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string | null;
  category: string;
  tags: string[];
  url: string | null;
  featured: boolean;
  order: number;
}

export interface Stat {
  id: string;
  label: string;
  value: number;
  suffix: string;
  order: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  icon: string;
  features: string[];
}

export interface StorySection {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image?: string;
}
