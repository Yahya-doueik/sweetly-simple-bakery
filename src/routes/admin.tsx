import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  bootstrapStoreData,
  deleteCustomer,
  deleteNews,
  deleteOrder,
  deleteProduct,
  saveAbout,
  saveHomeContent,
  saveNews,
  saveProduct,
  saveSiteSettings,
  subscribeAbout,
  subscribeCustomers,
  subscribeHomeContent,
  subscribeNews,
  subscribeOrders,
  subscribeProducts,
  subscribeSiteSettings,
  toggleProductHidden,
  updateOrderStatus,
  type CustomerRecord,
  type OrderRecord,
} from "@/lib/firebase-store";
import {
  DEFAULT_ABOUT_CONTENT,
  DEFAULT_HOME_CONTENT,
  DEFAULT_SITE_SETTINGS,
  type AboutContent,
  type HomeContent,
  type NewsItem,
  type NewsPlacement,
  type Product,
  type SiteSettings,
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
  images: [],
  tag: "",
  hidden: false,
};

const EMPTY_NEWS: NewsItem = {
  id: "",
  title: "",
  message: "",
  placement: "hero",
  sortOrder: 0,
};

function formatDate(date: string | null) {
  if (!date) return "—";
  return new Date(date).toLocaleString();
}

function totalRevenue(orders: OrderRecord[]) {
  return orders.reduce((sum, order) => sum + (order.status === "fulfilled" ? order.total : 0), 0);
}

