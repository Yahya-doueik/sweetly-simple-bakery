import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { b as createRouter, e as useRouter, a as createRootRoute, c as createFileRoute, l as lazyRouteComponent, H as HeadContent, S as Scripts, O as Outlet, L as Link } from "../_libs/tanstack__react-router.mjs";
import { T as Toaster$1 } from "../_libs/sonner.mjs";
import { A as AnimatePresence, m as motion } from "../_libs/framer-motion.mjs";
import { X, M as Minus, P as Plus } from "../_libs/lucide-react.mjs";
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
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
const CartContext = reactExports.createContext(null);
const STORAGE_KEY = "lazycake.cart.v1";
function CartProvider({ children }) {
  const [items, setItems] = reactExports.useState([]);
  const [isOpen, setOpen] = reactExports.useState(false);
  const [hydrated, setHydrated] = reactExports.useState(false);
  reactExports.useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) setItems(JSON.parse(raw));
    } catch {
    }
    setHydrated(true);
  }, []);
  reactExports.useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
    }
  }, [items, hydrated]);
  const addItem = reactExports.useCallback((cake, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.cake.id === cake.id);
      if (existing) return prev.map((i) => i.cake.id === cake.id ? { ...i, quantity: i.quantity + quantity } : i);
      return [...prev, { cake, quantity }];
    });
  }, []);
  const removeItem = reactExports.useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.cake.id !== id));
  }, []);
  const setQuantity = reactExports.useCallback((id, quantity) => {
    setItems((prev) => quantity <= 0 ? prev.filter((i) => i.cake.id !== id) : prev.map((i) => i.cake.id === id ? { ...i, quantity } : i));
  }, []);
  const clear = reactExports.useCallback(() => setItems([]), []);
  const value = reactExports.useMemo(() => ({
    items,
    count: items.reduce((n, i) => n + i.quantity, 0),
    subtotal: items.reduce((n, i) => n + i.quantity * i.cake.price, 0),
    isOpen,
    openCart: () => setOpen(true),
    closeCart: () => setOpen(false),
    addItem,
    removeItem,
    setQuantity,
    clear
  }), [items, isOpen, addItem, removeItem, setQuantity, clear]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(CartContext.Provider, { value, children });
}
function useCart() {
  const ctx = reactExports.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
function CartDrawer() {
  const { items, isOpen, closeCart, setQuantity, removeItem, subtotal, count } = useCart();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.25 },
        onClick: closeCart,
        className: "fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm"
      },
      "overlay"
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.aside,
      {
        initial: { x: "100%" },
        animate: { x: 0 },
        exit: { x: "100%" },
        transition: { type: "spring", stiffness: 260, damping: 32 },
        className: "fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-background shadow-[var(--shadow-soft)]",
        "aria-label": "Shopping cart",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center justify-between border-b border-border/60 px-6 py-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.25em] text-accent", children: "Your box" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-2xl text-foreground", children: [
                count,
                " ",
                count === 1 ? "cake" : "cakes"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: closeCart, className: "rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground", "aria-label": "Close cart", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto px-6 py-4", children: items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full flex-col items-center justify-center text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl text-foreground", children: "Your box is empty." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Add a slow-set cake to get started." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/",
                hash: "menu",
                onClick: closeCart,
                className: "mt-6 rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:opacity-90",
                children: "Browse the menu"
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border/60", children: items.map(({ cake, quantity }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-4 py-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: cake.image, alt: cake.name, className: "h-20 w-20 flex-shrink-0 rounded-lg object-cover" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-lg leading-tight text-foreground", children: cake.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-base text-accent", children: [
                  "$",
                  (cake.price * quantity).toFixed(0)
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs italic text-muted-foreground", children: cake.tagline }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-auto flex items-center justify-between pt-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center rounded-full border border-border", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setQuantity(cake.id, quantity - 1), className: "p-1.5 text-muted-foreground hover:text-foreground", "aria-label": "Decrease", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-3.5 w-3.5" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-6 text-center text-sm tabular-nums", children: quantity }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setQuantity(cake.id, quantity + 1), className: "p-1.5 text-muted-foreground hover:text-foreground", "aria-label": "Increase", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => removeItem(cake.id), className: "text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline", children: "Remove" })
              ] })
            ] })
          ] }, cake.id)) }) }),
          items.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "border-t border-border/60 px-6 py-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm uppercase tracking-widest text-muted-foreground", children: "Subtotal" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display text-2xl text-foreground", children: [
                "$",
                subtotal.toFixed(0)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Shipping & taxes calculated at checkout." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: "/checkout",
                onClick: closeCart,
                className: "mt-4 block w-full rounded-full bg-primary px-6 py-3 text-center text-sm font-medium text-primary-foreground transition-all hover:opacity-90",
                children: [
                  "Checkout — $",
                  subtotal.toFixed(0)
                ]
              }
            )
          ] })
        ]
      },
      "drawer"
    )
  ] }) });
}
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
const appCss = "/assets/styles-DTZQn8pw.css";
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
const Route$5 = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lazy Cake — Slow-made no-bake cakes" },
      { name: "description", content: "Hand-finished no-bake chocolate cakes, made slowly with great ingredients. Order online for pickup or local delivery." },
      { name: "author", content: "Lazy Cake Co." },
      { property: "og:title", content: "Lazy Cake — Slow-made no-bake cakes" },
      { property: "og:description", content: "Hand-finished no-bake chocolate cakes, made slowly with great ingredients." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400&family=Inter:wght@400;500;600&display=swap"
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(CartProvider, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CartDrawer, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { position: "bottom-right" })
  ] });
}
const $$splitComponentImporter$4 = () => import("./menu-DPDVSfvW.mjs");
const Route$4 = createFileRoute("/menu")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./contact-C72jEAyE.mjs");
const Route$3 = createFileRoute("/contact")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./checkout-C3IZg4Su.mjs");
const Route$2 = createFileRoute("/checkout")({
  head: () => ({
    meta: [{
      title: "Checkout — Lazy Cake"
    }, {
      name: "description",
      content: "Review your box and place your Lazy Cake order."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./about-Bw1U5-C8.mjs");
const Route$1 = createFileRoute("/about")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./index-CchXBepo.mjs");
const Route = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "Lazy Cake — Slow-made no-bake cakes"
    }, {
      name: "description",
      content: "Hand-finished no-bake chocolate cakes, made slowly with great ingredients. Order online for pickup or local delivery."
    }, {
      property: "og:title",
      content: "Lazy Cake — Slow-made no-bake cakes"
    }, {
      property: "og:description",
      content: "Hand-finished no-bake chocolate cakes from our small kitchen."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const MenuRoute = Route$4.update({
  id: "/menu",
  path: "/menu",
  getParentRoute: () => Route$5
});
const ContactRoute = Route$3.update({
  id: "/contact",
  path: "/contact",
  getParentRoute: () => Route$5
});
const CheckoutRoute = Route$2.update({
  id: "/checkout",
  path: "/checkout",
  getParentRoute: () => Route$5
});
const AboutRoute = Route$1.update({
  id: "/about",
  path: "/about",
  getParentRoute: () => Route$5
});
const IndexRoute = Route.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$5
});
const rootRouteChildren = {
  IndexRoute,
  AboutRoute,
  CheckoutRoute,
  ContactRoute,
  MenuRoute
};
const routeTree = Route$5._addFileChildren(rootRouteChildren)._addFileTypes();
function DefaultErrorComponent({ error, reset }) {
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        className: "h-8 w-8 text-destructive",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: 2,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            d: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          }
        )
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight text-foreground", children: "Something went wrong" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "An unexpected error occurred. Please try again." }),
    false,
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex items-center justify-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const getRouter = () => {
  const router2 = createRouter({
    routeTree,
    context: {},
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultErrorComponent
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  router as r,
  useCart as u
};
