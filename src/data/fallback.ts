import type { BlogPost, CaseStudy, Project, Stat } from "@/types";

export const fallbackStats: Stat[] = [
  { id: "1", label: "SEO Projects", value: 48, suffix: "+", order: 1 },
  { id: "2", label: "Organic Traffic Growth", value: 312, suffix: "%", order: 2 },
  { id: "3", label: "Technical Articles", value: 86, suffix: "+", order: 3 },
  { id: "4", label: "Product Launches", value: 24, suffix: "+", order: 4 },
];

export const fallbackProjects: Project[] = [
  {
    id: "1",
    slug: "saas-seo-transformation",
    title: "SaaS SEO Transformation",
    description:
      "Led a full technical SEO overhaul for a B2B SaaS platform, achieving 4.2x organic traffic in 8 months.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    category: "SEO",
    tags: ["Technical SEO", "Content Strategy", "SaaS"],
    url: "/case-studies/saas-seo-transformation",
    featured: true,
    order: 1,
  },
  {
    id: "2",
    slug: "design-system-growth",
    title: "Design System & Growth",
    description:
      "Built a scalable design system that reduced development time by 40% and improved conversion by 28%.",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
    category: "Product",
    tags: ["Design Systems", "UX", "Conversion"],
    url: "/case-studies/design-system-growth",
    featured: true,
    order: 2,
  },
  {
    id: "3",
    slug: "distributed-systems-blog",
    title: "Distributed Systems Blog",
    description:
      "Created a technical blog series on distributed systems with 500K+ monthly readers.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    category: "Tech",
    tags: ["Computer Science", "Technical Writing"],
    url: "/blog/distributed-systems-fundamentals",
    featured: true,
    order: 3,
  },
  {
    id: "4",
    slug: "ecommerce-seo-audit",
    title: "E-commerce SEO Audit",
    description:
      "Comprehensive SEO audit and remediation for a global e-commerce brand with 2M+ product pages.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
    category: "SEO",
    tags: ["E-commerce", "Crawl Budget", "Schema"],
    url: "/case-studies/ecommerce-seo-audit",
    featured: false,
    order: 4,
  },
];