function AdminDashboard() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [about, setAbout] = useState<AboutContent>(DEFAULT_ABOUT_CONTENT);
  const [home, setHome] = useState<HomeContent>(DEFAULT_HOME_CONTENT);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);

  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<Product>(EMPTY_PRODUCT);
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [newsForm, setNewsForm] = useState<NewsItem>(EMPTY_NEWS);
  const [savingProduct, setSavingProduct] = useState(false);
  const [savingNews, setSavingNews] = useState(false);
  const [savingAbout, setSavingAbout] = useState(false);
  const [savingHome, setSavingHome] = useState(false);
  const [savingSiteSettings, setSavingSiteSettings] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
  const [editingPhoneIndex, setEditingPhoneIndex] = useState<number | null>(null);

  useEffect(() => {
    const isAuthed = localStorage.getItem(ADMIN_SESSION_KEY) === "true";
    setLoggedIn(isAuthed);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    bootstrapStoreData().catch(() => undefined);
    const unsubProducts = subscribeProducts(setProducts, { includeHidden: true });
    const unsubOrders = subscribeOrders(setOrders);
    const unsubCustomers = subscribeCustomers(setCustomers);
    const unsubAbout = subscribeAbout(setAbout);
    const unsubHome = subscribeHomeContent(setHome);
    const unsubNews = subscribeNews(setNews);
    const unsubSiteSettings = subscribeSiteSettings(setSiteSettings);
    return () => {
      unsubProducts();
      unsubOrders();
      unsubCustomers();
      unsubAbout();
      unsubHome();
      unsubNews();
      unsubSiteSettings();
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

  const resetNewsForm = () => {
    setEditingNewsId(null);
    setNewsForm(EMPTY_NEWS);
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
        images:
          productForm.images
            ?.map((item) => item.trim())
            .filter(Boolean)
            .filter((item, index, arr) => arr.indexOf(item) === index) ?? [],
        tag: productForm.tag?.trim() || undefined,
        hidden: productForm.hidden === true,
      };
      if (
        !productToSave.id ||
        !productToSave.name ||
        !productToSave.image ||
        productToSave.price <= 0
      ) {
        toast.error("Product id, name, image URL, and price are required.");
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
      images: product.images ?? [product.image],
      tag: product.tag ?? "",
      hidden: product.hidden === true,
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

  const onToggleProductHidden = async (product: Product) => {
    try {
      await toggleProductHidden(product.id, !product.hidden);
      toast.success(product.hidden ? "Product is now visible." : "Product hidden from storefront.");
    } catch {
      toast.error("Unable to update product visibility.");
    }
  };

  const onSaveNews = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSavingNews(true);
    try {
      const newsToSave = {
        ...newsForm,
        id: newsForm.id.trim(),
        title: newsForm.title.trim(),
        message: newsForm.message.trim(),
        placement: newsForm.placement,
        sortOrder: Number(newsForm.sortOrder) || 0,
      };
      if (!newsToSave.title || !newsToSave.message) {
        toast.error("News title and message are required.");
        return;
      }
      await saveNews(newsToSave);
      toast.success(editingNewsId ? "News updated." : "News added.");
      resetNewsForm();
    } catch {
      toast.error("Unable to save news.");
    } finally {
      setSavingNews(false);
    }
  };

  const onEditNews = (newsItem: NewsItem) => {
    setEditingNewsId(newsItem.id);
    setNewsForm(newsItem);
  };

  const onDeleteNews = async (newsId: string) => {
    if (!confirm("Delete this news item?")) return;
    try {
      await deleteNews(newsId);
      toast.success("News deleted.");
      if (editingNewsId === newsId) {
        resetNewsForm();
      }
    } catch {
      toast.error("Unable to delete news.");
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

  const onSaveHome = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSavingHome(true);
    try {
      await saveHomeContent({
        hero: {
          eyebrow: home.hero.eyebrow.trim(),
          headingPrefix: home.hero.headingPrefix.trim(),
          headingEmphasis: home.hero.headingEmphasis.trim(),
          headingSuffix: home.hero.headingSuffix.trim(),
          description: home.hero.description.trim(),
          primaryCtaLabel: home.hero.primaryCtaLabel.trim(),
          secondaryCtaLabel: home.hero.secondaryCtaLabel.trim(),
          image: home.hero.image.trim(),
          imageAlt: home.hero.imageAlt.trim(),
        },
        values: home.values.map((item) => ({
          value: item.value.trim(),
          label: item.label.trim(),
        })),
      });
      toast.success("Hero and values updated.");
    } catch {
      toast.error("Unable to update hero and values.");
    } finally {
      setSavingHome(false);
    }
  };

  const onAddOrUpdatePhone = () => {
    const number = phoneInput.trim();
    if (!number) {
      toast.error("Enter a WhatsApp number first.");
      return;
    }

    setSiteSettings((prev) => {
      if (editingPhoneIndex === null) {
        if (prev.whatsappNumbers.includes(number)) {
          toast.error("That number is already added.");
          return prev;
        }
        const nextNumbers = [...prev.whatsappNumbers, number];
        return {
          ...prev,
          whatsappNumbers: nextNumbers,
          defaultWhatsAppNumber: prev.defaultWhatsAppNumber || number,
        };
      }

      const duplicateAtDifferentIndex = prev.whatsappNumbers.some(
        (item, itemIndex) => item === number && itemIndex !== editingPhoneIndex,
      );
      if (duplicateAtDifferentIndex) {
        toast.error("That number is already added.");
        return prev;
      }

      const nextNumbers = prev.whatsappNumbers.map((item, itemIndex) =>
        itemIndex === editingPhoneIndex ? number : item,
      );
      const nextDefault =
        prev.defaultWhatsAppNumber === prev.whatsappNumbers[editingPhoneIndex]
          ? number
          : prev.defaultWhatsAppNumber;
      return {
        ...prev,
        whatsappNumbers: nextNumbers,
        defaultWhatsAppNumber: nextDefault,
      };
    });

    setPhoneInput("");
    setEditingPhoneIndex(null);
  };

  const onEditPhone = (index: number) => {
    setEditingPhoneIndex(index);
    setPhoneInput(siteSettings.whatsappNumbers[index] ?? "");
  };

  const onDeletePhone = (index: number) => {
    setSiteSettings((prev) => {
      const removedNumber = prev.whatsappNumbers[index];
      const nextNumbers = prev.whatsappNumbers.filter((_, itemIndex) => itemIndex !== index);
      const nextDefault =
        prev.defaultWhatsAppNumber === removedNumber
          ? (nextNumbers[0] ?? "")
          : prev.defaultWhatsAppNumber;
      return {
        ...prev,
        whatsappNumbers: nextNumbers,
        defaultWhatsAppNumber: nextDefault,
      };
    });

    if (editingPhoneIndex === index) {
      setEditingPhoneIndex(null);
      setPhoneInput("");
    }
  };

  const onSaveSiteSettings = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (siteSettings.whatsappNumbers.length === 0) {
      toast.error("Add at least one WhatsApp number.");
      return;
    }
    setSavingSiteSettings(true);
    try {
      await saveSiteSettings({
        ...siteSettings,
        brandName: siteSettings.brandName.trim(),
        supportEmail: siteSettings.supportEmail.trim(),
        whatsappNumbers: siteSettings.whatsappNumbers.map((item) => item.trim()).filter(Boolean),
        defaultWhatsAppNumber: siteSettings.defaultWhatsAppNumber.trim(),
        menu: {
          eyebrow: siteSettings.menu.eyebrow.trim(),
          heading: siteSettings.menu.heading.trim(),
          description: siteSettings.menu.description.trim(),
        },
        customOrders: {
          eyebrow: siteSettings.customOrders.eyebrow.trim(),
          heading: siteSettings.customOrders.heading.trim(),
          description: siteSettings.customOrders.description.trim(),
          messageLabel: siteSettings.customOrders.messageLabel.trim(),
          submitLabel: siteSettings.customOrders.submitLabel.trim(),
          whatsappIntro: siteSettings.customOrders.whatsappIntro.trim(),
        },
        footer: {
          tagline: siteSettings.footer.tagline.trim(),
          contactHeading: siteSettings.footer.contactHeading.trim(),
          copyrightNote: siteSettings.footer.copyrightNote.trim(),
        },
      });
      toast.success("Store text and contact settings updated.");
    } catch {
      toast.error("Unable to save store settings.");
    } finally {
      setSavingSiteSettings(false);
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
              Revenue increases when an order status becomes fulfilled.
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
                    <th className="pb-3 font-medium">Actions</th>
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
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-3 text-xs text-muted-foreground">
                        {order.customer.notes || "—"}
                      </td>
                      <td className="py-3">
                        <button
                          type="button"
                          onClick={async () => {
                            if (!confirm("Delete this order permanently?")) return;
                            try {
                              await deleteOrder(order.id);
                              toast.success("Order deleted.");
                            } catch {
                              toast.error("Unable to delete order.");
                            }
                          }}
                          className="rounded-md border border-destructive/40 px-3 py-1 text-xs text-destructive hover:bg-destructive/10"
                        >
                          Delete
                        </button>
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
                    <th className="pb-3 font-medium">Actions</th>
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
                        {customer.address}, {customer.city}, {customer.zip}
                      </td>
                      <td className="py-3 pr-4 text-foreground">{customer.ordersCount}</td>
                      <td className="py-3 text-xs text-muted-foreground">
                        {formatDate(customer.lastOrderAt)}
                      </td>
                      <td className="py-3">
                        <button
                          type="button"
                          onClick={async () => {
                            if (!confirm("Delete this customer profile?")) return;
                            try {
                              await deleteCustomer(customer.id);
                              toast.success("Customer deleted.");
                            } catch {
                              toast.error("Unable to delete customer.");
                            }
                          }}
                          className="rounded-md border border-destructive/40 px-3 py-1 text-xs text-destructive hover:bg-destructive/10"
                        >
                          Delete
                        </button>
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
                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">
                    Gallery images (one URL per line)
                  </span>
                  <textarea
                    value={(productForm.images ?? [productForm.image]).join("\n")}
                    onChange={(event) =>
                      setProductForm((prev) => {
                        const images = event.target.value
                          .split("\n")
                          .map((item) => item.trim())
                          .filter(Boolean);
                        return { ...prev, images, image: images[0] ?? "" };
                      })
                    }
                    rows={4}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
                  />
                </label>
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
                <label className="inline-flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={productForm.hidden === true}
                    onChange={(event) =>
                      setProductForm((prev) => ({ ...prev, hidden: event.target.checked }))
                    }
                    className="h-4 w-4 rounded border-input"
                  />
                  Hidden from storefront
                </label>
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
                      <th className="pb-3 pr-4 font-medium">Visibility</th>
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
                        <td className="py-3 pr-4 text-xs text-muted-foreground">
                          {product.hidden ? "Hidden" : "Visible"}
                        </td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => onEditProduct(product)}
                              className="rounded-md border border-border px-3 py-1 text-xs hover:bg-secondary"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => onToggleProductHidden(product)}
                              className="rounded-md border border-border px-3 py-1 text-xs hover:bg-secondary"
                            >
                              {product.hidden ? "Unhide" : "Hide"}
                            </button>
                            <button
                              type="button"
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

            <div className="space-y-10">
              <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-[var(--shadow-soft)]">
                <h2 className="font-display text-3xl text-foreground">News</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Add, edit, delete, and place announcements on different homepage sections.
                </p>
                <form onSubmit={onSaveNews} className="mt-5 space-y-3">
                  <Field
                    label="News ID (optional)"
                    value={newsForm.id}
                    onChange={(value) => setNewsForm((prev) => ({ ...prev, id: value }))}
                  />
                  <Field
                    label="Title"
                    value={newsForm.title}
                    onChange={(value) => setNewsForm((prev) => ({ ...prev, title: value }))}
                  />
                  <label className="block">
                    <span className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">
                      Message
                    </span>
                    <textarea
                      value={newsForm.message}
                      onChange={(event) =>
                        setNewsForm((prev) => ({ ...prev, message: event.target.value }))
                      }
                      rows={3}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">
                      Placement
                    </span>
                    <select
                      value={newsForm.placement}
                      onChange={(event) =>
                        setNewsForm((prev) => ({
                          ...prev,
                          placement: event.target.value as NewsPlacement,
                        }))
                      }
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
                    >
                      <option value="hero">Hero</option>
                      <option value="menu">Menu</option>
                      <option value="about">About</option>
                      <option value="contact">Contact</option>
                    </select>
                  </label>
                  <Field
                    label="Sort order"
                    type="number"
                    value={String(newsForm.sortOrder)}
                    onChange={(value) =>
                      setNewsForm((prev) => ({ ...prev, sortOrder: Number(value) || 0 }))
                    }
                  />
                  <div className="flex flex-wrap gap-3">
                    <button
                      disabled={savingNews}
                      type="submit"
                      className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 disabled:opacity-60"
                    >
                      {savingNews ? "Saving…" : editingNewsId ? "Update news" : "Add news"}
                    </button>
                    {editingNewsId && (
                      <button
                        type="button"
                        onClick={resetNewsForm}
                        className="rounded-full border border-foreground/20 px-6 py-2 text-sm font-medium text-foreground transition-all hover:bg-foreground hover:text-background"
                      >
                        Cancel edit
                      </button>
                    )}
                  </div>
                </form>
                <div className="mt-6 overflow-x-auto">
                  <table className="w-full min-w-[680px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-border/60 text-muted-foreground">
                        <th className="pb-3 pr-4 font-medium">Title</th>
                        <th className="pb-3 pr-4 font-medium">Placement</th>
                        <th className="pb-3 pr-4 font-medium">Order</th>
                        <th className="pb-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {news.map((item) => (
                        <tr key={item.id} className="border-b border-border/50">
                          <td className="py-3 pr-4">
                            <p className="font-medium text-foreground">{item.title}</p>
                            <p className="line-clamp-2 text-xs text-muted-foreground">
                              {item.message}
                            </p>
                          </td>
                          <td className="py-3 pr-4 text-xs uppercase tracking-widest text-muted-foreground">
                            {item.placement}
                          </td>
                          <td className="py-3 pr-4 text-foreground">{item.sortOrder}</td>
                          <td className="py-3">
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => onEditNews(item)}
                                className="rounded-md border border-border px-3 py-1 text-xs hover:bg-secondary"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => onDeleteNews(item.id)}
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
                  {news.length === 0 && (
                    <p className="py-6 text-center text-sm text-muted-foreground">
                      No news items yet.
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-[var(--shadow-soft)]">
                <h2 className="font-display text-3xl text-foreground">Hero and values</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Edit the full hero section and value stats shown on the homepage.
                </p>
                <form onSubmit={onSaveHome} className="mt-5 space-y-3">
                  <Field
                    label="Hero eyebrow"
                    value={home.hero.eyebrow}
                    onChange={(value) =>
                      setHome((prev) => ({ ...prev, hero: { ...prev.hero, eyebrow: value } }))
                    }
                  />
                  <Field
                    label="Hero heading prefix"
                    value={home.hero.headingPrefix}
                    onChange={(value) =>
                      setHome((prev) => ({ ...prev, hero: { ...prev.hero, headingPrefix: value } }))
                    }
                  />
                  <Field
                    label="Hero heading emphasis"
                    value={home.hero.headingEmphasis}
                    onChange={(value) =>
                      setHome((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, headingEmphasis: value },
                      }))
                    }
                  />
                  <Field
                    label="Hero heading suffix"
                    value={home.hero.headingSuffix}
                    onChange={(value) =>
                      setHome((prev) => ({ ...prev, hero: { ...prev.hero, headingSuffix: value } }))
                    }
                  />
                  <label className="block">
                    <span className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">
                      Hero description
                    </span>
                    <textarea
                      value={home.hero.description}
                      onChange={(event) =>
                        setHome((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, description: event.target.value },
                        }))
                      }
                      rows={3}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
                    />
                  </label>
                  <Field
                    label="Primary button label"
                    value={home.hero.primaryCtaLabel}
                    onChange={(value) =>
                      setHome((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, primaryCtaLabel: value },
                      }))
                    }
                  />
                  <Field
                    label="Secondary button label"
                    value={home.hero.secondaryCtaLabel}
                    onChange={(value) =>
                      setHome((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, secondaryCtaLabel: value },
                      }))
                    }
                  />
                  <Field
                    label="Hero image URL (optional)"
                    value={home.hero.image}
                    onChange={(value) =>
                      setHome((prev) => ({ ...prev, hero: { ...prev.hero, image: value } }))
                    }
                  />
                  <Field
                    label="Hero image alt text"
                    value={home.hero.imageAlt}
                    onChange={(value) =>
                      setHome((prev) => ({ ...prev, hero: { ...prev.hero, imageAlt: value } }))
                    }
                  />
                  {home.values.map((item, index) => (
                    <div key={`value-${index}`} className="grid gap-3 md:grid-cols-2">
                      <Field
                        label={`Value ${index + 1}`}
                        value={item.value}
                        onChange={(value) =>
                          setHome((prev) => ({
                            ...prev,
                            values: prev.values.map((entry, entryIndex) =>
                              entryIndex === index ? { ...entry, value } : entry,
                            ),
                          }))
                        }
                      />
                      <Field
                        label={`Value ${index + 1} label`}
                        value={item.label}
                        onChange={(label) =>
                          setHome((prev) => ({
                            ...prev,
                            values: prev.values.map((entry, entryIndex) =>
                              entryIndex === index ? { ...entry, label } : entry,
                            ),
                          }))
                        }
                      />
                    </div>
                  ))}
                  <button
                    disabled={savingHome}
                    type="submit"
                    className="w-full rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 disabled:opacity-60"
                  >
                    {savingHome ? "Saving…" : "Save Hero and values"}
                  </button>
                </form>
              </div>

              <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-[var(--shadow-soft)]">
                <h2 className="font-display text-3xl text-foreground">Store text and contact</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Manage branding, WhatsApp routing, and editable text for menu, custom orders, and
                  footer.
                </p>
                <form onSubmit={onSaveSiteSettings} className="mt-5 space-y-4">
                  <Field
                    label="Brand name"
                    value={siteSettings.brandName}
                    onChange={(value) => setSiteSettings((prev) => ({ ...prev, brandName: value }))}
                  />
                  <Field
                    label="Support email"
                    type="email"
                    value={siteSettings.supportEmail}
                    onChange={(value) =>
                      setSiteSettings((prev) => ({ ...prev, supportEmail: value }))
                    }
                  />

                  <div>
                    <span className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">
                      WhatsApp order numbers
                    </span>
                    <div className="flex gap-2">
                      <input
                        value={phoneInput}
                        onChange={(event) => setPhoneInput(event.target.value)}
                        placeholder="Add number"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
                      />
                      <button
                        type="button"
                        onClick={onAddOrUpdatePhone}
                        className="rounded-md border border-border px-3 py-2 text-xs hover:bg-secondary"
                      >
                        {editingPhoneIndex === null ? "Add" : "Update"}
                      </button>
                    </div>
                    {editingPhoneIndex !== null && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPhoneIndex(null);
                          setPhoneInput("");
                        }}
                        className="mt-2 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                      >
                        Cancel number edit
                      </button>
                    )}
                    <div className="mt-3 space-y-2">
                      {siteSettings.whatsappNumbers.map((number, index) => (
                        <div
                          key={`${number}-${index}`}
                          className="flex items-center justify-between rounded-md border border-border/60 px-3 py-2 text-sm"
                        >
                          <label className="inline-flex items-center gap-2">
                            <input
                              type="radio"
                              name="default-whatsapp-number"
                              checked={siteSettings.defaultWhatsAppNumber === number}
                              onChange={() =>
                                setSiteSettings((prev) => ({
                                  ...prev,
                                  defaultWhatsAppNumber: number,
                                }))
                              }
                              className="h-4 w-4 border-input"
                            />
                            <span className="text-foreground">{number}</span>
                          </label>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => onEditPhone(index)}
                              className="rounded-md border border-border px-3 py-1 text-xs hover:bg-secondary"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeletePhone(index)}
                              className="rounded-md border border-destructive/40 px-3 py-1 text-xs text-destructive hover:bg-destructive/10"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Field
                    label="Menu eyebrow"
                    value={siteSettings.menu.eyebrow}
                    onChange={(value) =>
                      setSiteSettings((prev) => ({
                        ...prev,
                        menu: { ...prev.menu, eyebrow: value },
                      }))
                    }
                  />
                  <Field
                    label="Menu heading"
                    value={siteSettings.menu.heading}
                    onChange={(value) =>
                      setSiteSettings((prev) => ({
                        ...prev,
                        menu: { ...prev.menu, heading: value },
                      }))
                    }
                  />
                  <label className="block">
                    <span className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">
                      Menu description
                    </span>
                    <textarea
                      value={siteSettings.menu.description}
                      onChange={(event) =>
                        setSiteSettings((prev) => ({
                          ...prev,
                          menu: { ...prev.menu, description: event.target.value },
                        }))
                      }
                      rows={3}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
                    />
                  </label>
                  <Field
                    label="Custom orders eyebrow"
                    value={siteSettings.customOrders.eyebrow}
                    onChange={(value) =>
                      setSiteSettings((prev) => ({
                        ...prev,
                        customOrders: { ...prev.customOrders, eyebrow: value },
                      }))
                    }
                  />
                  <Field
                    label="Custom orders heading"
                    value={siteSettings.customOrders.heading}
                    onChange={(value) =>
                      setSiteSettings((prev) => ({
                        ...prev,
                        customOrders: { ...prev.customOrders, heading: value },
                      }))
                    }
                  />
                  <label className="block">
                    <span className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">
                      Custom orders description
                    </span>
                    <textarea
                      value={siteSettings.customOrders.description}
                      onChange={(event) =>
                        setSiteSettings((prev) => ({
                          ...prev,
                          customOrders: { ...prev.customOrders, description: event.target.value },
                        }))
                      }
                      rows={3}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
                    />
                  </label>
                  <Field
                    label="Custom orders message label"
                    value={siteSettings.customOrders.messageLabel}
                    onChange={(value) =>
                      setSiteSettings((prev) => ({
                        ...prev,
                        customOrders: { ...prev.customOrders, messageLabel: value },
                      }))
                    }
                  />
                  <Field
                    label="Custom orders send button label"
                    value={siteSettings.customOrders.submitLabel}
                    onChange={(value) =>
                      setSiteSettings((prev) => ({
                        ...prev,
                        customOrders: { ...prev.customOrders, submitLabel: value },
                      }))
                    }
                  />
                  <label className="block">
                    <span className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">
                      WhatsApp intro message
                    </span>
                    <textarea
                      value={siteSettings.customOrders.whatsappIntro}
                      onChange={(event) =>
                        setSiteSettings((prev) => ({
                          ...prev,
                          customOrders: { ...prev.customOrders, whatsappIntro: event.target.value },
                        }))
                      }
                      rows={2}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
                    />
                  </label>
                  <Field
                    label="Footer tagline"
                    value={siteSettings.footer.tagline}
                    onChange={(value) =>
                      setSiteSettings((prev) => ({
                        ...prev,
                        footer: { ...prev.footer, tagline: value },
                      }))
                    }
                  />
                  <Field
                    label="Footer contact heading"
                    value={siteSettings.footer.contactHeading}
                    onChange={(value) =>
                      setSiteSettings((prev) => ({
                        ...prev,
                        footer: { ...prev.footer, contactHeading: value },
                      }))
                    }
                  />
                  <Field
                    label="Footer copyright note"
                    value={siteSettings.footer.copyrightNote}
                    onChange={(value) =>
                      setSiteSettings((prev) => ({
                        ...prev,
                        footer: { ...prev.footer, copyrightNote: value },
                      }))
                    }
                  />
                  <button
                    disabled={savingSiteSettings}
                    type="submit"
                    className="w-full rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 disabled:opacity-60"
                  >
                    {savingSiteSettings ? "Saving…" : "Save store text and contacts"}
                  </button>
                </form>
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
