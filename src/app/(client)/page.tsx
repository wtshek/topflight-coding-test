"use client";

import { Product } from "@/utils/type";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import products from "@/mock/product.json";
import faqs from "@/mock/faq.json";
import Image from "next/image";
import Link from "next/link";
import { PATH } from "@/utils/const";

export default function Home() {
  // Filter bestseller products
  const bestsellerProducts = (products as Product[]).filter(
    (product) => product.bestseller
  );

  return (
    <main className="min-h-screen px-4 py-8 md:px-8 lg:px-16">
      {/* Bestseller Section */}
      <section className="mb-16">
        <h2 className="mb-8 text-2xl font-bold text-center md:text-3xl">
          Our Bestsellers
        </h2>
        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {bestsellerProducts.map((product) => (
                <CarouselItem
                  key={product.id}
                  className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <Link href={`${PATH.products}/${product.id}`}>
                    <div className="p-4 border rounded-lg">
                      <Image
                        src="/placeholder-image.svg"
                        alt={product.name}
                        width={300}
                        height={200}
                      />
                      <h3 className="mb-2 text-lg font-semibold">
                        {product.name}
                      </h3>
                      <p className="mb-2 text-sm text-gray-600">
                        {product.category}
                      </p>
                      <p className="mb-3 text-sm line-clamp-2">
                        {product.description}
                      </p>
                      <p className="text-lg font-bold">${product.price}</p>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto">
        <h2 className="mb-8 text-2xl font-bold text-center md:text-3xl">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-gray-600">{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </main>
  );
}
