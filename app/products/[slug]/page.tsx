import { notFound } from "next/navigation";
import { after } from "next/server";
import type { Metadata } from "next";
import { StoreLayout } from "@/components/layout/store-layout";
import { ProductDetailView } from "@/components/product/product-detail-view";
import {
  getProductBySlug,
  getAllProductSlugs,
  findProductBySlug,
  incrementProductViewCount,
} from "@/lib/products";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 120;

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

  after(() => incrementProductViewCount(product.id));

  return (
    <StoreLayout>
      <div className="bg-gradient-to-b from-brand-tint/40 via-canvas to-canvas">
        <div className="mx-auto max-w-7xl px-4 py-5 md:px-6 md:py-10">
          <ProductDetailView product={product} />
        </div>
      </div>
    </StoreLayout>
  );
}
