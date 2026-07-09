import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { StoreLayout } from "@/components/layout/store-layout";
import { ProductDetailView } from "@/components/product/product-detail-view";
import { getProductBySlug, getAllProductSlugs, findProductBySlug } from "@/lib/products";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const slugs = await getAllProductSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await findProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.title,
    description: `${product.brand} — ${product.title}`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <StoreLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <ProductDetailView product={product} />
      </div>
    </StoreLayout>
  );
}
