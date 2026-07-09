import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  const stockVariant = (status: string) => {
    switch (status) {
      case "IN_STOCK":
        return "success" as const;
      case "LOW_STOCK":
        return "warning" as const;
      default:
        return "soldOut" as const;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Product & Inventory</h1>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="h-4 w-4" />
            Add New Product
          </Button>
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-card">
            <tr className="text-left text-xs uppercase tracking-wide text-muted">
              <th className="p-4">Product</th>
              <th className="p-4">Brand</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted">
                  No products yet. Add your first product.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="p-4 font-medium text-foreground">{product.title}</td>
                  <td className="p-4 text-muted">{product.brand}</td>
                  <td className="p-4 text-muted">{product.category}</td>
                  <td className="p-4">
                    {product.isSale && product.salePrice ? (
                      <span>
                        {formatPrice(Number(product.salePrice))}{" "}
                        <span className="text-xs text-muted line-through">
                          {formatPrice(Number(product.price))}
                        </span>
                      </span>
                    ) : (
                      formatPrice(Number(product.price))
                    )}
                  </td>
                  <td className="p-4">
                    <Badge variant={stockVariant(product.stockStatus)}>
                      {product.stockStatus.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
