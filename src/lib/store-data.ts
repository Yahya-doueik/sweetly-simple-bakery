import { cakes, type Cake } from "@/data/cakes";

export type AboutContent = {
  heading: string;
  subtitle: string;
  paragraphs: string[];
};

export type Product = Cake;

export const DEFAULT_PRODUCTS: Product[] = cakes;

export const DEFAULT_ABOUT_CONTENT: AboutContent = {
  heading: "A kitchen without an oven.",
  subtitle: "Our Story",
  paragraphs: [
    "Lazy Cake started in 2021 in a tiny flat with a broken oven and a craving for chocolate. The first batch was an accident: melted butter, dark chocolate, biscuits crushed by hand, set overnight in the fridge.",
    "Friends asked for more. Then their friends. Today we make four cakes — slowly, in small batches, from a small kitchen on Linden Lane.",
    "We use 70% Belgian chocolate, French butter, and biscuits we'd happily eat on their own. Nothing else.",
  ],
};
