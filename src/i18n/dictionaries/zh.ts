import type { Dictionary } from "../types";

const zh: Dictionary = {
  meta: {
    siteName: "Isabel",
    siteDescription:
      "独立开发者，公开记录 SEO 实践、产品实验与 AI 工作流。",
    authorName: "Isabel",
    authorTagline: "独立开发者 · SEO 实践 · 公开笔记",
    authorBio:
      "做小工具、写搜索与系统相关的内容，并把过程中的收获整理出来。",
    email: "15171181332@163.com",
  },
  nav: [
    { label: "个人介绍", href: "/about" },
    { label: "写作", href: "/blog" },
  ],
  common: {
    readMore: "阅读更多",
    viewAll: "查看全部",
    backTo: "返回",
    minRead: "分钟阅读",
    getInTouch: "联系我",
    sendMessage: "发送消息",
    navigation: "导航",
    contact: "联系",
    allRights: "保留所有权利。",
    builtWith: "使用 Next.js 构建",
    view: "查看",
    project: "项目",
    website: "文章",
    work: "作品",
    dockCta: "联系我",
    searchPlaceholder: "搜索灵感…",
    scrollToTop: "回到顶部",
  },
  intro: {
    line1: "Hello World.",
    line2: "Welcome home.",
  },
  home: {
    hero: {
      greeting: "独立开发者",
      headline: "为写作、搜索",
      headlineAccent: "与工作流做的工具。",
      subline:
        "一名平凡无奇的普通人",
      ctaProjects: "查看精选项目",
      ctaAbout: "个人介绍",
    },
    story: {
      label: "我是怎么走到这里的",
      title: "少些 pitch，多些笔记。",
      blocks: [
        {
          id: "start",
          chapter: "01",
          title: "从好奇开始",
          body: "我不是从某个职位头衔开始的。我是从糟糕的工作流开始的——在应用之间复制文字、丢失 SEO 笔记、重复同样的 prompt。解决这些问题，比任何证书教我的都多。",
        },
        {
          id: "build",
          chapter: "02",
          title: "小步发布，公开学习",
          body: "QuickCopy 来自日常摩擦。SEO 知识库是因为我需要一个地方，整理那些反复解释的模式。AI 实验放在公开处，因为这个领域变化比任何静态作品集都快。",
        },
        {
          id: "now",
          chapter: "03",
          title: "仍在迭代",
          body: "这个网站不是服务宣传册。它记录我在构建什么、在读什么、在测试什么——让未来的我（也许还有你）可以绕开那些走不通的路。",
        },
      ],
    },
    projects: {
      label: "精选项目",
      title: "正在构建的事",
      description: "三个持续进行中的项目，塑造我对产品、搜索与自动化的理解。",
      items: [
        {
          slug: "quickcopy",
          title: "QuickCopy App",
          description:
            "为整天复制、粘贴、改写的人准备的快速剪贴板助手。需要时才出现，平时不打扰。",
          tags: ["Android", "Flutter", "桌面小组件"],
          year: "2025",
          status: "进行中",
          image:
            "https://images.unsplash.com/photo-1616461366505-27b3c8310164?w=1400&q=80",
        },
        {
          slug: "seo-knowledge-base",
          title: "SEO 知识库",
          description:
            "结构化整理技术 SEO、内容模式与诊断方法——是我学习时希望已有的笔记。",
          tags: ["SEO", "文档", "Next.js"],
          year: "2024",
          status: "持续扩充",
          image:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=80",
        },
        {
          slug: "ai-workflow",
          title: "AI 工作流实验",
          description:
            "用于调研、起草与质检的小型自动化与 agent 配置。失败也会记录，而不只是高光。",
          tags: ["AI", "自动化", "工作流"],
          year: "2025",
          status: "实验中",
          image:
            "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1400&q=80",
        },
      ],
    },
    openSource: {
      label: "开源",
      title: "Gitee 上的代码",
      description:
        "在 Gitee 发布工具、片段与实验仓库。觉得有用可以 star 或 fork——欢迎 issue 和 PR。",
      giteeLabel: "gitee.com/ljnsixsixsix",
      giteeUrl: "https://gitee.com/ljnsixsixsix",
      cta: "访问 Gitee 主页",
    },
    writing: {
      label: "写作",
      title: "最近的笔记",
      description: "关于搜索、系统与产品构建的长文——有值得说的内容时才更新。",
      cta: "全部文章",
    },
    closing: {
      title: "也在做类似的事？",
      body: "如果你在构建工具、修复搜索、或实验 AI 工作流——我想听听你的做法。",
      cta: "打个招呼",
      secondary: "个人介绍",
    },
  },
  about: {
    metaTitle: "个人介绍",
    metaDescription: "关于 Isabel 自己—— slogan、爱好、影视与去过的城市。",
    subtitle: "个人介绍",
    title: "屏幕之外的我",
    description: "写代码是一面。这里记录我不在仓库里时，仍然愿意花时间的事。",
    personal: {
      slogan: "独立开发者 · 把好用的小工具做出来 · 把值得留下的记下来",
      intro:
        "白天做产品、写 SEO、折腾 AI 工作流；晚上听歌、找吃的、补完没看完的剧。下面是我的一些私人偏好——没有 pitch，只是真实的我。",
      labels: {
        hobbies: "爱好",
        cities: "去过的城市",
        tvShows: "爱看的电视剧",
        movies: "爱看的电影",
      },
      hobbies: "听歌、唱歌、运动、购物、探店吃吃吃，以及半夜改小工具。",
      cities: "天津、北京、郑州、武汉、深圳、广州、沈阳、大连、上海、杭州、成都——更喜欢慢慢走，而不是打卡式旅行。",
      tvShowItems: [
        {
          id: "chinese-paladin",
          title: "仙剑奇侠传",
          subtitle: "Chinese Paladin",
          tags: "仙侠 · 经典 · 童年",
          accent: "#D55559",
          accentEnd: "#9e3a3d",
        },
        {
          id: "ipartment",
          title: "爱情公寓",
          subtitle: "iPartment",
          tags: "喜剧 · 群像 · 下饭",
          accent: "#e8875a",
          accentEnd: "#c45c28",
        },
        {
          id: "meteor-garden",
          title: "流星花园",
          subtitle: "Meteor Garden",
          tags: "青春 · 偶像 · 回忆",
          accent: "#d55559",
          accentEnd: "#7a3537",
        },
        {
          id: "someday-or-one-day",
          title: "想见你",
          subtitle: "Someday or One Day",
          tags: "穿越 · 悬疑 · 循环",
          accent: "#5c7fd6",
          accentEnd: "#3a4f8f",
        },
        {
          id: "empresses-in-the-palace",
          title: "甄嬛传",
          subtitle: "Empresses in the Palace",
          tags: "宫斗 · 经典 · 重刷",
          accent: "#8b4a52",
          accentEnd: "#4a2528",
        },
        {
          id: "the-story-of-minglan",
          title: "知否知否",
          subtitle: "The Story of Minglan",
          tags: "宅斗 · 宋代 · 细节",
          accent: "#6b8f71",
          accentEnd: "#3d5240",
        },
      ],
      movies: "《肖申克的救赎》《海街日记》《绿皮书》《怦然心动》——愿意反复看的那些。",
    },
  },
  blog: {
    metaTitle: "写作",
    metaDescription: "关于计算机、SEO 与产品方向的笔记与长文。",
    subtitle: "写作",
    title: "笔记与文章",
    description: "想到什么写什么",
    backToBlog: "返回写作",
    filterLabel: "分类",
    categories: [
      { slug: "cs", label: "计算机" },
      { slug: "seo", label: "SEO" },
      { slug: "product", label: "产品" },
    ],
    empty: "这个分类下还没有文章。",
    hiddenWords: ["系统", "搜索", "产品", "笔记"],
  },
  works: {
    metaTitle: "作品",
    metaDescription: "正在构建的项目——工具、知识库与实验。",
    subtitle: "作品",
    title: "正在构建的事",
    description: "三个持续进行中的项目。点进卡片查看案例详情。",
    backToWorks: "返回作品",
    viewProject: "查看案例",
    viewAllWorks: "全部作品",
    statusUnreleased: "未上线",
    quickcopy: {
      name: "QuickCopy",
      tagline: "把常用片段存好——在应用里用，或在桌面一键复制。",
      stack: ["Flutter", "Android", "桌面小组件", "SharedPreferences"],
      featuresTitle: "核心功能",
      story: {
        problem: {
          title: "痛点从哪来",
          body: "我每天要复制几十次相同的内容——地址、快递单号、邮件模板、Prompt 片段。系统剪贴板历史要么没有、要么藏得很深、要么全是噪音。为了找上一条复制的内容切换应用，会彻底打断工作流。",
        },
        need: {
          title: "我真正需要什么",
          body: "一个按分类管理的个人片段库，点一下就能复制，还能从剪贴板快速保存、不必打开完整编辑器。在 Android 上我还希望它能出现在桌面——而不是又多一个要去找的应用图标。",
        },
        build: {
          title: "我做了什么",
          body: "QuickCopy 是用 Flutter 写的 Android 应用：分类卡片、快速粘贴保存、搜索、批量操作。数据通过 home_widget 同步到桌面小组件——切换分类、直接粘贴，无需启动应用。我也尝试过 Windows 版（window_manager），但核心故事是移动端 + 小组件。",
        },
      },
      features: [
        {
          title: "分类侧栏",
          description: "可拖拽排序的分类——地址、模板、Prompt 等，各自独立的卡片列表。",
        },
        {
          title: "单击复制",
          description: "点卡片即复制；双击可 inline 编辑标题或正文。",
        },
        {
          title: "快速粘贴保存",
          description: "点一下拉取剪贴板，点两下编辑，然后保存——没有层层弹窗。",
        },
        {
          title: "桌面小组件",
          description: "Launcher 上显示分类 chips + 可滚动列表，通过 BroadcastReceiver 粘贴，无需打开 App。",
        },
        {
          title: "搜索与批量操作",
          description: "关键词筛选、多选删除、或一键清空当前分类。",
        },
      ],
      widget: {
        title: "为什么小组件很重要",
        body: "App 负责编辑与整理，小组件负责速度——两者通过 HomeWidget 共享 JSON 状态。在 App 里切换分类，小组件会刷新；从小组件粘贴时，PendingIntent 写入剪贴板。小组件同步失败不会阻塞 App 内的任何操作。",
      },
      prototypesLabel: "原型示意",
      prototypes: [
        { id: "main", caption: "主界面 — 分类侧栏 + 卡片列表" },
        { id: "widget", caption: "桌面小组件与分类切换" },
        { id: "quickpaste", caption: "快速粘贴 — 从剪贴板保存" },
      ],
      otherProjectsTitle: "其他进行中的项目",
      otherProjects: [
        {
          slug: "seo-knowledge-base",
          title: "SEO 知识库",
          description: "技术 SEO 与诊断方法的结构化笔记。",
        },
        {
          slug: "ai-workflow",
          title: "AI 工作流实验",
          description: "用于调研、起草与质检的小型自动化。",
        },
      ],
    },
  },
  contact: {
    metaTitle: "联系",
    metaDescription: "关于项目、合作或问题的联系渠道。",
    subtitle: "联系",
    title: "打个招呼",
    description: "项目问题、开源反馈，或只是想交流做法——都可以留言。",
    aside: {
      emailLabel: "我的邮箱",
      responseNote: "通常在 1–2 天内回复。",
      formTitle: "留言给我",
    },
    form: {
      name: "姓名",
      email: "邮箱",
      company: "公司",
      subject: "主题",
      message: "消息",
      submit: "发送消息",
      submitting: "发送中…",
      success: "消息已发送，我会尽快回复。",
      placeholders: {
        name: "你的名字",
        email: "you@example.com",
        company: "选填",
        subject: "关于什么？",
        message: "说说你在做什么…",
      },
    },
  },
  footer: {
    tagline: "独立开发者——工具、搜索与实验，公开记录。",
    linksLabel: "链接",
    reels: ["工具", "搜索", "笔记"],
  },
};

export default zh;
