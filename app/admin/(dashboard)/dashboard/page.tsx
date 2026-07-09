import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  ShoppingBag,
  MessageCircle,
  Package,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const [orders, products, whatsappClicks] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { items: true },
    }),
    prisma.product.count(),
    prisma.whatsAppClick.count(),
  ]);

  const paidOrders = await prisma.order.findMany({
    where: { paymentStatus: "PAID" },
    select: { total: true },
  });

  const totalRevenue = paidOrders.reduce((sum, o) => sum + Number(o.total), 0);
  const totalOrders = await prisma.order.count();

  const stats = [
    {
      label: "Total Revenue",
      value: formatPrice(totalRevenue),
      icon: DollarSign,
    },
    {
      label: "Total Orders",
      value: `${totalOrders} Orders`,
      icon: ShoppingBag,
    },
    {
      label: "WhatsApp Clicks",
      value: `${whatsappClicks} Clicks`,
      icon: MessageCircle,
    },
    {
      label: "Active Products",
      value: `${products} Items`,
      icon: Package,
    },
  ];

  const statusVariant = (status: string) => {
    switch (status) {
      case "PAID":
      case "COMPLETED":
        return "success" as const;
      case "PROCESSING":
        return "warning" as const;
      default:
        return "muted" as const;
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">
                  {stat.label}
                </p>
                <p className="mt-2 text-xl font-bold text-white">{stat.value}</p>
              </div>
              <stat.icon className="h-8 w-8 text-brand opacity-80" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Sales Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted">
              Sales chart — connect Paystack data to populate
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <p className="text-sm text-muted">No orders yet.</p>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between border-b border-border pb-3 last:border-0"
                  >
                    <span className="font-mono text-xs text-muted">
                      {order.orderNumber}
                    </span>
                    <span className="text-sm font-medium">
                      {formatPrice(Number(order.total))}
                    </span>
                    <Badge variant={statusVariant(order.paymentStatus)}>
                      {order.paymentStatus}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
