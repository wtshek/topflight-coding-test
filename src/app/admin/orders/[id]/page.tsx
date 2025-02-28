"use client";
import { getOrderById } from "@/utils/db";
import { Order } from "@/utils/type";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";

function OrderPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | undefined>();

  useEffect(() => {
    if (id) {
      // Fetch order data based on the order ID
      const fetchOrder = async () => {
        const order = await getOrderById(Number(id));
        setOrder(order);
      };

      fetchOrder();
    }
  }, [id]);

  if (!order) return <div>Loading...</div>;

  return (
    <div>
      <h1>Order Summary</h1>
      <p>Order ID: {order.id}</p>
      <p>Status: {order.status}</p>

      <h2>Customer Details</h2>
      <p>Name: {order.shippingInfo.name}</p>

      <h2>Product List</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {order.cart.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Image
                  src="/placeholder-image.svg"
                  alt={item.name}
                  width={150}
                  height={100}
                />
              </TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>${item.price}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default OrderPage;
