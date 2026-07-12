import "server-only";
import { unstable_cache } from "next/cache";
import { prisma } from "./prisma";
import type {
  AdminDeliveryLocation,
  DeliveryLocationOption,
} from "./delivery-location-types";

export type {
  AdminDeliveryLocation,
  DeliveryLocationOption,
} from "./delivery-location-types";

function serializeLocation(location: {
  id: string;
  name: string;
  fee: { toString(): string } | number;
}): DeliveryLocationOption {
  return {
    id: location.id,
    name: location.name,
    fee: Number(location.fee),
  };
}

const getCachedActiveLocations = unstable_cache(
  async () => {
    const locations = await prisma.deliveryLocation.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, fee: true },
    });
    return locations.map(serializeLocation);
  },
  ["delivery-locations-active"],
  { revalidate: 60, tags: ["delivery-locations"] }
);

export async function getActiveDeliveryLocations(): Promise<
  DeliveryLocationOption[]
> {
  return getCachedActiveLocations();
}

export async function findDeliveryLocationById(
  id: string
): Promise<DeliveryLocationOption | null> {
  const location = await prisma.deliveryLocation.findFirst({
    where: { id, isActive: true },
    select: { id: true, name: true, fee: true },
  });
  return location ? serializeLocation(location) : null;
}

export async function getAllDeliveryLocations(): Promise<
  AdminDeliveryLocation[]
> {
  const rows = await prisma.deliveryLocation.findMany({
    orderBy: { name: "asc" },
  });

  const locations: AdminDeliveryLocation[] = rows.map((row) => ({
    id: row.id,
    name: row.name,
    fee: Number(row.fee),
    isActive: row.isActive,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }));

  return locations;
}
