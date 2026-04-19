import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CakeCard } from "@/components/CakeCard";
import { Reveal, StaggerGroup } from "@/components/Reveal";
import { cakes } from "@/data/cakes";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu — Lazy Cake" },
      { name: "description", content: "Browse our full menu of no-bake chocolate cakes — classic cocoa, pistachio rose, salted caramel hazelnut, and espresso tiramisu." },
      { property: "og:title", content: "Menu — Lazy Cake" },
      { property: "og:description", content: "Our full lineup of slow-made, no-bake cakes." },
    ],
  }),
  component: Menu,
});

function Menu() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <Reveal className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.25em] text-accent">The Menu</p>
          <h1 className="mt-3 font-display text-5xl text-foreground md:text-6xl">Pick your slice.</h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Each cake is set overnight, sliced cold, and packed in a chilled box. Ships locally Tue–Fri.
          </p>
        </Reveal>
        <StaggerGroup className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {cakes.map((c) => (
            <CakeCard key={c.id} cake={c} />
          ))}
        </StaggerGroup>
      </section>
      <SiteFooter />
    </div>
  );
}
