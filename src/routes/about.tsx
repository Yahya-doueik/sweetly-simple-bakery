import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Lazy Cake" },
      { name: "description", content: "A small kitchen making no-bake chocolate cakes the slow way. Real chocolate, butter biscuits, time." },
      { property: "og:title", content: "About — Lazy Cake" },
      { property: "og:description", content: "The story behind our slow-made, no-bake cakes." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-6 py-20 md:py-28">
        <Reveal>
          <p className="text-sm uppercase tracking-[0.25em] text-accent">Our Story</p>
          <h1 className="mt-3 font-display text-5xl text-foreground md:text-6xl">A kitchen without an oven.</h1>
        </Reveal>
        <div className="mt-10 space-y-6 text-lg leading-relaxed text-muted-foreground">
          <Reveal delay={0.05}>
            <p>
              Lazy Cake started in 2021 in a tiny flat with a broken oven and a craving for chocolate. The first batch was an
              accident: melted butter, dark chocolate, biscuits crushed by hand, set overnight in the fridge.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p>
              Friends asked for more. Then their friends. Today we make four cakes — slowly, in small batches, from a
              small kitchen on Linden Lane.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p>
              We use 70% Belgian chocolate, French butter, and biscuits we'd happily eat on their own. Nothing else.
            </p>
          </Reveal>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
