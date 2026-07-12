import { AdminPageHeader } from "@/components/admin/admin-ui";
import { AdminProductForm } from "@/components/admin/admin-product-form";

export default function NewProductPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <AdminPageHeader title="Add New Product" />
      <AdminProductForm mode="create" />
    </div>
  );
}
