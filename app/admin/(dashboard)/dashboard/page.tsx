import { formatPrice } from "@/lib/utils";
import { getAdminDashboardData } from "@/lib/admin-queries";
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
  const {
    recentOrders,
    productCount,
    whatsappClicks,
    totalRevenue,
    totalOrders,
  } = await getAdminDashboardData();

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
            <CardContent className="flex items-center justify-between gap-3 p-4 sm:p-5">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wide text-muted sm:text-xs">
                  {stat.label}
                </p>
                <p className="mt-1.5 truncate text-lg font-bold text-brand sm:mt-2 sm:text-xl">
                  {stat.value}
                </p>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-tint sm:h-11 sm:w-11">
                <stat.icon className="h-5 w-5 text-brand" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-5">
        <Card className="border-border/80 shadow-sm lg:col-span-3">
          <CardHeader className="px-4 py-4 sm:px-6 sm:py-5">
            <CardTitle className="text-base sm:text-lg">Sales Over Time</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
            <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-border bg-surface px-4 text-center text-sm text-muted sm:h-48">
              Sales chart — connect Paystack data to populate
            </div>
          </CardContent>
        </Card>

        <AdminPanel className="lg:col-span-2">
          <div className="border-b border-border px-4 py-4 sm:px-6 sm:py-5">
            <h2 className="text-base font-semibold text-foreground sm:text-lg">
              Recent Orders
            </h2>
          </div>
          <div className="space-y-2.5 p-3 sm:space-y-3 sm:p-6">
            {recentOrders.length === 0 ? (
              <p className="text-sm text-muted">No orders yet.</p>
            ) : (
              recentOrders.map((order) => (
                <div
                  key={order.orderNumber}
                  className="flex flex-col gap-2 rounded-lg border border-border/70 bg-surface/60 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3"
                >
                  <span className="font-mono text-[11px] text-muted sm:text-xs">
                    {order.orderNumber}
                  </span>
                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <span className="text-sm font-medium">
                      {formatPrice(Number(order.total))}
                    </span>
                    <Badge variant={statusVariant(order.paymentStatus)}>
                      {order.paymentStatus}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </AdminPanel>
      </div>
    </div>
  );
}
