import { initializeApp, getApps } from "firebase/app";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  increment,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  type Firestore,
  type Timestamp,
} from "firebase/firestore";
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

const firebaseConfig = {
  apiKey: "AIzaSyBKBZ9K82WFNNperWHhw4YReVdTjrIJM0g",
  authDomain: "cake-it-easy-3c242.firebaseapp.com",
  projectId: "cake-it-easy-3c242",
  storageBucket: "cake-it-easy-3c242.firebasestorage.app",
  messagingSenderId: "21728284203",
  appId: "1:21728284203:web:1116f5b56ff62027f6a46e",
  measurementId: "G-XDE882KMQF",
};

type PersistOrderInput = {
  customer: {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    zip: string;
    notes: string;
  };
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  subtotal: number;
  shipping: number;
  total: number;
};

export type OrderRecord = {
  id: string;
  customerKey: string;
  customer: PersistOrderInput["customer"];
  items: PersistOrderInput["items"];
  subtotal: number;
  shipping: number;
  total: number;
  status: "new" | "confirmed" | "fulfilled" | "cancelled";
  createdAt: string | null;
};

export type CustomerRecord = PersistOrderInput["customer"] & {
  id: string;
  key: string;
  country?: string;
  firstOrderAt: string | null;
  lastOrderAt: string | null;
  ordersCount: number;
};

function getDb(): Firestore | null {
  if (typeof window === "undefined") return null;
  const app = getApps()[0] ?? initializeApp(firebaseConfig);
  return getFirestore(app);
}

function timestampToIso(value: unknown): string | null {
  if (!value || typeof value !== "object" || !("toDate" in value)) return null;
  const maybeTimestamp = value as Timestamp;
  return maybeTimestamp.toDate().toISOString();
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeProduct(raw: unknown): Product | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const data = raw as Partial<Product>;

  const id = typeof data.id === "string" && data.id.trim().length > 0 ? data.id.trim() : "";
  const name = typeof data.name === "string" && data.name.trim().length > 0 ? data.name.trim() : "";
  const tagline =
    typeof data.tagline === "string" && data.tagline.trim().length > 0 ? data.tagline.trim() : "";
  const description =
    typeof data.description === "string" && data.description.trim().length > 0
      ? data.description.trim()
      : "";
  const image =
    typeof data.image === "string" && data.image.trim().length > 0 ? data.image.trim() : "";
  const price =
    typeof data.price === "number" && Number.isFinite(data.price)
      ? data.price
      : Number.isFinite(Number(data.price))
        ? Number(data.price)
        : 0;
  const tag =
    typeof data.tag === "string" && data.tag.trim().length > 0 ? data.tag.trim() : undefined;
  const images = Array.isArray(data.images)
    ? data.images.map((item) => `${item}`.trim()).filter(Boolean)
    : image
      ? [image]
      : [];
  const hidden = data.hidden === true;

  if (!id || !name || images.length === 0) return null;

  return {
    id,
    name,
    tagline,
    description,
    price,
    image: images[0],
    images,
    tag,
    hidden,
  };
}

