import { Order, ShippingInfo } from "@/utils/type";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
  },
  {
    accessorKey: "customerName",
    header: "Customer Name",
  },
  {
    accessorKey: "orderDate",
    header: "Order Date",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "products",
    header: "Product",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "shippingAddress",
    header: "Shipping Address",
  },
];
