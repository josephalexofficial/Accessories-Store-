import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { type Product, type KeyValueSpec, getEffectivePrice } from "@/lib/product-types";
import { formatPrice } from "@/lib/utils";
import { ProductActions } from "./product-actions";

interface ProductDetailViewProps {
  product: Product;
}

function Specifications({ product }: { product: Product }) {
  const specs = product.specifications;

  if (!specs || (Array.isArray(specs) && specs.length === 0)) {
    return (
      <p className="text-sm text-muted">No specifications available.</p>
    );
  }

  if (product.specType === "BULLET_LIST") {
    const bullets = specs as string[];
    return (
      <ul className="list-inside list-disc space-y-1 text-sm text-muted">
        {bullets.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    );
  }

  const pairs = specs as KeyValueSpec[];
  return (
    <dl className="divide-y divide-border rounded-lg border border-border">
      {pairs.map((spec) => (
        <div
          key={spec.key}
          className="grid grid-cols-2 gap-2 px-4 py-3 text-sm even:bg-white/[0.02]"
        >
          <dt className="font-medium text-muted">{spec.key}</dt>
          <dd className="text-foreground">{spec.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const effectivePrice = getEffectivePrice(product);
  const soldOut = product.stockStatus === "SOLD_OUT";

  return (
    <div className="grid gap-8 md:grid-cols-2 md:gap-12">
      <div className="space-y-4">
        <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-surface">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              unoptimized
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted">
              No image available
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <Badge variant="muted">{product.category}</Badge>
            {product.isSale && <Badge variant="sale">Deal</Badge>}
            {soldOut && <Badge variant="soldOut">Sold Out</Badge>}
            {product.stockStatus === "LOW_STOCK" && !soldOut && (
              <Badge variant="warning">Low Stock</Badge>
            )}
          </div>
          <p className="text-sm font-medium uppercase tracking-wider text-muted">
            {product.brand}
          </p>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            {product.title}
          </h1>
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold text-foreground">
              {formatPrice(effectivePrice)}
            </span>
            {product.isSale && product.salePrice != null && (
              <span className="text-lg text-muted line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>

        <ProductActions product={product} />

        <div className="space-y-3 border-t border-border pt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
            Specifications
          </h2>
          <Specifications product={product} />
        </div>
      </div>
    </div>
  );
}