export const fallbackBlogPosts: BlogPost[] = [
  {
    id: "5",
    slug: "what-is-seo",
    title: "What Is SEO? A Simple Introduction",
    excerpt:
      "SEO basics in plain language — what it is, why it matters, on-page vs off-page, and how it differs from SEM.",
    content: `# What Is SEO? A Simple Introduction

## 1. What is SEO?

**SEO = Search Engine Optimization — making your site and content rank higher in organic search.**

In plain terms:

**Optimize your website and content for free so Baidu, Google, and other search engines rank you higher when people search relevant keywords — without paying for ads.**

## 2. Core goals

1. Get free organic traffic from search engines — no pay-per-click;
2. Increase exposure, drive visits, acquire customers, grow followers, and convert on products.

## 3. Two main types of SEO

**1. On-page SEO (what you control on your site)**

- Titles, keywords, and content that match what users search for — original, useful material;
- Page structure, URL naming, image alt text, load speed;
- **Internal links**: links between pages on your own site.

**2. Off-page SEO (signals from outside)**

- **Backlinks**: other sites linking to yours, building authority;
- Publishing on other platforms, community traffic, brand visibility.

## 4. How it works (basically)

User searches → engine crawls and indexes pages → ranks by content quality and site authority → **good SEO means higher rankings and free clicks**.

## 5. SEO vs SEM

- **SEO: organic rankings, free, slow to show results (weeks to months), stable long-term**
- **SEM: paid search ads — you pay per click, instant visibility, traffic stops when you stop paying**
- SEM = Search Engine Marketing`,
    coverImage: null,
    category: "SEO",
    tags: ["SEO", "Basics", "SEM"],
    published: true,
    featured: true,
    readTime: 5,
    seoTitle: "What Is SEO? Simple Introduction for Beginners",
    seoDesc:
      "Learn what SEO is, on-page vs off-page SEO, how search rankings work, and how SEO differs from SEM.",
    publishedAt: new Date("2026-06-22"),
    updatedAt: new Date("2026-06-22"),
  },
  {
    id: "1",
    slug: "core-web-vitals-2026",
    title: "Core Web Vitals in 2026: Beyond the Basics",
    excerpt:
      "A deep dive into INP, LCP, and CLS optimization strategies that actually move the needle for enterprise sites.",
    content: `# Core Web Vitals in 2026\n\nPerformance is no longer a nice-to-have — it's a ranking signal and a conversion driver.\n\n## Understanding INP\n\nInteraction to Next Paint (INP) measures responsiveness...\n\n## LCP Optimization\n\nLargest Contentful Paint can be improved through...\n\n## CLS Best Practices\n\nCumulative Layout Shift issues often stem from...`,
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
    category: "SEO",
    tags: ["Core Web Vitals", "Performance", "SEO"],
    published: true,
    featured: true,
    readTime: 8,
    seoTitle: "Core Web Vitals 2026 Guide | INP, LCP, CLS Optimization",
    seoDesc: "Master Core Web Vitals optimization in 2026 with actionable INP, LCP, and CLS strategies.",
    publishedAt: new Date("2026-03-15"),
    updatedAt: new Date("2026-03-15"),
  },
  {
    id: "2",
    slug: "distributed-systems-fundamentals",
    title: "Distributed Systems Fundamentals: Consensus & Consistency",
    excerpt:
      "Understanding CAP theorem, Raft consensus, and eventual consistency in modern distributed architectures.",
    content: `# Distributed Systems Fundamentals\n\nDistributed systems power everything from social networks to financial platforms.\n\n## The CAP Theorem\n\nConsistency, Availability, and Partition tolerance...\n\n## Consensus Algorithms\n\nRaft and Paxos provide mechanisms for...`,
    coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80",
    category: "Computer Science",
    tags: ["Distributed Systems", "Computer Science", "Architecture"],
    published: true,
    featured: true,
    readTime: 12,
    seoTitle: "Distributed Systems Fundamentals | Consensus & Consistency",
    seoDesc: "Learn distributed systems fundamentals including CAP theorem, Raft consensus, and consistency models.",
    publishedAt: new Date("2026-02-20"),
    updatedAt: new Date("2026-02-20"),
  },
  {
    id: "3",
    slug: "product-led-growth-playbook",
    title: "The Product-Led Growth Playbook for B2B SaaS",
    excerpt:
      "How to design activation flows, onboarding experiences, and viral loops that drive sustainable growth.",
    content: `# Product-Led Growth Playbook\n\nPLG isn't just a go-to-market strategy — it's a product design philosophy.\n\n## Activation Metrics\n\nTime-to-value is the north star metric...\n\n## Onboarding Design\n\nProgressive disclosure and contextual guidance...`,
    coverImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80",
    category: "Product",
    tags: ["PLG", "Growth", "Product Design"],
    published: true,
    featured: false,
    readTime: 10,
    seoTitle: "Product-Led Growth Playbook for B2B SaaS",
    seoDesc: "A comprehensive guide to product-led growth strategies for B2B SaaS companies.",
    publishedAt: new Date("2026-01-10"),
    updatedAt: new Date("2026-01-10"),
  },
  {
    id: "4",
    slug: "structured-data-seo-guide",
    title: "Structured Data for SEO: JSON-LD Implementation Guide",
    excerpt:
      "Complete guide to implementing Schema.org markup for rich snippets, knowledge panels, and enhanced SERP visibility.",
    content: `# Structured Data for SEO\n\nJSON-LD is the preferred format for structured data implementation.\n\n## Article Schema\n\nImplement Article markup for blog posts...\n\n## FAQ Schema\n\nFAQ rich results can significantly increase CTR...`,
    coverImage: "https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=1200&q=80",
    category: "SEO",
    tags: ["Structured Data", "JSON-LD", "Schema.org"],
    published: true,
    featured: false,
    readTime: 7,
    seoTitle: "Structured Data SEO Guide | JSON-LD Implementation",
    seoDesc: "Learn how to implement JSON-LD structured data for better SEO and rich search results.",
    publishedAt: new Date("2025-12-05"),
    updatedAt: new Date("2025-12-05"),
  },
];

