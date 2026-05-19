import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import heroImg from "@/assets/hero-cake.jpg";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CakeCard } from "@/components/CakeCard";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/Reveal";
import { cakes } from "@/data/cakes";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lazy Cake — Slow-made no-bake cakes" },
      { name: "description", content: "Hand-finished no-bake chocolate cakes, made slowly with great ingredients. Order online for pickup or local delivery." },
      { property: "og:title", content: "Lazy Cake — Slow-made no-bake cakes" },
      { property: "og:description", content: "Hand-finished no-bake chocolate cakes from our small kitchen." },
    ],
  }),
  component: Home,
});

function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section ref={heroRef} className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10"
          >
            <p className="mb-4 text-sm uppercase tracking-[0.25em] text-accent">No-bake · Hand-finished</p>
            <h1 className="font-display text-5xl leading-[1.05] text-foreground md:text-7xl">
              Slow cakes for <span className="italic">unhurried</span> days.
            </h1>
            <p className="mt-6 max-w-md text-lg text-muted-foreground">
              We fold great chocolate through buttery biscuits and let time do the rest. No oven. No rush. Just dense, fudgy slices.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#menu"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:translate-y-[-2px]"
              >
                Browse the menu
              </a>
              <a
                href="#about"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="rounded-full border border-foreground/20 px-7 py-3 text-sm font-medium text-foreground transition-all hover:bg-foreground hover:text-background"
              >
                Our story
              </a>
            </div>
          </motion.div>
          <motion.div
            style={{ y: heroY, scale: heroScale }}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-[var(--gradient-warm)] blur-2xl opacity-70" />
            <img
              src={heroImg}
              alt="Sliced chocolate lazy cake on parchment"
              width={1600}
              height={1200}
              className="relative aspect-[4/3] w-full rounded-[1.75rem] object-cover shadow-[var(--shadow-soft)]"
            />
          </motion.div>
        </div>
      </section>

      {/* Marquee values */}
      <section className="border-y border-border/60 bg-secondary/30">
        <StaggerGroup className="mx-auto grid max-w-6xl gap-8 px-6 py-10 text-center md:grid-cols-3">
          {[
            ["72hr", "rest before slicing"],
            ["3", "ingredients you'd recognise"],
            ["0", "ovens harmed"],
          ].map(([k, v]) => (
            <StaggerItem key={k as string}>
              <p className="font-display text-4xl text-foreground">{k}</p>
              <p className="mt-1 text-sm uppercase tracking-widest text-muted-foreground">{v}</p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* Menu */}
      <section id="menu" className="mx-auto max-w-6xl px-6 py-20 scroll-mt-20">
        <Reveal className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.25em] text-accent">The Menu</p>
          <h2 className="mt-3 font-display text-5xl text-foreground md:text-6xl">Pick your slice.</h2>
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

      {/* About */}
      <section id="about" className="mx-auto max-w-3xl px-6 py-20 scroll-mt-20">
        <Reveal>
          <p className="text-sm uppercase tracking-[0.25em] text-accent">Our Story</p>
          <h2 className="mt-3 font-display text-5xl text-foreground md:text-6xl">A kitchen without an oven.</h2>
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

      {/* Contact */}
      <section id="contact" className="mx-auto grid max-w-5xl gap-16 px-6 py-20 md:grid-cols-2 md:py-28 scroll-mt-20">
        <Reveal>
          <p className="text-sm uppercase tracking-[0.25em] text-accent">Say hello</p>
          <h2 className="mt-3 font-display text-5xl text-foreground md:text-6xl">Custom orders & events.</h2>
          <p className="mt-6 text-muted-foreground">
            Birthdays, weddings, dinner parties, or just a Tuesday — tell us what you're dreaming up.
          </p>
          <dl className="mt-10 space-y-4 text-sm">
            <div>
              <dt className="font-medium text-foreground">Email</dt>
              <dd className="text-muted-foreground">hello@lazycake.shop</dd>
            </div>
            <div>
              <dt className="font-medium text-foreground">Phone</dt>
              <dd className="text-muted-foreground">+1 (555) 010-2244</dd>
            </div>
            <div>
              <dt className="font-medium text-foreground">Studio</dt>
              <dd className="text-muted-foreground">14 Linden Lane · Mon–Sat 9–7</dd>
            </div>
          </dl>
        </Reveal>
        <Reveal delay={0.1}>
          <form
            onSubmit={(e) => { e.preventDefault(); alert("Thanks — we'll be in touch within a day."); }}
            className="space-y-5 rounded-2xl bg-card p-8 shadow-[var(--shadow-soft)]"
          >
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-foreground">Name</label>
              <input id="name" required className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-accent" />
            </div>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">Email</label>
              <input id="email" type="email" required className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-accent" />
            </div>
            <div>
              <label htmlFor="msg" className="mb-2 block text-sm font-medium text-foreground">What can we make for you?</label>
              <textarea id="msg" rows={5} required className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-accent" />
            </div>
            <button type="submit" className="w-full rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground transition-all hover:opacity-90">
              Send message
            </button>
          </form>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  );
}
