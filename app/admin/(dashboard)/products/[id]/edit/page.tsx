import { notFound } from "next/navigation";
import { getAdminProductById } from "@/lib/admin-queries";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { AdminProductForm } from "@/components/admin/admin-product-form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getAdminProductById(id);

  if (!product) notFound();

  return (
    <div className="space-y-4 sm:space-y-6">
      <AdminPageHeader title="Edit Product" />
      <AdminProductForm
        mode="edit"
        productId={product.id}
        initial={{
          title: product.title,
          brand: product.brand,
          category: product.category,
          price: String(Number(product.price)),
          isSale: product.isSale,
          salePrice:
            product.salePrice != null ? String(Number(product.salePrice)) : "",
          stockStatus: product.stockStatus,
          imageUrl: product.imageUrl ?? "",
          specType: product.specType,
          specifications: product.specifications,
        }}
      />
    </div>
  );
}