export const fallbackCaseStudies: CaseStudy[] = [
  {
    id: "1",
    slug: "saas-seo-transformation",
    title: "SaaS SEO Transformation: 4.2x Organic Growth",
    excerpt:
      "How we rebuilt the technical SEO foundation of a Series B SaaS company and achieved 4.2x organic traffic growth.",
    content: `# SaaS SEO Transformation\n\n## Challenge\n\nThe client had strong product-market fit but virtually no organic visibility.\n\n## Approach\n\nWe implemented a three-phase strategy:\n\n1. **Technical Foundation** — Fixed crawl issues, implemented proper canonicalization\n2. **Content Architecture** — Built topical authority through pillar pages\n3. **Link Building** — Earned high-quality backlinks through digital PR\n\n## Results\n\n- 4.2x organic traffic increase\n- 156% increase in qualified leads\n- Top 3 rankings for 47 target keywords`,
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
    category: "SEO",
    client: "Confidential B2B SaaS",
    industry: "Enterprise Software",
    results: {
      "Organic Traffic": "+320%",
      "Qualified Leads": "+156%",
      "Target Keywords Top 3": "47",
    },
    tags: ["SEO", "SaaS", "Content Strategy"],
    published: true,
    featured: true,
    seoTitle: "SaaS SEO Case Study | 4.2x Organic Traffic Growth",
    seoDesc: "Case study: How we achieved 4.2x organic traffic growth for a B2B SaaS company.",
    publishedAt: new Date("2026-02-01"),
    updatedAt: new Date("2026-02-01"),
  },
  {
    id: "2",
    slug: "design-system-growth",
    title: "Design System That Drove 28% Conversion Lift",
    excerpt:
      "Building a unified design system that accelerated product development and dramatically improved user conversion.",
    content: `# Design System & Growth\n\n## Challenge\n\nInconsistent UI patterns were slowing development and hurting conversion rates.\n\n## Solution\n\nWe created a comprehensive design system with:\n\n- Token-based theming\n- Component library with 60+ components\n- Documentation and usage guidelines\n\n## Impact\n\n- 40% reduction in development time\n- 28% improvement in conversion rate\n- 95% component reuse across products`,
    coverImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80",
    category: "Product",
    client: "Growth-stage Startup",
    industry: "FinTech",
    results: {
      "Dev Time Saved": "40%",
      "Conversion Lift": "+28%",
      "Component Reuse": "95%",
    },
    tags: ["Design Systems", "UX", "Product"],
    published: true,
    featured: true,
    seoTitle: "Design System Case Study | 28% Conversion Improvement",
    seoDesc: "How a design system reduced dev time by 40% and improved conversion by 28%.",
    publishedAt: new Date("2026-01-15"),
    updatedAt: new Date("2026-01-15"),
  },
  {
    id: "3",
    slug: "ecommerce-seo-audit",
    title: "E-commerce SEO: 2M Page Crawl Optimization",
    excerpt:
      "Optimizing crawl budget and indexation for a global e-commerce platform with over 2 million product pages.",
    content: `# E-commerce SEO Audit\n\n## Scale\n\n2M+ product pages across 12 regional sites.\n\n## Key Fixes\n\n- Faceted navigation cleanup\n- Dynamic sitemap generation\n- Product schema implementation\n\n## Results\n\n- 67% reduction in crawl waste\n- 89% indexation rate improvement`,
    coverImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80",
    category: "SEO",
    client: "Global E-commerce Brand",
    industry: "Retail",
    results: {
      "Crawl Waste Reduced": "67%",
      "Indexation Rate": "+89%",
      "Revenue from Organic": "+45%",
    },
    tags: ["E-commerce", "Technical SEO", "Crawl Budget"],
    published: true,
    featured: false,
    seoTitle: "E-commerce SEO Case Study | 2M Page Optimization",
    seoDesc: "Optimizing crawl budget for 2M+ product pages on a global e-commerce platform.",
    publishedAt: new Date("2025-11-20"),
    updatedAt: new Date("2025-11-20"),
  },
];

