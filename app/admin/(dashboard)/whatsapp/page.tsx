import { getAdminWhatsAppData } from "@/lib/admin-queries";
import { Card, CardContent } from "@/components/ui/card";
import { AdminPageHeader, AdminPanel } from "@/components/admin/admin-ui";

export default async function AdminWhatsAppPage() {
  const { clicks, topProducts, totalClicks } = await getAdminWhatsAppData();
  const topProduct = topProducts[0];

  return (
    <div className="space-y-6 sm:space-y-8">
      <AdminPageHeader title="WhatsApp Interaction Log" />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3">
        <Card className="border-border/80 shadow-sm">
          <CardContent className="p-4 sm:p-5">
            <p className="text-[11px] uppercase text-muted sm:text-xs">
              Most Wanted Product
            </p>
            <p className="mt-2 line-clamp-2 text-sm font-bold text-foreground sm:text-base">
              {topProduct?.title ?? "—"}
            </p>
            <p className="mt-1 text-sm text-muted">
              {topProduct?.popularity ?? 0} clicks
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/80 shadow-sm">
          <CardContent className="p-4 sm:p-5">
            <p className="text-[11px] uppercase text-muted sm:text-xs">
              Peak Click Time
            </p>
            <p className="mt-2 text-sm font-bold text-foreground sm:text-base">
              2:00 PM - 4:00 PM
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/80 shadow-sm sm:col-span-2 md:col-span-1">
          <CardContent className="p-4 sm:p-5">
            <p className="text-[11px] uppercase text-muted sm:text-xs">
              Total Chat Inquiries
            </p>
            <p className="mt-2 text-sm font-bold text-foreground sm:text-base">
              {totalClicks} Total Clicks
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        <AdminPanel>
          <div className="border-b border-border px-4 py-4 sm:px-6 sm:py-5">
            <h2 className="text-base font-semibold text-foreground sm:text-lg">
              Product Demand Leaderboard
            </h2>
          </div>
          <div className="space-y-2.5 p-3 sm:space-y-3 sm:p-6">
            {topProducts.map((product, i) => (
              <div
                key={product.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-surface/60 px-3 py-2.5"
              >
                <span className="min-w-0 text-sm">
                  <span className="text-muted">#{i + 1}</span>{" "}
                  <span className="line-clamp-2">{product.title}</span>
                </span>
                <span className="shrink-0 font-bold text-brand">
                  {product.popularity}
                </span>
              </div>
            ))}
          </div>
        </AdminPanel>

        <AdminPanel>
          <div className="border-b border-border px-4 py-4 sm:px-6 sm:py-5">
            <h2 className="text-base font-semibold text-foreground sm:text-lg">
              Live Interaction Stream
            </h2>
          </div>
          <div className="space-y-2.5 p-3 sm:space-y-3 sm:p-6">
            {clicks.length === 0 ? (
              <p className="text-sm text-muted">No clicks recorded yet.</p>
            ) : (
              clicks.map((click) => (
                <div
                  key={click.id}
                  className="rounded-lg border border-border/70 bg-surface/60 px-3 py-3"
                >
                  <p className="text-[11px] text-muted sm:text-xs">
                    {new Date(click.createdAt).toLocaleString()}
                  </p>
                  <p className="mt-1 text-sm leading-snug">
                    A user initiated a chat inquiry for {click.product.title}.
                  </p>
                </div>
              ))
            )}
          </div>
        </AdminPanel>
      </div>
    </div>
  );
}