function normalizeHomeContent(raw: unknown): HomeContent {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return DEFAULT_HOME_CONTENT;
  }
  const data = raw as Partial<HomeContent>;
  const heroData =
    data.hero && typeof data.hero === "object" && !Array.isArray(data.hero) ? data.hero : undefined;
  const values = Array.isArray(data.values)
    ? data.values
        .map((item) => {
          if (!item || typeof item !== "object" || Array.isArray(item)) return null;
          const value = `${(item as { value?: unknown }).value ?? ""}`.trim();
          const label = `${(item as { label?: unknown }).label ?? ""}`.trim();
          if (!value || !label) return null;
          return { value, label };
        })
        .filter((item): item is { value: string; label: string } => item !== null)
    : [];

  return {
    hero: {
      eyebrow:
        typeof heroData?.eyebrow === "string" && heroData.eyebrow.trim().length > 0
          ? heroData.eyebrow.trim()
          : DEFAULT_HOME_CONTENT.hero.eyebrow,
      headingPrefix:
        typeof heroData?.headingPrefix === "string" && heroData.headingPrefix.trim().length > 0
          ? heroData.headingPrefix.trim()
          : DEFAULT_HOME_CONTENT.hero.headingPrefix,
      headingEmphasis:
        typeof heroData?.headingEmphasis === "string" && heroData.headingEmphasis.trim().length > 0
          ? heroData.headingEmphasis.trim()
          : DEFAULT_HOME_CONTENT.hero.headingEmphasis,
      headingSuffix:
        typeof heroData?.headingSuffix === "string" && heroData.headingSuffix.trim().length > 0
          ? heroData.headingSuffix.trim()
          : DEFAULT_HOME_CONTENT.hero.headingSuffix,
      description:
        typeof heroData?.description === "string" && heroData.description.trim().length > 0
          ? heroData.description.trim()
          : DEFAULT_HOME_CONTENT.hero.description,
      primaryCtaLabel:
        typeof heroData?.primaryCtaLabel === "string" && heroData.primaryCtaLabel.trim().length > 0
          ? heroData.primaryCtaLabel.trim()
          : DEFAULT_HOME_CONTENT.hero.primaryCtaLabel,
      secondaryCtaLabel:
        typeof heroData?.secondaryCtaLabel === "string" &&
        heroData.secondaryCtaLabel.trim().length > 0
          ? heroData.secondaryCtaLabel.trim()
          : DEFAULT_HOME_CONTENT.hero.secondaryCtaLabel,
      image:
        typeof heroData?.image === "string" && heroData.image.trim().length > 0
          ? heroData.image.trim()
          : DEFAULT_HOME_CONTENT.hero.image,
      imageAlt:
        typeof heroData?.imageAlt === "string" && heroData.imageAlt.trim().length > 0
          ? heroData.imageAlt.trim()
          : DEFAULT_HOME_CONTENT.hero.imageAlt,
    },
    values: values.length > 0 ? values : DEFAULT_HOME_CONTENT.values,
  };
}

function normalizeNewsPlacement(value: unknown): NewsPlacement {
  if (value === "menu" || value === "about" || value === "contact") {
    return value;
  }
  return "hero";
}

function normalizeNews(raw: unknown): NewsItem | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const data = raw as Partial<NewsItem>;

  const id = typeof data.id === "string" && data.id.trim().length > 0 ? data.id.trim() : "";
  const title =
    typeof data.title === "string" && data.title.trim().length > 0 ? data.title.trim() : "";
  const message =
    typeof data.message === "string" && data.message.trim().length > 0 ? data.message.trim() : "";
  const sortOrder =
    typeof data.sortOrder === "number" && Number.isFinite(data.sortOrder)
      ? data.sortOrder
      : Number.isFinite(Number(data.sortOrder))
        ? Number(data.sortOrder)
        : 0;

  if (!id || !title || !message) return null;

  return {
    id,
    title,
    message,
    placement: normalizeNewsPlacement(data.placement),
    sortOrder,
  };
}

function normalizePhoneList(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return [...new Set(raw.map((item) => `${item}`.trim()).filter(Boolean))];
}

