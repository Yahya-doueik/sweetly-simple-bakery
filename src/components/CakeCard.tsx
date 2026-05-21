import type { Product as Cake } from "@/lib/store-data";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";
import {
  getProductSavingsAmount,
  getProductUnitPrice,
  normalizeDiscountPercent,
} from "@/lib/pricing";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function CakeCard({ cake }: { cake: Cake }) {
  const { addItem, openCart } = useCart();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const unitPrice = useMemo(() => getProductUnitPrice(cake), [cake]);
  const discountPercent = useMemo(() => normalizeDiscountPercent(cake.discountPercent), [cake]);
  const savingsAmount = useMemo(() => getProductSavingsAmount(cake), [cake]);
  const salePill = discountPercent
    ? cake.saleLabel?.trim() || `${discountPercent}% off`
    : undefined;
  const displayBadge = salePill ?? cake.tag;
  const images = useMemo(() => {
    const gallery = Array.isArray(cake.images) ? cake.images : [];
    const merged = [...new Set([cake.image, ...gallery])].filter(Boolean);
    return merged.length > 0 ? merged : [cake.image];
  }, [cake.image, cake.images]);
  const handleAdd = () => {
    addItem(cake, 1);
    toast.success(`${cake.name} added to your box`, {
      action: { label: "View cart", onClick: openCart },
    });
  };
  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
      }}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      className="group relative overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-glow)]"
    >
      <Dialog
        onOpenChange={(open) => {
          if (!open) setActiveImageIndex(0);
        }}
      >
        <DialogTrigger asChild>
          <button type="button" className="relative block w-full text-left">
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src={images[0]}
                alt={cake.name}
                loading="lazy"
                width={900}
                height={1100}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
              />
              {displayBadge && (
                <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-medium tracking-wide text-foreground backdrop-blur">
                  {displayBadge}
                </span>
              )}
            </div>
          </button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-3xl text-foreground">{cake.name}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
            <div className="space-y-3">
              <img
                src={images[activeImageIndex] ?? images[0]}
                alt={cake.name}
                className="aspect-[4/5] w-full rounded-xl object-cover"
              />
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((image, index) => (
                    <button
                      key={`${cake.id}-img-${index}`}
                      type="button"
                      onClick={() => setActiveImageIndex(index)}
                      className={`overflow-hidden rounded-md border ${
                        activeImageIndex === index ? "border-accent" : "border-border/60"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${cake.name} view ${index + 1}`}
                        className="h-20 w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <div className="flex flex-wrap items-baseline gap-2">
                <p className="font-display text-3xl text-accent">${unitPrice.toFixed(0)}</p>
                {discountPercent && (
                  <>
                    <p className="text-sm text-muted-foreground line-through">
                      ${cake.price.toFixed(0)}
                    </p>
                    <p className="text-xs font-medium uppercase tracking-widest text-accent">
                      Save ${savingsAmount.toFixed(0)}
                    </p>
                  </>
                )}
              </div>
              <p className="mt-2 text-sm italic text-muted-foreground">{cake.tagline}</p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {cake.description}
              </p>
              <div className="mt-4 rounded-xl border border-border/60 bg-secondary/40 p-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Quick details
                </p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>
                    {images.length} gallery image{images.length === 1 ? "" : "s"} available
                  </li>
                  <li>Hand-finished in small cold-set batches</li>
                  <li>
                    {discountPercent ? "Limited-time sale price" : "Ready for pickup or delivery"}
                  </li>
                </ul>
              </div>
              <button
                onClick={handleAdd}
                className="mt-6 self-start rounded-full border border-foreground/20 px-5 py-2 text-sm font-medium text-foreground transition-all hover:border-foreground hover:bg-foreground hover:text-background"
              >
                Add to box
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <div className="flex flex-col gap-2 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl text-foreground">{cake.name}</h3>
            <p className="text-sm italic text-muted-foreground">{cake.tagline}</p>
          </div>
          <div className="text-right">
            <span className="font-display text-xl text-accent">${unitPrice.toFixed(0)}</span>
            {discountPercent && (
              <p className="text-xs text-muted-foreground line-through">${cake.price.toFixed(0)}</p>
            )}
          </div>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{cake.description}</p>
        <button
          type="button"
          onClick={handleAdd}
          className="mt-4 self-start rounded-full border border-foreground/20 px-5 py-2 text-sm font-medium text-foreground transition-all hover:border-foreground hover:bg-foreground hover:text-background"
        >
          Add to box
        </button>
      </div>
    </motion.article>
  );
}
