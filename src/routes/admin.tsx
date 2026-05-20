import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  bootstrapStoreData,
  deleteProduct,
  saveAbout,
  saveProduct,
  subscribeAbout,
  subscribeCustomers,
  subscribeOrders,
  subscribeProducts,
  updateOrderStatus,
  type CustomerRecord,
  type OrderRecord,
} from "@/lib/firebase-store";
import {
  DEFAULT_ABOUT_CONTENT,
  DEFAULT_PRODUCTS,
  type AboutContent,
  type Product,
} from "@/lib/store-data";

export const Route = createFileRoute("/admin")({
  component: AdminDashboard,
});

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "yahhusrash";
const ADMIN_SESSION_KEY = "lazycake.admin.auth.v1";

const EMPTY_PRODUCT: Product = {
  id: "",
  name: "",
  tagline: "",
  description: "",
  price: 0,
  image: "",
  tag: "",
};

function formatDate(date: string | null) {
  if (!date) return "—";
  return new Date(date).toLocaleString();
}

function totalRevenue(orders: OrderRecord[]) {
  return orders.reduce((sum, order) => sum + order.total, 0);
}

function AdminDashboard() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [about, setAbout] = useState<AboutContent>(DEFAULT_ABOUT_CONTENT);

  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<Product>(EMPTY_PRODUCT);
  const [savingProduct, setSavingProduct] = useState(false);
  const [savingAbout, setSavingAbout] = useState(false);

  useEffect(() => {
    const isAuthed = localStorage.getItem(ADMIN_SESSION_KEY) === "true";
    setLoggedIn(isAuthed);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    bootstrapStoreData().catch(() => undefined);
    const unsubProducts = subscribeProducts(setProducts);
    const unsubOrders = subscribeOrders(setOrders);
    const unsubCustomers = subscribeCustomers(setCustomers);
    const unsubAbout = subscribeAbout(setAbout);
    return () => {
      unsubProducts();
      unsubOrders();
      unsubCustomers();
      unsubAbout();
    };
  }, [isLoggedIn]);

  const metrics = useMemo(
    () => ({
      products: products.length,
      orders: orders.length,
      customers: customers.length,
      revenue: totalRevenue(orders),
    }),
    [products.length, orders, customers.length],
  );

  const resetProductForm = () => {
    setEditingProductId(null);
    setProductForm(EMPTY_PRODUCT);
  };

  const onLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem(ADMIN_SESSION_KEY, "true");
      setLoggedIn(true);
      setPassword("");
      toast.success("Welcome to the admin dashboard.");
      return;
    }
    toast.error("Invalid credentials.");
  };

  const onLogout = () => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setLoggedIn(false);
    setUsername("");
    setPassword("");
  };

  const onSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSavingProduct(true);
    try {
      const productToSave = {
        ...productForm,
        id: productForm.id.trim(),
        name: productForm.name.trim(),
        tagline: productForm.tagline.trim(),
        description: productForm.description.trim(),
        image: productForm.image.trim(),
        tag: productForm.tag?.trim() || undefined,
      };
      if (!productToSave.id || !productToSave.name || !productToSave.image) {
        toast.error("Product id, name, and image URL are required.");
        return;
      }
      await saveProduct(productToSave);
      toast.success(editingProductId ? "Product updated." : "Product added.");
      resetProductForm();
    } catch {
      toast.error("Unable to save product.");
    } finally {
      setSavingProduct(false);
    }
  };

  const onEditProduct = (product: Product) => {
    setEditingProductId(product.id);
    setProductForm({
      ...product,
      tag: product.tag ?? "",
    });
  };

  const onDeleteProduct = async (productId: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await deleteProduct(productId);
      toast.success("Product deleted.");
      if (editingProductId === productId) {
        resetProductForm();
      }
    } catch {
      toast.error("Unable to delete product.");
    }
  };

  const onSaveAbout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSavingAbout(true);
    try {
      await saveAbout({
        heading: about.heading.trim(),
        subtitle: about.subtitle.trim(),
        paragraphs: about.paragraphs.map((paragraph) => paragraph.trim()).filter(Boolean),
      });
      toast.success("About content updated.");
    } catch {
      toast.error("Unable to update about content.");
    } finally {
      setSavingAbout(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <section className="mx-auto max-w-md px-6 py-20">
          <div className="rounded-2xl border border-border/60 bg-card p-8 shadow-[var(--shadow-soft)]">
            <p className="text-sm uppercase tracking-[0.25em] text-accent">Admin</p>
            <h1 className="mt-3 font-display text-4xl text-foreground">Dashboard login</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Sign in to manage products, orders, users, and website content.
            </p>
            <form onSubmit={onLogin} className="mt-6 space-y-4">
              <Field label="Username" value={username} onChange={setUsername} />
              <Field label="Password" type="password" value={password} onChange={setPassword} />
              <button
                type="submit"
                className="w-full rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground transition-all hover:opacity-90"
              >
                Sign in
              </button>
            </form>
          </div>
        </section>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-accent">Admin dashboard</p>
            <h1 className="mt-2 font-display text-5xl text-foreground">Store control center</h1>
          </div>
          <button
            onClick={onLogout}
            className="rounded-full border border-foreground/20 px-5 py-2 text-sm font-medium text-foreground transition-all hover:bg-foreground hover:text-background"
          >
            Logout
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Products" value={metrics.products.toString()} />
          <MetricCard label="Orders" value={metrics.orders.toString()} />
          <MetricCard label="Customers" value={metrics.customers.toString()} />
          <MetricCard label="Revenue" value={`$${metrics.revenue.toFixed(0)}`} />
        </div>

        <div className="mt-10 grid gap-10">
          <section className="rounded-2xl border border-border/60 bg-card p-6 shadow-[var(--shadow-soft)]">
            <h2 className="font-display text-3xl text-foreground">Live orders</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              New orders appear here automatically as soon as checkout is submitted.
            </p>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border/60 text-muted-foreground">
                    <th className="pb-3 pr-4 font-medium">Time</th>
                    <th className="pb-3 pr-4 font-medium">Customer</th>
                    <th className="pb-3 pr-4 font-medium">Items</th>
                    <th className="pb-3 pr-4 font-medium">Total</th>
                    <th className="pb-3 pr-4 font-medium">Status</th>
                    <th className="pb-3 font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-border/50 align-top">
                      <td className="py-3 pr-4 text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="py-3 pr-4">
                        <p className="font-medium text-foreground">
                          {order.customer.firstName} {order.customer.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">{order.customer.email}</p>
                        <p className="text-xs text-muted-foreground">{order.customer.phone}</p>
                      </td>
                      <td className="py-3 pr-4">
                        {order.items.map((item) => (
                          <p key={item.id} className="text-xs text-muted-foreground">
                            {item.name} × {item.quantity}
                          </p>
                        ))}
                      </td>
                      <td className="py-3 pr-4 font-medium text-foreground">
                        ${order.total.toFixed(0)}
                      </td>
                      <td className="py-3 pr-4">
                        <select
                          value={order.status}
                          onChange={async (event) => {
                            const nextStatus = event.target.value as OrderRecord["status"];
                            try {
                              await updateOrderStatus(order.id, nextStatus);
                              toast.success("Order status updated.");
                            } catch {
                              toast.error("Unable to update order status.");
                            }
                          }}
                          className="rounded-md border border-input bg-background px-2 py-1 text-xs"
                        >
                          <option value="new">New</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="fulfilled">Fulfilled</option>
                        </select>
                      </td>
                      <td className="py-3 text-xs text-muted-foreground">
                        {order.customer.notes || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">No orders yet.</p>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-border/60 bg-card p-6 shadow-[var(--shadow-soft)]">
            <h2 className="font-display text-3xl text-foreground">Customers</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Customers are deduplicated by email + phone and auto-updated with every order.
            </p>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border/60 text-muted-foreground">
                    <th className="pb-3 pr-4 font-medium">Name</th>
                    <th className="pb-3 pr-4 font-medium">Contact</th>
                    <th className="pb-3 pr-4 font-medium">Address</th>
                    <th className="pb-3 pr-4 font-medium">Orders</th>
                    <th className="pb-3 font-medium">Last order</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id} className="border-b border-border/50">
                      <td className="py-3 pr-4 font-medium text-foreground">
                        {customer.firstName} {customer.lastName}
                      </td>
                      <td className="py-3 pr-4">
                        <p className="text-xs text-muted-foreground">{customer.email}</p>
                        <p className="text-xs text-muted-foreground">{customer.phone}</p>
                      </td>
                      <td className="py-3 pr-4 text-xs text-muted-foreground">
                        {customer.address}, {customer.city}, {customer.zip}, {customer.country}
                      </td>
                      <td className="py-3 pr-4 text-foreground">{customer.ordersCount}</td>
                      <td className="py-3 text-xs text-muted-foreground">
                        {formatDate(customer.lastOrderAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {customers.length === 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">No customers yet.</p>
              )}
            </div>
          </section>

          <section className="grid gap-10 xl:grid-cols-[1.2fr_1fr]">
            <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-[var(--shadow-soft)]">
              <h2 className="font-display text-3xl text-foreground">Products</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Add, edit, and remove products shown on the storefront.
              </p>
              <form onSubmit={onSaveProduct} className="mt-5 grid gap-3">
                <Field
                  label="Product ID"
                  value={productForm.id}
                  onChange={(value) => setProductForm((prev) => ({ ...prev, id: value }))}
                />
                <Field
                  label="Name"
                  value={productForm.name}
                  onChange={(value) => setProductForm((prev) => ({ ...prev, name: value }))}
                />
                <Field
                  label="Tagline"
                  value={productForm.tagline}
                  onChange={(value) => setProductForm((prev) => ({ ...prev, tagline: value }))}
                />
                <Field
                  label="Description"
                  value={productForm.description}
                  onChange={(value) => setProductForm((prev) => ({ ...prev, description: value }))}
                />
                <Field
                  label="Image URL"
                  value={productForm.image}
                  onChange={(value) => setProductForm((prev) => ({ ...prev, image: value }))}
                />
                <Field
                  label="Price"
                  type="number"
                  value={String(productForm.price)}
                  onChange={(value) =>
                    setProductForm((prev) => ({ ...prev, price: Number(value) || 0 }))
                  }
                />
                <Field
                  label="Badge tag (optional)"
                  value={productForm.tag ?? ""}
                  onChange={(value) => setProductForm((prev) => ({ ...prev, tag: value }))}
                />
                <div className="mt-2 flex flex-wrap gap-3">
                  <button
                    disabled={savingProduct}
                    type="submit"
                    className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 disabled:opacity-60"
                  >
                    {savingProduct
                      ? "Saving…"
                      : editingProductId
                        ? "Update product"
                        : "Add product"}
                  </button>
                  {editingProductId && (
                    <button
                      type="button"
                      onClick={resetProductForm}
                      className="rounded-full border border-foreground/20 px-6 py-2 text-sm font-medium text-foreground transition-all hover:bg-foreground hover:text-background"
                    >
                      Cancel edit
                    </button>
                  )}
                </div>
              </form>
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border/60 text-muted-foreground">
                      <th className="pb-3 pr-4 font-medium">Product</th>
                      <th className="pb-3 pr-4 font-medium">Price</th>
                      <th className="pb-3 pr-4 font-medium">Tag</th>
                      <th className="pb-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-border/50">
                        <td className="py-3 pr-4">
                          <p className="font-medium text-foreground">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.id}</p>
                        </td>
                        <td className="py-3 pr-4 text-foreground">${product.price.toFixed(0)}</td>
                        <td className="py-3 pr-4 text-xs text-muted-foreground">
                          {product.tag || "—"}
                        </td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => onEditProduct(product)}
                              className="rounded-md border border-border px-3 py-1 text-xs hover:bg-secondary"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => onDeleteProduct(product.id)}
                              className="rounded-md border border-destructive/40 px-3 py-1 text-xs text-destructive hover:bg-destructive/10"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-[var(--shadow-soft)]">
              <h2 className="font-display text-3xl text-foreground">About content</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Edit the homepage About section text.
              </p>
              <form onSubmit={onSaveAbout} className="mt-5 space-y-3">
                <Field
                  label="Subtitle"
                  value={about.subtitle}
                  onChange={(value) => setAbout((prev) => ({ ...prev, subtitle: value }))}
                />
                <Field
                  label="Heading"
                  value={about.heading}
                  onChange={(value) => setAbout((prev) => ({ ...prev, heading: value }))}
                />
                {about.paragraphs.map((paragraph, index) => (
                  <label key={`about-${index}`} className="block">
                    <span className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">
                      Paragraph {index + 1}
                    </span>
                    <textarea
                      value={paragraph}
                      onChange={(event) =>
                        setAbout((prev) => ({
                          ...prev,
                          paragraphs: prev.paragraphs.map((item, itemIndex) =>
                            itemIndex === index ? event.target.value : item,
                          ),
                        }))
                      }
                      rows={4}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
                    />
                  </label>
                ))}
                <button
                  disabled={savingAbout}
                  type="submit"
                  className="w-full rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 disabled:opacity-60"
                >
                  {savingAbout ? "Saving…" : "Save About section"}
                </button>
              </form>
            </div>
          </section>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-[var(--shadow-soft)]">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className="mt-3 font-display text-4xl text-foreground">{value}</p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
      />
    </label>
  );
}
