import type { Product as Cake } from "@/lib/store-data";
import { motion } from "framer-motion";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

export function CakeCard({ cake }: { cake: Cake }) {
  const { addItem, openCart } = useCart();
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
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={cake.image}
          alt={cake.name}
          loading="lazy"
          width={900}
          height={1100}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        {cake.tag && (
          <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-medium tracking-wide text-foreground backdrop-blur">
            {cake.tag}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl text-foreground">{cake.name}</h3>
            <p className="text-sm italic text-muted-foreground">{cake.tagline}</p>
          </div>
          <span className="font-display text-xl text-accent">${cake.price}</span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{cake.description}</p>
        <button
          onClick={handleAdd}
          className="mt-4 self-start rounded-full border border-foreground/20 px-5 py-2 text-sm font-medium text-foreground transition-all hover:border-foreground hover:bg-foreground hover:text-background"
        >
          Add to box
        </button>
      </div>
    </motion.article>
  );
}
