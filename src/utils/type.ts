export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  bestseller: boolean;
  description: string;
};

export type Order = {
  id: number;
  shippingInfo: ShippingInfo;
  cart: Product[];
  total: number;
  status: "Received" | "Processing" | "Delivered";
  createdAt: string;
};

export type ShippingInfo = {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};
