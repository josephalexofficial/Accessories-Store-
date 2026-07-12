/** Tiny gray placeholder used while product images decode. */
export const PRODUCT_IMAGE_BLUR =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+";

const OPTIMIZABLE_HOST_SUFFIXES = [
  "images.unsplash.com",
  "plus.unsplash.com",
  "utfs.io",
  "ufs.sh",
  "uploadthing.com",
  "cloudinary.com",
  "amazonaws.com",
  "googleusercontent.com",
  "imgix.net",
  "shopify.com",
  "supabase.co",
] as const;

/**
 * Next.js can only optimize hosts listed in `images.remotePatterns`.
 * Unknown admin-uploaded hosts still render, but skip the optimizer.
 */
export function canOptimizeProductImage(src: string): boolean {
  try {
    const { protocol, hostname } = new URL(src);
    if (protocol !== "https:") return false;
    return OPTIMIZABLE_HOST_SUFFIXES.some(
      (host) => hostname === host || hostname.endsWith(`.${host}`)
    );
  } catch {
    return false;
  }
}

export const PRODUCT_CARD_SIZES =
  "(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1280px) 20vw, 240px";

export const PRODUCT_DETAIL_SIZES =
  "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px";

export const PRODUCT_THUMB_SIZES = "80px";
