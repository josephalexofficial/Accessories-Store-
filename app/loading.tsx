import { StoreLayout } from "@/components/layout/store-layout";
import { HeroLoader, PageLoader } from "@/components/ui/page-loader";

export default function HomeLoading() {
  return (
    <StoreLayout>
      <HeroLoader />
      <PageLoader />
    </StoreLayout>
  );
}