function normalizeSiteSettings(raw: unknown): SiteSettings {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return DEFAULT_SITE_SETTINGS;
  }
  const data = raw as Partial<SiteSettings>;
  const whatsappNumbers = normalizePhoneList(data.whatsappNumbers);
  const firstNumber = whatsappNumbers[0] ?? DEFAULT_SITE_SETTINGS.defaultWhatsAppNumber;
  const requestedDefault =
    typeof data.defaultWhatsAppNumber === "string" ? data.defaultWhatsAppNumber.trim() : "";
  const defaultWhatsAppNumber =
    requestedDefault && whatsappNumbers.includes(requestedDefault) ? requestedDefault : firstNumber;

  return {
    brandName:
      typeof data.brandName === "string" && data.brandName.trim().length > 0
        ? data.brandName.trim()
        : DEFAULT_SITE_SETTINGS.brandName,
    supportEmail:
      typeof data.supportEmail === "string" && data.supportEmail.trim().length > 0
        ? data.supportEmail.trim()
        : DEFAULT_SITE_SETTINGS.supportEmail,
    whatsappNumbers:
      whatsappNumbers.length > 0 ? whatsappNumbers : DEFAULT_SITE_SETTINGS.whatsappNumbers,
    defaultWhatsAppNumber,
    menu: {
      eyebrow:
        typeof data.menu?.eyebrow === "string" && data.menu.eyebrow.trim().length > 0
          ? data.menu.eyebrow.trim()
          : DEFAULT_SITE_SETTINGS.menu.eyebrow,
      heading:
        typeof data.menu?.heading === "string" && data.menu.heading.trim().length > 0
          ? data.menu.heading.trim()
          : DEFAULT_SITE_SETTINGS.menu.heading,
      description:
        typeof data.menu?.description === "string" && data.menu.description.trim().length > 0
          ? data.menu.description.trim()
          : DEFAULT_SITE_SETTINGS.menu.description,
    },
    customOrders: {
      eyebrow:
        typeof data.customOrders?.eyebrow === "string" &&
        data.customOrders.eyebrow.trim().length > 0
          ? data.customOrders.eyebrow.trim()
          : DEFAULT_SITE_SETTINGS.customOrders.eyebrow,
      heading:
        typeof data.customOrders?.heading === "string" &&
        data.customOrders.heading.trim().length > 0
          ? data.customOrders.heading.trim()
          : DEFAULT_SITE_SETTINGS.customOrders.heading,
      description:
        typeof data.customOrders?.description === "string" &&
        data.customOrders.description.trim().length > 0
          ? data.customOrders.description.trim()
          : DEFAULT_SITE_SETTINGS.customOrders.description,
      messageLabel:
        typeof data.customOrders?.messageLabel === "string" &&
        data.customOrders.messageLabel.trim().length > 0
          ? data.customOrders.messageLabel.trim()
          : DEFAULT_SITE_SETTINGS.customOrders.messageLabel,
      submitLabel:
        typeof data.customOrders?.submitLabel === "string" &&
        data.customOrders.submitLabel.trim().length > 0
          ? data.customOrders.submitLabel.trim()
          : DEFAULT_SITE_SETTINGS.customOrders.submitLabel,
      whatsappIntro:
        typeof data.customOrders?.whatsappIntro === "string" &&
        data.customOrders.whatsappIntro.trim().length > 0
          ? data.customOrders.whatsappIntro.trim()
          : DEFAULT_SITE_SETTINGS.customOrders.whatsappIntro,
    },
    footer: {
      tagline:
        typeof data.footer?.tagline === "string" && data.footer.tagline.trim().length > 0
          ? data.footer.tagline.trim()
          : DEFAULT_SITE_SETTINGS.footer.tagline,
      contactHeading:
        typeof data.footer?.contactHeading === "string" &&
        data.footer.contactHeading.trim().length > 0
          ? data.footer.contactHeading.trim()
          : DEFAULT_SITE_SETTINGS.footer.contactHeading,
      copyrightNote:
        typeof data.footer?.copyrightNote === "string" &&
        data.footer.copyrightNote.trim().length > 0
          ? data.footer.copyrightNote.trim()
          : DEFAULT_SITE_SETTINGS.footer.copyrightNote,
    },
  };
}

export function buildCustomerKey(email: string, phone: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPhone = phone.replace(/\D/g, "");
  return `${normalizedEmail}::${normalizedPhone || "no-phone"}`;
}

export async function bootstrapStoreData() {
  const db = getDb();
  if (!db) return;

  const aboutRef = doc(db, "content", "about");
  const homeRef = doc(db, "content", "home");
  const siteSettingsRef = doc(db, "content", "siteSettings");
  const aboutSnapshot = await getDoc(aboutRef);
  const homeSnapshot = await getDoc(homeRef);
  const siteSettingsSnapshot = await getDoc(siteSettingsRef);
  if (!aboutSnapshot.exists()) {
    await setDoc(aboutRef, DEFAULT_ABOUT_CONTENT);
  }
  if (!homeSnapshot.exists()) {
    await setDoc(homeRef, DEFAULT_HOME_CONTENT);
  }
  if (!siteSettingsSnapshot.exists()) {
    await setDoc(siteSettingsRef, DEFAULT_SITE_SETTINGS);
  }
}

export function subscribeProducts(
  onData: (products: Product[]) => void,
  options?: { includeHidden?: boolean },
) {
  const db = getDb();
  if (!db) return () => {};
  const q = query(collection(db, "products"), orderBy("name"));
  return onSnapshot(q, (snapshot) => {
    const products = snapshot.docs
      .map((record) => normalizeProduct({ id: record.id, ...record.data() }))
      .filter((product): product is Product => product !== null);

    onData(options?.includeHidden ? products : products.filter((product) => !product.hidden));
  });
}