export const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "SEO", href: "/seo" },
  { label: "Tech", href: "/tech" },
  { label: "Product", href: "/product" },
  { label: "Blog", href: "/blog" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Contact", href: "/contact" },
];

export const storySections = [
  {
    id: "strategy",
    title: "Strategy First",
    subtitle: "Data-driven decisions",
    description:
      "Every engagement begins with deep research — competitive analysis, keyword mapping, and technical audits that reveal the real opportunities.",
  },
  {
    id: "craft",
    title: "Craft & Precision",
    subtitle: "Premium execution",
    description:
      "From pixel-perfect interfaces to meticulously optimized meta tags, every detail is intentional. Quality compounds over time.",
  },
  {
    id: "growth",
    title: "Sustainable Growth",
    subtitle: "Long-term impact",
    description:
      "Short-term hacks fade. We build systems — content engines, design systems, and SEO frameworks — that deliver compounding returns.",
  },
];

export const seoServices = [
  {
    title: "Technical SEO Audit",
    description: "Comprehensive site audits covering crawlability, indexation, Core Web Vitals, and structured data.",
    icon: "🔍",
    features: ["Crawl analysis", "Indexation review", "Performance audit", "Schema markup"],
  },
  {
    title: "Content Strategy",
    description: "Topical authority building through pillar content, keyword research, and content gap analysis.",
    icon: "📝",
    features: ["Keyword research", "Content mapping", "Topical clusters", "Editorial calendar"],
  },
  {
    title: "International SEO",
    description: "Hreflang implementation, geo-targeting, and multi-regional content strategies.",
    icon: "🌍",
    features: ["Hreflang setup", "Geo-targeting", "Localization", "Regional sitemaps"],
  },
  {
    title: "SEO Analytics",
    description: "Custom dashboards, attribution modeling, and ROI tracking for organic search.",
    icon: "📊",
    features: ["Custom dashboards", "Attribution models", "ROI tracking", "Competitive intel"],
  },
];

export const techTopics = [
  {
    title: "Distributed Systems",
    description: "Consensus algorithms, fault tolerance, and scalable architecture patterns.",
    tags: ["Raft", "CAP Theorem", "Microservices"],
  },
  {
    title: "Algorithms & Data Structures",
    description: "In-depth explorations of algorithms with practical applications.",
    tags: ["Graph Theory", "Dynamic Programming", "Trees"],
  },
  {
    title: "Web Performance",
    description: "Browser internals, rendering pipelines, and optimization techniques.",
    tags: ["V8", "Rendering", "Network"],
  },
  {
    title: "System Design",
    description: "Designing scalable systems for millions of users.",
    tags: ["Load Balancing", "Caching", "Databases"],
  },
];

export const productServices = [
  {
    title: "Product Strategy",
    description: "Market positioning, user research, and product roadmap development.",
  },
  {
    title: "UX/UI Design",
    description: "User-centered design with premium aesthetics and conversion optimization.",
  },
  {
    title: "Design Systems",
    description: "Scalable component libraries and design token architectures.",
  },
  {
    title: "Growth Design",
    description: "Activation flows, onboarding optimization, and viral loop design.",
  },
];
