export interface NavItem {
  label: string;
  href: string;
}

export interface StoryBlock {
  id: string;
  chapter: string;
  title: string;
  body: string;
}

export interface FeaturedProject {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  year: string;
  status: string;
  image: string;
}

export interface TvShowItem {
  id: string;
  title: string;
  subtitle: string;
  tags: string;
  accent: string;
  accentEnd: string;
  photo: string;
}

export interface TravelCity {
  id: string;
  name: string;
  lat: number;
  lng: number;
  visited: boolean;
  province: string;
  country: string;
  days?: number;
  visitDate?: string;
  note?: string;
  photo?: string;
  accent?: string;
}

export interface TravelFootprint {
  title: string;
  caption: string;
  travelSlogan: string;
  stats: {
    cities: string;
    provinces: string;
    countries: string;
    mileage: string;
    citiesValue: string;
    provincesValue: string;
    countriesValue: string;
    mileageValue: string;
  };
  controls: {
    autoRotateOn: string;
    autoRotateOff: string;
    resetView: string;
    globeHint: string;
  };
  tooltip: {
    days: string;
    visited: string;
    wishlist: string;
    visitDate: string;
  };
  listHeading: string;
  listVisited: string;
  listWishlist: string;
  cities: TravelCity[];
}

export interface HobbyItem {
  id: string;
  label: string;
  note: string;
  accent: string;
  accentEnd: string;
}

export interface MovieItem {
  id: string;
  title: string;
  subtitle: string;
  tags: string;
  note: string;
  accent: string;
  accentEnd: string;
  photo: string;
}

export interface PersonalFact {
  id: string;
  label: string;
  value: string;
  href?: string;
  pronounce?: string;
}

export interface PersonalProfile {
  facts: PersonalFact[];
  pronounceLabel: string;
  pokeHint: string;
  labels: {
    hobbies: string;
    cities: string;
    tvShows: string;
    movies: string;
  };
  hobbiesCaption: string;
  hobbyItems: HobbyItem[];
  moviesCaption: string;
  tvShowItems: TvShowItem[];
  movieItems: MovieItem[];
  travelFootprint: TravelFootprint;
}

export interface Dictionary {
  meta: {
    siteName: string;
    siteDescription: string;
    authorName: string;
    authorTagline: string;
    authorBio: string;
    email: string;
  };
  nav: NavItem[];
  common: {
    readMore: string;
    viewAll: string;
    backTo: string;
    minRead: string;
    getInTouch: string;
    sendMessage: string;
    navigation: string;
    contact: string;
    allRights: string;
    builtWith: string;
    view: string;
    project: string;
    website: string;
    work: string;
    dockCta: string;
    searchPlaceholder: string;
    searchEmpty: string;
    searchNoResults: string;
    searchLoading: string;
    searchHint: string;
    searchBlog: string;
    searchWork: string;
    scrollToTop: string;
  };
  intro: {
    line1: string;
    line2: string;
  };
  home: {
    hero: {
      greeting: string;
      headline: string;
      headlineAccent: string;
      subline: string;
      ctaProjects: string;
      ctaAbout: string;
    };
    story: {
      label: string;
      title: string;
      blocks: StoryBlock[];
    };
    projects: {
      label: string;
      title: string;
      description: string;
      items: FeaturedProject[];
    };
    openSource: {
      label: string;
      title: string;
      description: string;
      giteeLabel: string;
      giteeUrl: string;
      cta: string;
    };
    writing: {
      label: string;
      title: string;
      description: string;
      cta: string;
    };
    closing: {
      title: string;
      body: string;
      cta: string;
      secondary: string;
    };
  };
  about: {
    metaTitle: string;
    metaDescription: string;
    subtitle: string;
    title: string;
    personal: PersonalProfile;
  };
  blog: {
    metaTitle: string;
    metaDescription: string;
    subtitle: string;
    title: string;
    description: string;
    backToBlog: string;
    filterLabel: string;
    categories: { slug: "cs" | "seo" | "product"; label: string }[];
    empty: string;
    hiddenWords: string[];
  };
  works: {
    metaTitle: string;
    metaDescription: string;
    subtitle: string;
    title: string;
    description: string;
    backToWorks: string;
    viewProject: string;
    viewAllWorks: string;
    statusUnreleased: string;
    quickcopy: {
      name: string;
      tagline: string;
      stack: string[];
      featuresTitle: string;
      story: {
        problem: { title: string; body: string };
        need: { title: string; body: string };
        build: { title: string; body: string };
      };
      features: { title: string; description: string }[];
      widget: { title: string; body: string };
      prototypesLabel: string;
      prototypes: { id: string; caption: string }[];
      otherProjectsTitle: string;
      otherProjects: { slug: string; title: string; description: string }[];
    };
  };
  contact: {
    metaTitle: string;
    metaDescription: string;
    subtitle: string;
    title: string;
    description: string;
    aside: {
      emailLabel: string;
      responseNote: string;
      formTitle: string;
    };
    form: {
      name: string;
      email: string;
      company: string;
      subject: string;
      message: string;
      submit: string;
      submitting: string;
      success: string;
      placeholders: {
        name: string;
        email: string;
        company: string;
        subject: string;
        message: string;
      };
    };
  };
  footer: {
    tagline: string;
    linksLabel: string;
    reels: string[];
  };
}
