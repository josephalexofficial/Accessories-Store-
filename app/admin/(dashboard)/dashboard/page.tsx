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
import { AdminPageHeader, AdminPanel } from "@/components/admin/admin-ui";

export default async function AdminDashboardPage() {
  const [recentOrders, productCount, whatsappClicks, paidRevenue, totalOrders] =
    await Promise.all([
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          orderNumber: true,
          total: true,
          paymentStatus: true,
        },
      }),
      prisma.product.count(),
      prisma.whatsAppClick.count(),
      prisma.order.aggregate({
        where: { paymentStatus: "PAID" },
        _sum: { total: true },
      }),
      prisma.order.count(),
    ]);

  const totalRevenue = Number(paidRevenue._sum.total ?? 0);

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
      value: `${productCount} Items`,
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
      <AdminPageHeader title="Dashboard Overview" />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/80 shadow-sm">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">
                  {stat.label}
                </p>
                <p className="mt-2 text-xl font-bold text-brand">{stat.value}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-tint">
                <stat.icon className="h-5 w-5 text-brand" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="border-border/80 shadow-sm lg:col-span-3">
          <CardHeader>
            <CardTitle>Sales Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border bg-surface text-sm text-muted">
              Sales chart — connect Paystack data to populate
            </div>
          </CardContent>
        </Card>

        <AdminPanel className="lg:col-span-2">
          <div className="border-b border-border px-6 py-5">
            <h2 className="text-lg font-semibold text-foreground">Recent Orders</h2>
          </div>
          <div className="p-6">
            {recentOrders.length === 0 ? (
              <p className="text-sm text-muted">No orders yet.</p>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div
                    key={order.orderNumber}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-surface/60 px-3 py-3"
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
          </div>
        </AdminPanel>
      </div>
    </div>
  );
}
