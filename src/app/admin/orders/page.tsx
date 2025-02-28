"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/order-table/data-table";
import { columns } from "@/components/order-table/column";
import { getAllOrders } from "@/utils/db";

export default function Page() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const orders = await getAllOrders();
        const mapped = orders.map((order) => ({
          id: order.id,
          customerName: order.shippingInfo.name,
          orderDate: order.createdAt,
          status: order.status,
          products: order.cart.map((item) => item.name).join(","),
          amount: order.total.toFixed(2),
          shippingAddress: `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.country} ${order.shippingInfo.postalCode}`,
        }));
        setOrders(mapped);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    }

    fetchOrders();
  }, []);

  if (orders.length === 0) {
    return <div>No orders found.</div>;
  }

  return (
    <div className="my-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Order</h1>
      <DataTable columns={columns} data={orders} />
    </div>
  );
}
