import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { groupByCategory } from "@/lib/admin-products";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import {
  AdminEmptyState,
  AdminPageHeader,
  AdminPanel,
  AdminSectionHeader,
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeaderCell,
  AdminTableRow,
} from "@/components/admin/admin-ui";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: [{ category: "asc" }, { title: "asc" }],
    select: {
      id: true,
      title: true,
      brand: true,
      category: true,
      price: true,
      salePrice: true,
      isSale: true,
      stockStatus: true,
    },
  });

  const groupedProducts = groupByCategory(products);

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
    <div className="space-y-8">
      <AdminPageHeader title="Product & Inventory">
        <Link href="/admin/products/new">
          <Button>
            <Plus className="h-4 w-4" />
            Add New Product
          </Button>
        </Link>
      </AdminPageHeader>

      {products.length === 0 ? (
        <AdminPanel>
          <AdminEmptyState>No products yet. Add your first product.</AdminEmptyState>
        </AdminPanel>
      ) : (
        <div className="space-y-8">
          {groupedProducts.map(({ category, items }) => (
            <section key={category} className="space-y-3">
              <AdminSectionHeader title={category} count={items.length} />

              <AdminPanel>
                <AdminTable>
                  <AdminTableHead>
                    <AdminTableHeaderCell>Product</AdminTableHeaderCell>
                    <AdminTableHeaderCell>Brand</AdminTableHeaderCell>
                    <AdminTableHeaderCell>Price</AdminTableHeaderCell>
                    <AdminTableHeaderCell>Stock</AdminTableHeaderCell>
                    <AdminTableHeaderCell>Actions</AdminTableHeaderCell>
                  </AdminTableHead>
                  <AdminTableBody>
                    {items.map((product) => (
                      <AdminTableRow key={product.id}>
                        <AdminTableCell className="font-medium text-foreground">
                          {product.title}
                        </AdminTableCell>
                        <AdminTableCell className="text-muted">
                          {product.brand}
                        </AdminTableCell>
                        <AdminTableCell>
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
                        </AdminTableCell>
                        <AdminTableCell>
                          <Badge variant={stockVariant(product.stockStatus)}>
                            {product.stockStatus.replace("_", " ")}
                          </Badge>
                        </AdminTableCell>
                        <AdminTableCell>
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </Link>
                        </AdminTableCell>
                      </AdminTableRow>
                    ))}
                  </AdminTableBody>
                </AdminTable>
              </AdminPanel>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