export function subscribeAbout(onData: (about: AboutContent) => void) {
  const db = getDb();
  if (!db) return () => {};
  return onSnapshot(doc(db, "content", "about"), (snapshot) => {
    if (!snapshot.exists()) {
      onData(DEFAULT_ABOUT_CONTENT);
      return;
    }
    const data = snapshot.data() as Partial<AboutContent>;
    onData({
      heading: data.heading ?? DEFAULT_ABOUT_CONTENT.heading,
      subtitle: data.subtitle ?? DEFAULT_ABOUT_CONTENT.subtitle,
      paragraphs:
        Array.isArray(data.paragraphs) && data.paragraphs.length > 0
          ? data.paragraphs.map((item) => `${item}`)
          : DEFAULT_ABOUT_CONTENT.paragraphs,
    });
  });
}

export function subscribeHomeContent(onData: (content: HomeContent) => void) {
  const db = getDb();
  if (!db) return () => {};
  return onSnapshot(doc(db, "content", "home"), (snapshot) => {
    if (!snapshot.exists()) {
      onData(DEFAULT_HOME_CONTENT);
      return;
    }
    onData(normalizeHomeContent(snapshot.data()));
  });
}

export function subscribeNews(onData: (news: NewsItem[]) => void) {
  const db = getDb();
  if (!db) return () => {};
  return onSnapshot(collection(db, "news"), (snapshot) => {
    const news = snapshot.docs
      .map((record) => normalizeNews({ id: record.id, ...record.data() }))
      .filter((item): item is NewsItem => item !== null)
      .sort((a, b) => {
        if (a.placement === b.placement) {
          if (a.sortOrder === b.sortOrder) {
            return a.title.localeCompare(b.title);
          }
          return a.sortOrder - b.sortOrder;
        }
        return a.placement.localeCompare(b.placement);
      });
    onData(news);
  });
}

export function subscribeSiteSettings(onData: (settings: SiteSettings) => void) {
  const db = getDb();
  if (!db) return () => {};
  return onSnapshot(doc(db, "content", "siteSettings"), (snapshot) => {
    if (!snapshot.exists()) {
      onData(DEFAULT_SITE_SETTINGS);
      return;
    }
    onData(normalizeSiteSettings(snapshot.data()));
  });
}

export function subscribeOrders(onData: (orders: OrderRecord[]) => void) {
  const db = getDb();
  if (!db) return () => {};
  const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map((record) => {
      const data = record.data();
      return {
        id: record.id,
        customerKey: `${data.customerKey ?? ""}`,
        customer: {
          email: `${data.customer?.email ?? ""}`,
          phone: `${data.customer?.phone ?? ""}`,
          firstName: `${data.customer?.firstName ?? ""}`,
          lastName: `${data.customer?.lastName ?? ""}`,
          address: `${data.customer?.address ?? ""}`,
          city: `${data.customer?.city ?? ""}`,
          zip: `${data.customer?.zip ?? ""}`,
          notes: `${data.customer?.notes ?? ""}`,
        },
        items: Array.isArray(data.items)
          ? data.items.map((item) => ({
              id: `${item?.id ?? ""}`,
              name: `${item?.name ?? ""}`,
              price: Number(item?.price ?? 0),
              quantity: Number(item?.quantity ?? 0),
            }))
          : [],
        subtotal: Number(data.subtotal ?? 0),
        shipping: Number(data.shipping ?? 0),
        total: Number(data.total ?? 0),
        status:
          data.status === "confirmed" || data.status === "fulfilled" || data.status === "cancelled"
            ? data.status
            : "new",
        createdAt: timestampToIso(data.createdAt),
      } satisfies OrderRecord;
    });
    onData(orders);
  });
}

export function subscribeCustomers(onData: (customers: CustomerRecord[]) => void) {
  const db = getDb();
  if (!db) return () => {};
  const q = query(collection(db, "customers"), orderBy("lastOrderAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const customers = snapshot.docs.map((record) => {
      const data = record.data();
      return {
        id: record.id,
        key: `${data.key ?? ""}`,
        email: `${data.email ?? ""}`,
        phone: `${data.phone ?? ""}`,
        firstName: `${data.firstName ?? ""}`,
        lastName: `${data.lastName ?? ""}`,
        address: `${data.address ?? ""}`,
        city: `${data.city ?? ""}`,
        zip: `${data.zip ?? ""}`,
        country:
          typeof data.country === "string" && data.country.trim().length > 0
            ? data.country.trim()
            : undefined,
        notes: `${data.notes ?? ""}`,
        ordersCount: Number(data.ordersCount ?? 0),
        firstOrderAt: timestampToIso(data.firstOrderAt),
        lastOrderAt: timestampToIso(data.lastOrderAt),
      } satisfies CustomerRecord;
    });
    onData(customers);
  });
}

