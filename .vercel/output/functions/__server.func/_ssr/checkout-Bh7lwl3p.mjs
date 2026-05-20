import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a as SiteHeader, R as Reveal, S as SiteFooter, W as WHATSAPP_NUMBER } from "./constants-CR1sXmqj.mjs";
import { u as useCart } from "./router-IxDu2Vjv.mjs";
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
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
const SHIPPING_FLAT = 8;
const CUSTOMER_STORAGE_KEY = "lazycake.checkout.customer.v1";
function getCustomerDetails(formData) {
  return {
    email: formData.get("email")?.toString().trim() ?? "",
    phone: formData.get("phone")?.toString().trim() ?? "",
    firstName: formData.get("firstName")?.toString().trim() ?? "",
    lastName: formData.get("lastName")?.toString().trim() ?? "",
    address: formData.get("address")?.toString().trim() ?? "",
    city: formData.get("city")?.toString().trim() ?? "",
    zip: formData.get("zip")?.toString().trim() ?? "",
    country: formData.get("country")?.toString().trim() ?? "",
    notes: formData.get("notes")?.toString().trim() ?? ""
  };
}
function formatPrice(price) {
  return `$${price.toFixed(0)}`;
}
function buildWhatsAppMessage({
  items,
  subtotal,
  shipping,
  total,
  customer
}) {
  const orderLines = items.map(({
    cake,
    quantity
  }) => `- ${cake.name} x${quantity} @ ${formatPrice(cake.price)} = ${formatPrice(cake.price * quantity)}`);
  const customerLines = [`Name: ${customer.firstName} ${customer.lastName}`.trim(), `Email: ${customer.email}`, `Phone: ${customer.phone}`, `Address: ${customer.address}`, `City: ${customer.city}`, `Postcode: ${customer.zip}`, `Country: ${customer.country}`, customer.notes ? `Delivery notes: ${customer.notes}` : null].filter(Boolean);
  return ["Hello, I'd like to place an order from Lazy Cake.", "", "Order details:", ...orderLines, "", `Subtotal: ${formatPrice(subtotal)}`, `Shipping: ${formatPrice(shipping)}`, `Total: ${formatPrice(total)}`, "", "Customer details:", ...customerLines].join("\n");
}
function Checkout() {
  const {
    items,
    subtotal,
    setQuantity,
    removeItem
  } = useCart();
  const [submitting, setSubmitting] = reactExports.useState(false);
  const shipping = items.length === 0 ? 0 : SHIPPING_FLAT;
  const total = subtotal + shipping;
  const onSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const customer = getCustomerDetails(formData);
    try {
      localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customer));
      const message = buildWhatsAppMessage({
        items,
        subtotal,
        shipping,
        total,
        customer
      });
      window.location.assign(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`);
    } catch {
      toast.error("Unable to start WhatsApp checkout.", {
        description: "Please try again."
      });
      setSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteHeader, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-6xl px-6 py-16 md:py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Reveal, { className: "max-w-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm uppercase tracking-[0.25em] text-accent", children: "Checkout" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-3 font-display text-5xl text-foreground md:text-6xl", children: "Almost yours." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-muted-foreground", children: "Payment method: cash on delivery." })
      ] }),
      items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Reveal, { className: "mt-16 rounded-2xl border border-border/60 bg-card p-12 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-3xl text-foreground", children: "Your box is empty." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-muted-foreground", children: "Pick a cake or two and come back." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/menu", className: "mt-6 inline-block rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground", children: "Browse the menu" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12 grid gap-10 lg:grid-cols-[1fr_420px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "space-y-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("fieldset", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("legend", { className: "font-display text-2xl text-foreground", children: "Contact" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Email", name: "email", type: "email", required: true }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Phone", name: "phone", type: "tel", required: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("fieldset", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("legend", { className: "font-display text-2xl text-foreground", children: "Delivery" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "First name", name: "firstName", required: true }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Last name", name: "lastName", required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Address", name: "address", required: true }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "City", name: "city", required: true }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Postcode", name: "zip", required: true }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Country", name: "country", defaultValue: "United States", required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Delivery notes (optional)", name: "notes" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: submitting, className: "w-full rounded-full bg-primary px-7 py-4 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:translate-y-[-2px] disabled:opacity-60", children: submitting ? "Placing order…" : `Place order — $${total.toFixed(0)}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Your order is confirmed on WhatsApp and paid in cash on delivery." })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "sticky top-24 rounded-2xl border border-border/60 bg-card p-6 shadow-[var(--shadow-soft)]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.25em] text-accent", children: "Your box" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-4 divide-y divide-border/60", children: items.map(({
            cake,
            quantity
          }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-4 py-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: cake.image, alt: cake.name, className: "h-16 w-16 flex-shrink-0 rounded-md object-cover" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: cake.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-accent", children: [
                  "$",
                  (cake.price * quantity).toFixed(0)
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex items-center justify-between text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setQuantity(cake.id, quantity - 1), className: "rounded-full border border-border px-2 leading-none hover:bg-secondary", children: "−" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums", children: quantity }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setQuantity(cake.id, quantity + 1), className: "rounded-full border border-border px-2 leading-none hover:bg-secondary", children: "+" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => removeItem(cake.id), className: "underline-offset-4 hover:text-foreground hover:underline", children: "Remove" })
              ] })
            ] })
          ] }, cake.id)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "mt-6 space-y-2 border-t border-border/60 pt-4 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Subtotal", value: `$${subtotal.toFixed(0)}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Shipping", value: `$${shipping.toFixed(0)}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Total", value: `$${total.toFixed(0)}`, bold: true })
          ] })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteFooter, {})
  ] });
}
function Field({
  label,
  name,
  type = "text",
  required,
  defaultValue
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { name, type, required, defaultValue, className: "mt-1 block w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/30" })
  ] });
}
function Row({
  label,
  value,
  bold
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex justify-between ${bold ? "pt-2 text-base font-medium text-foreground" : "text-muted-foreground"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: bold ? "font-display text-xl text-foreground" : "", children: value })
  ] });
}
export {
  Checkout as component
};
