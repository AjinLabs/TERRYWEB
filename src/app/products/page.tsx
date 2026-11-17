"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { Product, ALL_SIZES, ALL_COLORS, ProductSize, ProductColor } from "@/types";
import { Filter, X, Search, RotateCcw, SlidersHorizontal } from "lucide-react";

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters state
  const [selectedSize, setSelectedSize] = useState<ProductSize | "">(
    (searchParams.get("size") as ProductSize) || ""
  );
  const [selectedColour, setSelectedColour] = useState<ProductColor | "">(
    (searchParams.get("colour") as ProductColor) || ""
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get("category") || "All"
  );
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get("search") || ""
  );
  const [sortBy, setSortBy] = useState<string>("newest");

  // Fetch products
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
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Sync state when URL params change
  useEffect(() => {
    const sizeParam = searchParams.get("size") as ProductSize | null;
    const colourParam = searchParams.get("colour") as ProductColor | null;
    const catParam = searchParams.get("category");
    const searchParam = searchParams.get("search");

    if (sizeParam) setSelectedSize(sizeParam);
    if (colourParam) setSelectedColour(colourParam);
    if (catParam) setSelectedCategory(catParam);
    if (searchParam) setSearchQuery(searchParam);
  }, [searchParams]);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Exclude sold out / stock out garments
        if (p.availability === "Sold Out") {
          return false;
        }
        // Size filter
        if (selectedSize && !p.sizes.includes(selectedSize)) {
          return false;
        }
        // Colour filter
        if (
          selectedColour &&
          !p.colours.some((c) => c.toLowerCase() === selectedColour.toLowerCase())
        ) {
          return false;
        }
        // Category filter
        if (selectedCategory && selectedCategory !== "All") {
          if (p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
            return false;
          }
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesName = p.name.toLowerCase().includes(q);
          const matchesCode = p.code.toLowerCase().includes(q);
          const matchesDesc = p.description.toLowerCase().includes(q);
          if (!matchesName && !matchesCode && !matchesDesc) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [products, selectedSize, selectedColour, selectedCategory, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedSize("");
    setSelectedColour("");
    setSelectedCategory("All");
    setSearchQuery("");
    setSortBy("newest");
    router.push("/products");
  };

  const hasActiveFilters =
    Boolean(selectedSize) ||
    Boolean(selectedColour) ||
    selectedCategory !== "All" ||
    Boolean(searchQuery);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Editorial Header */}
      <div className="border-b border-[#E5E3DC] pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#0D3D2E] font-semibold block">
            Boutique Apparel
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-neutral-900 mt-1">
            Complete Collection
          </h1>
          <p className="text-xs text-neutral-500 mt-1.5 font-light">
            Showing {filteredProducts.length} curated luxury garments
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or code..."
              className="bg-white border border-[#DCDAD2] pl-8 pr-3 py-2 text-xs focus:outline-none focus:border-black w-48 sm:w-60"
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

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-[#DCDAD2] px-3 py-2 text-xs text-neutral-800 focus:outline-none focus:border-black font-medium"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden px-3 py-2 bg-neutral-900 text-white text-xs uppercase tracking-wider flex items-center space-x-1.5"
          >
            <SlidersHorizontal size={14} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-8 pr-6 border-r border-[#EBE8E0]">
          {/* Active Filters Clear Button */}
          {hasActiveFilters && (
            <div className="p-3 bg-[#F4F2EB] border border-[#E5E3DC] flex items-center justify-between">
              <span className="text-[11px] font-medium text-neutral-800">Filters Applied</span>
              <button
                onClick={resetFilters}
                className="text-[10px] uppercase tracking-wider font-semibold text-[#0D3D2E] hover:underline flex items-center space-x-1"
              >
                <RotateCcw size={11} />
                <span>Reset All</span>
              </button>
            </div>
          )}

          {/* Category Filter */}
          <div>
            <h4 className="text-[11px] uppercase tracking-widest text-neutral-900 font-semibold mb-3">
              Garment Category
            </h4>
            <div className="space-y-1 text-xs">
              {["All", "Corsets & Tops", "Blouses & Shirts", "Dresses & Tunics"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`block w-full text-left py-1.5 px-2 transition-colors ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? "bg-neutral-900 text-white font-medium"
                      : "text-neutral-600 hover:text-black hover:bg-neutral-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter (M, L, XL, XXL) */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-[11px] uppercase tracking-widest text-neutral-900 font-semibold">
                Size
              </h4>
              {selectedSize && (
                <button
                  onClick={() => setSelectedSize("")}
                  className="text-[10px] text-neutral-500 hover:text-black underline"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {ALL_SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(selectedSize === size ? "" : size)}
                  className={`py-2 text-xs font-semibold uppercase tracking-wider border transition-all ${
                    selectedSize === size
                      ? "bg-black text-white border-black"
                      : "bg-white text-neutral-800 border-[#DCDAD2] hover:border-neutral-500"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* 20 Predefined Colour Filters */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-[11px] uppercase tracking-widest text-neutral-900 font-semibold">
                Colour ({ALL_COLORS.length})
              </h4>
              {selectedColour && (
                <button
                  onClick={() => setSelectedColour("")}
                  className="text-[10px] text-neutral-500 hover:text-black underline"
                >
                  Clear
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
              {ALL_COLORS.map(({ name, hex, border }) => {
                const isSelected = selectedColour === name;
                return (
                  <button
                    key={name}
                    onClick={() => setSelectedColour(isSelected ? "" : name)}
                    className={`flex items-center space-x-2 px-2 py-1.5 text-xs text-left border transition-all ${
                      isSelected
                        ? "border-black bg-neutral-100 font-semibold text-black"
                        : "border-[#E5E3DC] bg-white text-neutral-700 hover:border-neutral-400"
                    }`}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded-full shrink-0 ${
                        border ? "border border-neutral-300" : ""
                      }`}
                      style={{ backgroundColor: hex }}
                    />
                    <span className="truncate text-[11px]">{name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Boutique Note */}
          <div className="p-4 bg-[#F7F5EE] border border-[#E5E3DC] text-[11px] text-neutral-600 space-y-1.5 leading-relaxed">
            <span className="font-semibold text-neutral-900 block uppercase tracking-wider text-[10px]">
              Direct WhatsApp Assistance
            </span>
            <p>
              Have questions regarding bust measurements, fabric drape, or custom colours? Message our atelier concierge at +91 83308 89632.
            </p>
          </div>
        </aside>

        {/* Mobile Filter Sheet */}
        {mobileFilterOpen && (
          <div className="lg:hidden col-span-1 p-5 bg-[#FAF9F5] border border-[#E5E3DC] mb-6 space-y-6">
            <div className="flex justify-between items-center border-b border-neutral-200 pb-3">
              <h3 className="font-serif text-lg text-neutral-900">Filter Collection</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="text-neutral-500 hover:text-black"
              >
                <X size={18} />
              </button>
            </div>

            {/* Mobile Categories */}
            <div>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-800 block mb-2">
                Category
              </span>
              <div className="flex flex-wrap gap-1.5">
                {["All", "Corsets & Tops", "Blouses & Shirts", "Dresses & Tunics"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 text-xs border ${
                      selectedCategory.toLowerCase() === cat.toLowerCase()
                        ? "bg-black text-white border-black"
                        : "bg-white text-neutral-700 border-neutral-300"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Sizes */}
            <div>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-800 block mb-2">
                Sizes
              </span>
              <div className="flex gap-2">
                {ALL_SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(selectedSize === size ? "" : size)}
                    className={`flex-1 py-1.5 text-xs font-semibold uppercase border ${
                      selectedSize === size
                        ? "bg-black text-white border-black"
                        : "bg-white text-neutral-700 border-neutral-300"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Colours */}
            <div>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-800 block mb-2">
                Colours
              </span>
              <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto">
                {ALL_COLORS.map(({ name, hex, border }) => (
                  <button
                    key={name}
                    onClick={() => setSelectedColour(selectedColour === name ? "" : name)}
                    className={`flex items-center space-x-2 px-2 py-1.5 text-xs border ${
                      selectedColour === name
                        ? "bg-neutral-900 text-white border-neutral-900"
                        : "bg-white text-neutral-700 border-neutral-200"
                    }`}
                  >
                    <span
                      className={`w-3 h-3 rounded-full shrink-0 ${border ? "border border-neutral-300" : ""}`}
                      style={{ backgroundColor: hex }}
                    />
                    <span className="truncate text-[10px]">{name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={resetFilters}
                className="flex-1 py-2.5 border border-neutral-900 text-neutral-900 text-xs uppercase tracking-wider font-medium"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 bg-black text-white text-xs uppercase tracking-wider font-medium"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Product Grid Area */}
        <div className="lg:col-span-3">
          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium">
                Active:
              </span>
              {selectedCategory !== "All" && (
                <span className="inline-flex items-center bg-[#F2EFE8] text-neutral-800 text-[11px] px-2.5 py-1 border border-neutral-300">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory("All")} className="ml-1.5 text-neutral-500 hover:text-black">
                    <X size={10} />
                  </button>
                </span>
              )}
              {selectedSize && (
                <span className="inline-flex items-center bg-[#F2EFE8] text-neutral-800 text-[11px] px-2.5 py-1 border border-neutral-300">
                  Size: {selectedSize}
                  <button onClick={() => setSelectedSize("")} className="ml-1.5 text-neutral-500 hover:text-black">
                    <X size={10} />
                  </button>
                </span>
              )}
              {selectedColour && (
                <span className="inline-flex items-center bg-[#F2EFE8] text-neutral-800 text-[11px] px-2.5 py-1 border border-neutral-300">
                  Colour: {selectedColour}
                  <button onClick={() => setSelectedColour("")} className="ml-1.5 text-neutral-500 hover:text-black">
                    <X size={10} />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center bg-[#F2EFE8] text-neutral-800 text-[11px] px-2.5 py-1 border border-neutral-300">
                  Search: &ldquo;{searchQuery}&rdquo;
                  <button onClick={() => setSearchQuery("")} className="ml-1.5 text-neutral-500 hover:text-black">
                    <X size={10} />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
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
            /* Empty State */
            <div className="text-center py-20 bg-white border border-[#E5E3DC] p-8">
              <h3 className="font-serif text-2xl text-neutral-800 mb-2">
                No matching garments found
              </h3>
              <p className="text-xs text-neutral-500 max-w-md mx-auto mb-6">
                Try loosening your filters or explore other sizes and colours. Our atelier can also custom craft specific sizes on WhatsApp.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-3 bg-black text-white text-xs uppercase tracking-widest font-medium hover:bg-neutral-800"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            /* Products Grid */
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-xs uppercase tracking-widest text-neutral-400">Loading Collection...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
