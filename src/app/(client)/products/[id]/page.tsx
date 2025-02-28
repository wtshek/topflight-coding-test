"use client";
import products from "@/mock/product.json";
import Image from "next/image";
import { useParams } from "next/navigation";
import { addToCart } from "@/utils/db";
import { toast } from "sonner";

const ProductPage = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id as string));

  if (!product) {
    return <div>Product not found</div>;
  }

  const handleAddToCart = async () => {
    try {
      await addToCart(product);
      toast("Product added to cart");
    } catch (error) {
      console.error("Failed to add product to cart", error);
    }
  };

  return (
    <div className="container mx-auto my-8">
      <div className="flex flex-col md:flex-row">
        <div className="flex-1">
          <Image
            src="/placeholder-image.svg"
            alt={product.name}
            className="w-full h-auto"
            width={300}
            height={200}
          />
        </div>
        <div className="flex-1 lg:pl-8">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-lg">{product.description}</p>
          <p className="text-lg font-semibold">Category: {product.category}</p>
          <p className="text-lg font-semibold">
            Price: ${product.price.toFixed(2)}
          </p>
          <button
            onClick={handleAddToCart}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
