import type { Locale } from "./config";

export interface LocalizedBlogFields {
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  seoTitle?: string;
  seoDesc?: string;
}

const enPosts: Record<string, LocalizedBlogFields> = {
  "what-is-seo": {
    title: "What Is SEO? A Simple Introduction",
    excerpt:
      "SEO basics in plain language — what it is, why it matters, on-page vs off-page, and how it differs from SEM.",
    content: `# What Is SEO? A Simple Introduction

## 1. What is SEO?

**SEO = Search Engine Optimization（[ˌɒptɪmaɪˈzeɪʃn]）**

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
- SEM = Search Engine Marketing（搜索引擎营销）`,
    tags: ["SEO", "Basics", "SEM"],
    seoTitle: "What Is SEO? Simple Introduction for Beginners",
    seoDesc:
      "Learn what SEO is, on-page vs off-page SEO, how search rankings work, and how SEO differs from SEM.",
  },
  "core-web-vitals-2026": {
    title: "Core Web Vitals in 2026: Beyond the Basics",
    excerpt:
      "A deep dive into INP, LCP, and CLS optimization strategies that actually move the needle for enterprise sites.",
    content: `# Core Web Vitals in 2026

Performance is no longer a nice-to-have — it's a ranking signal and a conversion driver.

## Understanding INP

Interaction to Next Paint (INP) measures responsiveness. For most sites, the fix isn't a single library — it's reducing main-thread work during input handlers and deferring non-critical scripts.

## LCP Optimization

Largest Contentful Paint improves when you prioritize the hero image or headline block: preload the LCP asset, avoid lazy-loading above-the-fold media, and keep server response times predictable.

## CLS Best Practices

Cumulative Layout Shift usually comes from images or ads without reserved space. Set explicit width/height (or aspect-ratio) and avoid injecting UI above existing content after load.`,
    tags: ["Core Web Vitals", "Performance", "SEO"],
    seoTitle: "Core Web Vitals 2026 Guide | INP, LCP, CLS Optimization",
    seoDesc:
      "Master Core Web Vitals optimization in 2026 with actionable INP, LCP, and CLS strategies.",
  },
  "distributed-systems-fundamentals": {
    title: "Distributed Systems Fundamentals: Consensus & Consistency",
    excerpt:
      "Understanding CAP theorem, Raft consensus, and eventual consistency in modern distributed architectures.",
    content: `# Distributed Systems Fundamentals

Distributed systems power everything from social networks to financial platforms. The hard part is rarely the API — it's agreeing on state when nodes fail or networks partition.

## The CAP Theorem

Consistency, Availability, and Partition tolerance trade off under failure. In practice you choose which inconsistency window your product can tolerate.

## Consensus Algorithms

Raft and Paxos provide mechanisms for replicated logs. Most application teams interact with them through managed databases rather than implementing from scratch.`,
    tags: ["Distributed Systems", "Computer Science", "Architecture"],
    seoTitle: "Distributed Systems Fundamentals | Consensus & Consistency",
    seoDesc:
      "Learn distributed systems fundamentals including CAP theorem, Raft consensus, and consistency models.",
  },
  "product-led-growth-playbook": {
    title: "The Product-Led Growth Playbook for B2B SaaS",
    excerpt:
      "How to design activation flows, onboarding experiences, and viral loops that drive sustainable growth.",
    content: `# Product-Led Growth Playbook

PLG isn't just a go-to-market strategy — it's a product design philosophy.

## Activation Metrics

Time-to-value is the north star. Measure how quickly a new user reaches a meaningful outcome, not how many screens they click through.

## Onboarding Design

Progressive disclosure and contextual guidance beat long product tours. Show the next step when the user is ready for it.`,
    tags: ["PLG", "Growth", "Product Design"],
    seoTitle: "Product-Led Growth Playbook for B2B SaaS",
    seoDesc:
      "A comprehensive guide to product-led growth strategies for B2B SaaS companies.",
  },
  "structured-data-seo-guide": {
    title: "Structured Data for SEO: JSON-LD Implementation Guide",
    excerpt:
      "Complete guide to implementing Schema.org markup for rich snippets, knowledge panels, and enhanced SERP visibility.",
    content: `# Structured Data for SEO

JSON-LD is the preferred format for structured data implementation — it keeps markup out of visible HTML and is easier to maintain.

## Article Schema

Implement Article markup for blog posts with headline, datePublished, and author fields aligned with on-page content.

## FAQ Schema

FAQ rich results can increase CTR when answers match real user questions. Avoid marking up content that isn't visible on the page.`,
    tags: ["Structured Data", "JSON-LD", "Schema.org"],
    seoTitle: "Structured Data SEO Guide | JSON-LD Implementation",
    seoDesc:
      "Learn how to implement JSON-LD structured data for better SEO and rich search results.",
  },
};

