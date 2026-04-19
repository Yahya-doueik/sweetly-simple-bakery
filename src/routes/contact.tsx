import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Lazy Cake" },
      { name: "description", content: "Get in touch for custom orders, events, or just to say hi." },
      { property: "og:title", content: "Contact — Lazy Cake" },
      { property: "og:description", content: "Custom orders, events, and friendly hellos." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto grid max-w-5xl gap-16 px-6 py-20 md:grid-cols-2 md:py-28">
        <Reveal>
          <p className="text-sm uppercase tracking-[0.25em] text-accent">Say hello</p>
          <h1 className="mt-3 font-display text-5xl text-foreground md:text-6xl">Custom orders & events.</h1>
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
