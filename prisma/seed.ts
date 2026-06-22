import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  await prisma.stat.deleteMany();
  await prisma.project.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.caseStudy.deleteMany();

  await prisma.stat.createMany({
    data: [
      { label: "SEO Projects", value: 48, suffix: "+", order: 1 },
      { label: "Organic Traffic Growth", value: 312, suffix: "%", order: 2 },
      { label: "Technical Articles", value: 86, suffix: "+", order: 3 },
      { label: "Product Launches", value: 24, suffix: "+", order: 4 },
    ],
  });

  await prisma.project.createMany({
    data: [
      {
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
    ],
  });

  await prisma.blogPost.createMany({
    data: [
      {
        slug: "what-is-seo",
        title: "What Is SEO? A Simple Introduction",
        excerpt:
          "SEO basics in plain language — what it is, why it matters, on-page vs off-page, and how it differs from SEM.",
        content:
          "# What Is SEO? A Simple Introduction\n\n## 1. What is SEO?\n\n**SEO = Search Engine Optimization**\n\nOptimize your website and content for free so search engines rank you higher — without paying for ads.\n\n## 2. Core goals\n\n1. Get free organic traffic;\n2. Increase exposure, visits, and conversions.\n\n## 3. On-page vs off-page SEO\n\nOn-page: titles, content, structure, internal links.\nOff-page: backlinks, platform publishing, brand exposure.\n\n## 4. SEO vs SEM\n\nSEO is organic and free but slow. SEM is paid ads with instant visibility.",
        coverImage: null,
        category: "SEO",
        tags: ["SEO", "Basics", "SEM"],
        published: true,
        featured: true,
        readTime: 5,
        seoTitle: "What Is SEO? Simple Introduction for Beginners",
        seoDesc:
          "Learn what SEO is, on-page vs off-page SEO, and how SEO differs from SEM.",
      },
      {
        slug: "core-web-vitals-2026",
        title: "Core Web Vitals in 2026: Beyond the Basics",
        excerpt:
          "A deep dive into INP, LCP, and CLS optimization strategies that actually move the needle for enterprise sites.",
        content:
          "# Core Web Vitals in 2026\n\nPerformance is no longer a nice-to-have — it's a ranking signal and a conversion driver.\n\n## Understanding INP\n\nInteraction to Next Paint (INP) measures responsiveness...\n\n## LCP Optimization\n\nLargest Contentful Paint can be improved through...\n\n## CLS Best Practices\n\nCumulative Layout Shift issues often stem from...",
        coverImage:
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
        category: "SEO",
        tags: ["Core Web Vitals", "Performance", "SEO"],
        published: true,
        featured: true,
        readTime: 8,
        seoTitle: "Core Web Vitals 2026 Guide | INP, LCP, CLS Optimization",
        seoDesc:
          "Master Core Web Vitals optimization in 2026 with actionable INP, LCP, and CLS strategies.",
      },
      {
        slug: "distributed-systems-fundamentals",
        title: "Distributed Systems Fundamentals: Consensus & Consistency",
        excerpt:
          "Understanding CAP theorem, Raft consensus, and eventual consistency in modern distributed architectures.",
        content:
          "# Distributed Systems Fundamentals\n\nDistributed systems power everything from social networks to financial platforms.\n\n## The CAP Theorem\n\nConsistency, Availability, and Partition tolerance...\n\n## Consensus Algorithms\n\nRaft and Paxos provide mechanisms for...",
        coverImage:
          "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80",
        category: "Computer Science",
        tags: ["Distributed Systems", "Computer Science", "Architecture"],
        published: true,
        featured: true,
        readTime: 12,
        seoTitle:
          "Distributed Systems Fundamentals | Consensus & Consistency",
        seoDesc:
          "Learn distributed systems fundamentals including CAP theorem, Raft consensus, and consistency models.",
      },
      {
        slug: "product-led-growth-playbook",
        title: "The Product-Led Growth Playbook for B2B SaaS",
        excerpt:
          "How to design activation flows, onboarding experiences, and viral loops that drive sustainable growth.",
        content:
          "# Product-Led Growth Playbook\n\nPLG isn't just a go-to-market strategy — it's a product design philosophy.\n\n## Activation Metrics\n\nTime-to-value is the north star metric...\n\n## Onboarding Design\n\nProgressive disclosure and contextual guidance...",
        coverImage:
          "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80",
        category: "Product",
        tags: ["PLG", "Growth", "Product Design"],
        published: true,
        featured: false,
        readTime: 10,
        seoTitle: "Product-Led Growth Playbook for B2B SaaS",
        seoDesc:
          "A comprehensive guide to product-led growth strategies for B2B SaaS companies.",
      },
    ],
  });

  await prisma.caseStudy.createMany({
    data: [
      {
        slug: "saas-seo-transformation",
        title: "SaaS SEO Transformation: 4.2x Organic Growth",
        excerpt:
          "How we rebuilt the technical SEO foundation of a Series B SaaS company and achieved 4.2x organic traffic growth.",
        content:
          "# SaaS SEO Transformation\n\n## Challenge\n\nThe client had strong product-market fit but virtually no organic visibility.\n\n## Approach\n\nWe implemented a three-phase strategy:\n\n1. **Technical Foundation** — Fixed crawl issues, implemented proper canonicalization\n2. **Content Architecture** — Built topical authority through pillar pages\n3. **Link Building** — Earned high-quality backlinks through digital PR\n\n## Results\n\n- 4.2x organic traffic increase\n- 156% increase in qualified leads\n- Top 3 rankings for 47 target keywords",
        coverImage:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
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
        seoDesc:
          "Case study: How we achieved 4.2x organic traffic growth for a B2B SaaS company.",
      },
      {
        slug: "design-system-growth",
        title: "Design System That Drove 28% Conversion Lift",
        excerpt:
          "Building a unified design system that accelerated product development and dramatically improved user conversion.",
        content:
          "# Design System & Growth\n\n## Challenge\n\nInconsistent UI patterns were slowing development and hurting conversion rates.\n\n## Solution\n\nWe created a comprehensive design system with token-based theming and 60+ components.\n\n## Impact\n\n- 40% reduction in development time\n- 28% improvement in conversion rate",
        coverImage:
          "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80",
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
        seoDesc:
          "How a design system reduced dev time by 40% and improved conversion by 28%.",
      },
    ],
  });

  console.log("✅ Database seeded successfully");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
