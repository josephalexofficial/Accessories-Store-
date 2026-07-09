import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminWhatsAppPage() {
  const [clicks, topProducts] = await Promise.all([
    prisma.whatsAppClick.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { product: true },
    }),
    prisma.product.findMany({
      orderBy: { popularity: "desc" },
      take: 10,
    }),
  ]);

  const totalClicks = await prisma.whatsAppClick.count();
  const topProduct = topProducts[0];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white">WhatsApp Interaction Log</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <p className="text-xs uppercase text-muted">Most Wanted Product</p>
            <p className="mt-2 font-bold text-white">{topProduct?.title ?? "—"}</p>
            <p className="text-sm text-muted">{topProduct?.popularity ?? 0} clicks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-xs uppercase text-muted">Peak Click Time</p>
            <p className="mt-2 font-bold text-white">2:00 PM - 4:00 PM</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-xs uppercase text-muted">Total Chat Inquiries</p>
            <p className="mt-2 font-bold text-white">{totalClicks} Total Clicks</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Product Demand Leaderboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topProducts.map((product, i) => (
              <div key={product.id} className="flex items-center justify-between">
                <span className="text-sm">
                  <span className="text-muted">#{i + 1}</span> {product.title}
                </span>
                <span className="font-bold text-brand">{product.popularity}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Live Interaction Stream</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {clicks.length === 0 ? (
              <p className="text-sm text-muted">No clicks recorded yet.</p>
            ) : (
              clicks.map((click) => (
                <div key={click.id} className="border-b border-border pb-3 last:border-0">
                  <p className="text-xs text-muted">
                    {new Date(click.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm">
                    A user initiated a chat inquiry for {click.product.title}.
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
