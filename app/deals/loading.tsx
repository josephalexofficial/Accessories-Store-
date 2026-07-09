import { StoreLayout } from "@/components/layout/store-layout";
import { PageLoader } from "@/components/ui/page-loader";

export default function DealsLoading() {
  return (
    <StoreLayout>
      <PageLoader />
    </StoreLayout>
  );
}
