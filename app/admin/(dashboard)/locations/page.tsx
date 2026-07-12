import { getAllDeliveryLocations } from "@/lib/delivery-locations";
import type { AdminDeliveryLocation } from "@/lib/delivery-location-types";
import { AddLocationForm } from "@/components/admin/add-location-form";
import { LocationTableRows } from "@/components/admin/location-table-rows";
import {
  AdminEmptyState,
  AdminPageHeader,
  AdminPanel,
  AdminTable,
  AdminTableBody,
  AdminTableHead,
  AdminTableHeaderCell,
} from "@/components/admin/admin-ui";

export default async function AdminLocationsPage() {
  const locations: AdminDeliveryLocation[] = await getAllDeliveryLocations();
  const isEmpty = locations.length === 0;

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      <AdminPageHeader title="Delivery Locations" />

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
        <div className="order-2 lg:order-1 lg:col-span-2">
          {isEmpty ? (
            <AdminPanel>
              <AdminEmptyState>
                No delivery locations yet. Add your first town.
              </AdminEmptyState>
            </AdminPanel>
          ) : (
            <AdminPanel>
              <AdminTable>
                <AdminTableHead>
                  <AdminTableHeaderCell>Location</AdminTableHeaderCell>
                  <AdminTableHeaderCell>Amount (Ksh)</AdminTableHeaderCell>
                  <AdminTableHeaderCell>Status</AdminTableHeaderCell>
                  <AdminTableHeaderCell>Actions</AdminTableHeaderCell>
                </AdminTableHead>
                <AdminTableBody>
                  <LocationTableRows locations={locations} />
                </AdminTableBody>
              </AdminTable>
            </AdminPanel>
          )}
        </div>

        <div className="order-1 lg:order-2">
          <AddLocationForm />
        </div>
      </div>
    </div>
  );
}