export async function saveProduct(product: Product) {
  const db = getDb();
  if (!db) return;
  const id = product.id || slugify(product.name);
  const images = Array.isArray(product.images)
    ? product.images.map((item) => item.trim()).filter(Boolean)
    : [];
  const primaryImage = product.image.trim();
  const allImages = [...new Set([primaryImage, ...images])].filter(Boolean);
  await setDoc(doc(db, "products", id), {
    ...product,
    id,
    image: allImages[0] ?? "",
    images: allImages,
    hidden: product.hidden === true,
  });
}

export async function deleteProduct(id: string) {
  const db = getDb();
  if (!db) return;
  await deleteDoc(doc(db, "products", id));
}

export async function saveAbout(about: AboutContent) {
  const db = getDb();
  if (!db) return;
  await setDoc(doc(db, "content", "about"), about);
}

export async function saveHomeContent(content: HomeContent) {
  const db = getDb();
  if (!db) return;
  await setDoc(doc(db, "content", "home"), content);
}

export async function saveSiteSettings(settings: SiteSettings) {
  const db = getDb();
  if (!db) return;
  const normalized = normalizeSiteSettings(settings);
  await setDoc(doc(db, "content", "siteSettings"), normalized);
}

export async function saveNews(newsItem: NewsItem) {
  const db = getDb();
  if (!db) return;
  const id = newsItem.id || slugify(newsItem.title);
  await setDoc(doc(db, "news", id), {
    ...newsItem,
    id,
    title: newsItem.title.trim(),
    message: newsItem.message.trim(),
    placement: normalizeNewsPlacement(newsItem.placement),
    sortOrder: Number.isFinite(newsItem.sortOrder) ? newsItem.sortOrder : 0,
  });
}

export async function deleteNews(newsId: string) {
  const db = getDb();
  if (!db) return;
  await deleteDoc(doc(db, "news", newsId));
}

export async function updateOrderStatus(orderId: string, status: OrderRecord["status"]) {
  const db = getDb();
  if (!db) return;
  await updateDoc(doc(db, "orders", orderId), { status });
}

export async function deleteOrder(orderId: string) {
  const db = getDb();
  if (!db) return;
  await deleteDoc(doc(db, "orders", orderId));
}

export async function deleteCustomer(customerId: string) {
  const db = getDb();
  if (!db) return;
  await deleteDoc(doc(db, "customers", customerId));
}

export async function toggleProductHidden(productId: string, hidden: boolean) {
  const db = getDb();
  if (!db) return;
  await updateDoc(doc(db, "products", productId), { hidden });
}

export async function persistOrder(input: PersistOrderInput) {
  const db = getDb();
  if (!db) throw new Error("Firebase is not available.");

  const customerKey = buildCustomerKey(input.customer.email, input.customer.phone);
  const customerRef = doc(db, "customers", customerKey);
  const orderRef = doc(collection(db, "orders"));

  await runTransaction(db, async (transaction) => {
    const customerSnapshot = await transaction.get(customerRef);

    if (customerSnapshot.exists()) {
      transaction.set(
        customerRef,
        {
          ...input.customer,
          key: customerKey,
          ordersCount: increment(1),
          lastOrderAt: serverTimestamp(),
        },
        { merge: true },
      );
    } else {
      transaction.set(customerRef, {
        ...input.customer,
        key: customerKey,
        ordersCount: 1,
        firstOrderAt: serverTimestamp(),
        lastOrderAt: serverTimestamp(),
      });
    }

    transaction.set(orderRef, {
      customerKey,
      customer: input.customer,
      items: input.items,
      subtotal: input.subtotal,
      shipping: input.shipping,
      total: input.total,
      status: "new",
      createdAt: serverTimestamp(),
    });
  });

  return orderRef.id;
}
