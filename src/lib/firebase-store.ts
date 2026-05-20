import { initializeApp, getApps } from "firebase/app";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  increment,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
  type Firestore,
  type Timestamp,
} from "firebase/firestore";
import {
  DEFAULT_ABOUT_CONTENT,
  DEFAULT_PRODUCTS,
  type AboutContent,
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
    country: string;
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
  status: "new" | "confirmed" | "fulfilled";
  createdAt: string | null;
};

export type CustomerRecord = PersistOrderInput["customer"] & {
  id: string;
  key: string;
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

function normalizeProduct(
  raw: unknown,
  fallback: Product | undefined,
  fallbackId: string,
): Product | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const data = raw as Partial<Product>;

  const id =
    typeof data.id === "string" && data.id.trim().length > 0
      ? data.id.trim()
      : (fallback?.id ?? fallbackId);
  const name =
    typeof data.name === "string" && data.name.trim().length > 0
      ? data.name.trim()
      : (fallback?.name ?? "");
  const tagline =
    typeof data.tagline === "string" && data.tagline.trim().length > 0
      ? data.tagline.trim()
      : (fallback?.tagline ?? "");
  const description =
    typeof data.description === "string" && data.description.trim().length > 0
      ? data.description.trim()
      : (fallback?.description ?? "");
  const image =
    typeof data.image === "string" && data.image.trim().length > 0
      ? data.image.trim()
      : (fallback?.image ?? "");
  const price =
    typeof data.price === "number" && Number.isFinite(data.price)
      ? data.price
      : Number.isFinite(Number(data.price))
        ? Number(data.price)
        : (fallback?.price ?? 0);
  const tag =
    typeof data.tag === "string" && data.tag.trim().length > 0 ? data.tag.trim() : fallback?.tag;

  if (!id || !name || !image) return null;

  return {
    id,
    name,
    tagline,
    description,
    price,
    image,
    tag,
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

  const productCollection = collection(db, "products");
  const productSnapshot = await getDocs(productCollection);

  if (productSnapshot.empty) {
    const batch = writeBatch(db);
    for (const product of DEFAULT_PRODUCTS) {
      batch.set(doc(productCollection, product.id), product);
    }
    await batch.commit();
  }

  const aboutRef = doc(db, "content", "about");
  const aboutSnapshot = await getDoc(aboutRef);
  if (!aboutSnapshot.exists()) {
    await setDoc(aboutRef, DEFAULT_ABOUT_CONTENT);
  }
}

export function subscribeProducts(onData: (products: Product[]) => void) {
  const db = getDb();
  if (!db) return () => {};
  const q = query(collection(db, "products"), orderBy("name"));
  const defaultById = new Map(DEFAULT_PRODUCTS.map((product) => [product.id, product]));
  return onSnapshot(q, (snapshot) => {
    const firebaseProducts = snapshot.docs
      .map((record) => normalizeProduct(record.data(), defaultById.get(record.id), record.id))
      .filter((product): product is Product => product !== null);

    if (firebaseProducts.length === 0) {
      onData(DEFAULT_PRODUCTS);
      return;
    }

    const firebaseById = new Map(firebaseProducts.map((product) => [product.id, product]));
    const products = [
      ...DEFAULT_PRODUCTS.map((product) => firebaseById.get(product.id) ?? product),
      ...firebaseProducts.filter((product) => !defaultById.has(product.id)),
    ];

    onData(products);
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
          country: `${data.customer?.country ?? ""}`,
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
        status: data.status === "confirmed" || data.status === "fulfilled" ? data.status : "new",
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
        country: `${data.country ?? ""}`,
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
  await setDoc(doc(db, "products", id), { ...product, id });
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

export async function updateOrderStatus(orderId: string, status: OrderRecord["status"]) {
  const db = getDb();
  if (!db) return;
  await updateDoc(doc(db, "orders", orderId), { status });
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
