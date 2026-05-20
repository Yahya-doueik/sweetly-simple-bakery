import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Lazy Cake" },
      { name: "description", content: "Review your box and place your Lazy Cake order." },
    ],
  }),
  component: Checkout,
});

const SHIPPING_FLAT = 8;
const CUSTOMER_STORAGE_KEY = "lazycake.checkout.customer.v1";
const WHATSAPP_NUMBER = "96170914486";

type CustomerDetails = {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  notes: string;
};

function getCustomerDetails(formData: FormData): CustomerDetails {
  return {
    email: formData.get("email")?.toString().trim() ?? "",
    phone: formData.get("phone")?.toString().trim() ?? "",
    firstName: formData.get("firstName")?.toString().trim() ?? "",
    lastName: formData.get("lastName")?.toString().trim() ?? "",
    address: formData.get("address")?.toString().trim() ?? "",
    city: formData.get("city")?.toString().trim() ?? "",
    zip: formData.get("zip")?.toString().trim() ?? "",
    country: formData.get("country")?.toString().trim() ?? "",
    notes: formData.get("notes")?.toString().trim() ?? "",
  };
}

function formatPrice(price: number) {
  return `$${price.toFixed(0)}`;
}

function buildWhatsAppMessage({
  items,
  subtotal,
  shipping,
  total,
  customer,
}: {
  items: ReturnType<typeof useCart>["items"];
  subtotal: number;
  shipping: number;
  total: number;
  customer: CustomerDetails;
}) {
  const orderLines = items.map(
    ({ cake, quantity }) =>
      `- ${cake.name} x${quantity} @ ${formatPrice(cake.price)} = ${formatPrice(cake.price * quantity)}`,
  );

  const customerLines = [
    `Name: ${customer.firstName} ${customer.lastName}`.trim(),
    `Email: ${customer.email}`,
    `Phone: ${customer.phone}`,
    `Address: ${customer.address}`,
    `City: ${customer.city}`,
    `Postcode: ${customer.zip}`,
    `Country: ${customer.country}`,
    customer.notes ? `Delivery notes: ${customer.notes}` : null,
  ].filter(Boolean);

  return [
    "Hello, I'd like to place an order from Lazy Cake.",
    "",
    "Order details:",
    ...orderLines,
    "",
    `Subtotal: ${formatPrice(subtotal)}`,
    `Shipping: ${formatPrice(shipping)}`,
    `Total: ${formatPrice(total)}`,
    "",
    "Customer details:",
    ...customerLines,
  ].join("\n");
}

function Checkout() {
  const { items, subtotal, setQuantity, removeItem } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const shipping = items.length === 0 ? 0 : SHIPPING_FLAT;
  const total = subtotal + shipping;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
        customer,
      });

      window.location.assign(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      );
    } catch {
      toast.error("Unable to start WhatsApp checkout.", {
        description: "Please try again.",
      });
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <Reveal className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.25em] text-accent">Checkout</p>
          <h1 className="mt-3 font-display text-5xl text-foreground md:text-6xl">Almost yours.</h1>
          <p className="mt-4 text-muted-foreground">
            Payment method: cash on delivery.
          </p>
        </Reveal>

        {items.length === 0 ? (
          <Reveal className="mt-16 rounded-2xl border border-border/60 bg-card p-12 text-center">
            <p className="font-display text-3xl text-foreground">Your box is empty.</p>
            <p className="mt-2 text-muted-foreground">Pick a cake or two and come back.</p>
            <Link to="/menu" className="mt-6 inline-block rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground">
              Browse the menu
            </Link>
          </Reveal>
        ) : (
          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_420px]">
            <Reveal>
              <form onSubmit={onSubmit} className="space-y-8">
                <fieldset className="space-y-4">
                  <legend className="font-display text-2xl text-foreground">Contact</legend>
                  <Field label="Email" name="email" type="email" required />
                  <Field label="Phone" name="phone" type="tel" required />
                </fieldset>
                <fieldset className="space-y-4">
                  <legend className="font-display text-2xl text-foreground">Delivery</legend>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="First name" name="firstName" required />
                    <Field label="Last name" name="lastName" required />
                  </div>
                  <Field label="Address" name="address" required />
                  <div className="grid gap-4 md:grid-cols-3">
                    <Field label="City" name="city" required />
                    <Field label="Postcode" name="zip" required />
                    <Field label="Country" name="country" defaultValue="United States" required />
                  </div>
                  <Field label="Delivery notes (optional)" name="notes" />
                </fieldset>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full bg-primary px-7 py-4 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:translate-y-[-2px] disabled:opacity-60"
                >
                  {submitting ? "Placing order…" : `Place order — $${total.toFixed(0)}`}
                </button>
                <p className="text-xs text-muted-foreground">
                  Your order is confirmed on WhatsApp and paid in cash on delivery.
                </p>
              </form>
            </Reveal>

            <Reveal>
              <aside className="sticky top-24 rounded-2xl border border-border/60 bg-card p-6 shadow-[var(--shadow-soft)]">
                <p className="text-xs uppercase tracking-[0.25em] text-accent">Your box</p>
                <ul className="mt-4 divide-y divide-border/60">
                  {items.map(({ cake, quantity }) => (
                    <li key={cake.id} className="flex gap-4 py-4">
                      <img src={cake.image} alt={cake.name} className="h-16 w-16 flex-shrink-0 rounded-md object-cover" />
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between gap-2">
                          <p className="font-medium text-foreground">{cake.name}</p>
                          <p className="font-display text-accent">${(cake.price * quantity).toFixed(0)}</p>
                        </div>
                        <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                          <div className="inline-flex items-center gap-2">
                            <button type="button" onClick={() => setQuantity(cake.id, quantity - 1)} className="rounded-full border border-border px-2 leading-none hover:bg-secondary">−</button>
                            <span className="tabular-nums">{quantity}</span>
                            <button type="button" onClick={() => setQuantity(cake.id, quantity + 1)} className="rounded-full border border-border px-2 leading-none hover:bg-secondary">+</button>
                          </div>
                          <button type="button" onClick={() => removeItem(cake.id)} className="underline-offset-4 hover:text-foreground hover:underline">Remove</button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <dl className="mt-6 space-y-2 border-t border-border/60 pt-4 text-sm">
                  <Row label="Subtotal" value={`$${subtotal.toFixed(0)}`} />
                  <Row label="Shipping" value={`$${shipping.toFixed(0)}`} />
                  <Row label="Total" value={`$${total.toFixed(0)}`} bold />
                </dl>
              </aside>
            </Reveal>
          </div>
        )}
      </section>
      <SiteFooter />
    </div>
  );
}

function Field({ label, name, type = "text", required, defaultValue }: { label: string; name: string; type?: string; required?: boolean; defaultValue?: string }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/30"
      />
    </label>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "pt-2 text-base font-medium text-foreground" : "text-muted-foreground"}`}>
      <dt>{label}</dt>
      <dd className={bold ? "font-display text-xl text-foreground" : ""}>{value}</dd>
    </div>
  );
}
