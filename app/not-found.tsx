import Link from "next/link";
import { StoreLayout } from "@/components/layout/store-layout";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <StoreLayout>
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center md:py-32">
        <p className="text-6xl font-bold text-brand">404</p>
        <h1 className="mt-4 text-xl font-semibold text-foreground md:text-2xl">
          Page Not Found
        </h1>
        <p className="mt-2 text-sm text-muted">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className={cn(buttonVariants({ size: "lg" }), "mt-8")}>
          Back to Home
        </Link>
      </div>
    </StoreLayout>
  );
}
