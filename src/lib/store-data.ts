export type AboutContent = {
  heading: string;
  subtitle: string;
  paragraphs: string[];
};

export type Product = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  image: string;
  images?: string[];
  tag?: string;
  hidden?: boolean;
};

export type HomeHeroContent = {
  eyebrow: string;
  headingPrefix: string;
  headingEmphasis: string;
  headingSuffix: string;
  description: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  image: string;
  imageAlt: string;
};

export type HomeValue = {
  value: string;
  label: string;
};

export type HomeContent = {
  hero: HomeHeroContent;
  values: HomeValue[];
};

export type NewsPlacement = "hero" | "menu" | "about" | "contact";

export type NewsItem = {
  id: string;
  title: string;
  message: string;
  placement: NewsPlacement;
  sortOrder: number;
};

export const DEFAULT_PRODUCTS: Product[] = [];

export const DEFAULT_ABOUT_CONTENT: AboutContent = {
  heading: "A kitchen without an oven.",
  subtitle: "Our Story",
  paragraphs: [
    "Lazy Cake started in 2021 in a tiny flat with a broken oven and a craving for chocolate. The first batch was an accident: melted butter, dark chocolate, biscuits crushed by hand, set overnight in the fridge.",
    "Friends asked for more. Then their friends. Today we make four cakes — slowly, in small batches, from a small kitchen on Linden Lane.",
    "We use 70% Belgian chocolate, French butter, and biscuits we'd happily eat on their own. Nothing else.",
  ],
};

export const DEFAULT_HOME_CONTENT: HomeContent = {
  hero: {
    eyebrow: "No-bake · Hand-finished",
    headingPrefix: "Slow cakes for",
    headingEmphasis: "unhurried",
    headingSuffix: "days.",
    description:
      "We fold great chocolate through buttery biscuits and let time do the rest. No oven. No rush. Just dense, fudgy slices.",
    primaryCtaLabel: "Browse the menu",
    secondaryCtaLabel: "Our story",
    image: "",
    imageAlt: "Sliced chocolate lazy cake on parchment",
  },
  values: [
    { value: "72hr", label: "rest before slicing" },
    { value: "3", label: "ingredients you'd recognise" },
    { value: "0", label: "ovens harmed" },
  ],
};
