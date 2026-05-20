import { createFileRoute, useLocation } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import heroImg from "@/assets/hero-cake.jpg";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CakeCard } from "@/components/CakeCard";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/Reveal";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import {
  bootstrapStoreData,
  subscribeAbout,
  subscribeHomeContent,
  subscribeProducts,
} from "@/lib/firebase-store";
import {
  DEFAULT_ABOUT_CONTENT,
  DEFAULT_HOME_CONTENT,
  type AboutContent,
  type HomeContent,
  type Product,
} from "@/lib/store-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lazy Cake — Slow-made no-bake cakes" },
      {
        name: "description",
        content:
          "Hand-finished no-bake chocolate cakes, made slowly with great ingredients. Order online for pickup or local delivery.",
      },
      { property: "og:title", content: "Lazy Cake — Slow-made no-bake cakes" },
      {
        property: "og:description",
        content: "Hand-finished no-bake chocolate cakes from our small kitchen.",
      },
    ],
  }),
  component: Home,
});

const MAX_NAME_LENGTH = 80;
const MAX_EMAIL_LENGTH = 120;
const MAX_MESSAGE_LENGTH = 800;

function sanitizeForWhatsApp(value: FormDataEntryValue | null, maxLength: number) {
  return (value?.toString().trim() ?? "")
    .replace(/\r?\n/g, " ")
    .replace(/\p{Cc}/gu, "")
    .slice(0, maxLength);
}

function Home() {
  const location = useLocation();
  const heroRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [about, setAbout] = useState<AboutContent>(DEFAULT_ABOUT_CONTENT);
  const [home, setHome] = useState<HomeContent>(DEFAULT_HOME_CONTENT);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
      }
    }
  }, [location.hash]);

  useEffect(() => {
    bootstrapStoreData().catch(() => undefined);
    const unsubProducts = subscribeProducts(setProducts);
    const unsubAbout = subscribeAbout(setAbout);
    const unsubHome = subscribeHomeContent(setHome);
    return () => {
      unsubProducts();
      unsubAbout();
      unsubHome();
    };
  }, []);

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
            <p className="mb-4 text-sm uppercase tracking-[0.25em] text-accent">
              {home.hero.eyebrow}
            </p>
            <h1 className="font-display text-5xl leading-[1.05] text-foreground md:text-7xl">
              {home.hero.headingPrefix} <span className="italic">{home.hero.headingEmphasis}</span>{" "}
              {home.hero.headingSuffix}
            </h1>
            <p className="mt-6 max-w-md text-lg text-muted-foreground">{home.hero.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#menu"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:translate-y-[-2px]"
              >
                {home.hero.primaryCtaLabel}
              </a>
              <a
                href="#about"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="rounded-full border border-foreground/20 px-7 py-3 text-sm font-medium text-foreground transition-all hover:bg-foreground hover:text-background"
              >
                {home.hero.secondaryCtaLabel}
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
              src={home.hero.image || heroImg}
              alt={home.hero.imageAlt}
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
          {home.values.map((item) => (
            <StaggerItem key={`${item.value}-${item.label}`}>
              <p className="font-display text-4xl text-foreground">{item.value}</p>
              <p className="mt-1 text-sm uppercase tracking-widest text-muted-foreground">
                {item.label}
              </p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* Menu */}
      <section id="menu" className="mx-auto max-w-6xl px-6 py-20 scroll-mt-20">
        <Reveal className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.25em] text-accent">The Menu</p>
          <h2 className="mt-3 font-display text-5xl text-foreground md:text-6xl">
            Pick your slice.
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Each cake is set overnight, sliced cold, and packed in a chilled box. Ships locally
            Tue–Fri.
          </p>
        </Reveal>
        <StaggerGroup className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {products.map((c) => (
            <CakeCard key={c.id} cake={c} />
          ))}
        </StaggerGroup>
      </section>

      {/* About */}
      <section id="about" className="mx-auto max-w-3xl px-6 py-20 scroll-mt-20">
        <Reveal>
          <p className="text-sm uppercase tracking-[0.25em] text-accent">{about.subtitle}</p>
          <h2 className="mt-3 font-display text-5xl text-foreground md:text-6xl">
            {about.heading}
          </h2>
        </Reveal>
        <div className="mt-10 space-y-6 text-lg leading-relaxed text-muted-foreground">
          {about.paragraphs.map((paragraph, index) => (
            <Reveal key={paragraph} delay={0.05 + index * 0.05}>
              <p>{paragraph}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="mx-auto grid max-w-5xl gap-16 px-6 py-20 md:grid-cols-2 md:py-28 scroll-mt-20"
      >
        <Reveal>
          <p className="text-sm uppercase tracking-[0.25em] text-accent">Say hello</p>
          <h2 className="mt-3 font-display text-5xl text-foreground md:text-6xl">
            Custom orders & events.
          </h2>
          <p className="mt-6 text-muted-foreground">
            Birthdays, weddings, dinner parties, or just a Tuesday — tell us what you're dreaming
            up.
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
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const name = sanitizeForWhatsApp(formData.get("name"), MAX_NAME_LENGTH);
              const email = sanitizeForWhatsApp(formData.get("email"), MAX_EMAIL_LENGTH);
              const message = sanitizeForWhatsApp(formData.get("message"), MAX_MESSAGE_LENGTH);
              const whatsappMessage = [
                "Hello, I'd like to place a custom order.",
                "",
                `Name: ${name}`,
                `Email: ${email}`,
                `Custom order details: ${message}`,
              ].join("\n");
              const whatsappNumber = WHATSAPP_NUMBER.replace(/\D/g, "");
              if (!whatsappNumber) return;
              window.location.assign(
                `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`,
              );
            }}
            className="space-y-5 rounded-2xl bg-card p-8 shadow-[var(--shadow-soft)]"
          >
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-foreground">
                Name
              </label>
              <input
                id="name"
                name="name"
                maxLength={MAX_NAME_LENGTH}
                required
                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-accent"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                maxLength={MAX_EMAIL_LENGTH}
                required
                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-accent"
              />
            </div>
            <div>
              <label htmlFor="msg" className="mb-2 block text-sm font-medium text-foreground">
                What can we make for you?
              </label>
              <textarea
                id="msg"
                name="message"
                rows={5}
                maxLength={MAX_MESSAGE_LENGTH}
                required
                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-accent"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground transition-all hover:opacity-90"
            >
              Send message
            </button>
          </form>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  );
}
