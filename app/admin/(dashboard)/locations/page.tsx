import { getAllDeliveryLocations } from "@/lib/delivery-locations";
import type { AdminDeliveryLocation } from "@/lib/delivery-location-types";
import { AddLocationForm } from "@/components/admin/add-location-form";
import { LocationTableRow } from "@/components/admin/location-table-row";
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

  return (
    <div className="space-y-8">
      <AdminPageHeader title="Delivery Locations" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AdminPanel>
            <AdminTable>
              <AdminTableHead>
                <AdminTableHeaderCell>Location</AdminTableHeaderCell>
                <AdminTableHeaderCell>Amount (Ksh)</AdminTableHeaderCell>
                <AdminTableHeaderCell>Status</AdminTableHeaderCell>
                <AdminTableHeaderCell>Actions</AdminTableHeaderCell>
              </AdminTableHead>
              <AdminTableBody>
                {locations.length === 0 ? (
                  <tr>
                    <td colSpan={4}>
                      <AdminEmptyState>
                        No delivery locations yet. Add your first town.
                      </AdminEmptyState>
                    </td>
                  </tr>
                ) : (
                  locations.map((location: AdminDeliveryLocation) => (
                    <LocationTableRow key={location.id} location={location} />
                  ))
                )}
              </AdminTableBody>
            </AdminTable>
          </AdminPanel>
        </div>

        <AddLocationForm />
      </div>
    </div>
  );
}
