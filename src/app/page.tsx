"use client";

import React, { useState, useEffect, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import { Product, ALL_SIZES, ALL_COLORS, ProductSize, ProductColor } from "@/types";
import { Sparkles, SlidersHorizontal, X, Search, RotateCcw } from "lucide-react";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Quick interactive filters
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedSize, setSelectedSize] = useState<ProductSize | "">("");
  const [selectedColour, setSelectedColour] = useState<ProductColor | "">("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data.products) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error("Failed to load garments:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Exclude sold out products
      if (p.availability === "Sold Out") return false;

      if (selectedCategory !== "All" && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      if (selectedSize && !p.sizes.includes(selectedSize)) {
        return false;
      }
      if (selectedColour && !p.colours.some((c) => c.toLowerCase() === selectedColour.toLowerCase())) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          p.name.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, selectedCategory, selectedSize, selectedColour, searchQuery]);

  const resetFilters = () => {
    setSelectedCategory("All");
    setSelectedSize("");
    setSelectedColour("");
    setSearchQuery("");
  };

  const hasActiveFilters =
    selectedCategory !== "All" || Boolean(selectedSize) || Boolean(selectedColour) || Boolean(searchQuery);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Sleek Minimal Header: Direct Garment Focus */}
      <div className="border-b border-[#E5E3DC] pb-5 mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-[10px] uppercase tracking-widest text-[#0D3D2E] font-semibold mb-1">
            <Sparkles size={12} />
            <span>New Arrivals & Collection</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-neutral-900 font-normal">
            Boutique Garments & Dresses
          </h1>
          <p className="text-xs text-neutral-500 mt-1 font-light">
            Showing {filteredProducts.length} exclusive 1-of-1 pieces · Express Delivery Across Kerala & India
          </p>
        </div>

        {/* Quick Search */}
        <div className="relative w-full md:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dress name or code..."
            className="w-full bg-white border border-[#DCDAD2] pl-8 pr-3 py-2 text-xs focus:outline-none focus:border-black"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Instant Filter Bar directly above garments */}
      <div className="bg-[#FAF9F5] border border-[#E5E3DC] p-3 sm:p-4 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        {/* Categories */}
        <div className="flex flex-wrap items-center gap-1.5">
          {["All", "Corsets & Tops", "Blouses & Shirts", "Dresses & Tunics"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs uppercase tracking-wider font-medium transition-all press-scale ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? "bg-black text-white"
                  : "bg-white text-neutral-700 border border-neutral-300 hover:border-black"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Quick Size Pills & Clear */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-neutral-500 uppercase tracking-wider font-semibold optical-badge">Size:</span>
          {ALL_SIZES.map((sz) => (
            <button
              key={sz}
              onClick={() => setSelectedSize(selectedSize === sz ? "" : sz)}
              className={`px-2.5 py-1 text-xs font-semibold uppercase border transition-all press-scale ${
                selectedSize === sz
                  ? "bg-black text-white border-black"
                  : "bg-white text-neutral-700 border-neutral-300 hover:border-black"
              }`}
            >
              {sz}
            </button>
          ))}

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="ml-2 text-[10px] text-[#0D3D2E] hover:underline uppercase tracking-wider font-semibold flex items-center space-x-1 press-scale"
            >
              <RotateCcw size={11} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Immediate Garment Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="bg-white border border-[#EBE8E0] animate-pulse">
              <div className="aspect-[3/4] bg-neutral-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-neutral-200 rounded w-3/4" />
                <div className="h-3 bg-neutral-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[#E5E3DC] p-8">
          <h3 className="font-serif text-2xl text-neutral-800 mb-2">
            No matching garments found
          </h3>
          <p className="text-xs text-neutral-500 max-w-md mx-auto mb-6">
            Try loosening your filters or resetting the category selection.
          </p>
          <button
            onClick={resetFilters}
            className="px-6 py-2.5 bg-black text-white text-xs uppercase tracking-widest font-medium"
          >
            Show All Garments
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 animate-spring-in">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
