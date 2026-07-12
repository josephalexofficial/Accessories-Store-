import Link from "next/link";
import { groupByCategory } from "@/lib/admin-products";
import { getAdminProductList } from "@/lib/admin-queries";
import { formatPrice } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
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
  const products = await getAdminProductList();
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
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      <AdminPageHeader title="Product & Inventory">
        <Link
          href="/admin/products/new"
          className={buttonVariants({
            className: "gap-2 whitespace-nowrap shadow-sm",
          })}
        >
          <Plus className="h-4 w-4 shrink-0" />
          Add New Product
        </Link>
      </AdminPageHeader>

      {products.length === 0 ? (
        <AdminPanel>
          <AdminEmptyState>No products yet. Add your first product.</AdminEmptyState>
        </AdminPanel>
      ) : (
        <div className="space-y-5 sm:space-y-8">
          {groupedProducts.map(({ category, items }) => (
            <section key={category} className="space-y-2.5 sm:space-y-3">
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
                        <AdminTableCell className="max-w-[11rem] font-medium text-foreground sm:max-w-none">
                          <span className="line-clamp-2">{product.title}</span>
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
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            prefetch
                            className={buttonVariants({
                              variant: "outline",
                              size: "sm",
                            })}
                          >
                            Edit
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
