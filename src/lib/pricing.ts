import type { Product } from "@/lib/store-data";

const MAX_DISCOUNT_PERCENT = 95;

export function normalizeDiscountPercent(value: unknown): number | undefined {
  const parsed =
    typeof value === "number" && Number.isFinite(value)
      ? value
      : Number.isFinite(Number(value))
        ? Number(value)
        : NaN;

  if (!Number.isFinite(parsed)) return undefined;

  const rounded = Math.round(parsed);
  if (rounded <= 0) return undefined;
  return Math.min(MAX_DISCOUNT_PERCENT, rounded);
}

export function getProductUnitPrice(product: Pick<Product, "price" | "discountPercent">): number {
  const discountPercent = normalizeDiscountPercent(product.discountPercent);
  if (!discountPercent) return product.price;
  return Math.max(0, Math.round(product.price * (1 - discountPercent / 100)));
}

export function getProductSavingsAmount(
  product: Pick<Product, "price" | "discountPercent">,
): number {
  return Math.max(0, product.price - getProductUnitPrice(product));
}