const zhPosts: Record<string, LocalizedBlogFields> = {
  "what-is-seo": {
    title: "SEO 是什么？简单介绍",
    excerpt:
      "用大白话讲清楚 SEO——是什么、为什么做、站内站外怎么分、和 SEM 有什么区别。",
    content: `# SEO（简单介绍）

## 一、什么是 SEO

**SEO = Search Engine Optimization（[ˌɒptɪmaɪˈzeɪʃn]），搜索引擎优化**

简单说：

**免费优化网站 / 内容，让百度、谷歌等搜索引擎自然排名靠前，用户搜关键词优先搜到你**，不靠付费竞价广告。

## 二、核心目的

1. 免费获取搜索引擎自然流量，不用每次点击花钱；
2. 提升曝光、引流、获客、涨粉、产品成交。

## 三、SEO 两大分类

**1. 站内 SEO（自己可控）**

- 标题、关键词、文章内容：贴合用户搜索词，原创优质内容；
- 页面结构、网址命名、图片 alt 标签、加载速度；
- **内链**（网站**内**部**链**接）：页面之间互相跳转链接。

**2. 站外 SEO（外部引流）**

- **外链**（网站**外**部**链**接）：别的网站挂你的网址，提升网站权威度；
- 平台发文、社群引流、品牌曝光。

## 四、基础逻辑

用户在搜索引擎搜词 → 引擎抓取页面 → 根据内容质量、权重排序 → **SEO 做好就排前面，获得免费点击**。

## 五、和 SEM 的区别

- **SEO：自然排名，免费，见效慢（几周～数月），长期稳定**
- **SEM：竞价付费广告，花钱点一次扣一次费，上线立刻有排名，停投就没流量**
- SEM 全称：Search Engine Marketing（搜索引擎营销）`,
    tags: ["SEO", "入门", "SEM"],
    seoTitle: "SEO 是什么？搜索引擎优化简单介绍",
    seoDesc:
      "SEO 入门：什么是搜索引擎优化、站内站外 SEO、排名逻辑，以及 SEO 与 SEM 的区别。",
  },
  "core-web-vitals-2026": {
    title: "2026 年的 Core Web Vitals：不止于基础",
    excerpt:
      "深入 INP、LCP 与 CLS 的优化策略——哪些做法对企业站点真正有效。",
    content: `# 2026 年的 Core Web Vitals

性能不再是「加分项」——它同时影响排名与转化。

## 理解 INP

Interaction to Next Paint（INP）衡量交互响应速度。多数站点的瓶颈不在某个库，而在输入事件期间的主线程阻塞与非关键脚本。

## LCP 优化

最大内容绘制（LCP）可通过优先加载首屏图片或标题块来改善：预加载 LCP 资源、避免首屏懒加载、保持服务端响应稳定。

## CLS 最佳实践

累积布局偏移（CLS）常来自未预留尺寸的图片或广告。为媒体设置宽高或 aspect-ratio，避免加载后在上方面板插入内容。`,
    tags: ["Core Web Vitals", "性能", "SEO"],
    seoTitle: "2026 Core Web Vitals 指南 | INP、LCP、CLS 优化",
    seoDesc: "2026 年 Core Web Vitals 实战：INP、LCP、CLS 可落地的优化策略。",
  },
  "distributed-systems-fundamentals": {
    title: "分布式系统基础：共识与一致性",
    excerpt:
      "CAP 定理、Raft 共识与最终一致性——现代分布式架构中的核心概念。",
    content: `# 分布式系统基础

社交网络与金融平台背后都是分布式系统。难点往往不在 API，而在节点故障或网络分区时如何就状态达成一致。

## CAP 定理

一致性、可用性与分区容错在故障场景下需要权衡。实践中要决定产品能容忍多长的「不一致窗口」。

## 共识算法

Raft 与 Paxos 提供复制日志的机制。多数团队通过托管数据库间接使用，而非从零实现。`,
    tags: ["分布式系统", "计算机", "架构"],
    seoTitle: "分布式系统基础 | 共识与一致性",
    seoDesc: "CAP 定理、Raft 共识与一致性模型入门。",
  },
  "product-led-growth-playbook": {
    title: "B2B SaaS 的产品驱动增长手册",
    excerpt:
      "如何设计激活流程、 onboarding 体验与增长闭环，驱动可持续增长。",
    content: `# 产品驱动增长手册

PLG 不只是 go-to-market 策略，更是产品设计哲学。

## 激活指标

Time-to-value 是北极星指标——衡量新用户多快获得有意义的结果，而非点了多少屏。

## Onboarding 设计

渐进式披露与情境引导，优于冗长的产品导览。在用户准备好时再展示下一步。`,
    tags: ["PLG", "增长", "产品设计"],
    seoTitle: "B2B SaaS 产品驱动增长手册",
    seoDesc: "B2B SaaS 产品驱动增长策略与实践指南。",
  },
  "structured-data-seo-guide": {
    title: "SEO 结构化数据：JSON-LD 实现指南",
    excerpt:
      "Schema.org 标记完整指南——富摘要、知识面板与 SERP 可见性提升。",
    content: `# SEO 结构化数据

JSON-LD 是首选格式——标记与可见 HTML 分离，维护成本更低。

## Article Schema

为博客文章实现 Article 标记，headline、datePublished、author 与页面内容一致。

## FAQ Schema

FAQ 富结果在用户问题与答案匹配时可提升 CTR。勿标记页面上不可见的内容。`,
    tags: ["结构化数据", "JSON-LD", "Schema.org"],
    seoTitle: "结构化数据 SEO 指南 | JSON-LD 实现",
    seoDesc: "JSON-LD 结构化数据实现，提升 SEO 与富搜索结果。",
  },
};

const byLocale: Record<Locale, Record<string, LocalizedBlogFields>> = {
  en: enPosts,
  zh: zhPosts,
};

export function getLocalizedBlogFields(
  slug: string,
  locale: Locale
): LocalizedBlogFields | undefined {
  return byLocale[locale]?.[slug];
}
