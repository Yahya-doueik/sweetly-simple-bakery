import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useLocation } from "../_libs/tanstack__react-router.mjs";
import { a as SiteHeader, b as StaggerGroup, c as StaggerItem, R as Reveal, S as SiteFooter } from "./Reveal-DxRq4R59.mjs";
import { u as useCart } from "./router-mByMQZ6p.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { u as useScroll, a as useTransform, m as motion } from "../_libs/framer-motion.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/lucide-react.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
const heroImg = "/assets/hero-cake-DfAM1lCe.jpg";
function CakeCard({ cake }) {
  const { addItem, openCart } = useCart();
  const handleAdd = () => {
    addItem(cake, 1);
    toast.success(`${cake.name} added to your box`, {
      action: { label: "View cart", onClick: openCart }
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.article,
    {
      variants: {
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
      },
      whileHover: { y: -6 },
      transition: { type: "spring", stiffness: 220, damping: 22 },
      className: "group relative overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-glow)]",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[4/5] overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: cake.image,
              alt: cake.name,
              loading: "lazy",
              width: 900,
              height: 1100,
              className: "h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            }
          ),
          cake.tag && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-medium tracking-wide text-foreground backdrop-blur", children: cake.tag })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-2xl text-foreground", children: cake.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm italic text-muted-foreground", children: cake.tagline })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display text-xl text-accent", children: [
              "$",
              cake.price
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm leading-relaxed text-muted-foreground", children: cake.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: handleAdd,
              className: "mt-4 self-start rounded-full border border-foreground/20 px-5 py-2 text-sm font-medium text-foreground transition-all hover:border-foreground hover:bg-foreground hover:text-background",
              children: "Add to box"
            }
          )
        ] })
      ]
    }
  );
}
const classic = "/assets/cake-classic-DKgOknfY.jpg";
const pistachio = "/assets/cake-pistachio-Cqd8pASh.jpg";
const caramel = "/assets/cake-caramel-Bfat9LLJ.jpg";
const espresso = "/assets/cake-espresso-nIz_AXhq.jpg";
const cakes = [
  {
    id: "classic-cocoa",
    name: "Classic Cocoa",
    tagline: "The original lazy cake",
    description: "Belgian dark chocolate folded with butter biscuits and a whisper of vanilla. Dense, fudgy, and sliced cold.",
    price: 28,
    image: classic,
    tag: "Bestseller"
  },
  {
    id: "pistachio-rose",
    name: "Pistachio & Rose",
    tagline: "Floral, nutty, refined",
    description: "White chocolate ganache with crushed Sicilian pistachios and a delicate rosewater finish.",
    price: 34,
    image: pistachio,
    tag: "New"
  },
  {
    id: "salted-caramel",
    name: "Salted Caramel Hazelnut",
    tagline: "Buttery and golden",
    description: "Soft caramel, toasted Piedmont hazelnuts, and flaky sea salt over a chocolate biscuit base.",
    price: 32,
    image: caramel
  },
  {
    id: "espresso",
    name: "Espresso Tiramisu",
    tagline: "For the coffee devoted",
    description: "Mascarpone, single-origin espresso, and ladyfingers layered into a cold-set cocoa loaf.",
    price: 30,
    image: espresso
  }
];
function Home() {
  const location = useLocation();
  const heroRef = reactExports.useRef(null);
  const {
    scrollYProgress
  } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  reactExports.useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => el.scrollIntoView({
          behavior: "smooth"
        }), 100);
      }
    }
  }, [location.hash]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteHeader, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { ref: heroRef, className: "relative overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        y: 30
      }, animate: {
        opacity: 1,
        y: 0
      }, transition: {
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1]
      }, className: "relative z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-4 text-sm uppercase tracking-[0.25em] text-accent", children: "No-bake · Hand-finished" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-5xl leading-[1.05] text-foreground md:text-7xl", children: [
          "Slow cakes for ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "italic", children: "unhurried" }),
          " days."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 max-w-md text-lg text-muted-foreground", children: "We fold great chocolate through buttery biscuits and let time do the rest. No oven. No rush. Just dense, fudgy slices." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#menu", onClick: (e) => {
            e.preventDefault();
            document.getElementById("menu")?.scrollIntoView({
              behavior: "smooth"
            });
          }, className: "rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:translate-y-[-2px]", children: "Browse the menu" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#about", onClick: (e) => {
            e.preventDefault();
            document.getElementById("about")?.scrollIntoView({
              behavior: "smooth"
            });
          }, className: "rounded-full border border-foreground/20 px-7 py-3 text-sm font-medium text-foreground transition-all hover:bg-foreground hover:text-background", children: "Our story" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { style: {
        y: heroY,
        scale: heroScale
      }, initial: {
        opacity: 0,
        scale: 0.96
      }, animate: {
        opacity: 1,
        scale: 1
      }, transition: {
        duration: 1.1,
        ease: [0.22, 1, 0.36, 1]
      }, className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -inset-6 -z-10 rounded-[2rem] bg-[var(--gradient-warm)] blur-2xl opacity-70" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: heroImg, alt: "Sliced chocolate lazy cake on parchment", width: 1600, height: 1200, className: "relative aspect-[4/3] w-full rounded-[1.75rem] object-cover shadow-[var(--shadow-soft)]" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-y border-border/60 bg-secondary/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StaggerGroup, { className: "mx-auto grid max-w-6xl gap-8 px-6 py-10 text-center md:grid-cols-3", children: [["72hr", "rest before slicing"], ["3", "ingredients you'd recognise"], ["0", "ovens harmed"]].map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(StaggerItem, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-4xl text-foreground", children: k }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm uppercase tracking-widest text-muted-foreground", children: v })
    ] }, k)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "menu", className: "mx-auto max-w-6xl px-6 py-20 scroll-mt-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Reveal, { className: "max-w-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm uppercase tracking-[0.25em] text-accent", children: "The Menu" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 font-display text-5xl text-foreground md:text-6xl", children: "Pick your slice." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 text-lg text-muted-foreground", children: "Each cake is set overnight, sliced cold, and packed in a chilled box. Ships locally Tue–Fri." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StaggerGroup, { className: "mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3", children: cakes.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(CakeCard, { cake: c }, c.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "about", className: "mx-auto max-w-3xl px-6 py-20 scroll-mt-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Reveal, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm uppercase tracking-[0.25em] text-accent", children: "Our Story" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 font-display text-5xl text-foreground md:text-6xl", children: "A kitchen without an oven." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 space-y-6 text-lg leading-relaxed text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { delay: 0.05, children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Lazy Cake started in 2021 in a tiny flat with a broken oven and a craving for chocolate. The first batch was an accident: melted butter, dark chocolate, biscuits crushed by hand, set overnight in the fridge." }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { delay: 0.1, children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Friends asked for more. Then their friends. Today we make four cakes — slowly, in small batches, from a small kitchen on Linden Lane." }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { delay: 0.15, children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "We use 70% Belgian chocolate, French butter, and biscuits we'd happily eat on their own. Nothing else." }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "contact", className: "mx-auto grid max-w-5xl gap-16 px-6 py-20 md:grid-cols-2 md:py-28 scroll-mt-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Reveal, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm uppercase tracking-[0.25em] text-accent", children: "Say hello" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 font-display text-5xl text-foreground md:text-6xl", children: "Custom orders & events." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-muted-foreground", children: "Birthdays, weddings, dinner parties, or just a Tuesday — tell us what you're dreaming up." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "mt-10 space-y-4 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "font-medium text-foreground", children: "Email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "text-muted-foreground", children: "hello@lazycake.shop" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "font-medium text-foreground", children: "Phone" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "text-muted-foreground", children: "+1 (555) 010-2244" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "font-medium text-foreground", children: "Studio" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "text-muted-foreground", children: "14 Linden Lane · Mon–Sat 9–7" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { delay: 0.1, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
        e.preventDefault();
        alert("Thanks — we'll be in touch within a day.");
      }, className: "space-y-5 rounded-2xl bg-card p-8 shadow-[var(--shadow-soft)]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "name", className: "mb-2 block text-sm font-medium text-foreground", children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "name", required: true, className: "w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-accent" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "email", className: "mb-2 block text-sm font-medium text-foreground", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "email", type: "email", required: true, className: "w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-accent" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "msg", className: "mb-2 block text-sm font-medium text-foreground", children: "What can we make for you?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { id: "msg", rows: 5, required: true, className: "w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-accent" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "w-full rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground transition-all hover:opacity-90", children: "Send message" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteFooter, {})
  ] });
}
export {
  Home as component
};
