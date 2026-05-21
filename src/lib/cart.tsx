import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product as Cake } from "@/lib/store-data";
import { getProductUnitPrice, normalizeDiscountPercent } from "@/lib/pricing";

export type CartItem = { cake: Cake; quantity: number };

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (cake: Cake, quantity?: number) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "lazycake.cart.v1";

function sanitizeCartItems(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const record = item as {
        cake?: {
          id?: unknown;
          name?: unknown;
          tagline?: unknown;
          description?: unknown;
          price?: unknown;
          image?: unknown;
          images?: unknown;
          tag?: unknown;
          discountPercent?: unknown;
          saleLabel?: unknown;
        };
        quantity?: unknown;
      };
      const quantity = typeof record.quantity === "number" ? Math.floor(record.quantity) : 0;
      const cakeData = record.cake;
      if (
        !cakeData ||
        typeof cakeData.id !== "string" ||
        typeof cakeData.name !== "string" ||
        typeof cakeData.tagline !== "string" ||
        typeof cakeData.description !== "string" ||
        typeof cakeData.price !== "number" ||
        typeof cakeData.image !== "string"
      ) {
        return null;
      }
      if (quantity <= 0) return null;
      const cake: Cake = {
        id: cakeData.id,
        name: cakeData.name,
        tagline: cakeData.tagline,
        description: cakeData.description,
        price: cakeData.price,
        image: cakeData.image,
        images: Array.isArray(cakeData.images)
          ? cakeData.images.map((item) => `${item}`.trim()).filter(Boolean)
          : undefined,
        tag: typeof cakeData.tag === "string" ? cakeData.tag : undefined,
        discountPercent: normalizeDiscountPercent(cakeData.discountPercent),
        saleLabel: typeof cakeData.saleLabel === "string" ? cakeData.saleLabel : undefined,
      };
      return { cake, quantity };
    })
    .filter((item): item is CartItem => item !== null);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) setItems(sanitizeCartItems(JSON.parse(raw)));
    } catch {
      setItems([]);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      return;
    }
  }, [items, hydrated]);

  const addItem = useCallback((cake: Cake, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.cake.id === cake.id);
      if (existing)
        return prev.map((i) =>
          i.cake.id === cake.id ? { ...i, quantity: i.quantity + quantity } : i,
        );
      return [...prev, { cake, quantity }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.cake.id !== id));
  }, []);

  const setQuantity = useCallback((id: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.cake.id !== id)
        : prev.map((i) => (i.cake.id === id ? { ...i, quantity } : i)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.quantity, 0),
      subtotal: items.reduce((n, i) => n + i.quantity * getProductUnitPrice(i.cake), 0),
      isOpen,
      openCart: () => setOpen(true),
      closeCart: () => setOpen(false),
      addItem,
      removeItem,
      setQuantity,
      clear,
    }),
    [items, isOpen, addItem, removeItem, setQuantity, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
