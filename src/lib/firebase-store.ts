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
  type AboutContent,
  type HomeContent,
  type Product,
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
  const aboutSnapshot = await getDoc(aboutRef);
  const homeSnapshot = await getDoc(homeRef);
  if (!aboutSnapshot.exists()) {
    await setDoc(aboutRef, DEFAULT_ABOUT_CONTENT);
  }
  if (!homeSnapshot.exists()) {
    await setDoc(homeRef, DEFAULT_HOME_CONTENT);
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
