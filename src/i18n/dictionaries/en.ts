import type { Dictionary } from "../types";

const en: Dictionary = {
  meta: {
    siteName: "Isabel",
    siteDescription:
      "Independent builder documenting SEO practice, product experiments, and AI workflows in public.",
    authorName: "Isabel",
    authorTagline: "Independent builder · SEO in practice · Notes in public",
    authorBio:
      "I ship small tools, write about search and systems, and share what I learn along the way.",
    email: "15171181332@163.com",
  },
  nav: [
    { label: "Profile", href: "/about" },
    { label: "Writing", href: "/blog" },
  ],
  common: {
    readMore: "Read more",
    viewAll: "View all",
    backTo: "Back to",
    minRead: "min read",
    getInTouch: "Get in touch",
    sendMessage: "Send a message",
    navigation: "Navigation",
    contact: "Contact",
    allRights: "All rights reserved.",
    builtWith: "Built with Next.js",
    view: "View",
    project: "Project",
    website: "Website",
    work: "Work",
    dockCta: "Contact",
    searchPlaceholder: "Search by inspiration",
    scrollToTop: "Back to top",
  },
  intro: {
    line1: "Hello World.",
    line2: "Welcome home.",
  },
  home: {
    hero: {
      greeting: "Independent builder",
      headline: "Tools for writing,",
      headlineAccent: "search, and workflow.",
      subline:
        "I build QuickCopy, maintain an SEO knowledge base, and run AI workflow experiments — then write down what actually works.",
      ctaProjects: "See featured work",
      ctaAbout: "My profile",
    },
    story: {
      label: "How I got here",
      title: "Less pitch deck, more notebook.",
      blocks: [
        {
          id: "start",
          chapter: "01",
          title: "Curiosity came first",
          body: "I didn't start with a job title. I started with broken workflows — copying text between apps, losing SEO notes, repeating the same prompts. Fixing those problems taught me more than any certification.",
        },
        {
          id: "build",
          chapter: "02",
          title: "Ship small, learn in public",
          body: "QuickCopy came from daily friction. The SEO knowledge base grew because I needed a place to organize patterns I kept re-explaining. AI experiments live in the open because the field moves faster than any static portfolio.",
        },
        {
          id: "now",
          chapter: "03",
          title: "Still iterating",
          body: "This site isn't a services brochure. It's a record of what I'm building, what I'm reading, and what I'm testing — so future me (and maybe you) can skip the dead ends.",
        },
      ],
    },
    projects: {
      label: "Featured projects",
      title: "Things I'm building",
      description:
        "Three ongoing projects that shape how I think about product, search, and automation.",
      items: [
        {
          slug: "quickcopy",
          title: "QuickCopy App",
          description:
            "A fast clipboard companion for people who copy, paste, and rewrite all day. Built to stay out of the way until you need it.",
          tags: ["Android", "Flutter", "Home Widget"],
          year: "2025",
          status: "Active",
          image:
            "https://images.unsplash.com/photo-1616461366505-27b3c8310164?w=1400&q=80",
        },
        {
          slug: "seo-knowledge-base",
          title: "SEO Knowledge Base",
          description:
            "A structured reference for technical SEO, content patterns, and diagnostics — the notes I wish existed when I was learning.",
          tags: ["SEO", "Documentation", "Next.js"],
          year: "2024",
          status: "Growing",
          image:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=80",
        },
        {
          slug: "ai-workflow",
          title: "AI Workflow Experiments",
          description:
            "Small automations and agent setups for research, drafting, and QA. Documented with failures included, not just highlights.",
          tags: ["AI", "Automation", "Workflow"],
          year: "2025",
          status: "Experimenting",
          image:
            "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1400&q=80",
        },
      ],
    },
    openSource: {
      label: "Open source",
      title: "Code on Gitee",
      description:
        "I publish tools, snippets, and experiment repos on Gitee. Star or fork anything useful — issues and PRs welcome.",
      giteeLabel: "gitee.com/ljnsixsixsix",
      giteeUrl: "https://gitee.com/ljnsixsixsix",
      cta: "Visit Gitee profile",
    },
    writing: {
      label: "Writing",
      title: "Recent notes",
      description:
        "Longer essays on search, systems, and building products — updated when there's something worth saying.",
      cta: "All articles",
    },
    closing: {
      title: "Working on something?",
      body: "If you're building a tool, fixing search, or experimenting with AI workflows — I'd like to hear about it.",
      cta: "Say hello",
      secondary: "My profile",
    },
  },
  about: {
    metaTitle: "Profile",
    metaDescription:
      "About Isabel — slogan, hobbies, favorite shows, films, and cities visited.",
    subtitle: "Profile",
    title: "Off-screen me",
    description:
      "Building is one layer. Here's what I enjoy when I'm not in the repo.",
    personal: {
      slogan:
        "Independent builder · Ship small useful tools · Write down what sticks",
      intro:
        "Days go to product work, SEO, and AI experiments; evenings to music, food hunts, and catching up on shows. No pitch deck — just the personal bits.",
      labels: {
        hobbies: "Hobbies",
        cities: "Cities visited",
        tvShows: "TV shows",
        movies: "Movies",
      },
      hobbies:
        "Music, singing, sports, shopping, food crawls, and late-night tool tinkering.",
      cities:
        "Tianjin, Beijing, Zhengzhou, Wuhan, Shenzhen, Guangzhou, Shenyang, Dalian, Shanghai, Hangzhou, Chengdu — slow travel over checklist tourism.",
      tvShowItems: [
        {
          id: "chinese-paladin",
          title: "Chinese Paladin",
          subtitle: "仙剑奇侠传",
          tags: "Fantasy · Classic · Nostalgia",
          accent: "#D55559",
          accentEnd: "#9e3a3d",
        },
        {
          id: "ipartment",
          title: "iPartment",
          subtitle: "爱情公寓",
          tags: "Comedy · Ensemble · Comfort",
          accent: "#e8875a",
          accentEnd: "#c45c28",
        },
        {
          id: "meteor-garden",
          title: "Meteor Garden",
          subtitle: "流星花园",
          tags: "Youth · Romance · Memories",
          accent: "#d55559",
          accentEnd: "#7a3537",
        },
        {
          id: "someday-or-one-day",
          title: "Someday or One Day",
          subtitle: "想见你",
          tags: "Time travel · Mystery · Loop",
          accent: "#5c7fd6",
          accentEnd: "#3a4f8f",
        },
        {
          id: "empresses-in-the-palace",
          title: "Empresses in the Palace",
          subtitle: "甄嬛传",
          tags: "Palace · Classic · Rewatch",
          accent: "#8b4a52",
          accentEnd: "#4a2528",
        },
        {
          id: "the-story-of-minglan",
          title: "The Story of Minglan",
          subtitle: "知否知否",
          tags: "Period · Family · Detail-rich",
          accent: "#6b8f71",
          accentEnd: "#3d5240",
        },
      ],
      movies:
        "The Shawshank Redemption · Our Little Sister · Green Book · Flipped — the ones I'll rewatch.",
    },
  },
  blog: {
    metaTitle: "Writing",
    metaDescription:
      "Essays and notes on computer science, SEO, and product management.",
    subtitle: "Writing",
    title: "Notes & essays",
    description:
      "Three lanes of writing — systems, search, and product — pick a lane below.",
    backToBlog: "Back to writing",
    filterLabel: "Topic",
    categories: [
      { slug: "cs", label: "Computer Science" },
      { slug: "seo", label: "SEO" },
      { slug: "product", label: "Product" },
    ],
    empty: "Nothing published in this lane yet.",
  },
  works: {
    metaTitle: "Work",
    metaDescription: "Projects in progress — tools, knowledge base, and experiments.",
    subtitle: "Work",
    title: "Things I'm building",
    description: "Three ongoing projects. Open a card for the full case study.",
    backToWorks: "Back to work",
    viewProject: "View case study",
    viewAllWorks: "All work",
    statusUnreleased: "Unreleased",
    quickcopy: {
      name: "QuickCopy",
      tagline: "Copy snippets you reuse — from the app or the home screen.",
      stack: ["Flutter", "Android", "Home Widget", "SharedPreferences"],
      featuresTitle: "Core features",
      story: {
        problem: {
          title: "The friction",
          body: "I copy the same strings dozens of times a day — addresses, tracking numbers, email templates, prompt fragments. System clipboard history is either missing, buried, or full of noise. Switching apps to hunt for the last thing I copied breaks flow.",
        },
        need: {
          title: "What I actually needed",
          body: "A personal snippet library organized by category, one tap to copy, and a way to save from clipboard without opening a full editor. On Android I also wanted it on the home screen — not another app icon to hunt for.",
        },
        build: {
          title: "What I built",
          body: "QuickCopy is a Flutter Android app with categorized copy cards, quick-paste save, search, and batch actions. Data syncs to a home-screen widget via home_widget — switch categories and paste without launching the app. I also explored a Windows build with window_manager, but the core story is mobile + widget.",
        },
      },
      features: [
        {
          title: "Category sidebar",
          description:
            "Reorderable categories — addresses, templates, prompts — each with its own card list.",
        },
        {
          title: "One-tap copy",
          description:
            "Tap a card to copy. Double-tap to edit title or body inline.",
        },
        {
          title: "Quick paste save",
          description:
            "Tap once to pull clipboard, twice to edit, then save — no modal maze.",
        },
        {
          title: "Home-screen widget",
          description:
            "Category chips + scrollable list on the launcher. Paste via broadcast receiver without opening the app.",
        },
        {
          title: "Search & batch ops",
          description:
            "Filter by keyword, multi-select delete, or clear an entire category.",
        },
      ],
      widget: {
        title: "Why the widget matters",
        body: "The app handles editing and organization. The widget handles speed — the two share JSON state through HomeWidget. When you change categories in the app, the widget refreshes. When you paste from the widget, a PendingIntent writes to clipboard. Widget sync failure never blocks app operations.",
      },
      prototypesLabel: "Wireframes",
      prototypes: [
        { id: "main", caption: "Main screen — categories + card list" },
        { id: "widget", caption: "Home-screen widget with category chips" },
        { id: "quickpaste", caption: "Quick paste — save from clipboard" },
      ],
      otherProjectsTitle: "Also in progress",
      otherProjects: [
        {
          slug: "seo-knowledge-base",
          title: "SEO Knowledge Base",
          description: "Structured notes on technical SEO and diagnostics.",
        },
        {
          slug: "ai-workflow",
          title: "AI Workflow Experiments",
          description: "Small automations for research, drafting, and QA.",
        },
      ],
    },
  },
  contact: {
    metaTitle: "Contact",
    metaDescription: "Get in touch about projects, collaboration, or questions.",
    subtitle: "Contact",
    title: "Say hello",
    description:
      "Questions about a project, feedback on open source work, or just want to compare notes — send a message.",
    aside: {
      emailLabel: "Direct email",
      responseNote: "Usually a reply within 1–2 days.",
      formTitle: "Send a message",
    },
    form: {
      name: "Name",
      email: "Email",
      company: "Company",
      subject: "Subject",
      message: "Message",
      submit: "Send message",
      submitting: "Sending…",
      success: "Message sent. I'll reply soon.",
      placeholders: {
        name: "Your name",
        email: "you@example.com",
        company: "Optional",
        subject: "What's this about?",
        message: "Tell me what you're working on…",
      },
    },
  },
  footer: {
    tagline:
      "Independent builder — tools, search, and experiments documented in public.",
    linksLabel: "Links",
    reels: ["TOOLS", "SEARCH", "NOTES"],
  },
};

export default en;
