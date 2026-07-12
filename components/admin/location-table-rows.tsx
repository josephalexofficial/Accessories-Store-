import type { AdminDeliveryLocation } from "@/lib/delivery-location-types";
import { LocationTableRow } from "@/components/admin/location-table-row";

export function LocationTableRows({
  locations,
}: {
  locations: AdminDeliveryLocation[];
}) {
  return (
    <>
      {locations.map((item: AdminDeliveryLocation) => (
        <LocationTableRow key={item.id} location={item} />
      ))}
    </>
  );
}
