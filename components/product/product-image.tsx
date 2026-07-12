import Image from "next/image";
import {
  PRODUCT_IMAGE_BLUR,
  canOptimizeProductImage,
} from "@/lib/product-image";
import { cn } from "@/lib/utils";

interface ProductImageProps {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  quality?: 60 | 75;
  className?: string;
}

export function ProductImage({
  src,
  alt,
  sizes,
  priority = false,
  quality = 75,
  className,
}: ProductImageProps) {
  const optimize = canOptimizeProductImage(src);

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      quality={quality}
      priority={priority}
      placeholder="blur"
      blurDataURL={PRODUCT_IMAGE_BLUR}
      unoptimized={!optimize}
      className={cn("object-cover", className)}
    />
  );
}
