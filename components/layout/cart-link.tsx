"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/store/cart";
import { cn } from "@/lib/utils";

interface CartLinkProps {
  className?: string;
}

export function CartLink({ className }: CartLinkProps) {
  const count = useCart((s) =>
    s.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  return (
    <Link
      href="/cart"
      className={cn(
        "relative flex items-center justify-center rounded-lg p-2 text-muted transition-colors hover:bg-brand-light hover:text-brand",
        className
      )}
      aria-label={`Cart${count > 0 ? `, ${count} items` : ""}`}
    >
      <ShoppingCart className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
