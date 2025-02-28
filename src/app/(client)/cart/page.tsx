"use client";
import { useEffect, useState } from "react";
import { removeCart, getAllFromCart, clearCart } from "@/utils/db";
import { Product } from "@/utils/type";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import Link from "next/link";
import { PATH } from "@/utils/const";

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const total = cartItems
    .reduce((total, item) => total + item.price, 0)
    .toFixed(2);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const items = await getAllFromCart();
        setCartItems(items);
      } catch (error) {
        toast("Something went wrong. Please contact admin");
        console.error("Failed to fetch cart items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleRemoveFromCart = async (productId: number) => {
    try {
      await removeCart(productId);
      setCartItems(await getAllFromCart());
    } catch (error) {
      toast("Something went wrong. Please contact admin");
      console.error("Failed to remove product from cart:", error);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      setCartItems([]);
    } catch (error) {
      toast("Something went wrong. Please contact admin");
      console.error("Failed to clear cart:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="my-8 min-w-2/3">
      <h1>Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
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
            {cartItems.map((item) => (
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
                <TableCell>
                  <Button
                    variant="destructive"
                    onClick={() => handleRemoveFromCart(item.id)}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <p className="mt-4">Total: ${total}</p>
      <div className="flex gap-4 mt-4">
        <Button variant="outline" onClick={handleClearCart}>
          Clear Cart
        </Button>{" "}
        <Button disabled={cartItems.length === 0}>
          <Link href={PATH.checkout}>Proceed to Checkout</Link>
        </Button>
      </div>
    </div>
  );
};

export default CartPage;
