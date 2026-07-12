export type DeliveryLocationOption = {
  id: string;
  name: string;
  fee: number;
};

export type AdminDeliveryLocation = DeliveryLocationOption & {
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};
