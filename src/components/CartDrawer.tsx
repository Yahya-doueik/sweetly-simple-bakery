import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { getProductUnitPrice, normalizeDiscountPercent } from "@/lib/pricing";

export function CartDrawer() {
  const { items, isOpen, closeCart, setQuantity, removeItem, subtotal, count } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm"
          />
          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 32 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-background shadow-[var(--shadow-soft)]"
            aria-label="Shopping cart"
          >
            <header className="flex items-center justify-between border-b border-border/60 px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-accent">Your box</p>
                <h2 className="font-display text-2xl text-foreground">
                  {count} {count === 1 ? "cake" : "cakes"}
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="font-display text-2xl text-foreground">Your box is empty.</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Add a slow-set cake to get started.
                  </p>
                  <Link
                    to="/"
                    hash="menu"
                    onClick={closeCart}
                    className="mt-6 rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                  >
                    Browse the menu
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-border/60">
                  {items.map(({ cake, quantity }) => (
                    <li key={cake.id} className="flex gap-4 py-4">
                      {(() => {
                        const unitPrice = getProductUnitPrice(cake);
                        const discountPercent = normalizeDiscountPercent(cake.discountPercent);
                        return (
                          <>
                            <img
                              src={cake.image}
                              alt={cake.name}
                              className="h-20 w-20 flex-shrink-0 rounded-lg object-cover"
                            />
                            <div className="flex flex-1 flex-col">
                              <div className="flex justify-between gap-2">
                                <p className="font-display text-lg leading-tight text-foreground">
                                  {cake.name}
                                </p>
                                <div className="text-right">
                                  <p className="font-display text-base text-accent">
                                    ${(unitPrice * quantity).toFixed(0)}
                                  </p>
                                  {discountPercent && (
                                    <p className="text-xs text-muted-foreground line-through">
                                      ${(cake.price * quantity).toFixed(0)}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <p className="text-xs italic text-muted-foreground">{cake.tagline}</p>
                              {discountPercent && (
                                <p className="text-[11px] uppercase tracking-widest text-accent">
                                  {cake.saleLabel || `${discountPercent}% off`}
                                </p>
                              )}
                              <div className="mt-auto flex items-center justify-between pt-3">
                                <div className="inline-flex items-center rounded-full border border-border">
                                  <button
                                    onClick={() => setQuantity(cake.id, quantity - 1)}
                                    className="p-1.5 text-muted-foreground hover:text-foreground"
                                    aria-label="Decrease"
                                  >
                                    <Minus className="h-3.5 w-3.5" />
                                  </button>
                                  <span className="w-6 text-center text-sm tabular-nums">
                                    {quantity}
                                  </span>
                                  <button
                                    onClick={() => setQuantity(cake.id, quantity + 1)}
                                    className="p-1.5 text-muted-foreground hover:text-foreground"
                                    aria-label="Increase"
                                  >
                                    <Plus className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                                <button
                                  onClick={() => removeItem(cake.id)}
                                  className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <footer className="border-t border-border/60 px-6 py-5">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm uppercase tracking-widest text-muted-foreground">
                    Subtotal
                  </span>
                  <span className="font-display text-2xl text-foreground">
                    ${subtotal.toFixed(0)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Shipping & taxes calculated at checkout.
                </p>
                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="mt-4 block w-full rounded-full bg-primary px-6 py-3 text-center text-sm font-medium text-primary-foreground transition-all hover:opacity-90"
                >
                  Checkout — ${subtotal.toFixed(0)}
                </Link>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
