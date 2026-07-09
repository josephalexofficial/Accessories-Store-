import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { AdminPageHeader, AdminPanel } from "@/components/admin/admin-ui";

export default async function AdminWhatsAppPage() {
  const [clicks, topProducts, totalClicks] = await Promise.all([
    prisma.whatsAppClick.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { product: { select: { title: true } } },
    }),
    prisma.product.findMany({
      orderBy: { popularity: "desc" },
      take: 10,
      select: { id: true, title: true, popularity: true },
    }),
    prisma.whatsAppClick.count(),
  ]);
  const topProduct = topProducts[0];

  return (
    <div className="space-y-8">
      <AdminPageHeader title="WhatsApp Interaction Log" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border-border/80 shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs uppercase text-muted">Most Wanted Product</p>
            <p className="mt-2 font-bold text-foreground">
              {topProduct?.title ?? "—"}
            </p>
            <p className="text-sm text-muted">{topProduct?.popularity ?? 0} clicks</p>
          </CardContent>
        </Card>
        <Card className="border-border/80 shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs uppercase text-muted">Peak Click Time</p>
            <p className="mt-2 font-bold text-foreground">2:00 PM - 4:00 PM</p>
          </CardContent>
        </Card>
        <Card className="border-border/80 shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs uppercase text-muted">Total Chat Inquiries</p>
            <p className="mt-2 font-bold text-foreground">
              {totalClicks} Total Clicks
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        <AdminPanel>
          <div className="border-b border-border px-6 py-5">
            <h2 className="text-lg font-semibold text-foreground">
              Product Demand Leaderboard
            </h2>
          </div>
          <div className="space-y-3 p-6">
            {topProducts.map((product, i) => (
              <div
                key={product.id}
                className="flex items-center justify-between rounded-lg border border-border/70 bg-surface/60 px-3 py-2.5"
              >
                <span className="text-sm">
                  <span className="text-muted">#{i + 1}</span> {product.title}
                </span>
                <span className="font-bold text-brand">{product.popularity}</span>
              </div>
            ))}
          </div>
        </AdminPanel>

        <AdminPanel>
          <div className="border-b border-border px-6 py-5">
            <h2 className="text-lg font-semibold text-foreground">
              Live Interaction Stream
            </h2>
          </div>
          <div className="space-y-3 p-6">
            {clicks.length === 0 ? (
              <p className="text-sm text-muted">No clicks recorded yet.</p>
            ) : (
              clicks.map((click) => (
                <div
                  key={click.id}
                  className="rounded-lg border border-border/70 bg-surface/60 px-3 py-3"
                >
                  <p className="text-xs text-muted">
                    {new Date(click.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm">
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
