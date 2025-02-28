"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PATH } from "@/utils/const";
import { createOrder, getAllFromCart } from "@/utils/db";
import { Product } from "@/utils/type";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";

export default function CheckoutPage() {
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [orderSummary, setOrderSummary] = useState<{
    items: Product[];
    total: number;
  }>({
    items: [], // This should be populated with actual cart items
    total: 0, // This should be calculated based on cart items
  });
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      // Proceed with order submission logic
      await createOrder({ ...orderSummary, shippingInfo });
      router.push(PATH.home);
    } catch (e) {
      toast("Something went wrong. Contact admin");
      console.error(e);
    }
  };

  useEffect(() => {
    async function fetchCartItems() {
      try {
        const items = await getAllFromCart();
        const total = items.reduce((sum, item) => sum + item.price, 0); // Assuming each item has a 'price' property
        setOrderSummary({ items, total });
      } catch (error) {
        console.error(error);
        toast("Failed to load cart items.");
      }
    }

    fetchCartItems();
  }, []);

  return (
    <div className="my-8 min-w-2/3">
      <h1 className="text-3xl md:text-4xl text-center font-bold text-gray-800">
        Checkout
      </h1>
      <div className="mt-4">
        <div className="lg:flex lg:gap-20">
          <div className="mt-8 lg:mt-0">
            <h2 className="font-semibold">Order Summary</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderSummary.items.map((item) => (
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
            <p>Total: ${orderSummary.total.toFixed(2)}</p>
          </div>
          <div className="lg:min-w-[400px] lg:mt-0 mt-8">
            <h2 className="font-semibold">Shipping Information</h2>
            <form className="grid gap-4 mt-2">
              <Input
                type="text"
                name="name"
                placeholder="Full Name"
                value={shippingInfo.name}
                onChange={handleInputChange}
                required
              />
              <Input
                type="text"
                name="address"
                placeholder="Address"
                value={shippingInfo.address}
                onChange={handleInputChange}
                required
              />
              <Input
                type="text"
                name="city"
                placeholder="City"
                value={shippingInfo.city}
                onChange={handleInputChange}
                required
              />
              <Input
                type="text"
                name="postalCode"
                placeholder="Postal Code"
                value={shippingInfo.postalCode}
                onChange={handleInputChange}
                required
              />
              <Input
                type="text"
                name="country"
                placeholder="Country"
                value={shippingInfo.country}
                onChange={handleInputChange}
                required
              />
            </form>
            <div className="flex gap-4 mt-4">
              <Button variant="outline" onClick={() => router.push(PATH.cart)}>
                Back to Cart
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={Object.values(shippingInfo).some(
                  (field) => field === ""
                )}
              >
                Place Order
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
