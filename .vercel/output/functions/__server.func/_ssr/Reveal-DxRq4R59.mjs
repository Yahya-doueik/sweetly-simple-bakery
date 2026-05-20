import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useCart } from "./router-mByMQZ6p.mjs";
import { S as ShoppingBag } from "../_libs/lucide-react.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}
function SiteHeader() {
  const { count, openCart } = useCart();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex h-16 max-w-6xl items-center justify-between px-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "a",
      {
        href: "#",
        onClick: (e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        },
        className: "flex items-center gap-2",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display text-2xl tracking-tight text-foreground", children: [
          "Lazy ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "italic text-accent", children: "Cake" })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "hidden items-center gap-8 text-sm font-medium md:flex", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "#menu",
          onClick: (e) => {
            e.preventDefault();
            scrollTo("menu");
          },
          className: "text-muted-foreground transition-colors hover:text-foreground",
          children: "Menu"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "#about",
          onClick: (e) => {
            e.preventDefault();
            scrollTo("about");
          },
          className: "text-muted-foreground transition-colors hover:text-foreground",
          children: "About"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "#contact",
          onClick: (e) => {
            e.preventDefault();
            scrollTo("contact");
          },
          className: "text-muted-foreground transition-colors hover:text-foreground",
          children: "Contact"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: openCart,
        className: "relative inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-all hover:opacity-90",
        "aria-label": `Open cart (${count} items)`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Cart" }),
          count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-semibold text-accent-foreground", children: count })
        ]
      }
    )
  ] }) });
}
function SiteFooter() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "mt-24 border-t border-border/60 bg-secondary/40", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-xl text-foreground", children: [
          "Lazy ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "italic text-accent", children: "Cake" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "No-bake cakes, slowly made with great chocolate." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2 font-medium text-foreground", children: "Visit" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "14 Linden Lane" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Mon–Sat · 9am–7pm" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2 font-medium text-foreground", children: "Contact" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "hello@lazycake.shop" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "+1 (555) 010-2244" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border/60 py-4 text-center text-xs text-muted-foreground", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " Lazy Cake Co. Made with cocoa."
    ] })
  ] });
}
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};
function Reveal({ children, delay = 0, ...rest }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: "hidden",
      whileInView: "visible",
      viewport: { once: true, margin: "-80px" },
      variants: fadeUp,
      transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
      ...rest,
      children
    }
  );
}
function StaggerGroup({ children, className }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      className,
      initial: "hidden",
      whileInView: "visible",
      viewport: { once: true, margin: "-80px" },
      variants: {
        hidden: {},
        visible: { transition: { staggerChildren: 0.12 } }
      },
      children
    }
  );
}
function StaggerItem({ children, className }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { className, variants: fadeUp, children });
}
export {
  Reveal as R,
  SiteFooter as S,
  SiteHeader as a,
  StaggerGroup as b,
  StaggerItem as c
};
