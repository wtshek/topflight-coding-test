"use client";

import { Product } from "@/utils/type";
import products from "@/mock/product.json";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { PATH } from "@/utils/const";
import { Search, SlidersHorizontal } from "lucide-react";

// TODO: large screen ux - should not shrink when no product match search

export default function ProductsPage() {
  // Get unique categories
  const categories = [
    ...new Set((products as Product[]).map((product) => product.category)),
  ];

  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showBestsellers, setShowBestsellers] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products] as Product[];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Price range filter
    if (minPrice) {
      filtered = filtered.filter(
        (product) => product.price >= Number(minPrice)
      );
    }
    if (maxPrice) {
      filtered = filtered.filter(
        (product) => product.price <= Number(maxPrice)
      );
    }

    // Bestseller filter
    if (showBestsellers) {
      filtered = filtered.filter((product) => product.bestseller);
    }

    // Sorting
    switch (sortBy) {
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "bestseller":
        filtered.sort(
          (a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0)
        );
        break;
    }

    return filtered;
  }, [
    searchQuery,
    selectedCategory,
    minPrice,
    maxPrice,
    showBestsellers,
    sortBy,
  ]);

  return (
    <main className="min-h-screen p-4 md:p-8">
      {/* Search and Filter Section */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>

          <div className="flex gap-4 items-center">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="name">Alphabetical</SelectItem>
                <SelectItem value="bestseller">Bestsellers First</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden"
            >
              <SlidersHorizontal size={20} />
            </Button>
          </div>
        </div>

        {/* Filters - Desktop */}
        <div className="hidden md:flex gap-4 items-center">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="number"
            placeholder="Min price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-[120px]"
          />
          <Input
            type="number"
            placeholder="Max price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-[120px]"
          />

          <div className="flex items-center gap-2">
            <Checkbox
              id="bestsellers"
              checked={showBestsellers}
              onCheckedChange={(checked) =>
                setShowBestsellers(checked as boolean)
              }
            />
            <label htmlFor="bestsellers">Bestsellers only</label>
          </div>
        </div>

        {/* Filters - Mobile */}
        {showFilters && (
          <div className="space-y-4 md:hidden">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Max price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="bestsellers-mobile"
                checked={showBestsellers}
                onCheckedChange={(checked) =>
                  setShowBestsellers(checked as boolean)
                }
              />
              <label htmlFor="bestsellers-mobile">Bestsellers only</label>
            </div>
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 min-w-full">
        {filteredProducts.map((product) => (
          <Link key={product.id} href={`${PATH.products}/${product.id}`}>
            <div className="border rounded-lg p-4 h-full hover:shadow-lg transition-shadow">
              <Image
                src="/placeholder-image.svg"
                alt={product.name}
                width={300}
                height={200}
                className="w-full h-48 object-cover mb-4 rounded"
              />
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.category}</p>
                <p className="text-sm line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <p className="font-bold">${product.price}</p>
                  {product.bestseller && (
                    <span className="text-sm text-orange-500 font-medium">
                      Bestseller
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* No Results Message */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-8 w-full">
          <p className="text-gray-500">
            No products found matching your criteria.
          </p>
        </div>
      )}
    </main>
  );
}
