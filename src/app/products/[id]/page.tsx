"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Product, ProductSize, ProductColor } from "@/types";
import { useCart } from "@/lib/cartContext";
import {
  ShoppingBag,
  Shield,
  Truck,
  Check,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Loader2,
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const idOrSlug = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [addedNotice, setAddedNotice] = useState(false);
  const [activeTab, setActiveTab] = useState<"fabric" | "fit" | "care" | "delivery">("fabric");

  const { addItem, setIsCartOpen } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${idOrSlug}`);
        const data = await res.json();
        if (data.product) {
          setProduct(data.product);
          if (data.product.images && data.product.images.length > 0) {
            setSelectedImage(data.product.images[0]);
          }
        }
      } catch (err) {
        console.error("Error loading product:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [idOrSlug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-neutral-400" size={32} />
        <span className="text-xs uppercase tracking-widest text-neutral-500 font-light">
          Presenting Atelier Garment...
        </span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h2 className="font-serif text-3xl text-neutral-800 mb-3">Garment Not Found</h2>
        <p className="text-xs text-neutral-500 mb-6">
          This piece may have been acquired and auto-deleted from our boutique catalog.
        </p>
        <Link
          href="/products"
          className="inline-flex px-6 py-3 bg-[#0D3D2E] text-white text-xs uppercase tracking-widest font-medium hover:bg-[#08281e]"
        >
          Explore Active Collection
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, product.sizes[0], product.colours[0], 1);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    addItem(product, product.sizes[0], product.colours[0], 1);
    router.push("/checkout");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-[11px] uppercase tracking-wider text-neutral-400 mb-8">
        <Link href="/" className="hover:text-black">
          Home
        </Link>
        <ChevronRight size={12} />
        <Link href="/products" className="hover:text-black">
          Collection
        </Link>
        <ChevronRight size={12} />
        <span className="text-neutral-800 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left: Product Imagery */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          {/* Thumbnails Column (if more than 1 image) */}
          {product.images.length > 1 && (
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[600px] shrink-0">
              {product.images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`relative w-16 h-22 md:w-20 md:h-26 bg-[#F4F1EA] border transition-all overflow-hidden ${
                    selectedImage === imgUrl
                      ? "border-black ring-1 ring-black"
                      : "border-neutral-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={imgUrl}
                    alt={`${product.name} view ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Large Main Feature Image */}
          <div className="relative flex-1 aspect-[3/4] bg-[#F7F5EE] border border-[#E5E3DC] overflow-hidden">
            <Image
              src={selectedImage || product.images[0] || "/images/placeholder.jpg"}
              alt={product.name}
              fill
              priority
              className="object-cover object-top transition-transform duration-500 hover:scale-105"
            />
            {product.isNewArrival && (
              <span className="absolute top-4 left-4 px-2.5 py-1 bg-black text-white text-[10px] uppercase tracking-widest font-semibold">
                NEW ARRIVAL
              </span>
            )}
          </div>
        </div>

        {/* Right: Garment Details & Order Actions */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between text-xs uppercase tracking-widest text-neutral-400 font-medium mb-1.5">
                <span>{product.category || "Couture Garment"}</span>
                <span className="font-mono text-neutral-500">CODE: {product.code}</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl text-neutral-900 leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Price & Stock */}
            <div className="flex items-center space-x-3 pb-4 border-b border-[#E5E3DC]">
              <span className="text-2xl font-semibold text-neutral-900">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-neutral-400 line-through">
                  ₹{product.originalPrice.toLocaleString("en-IN")}
                </span>
              )}
              <span className="ml-auto inline-flex items-center px-2.5 py-0.5 bg-emerald-50 text-[#0D3D2E] text-[11px] font-semibold border border-emerald-200">
                {product.availability}
              </span>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
              {product.description}
            </p>

            {/* Single Unique Garment Size */}
            <div className="pt-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] uppercase tracking-widest font-semibold text-neutral-800">
                  Exclusive Garment Size
                </span>
                <span className="text-[10px] text-[#0D3D2E] font-semibold uppercase tracking-wider">
                  1-of-1 Piece Only
                </span>
              </div>
              <div className="p-3.5 bg-neutral-900 text-white flex items-center justify-between">
                <div>
                  <span className="text-base font-bold tracking-wider font-mono">SIZE {product.sizes[0]}</span>
                  <span className="block text-[11px] text-neutral-400 mt-0.5">
                    This handcrafted design is uniquely tailored in Size {product.sizes[0]}.
                  </span>
                </div>
                <span className="px-2.5 py-1 bg-neutral-800 text-neutral-200 text-[10px] uppercase tracking-wider font-semibold">
                  {product.colours[0]}
                </span>
              </div>
            </div>

            {/* Actions: Direct Buy Now & Add to Selection Bag */}
            <div className="space-y-2.5 pt-4">
              <button
                onClick={handleBuyNow}
                className="w-full py-4 bg-[#0D3D2E] hover:bg-[#08281e] text-white text-xs uppercase tracking-widest font-semibold transition-all flex items-center justify-center space-x-2 shadow-md active:scale-[0.99] rounded-xs"
              >
                <span>Buy Now · ₹{product.price.toLocaleString("en-IN")}</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={handleAddToCart}
                className="w-full py-3.5 border border-black hover:bg-neutral-100 text-black text-xs uppercase tracking-widest font-medium transition-all flex items-center justify-center space-x-2 shadow-xs rounded-xs"
              >
                {addedNotice ? (
                  <>
                    <Check size={16} className="text-emerald-700" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    <span>Add to Selection Bag</span>
                  </>
                )}
              </button>
            </div>

            {/* Unique 1-of-1 Piece Guarantee & No Return Policy */}
            <div className="space-y-2 pt-2">
              <div className="bg-[#FAF9F5] p-3.5 border border-[#E5E3DC] text-[11px] text-neutral-600 space-y-1">
                <div className="flex items-center space-x-1.5 text-neutral-900 font-semibold">
                  <Sparkles size={13} className="text-[#0D3D2E]" />
                  <span>Auto-Delete Guarantee</span>
                </div>
                <p className="leading-relaxed">
                  When you complete checkout, this unique piece is immediately reserved for you and permanently deleted from our live catalogue.
                </p>
              </div>

              <div className="bg-amber-50 p-3 border border-amber-200 text-amber-900 text-[11px] space-y-0.5 rounded-xs">
                <span className="font-semibold uppercase tracking-wider block text-[10px]">
                  ⚠️ Policy: No Replacement & No Return
                </span>
                <p className="leading-tight text-[10px] text-amber-800">
                  Because every piece in our collection is an exclusive 1-of-1 handcrafted garment, all sales are final.
                </p>
              </div>
            </div>
          </div>

          {/* Accordion Specification Tabs */}
          <div className="border-t border-[#E5E3DC] pt-4">
            <div className="flex border-b border-[#E5E3DC] text-xs uppercase tracking-wider font-medium">
              <button
                onClick={() => setActiveTab("fabric")}
                className={`pb-2.5 mr-6 transition-colors ${
                  activeTab === "fabric"
                    ? "border-b-2 border-black text-black font-semibold"
                    : "text-neutral-500 hover:text-black"
                }`}
              >
                Fabric
              </button>
              <button
                onClick={() => setActiveTab("fit")}
                className={`pb-2.5 mr-6 transition-colors ${
                  activeTab === "fit"
                    ? "border-b-2 border-black text-black font-semibold"
                    : "text-neutral-500 hover:text-black"
                }`}
              >
                Fit & Cut
              </button>
              <button
                onClick={() => setActiveTab("care")}
                className={`pb-2.5 mr-6 transition-colors ${
                  activeTab === "care"
                    ? "border-b-2 border-black text-black font-semibold"
                    : "text-neutral-500 hover:text-black"
                }`}
              >
                Care
              </button>
              <button
                onClick={() => setActiveTab("delivery")}
                className={`pb-2.5 transition-colors ${
                  activeTab === "delivery"
                    ? "border-b-2 border-black text-black font-semibold"
                    : "text-neutral-500 hover:text-black"
                }`}
              >
                Dispatch
              </button>
            </div>

            <div className="py-4 text-xs text-neutral-600 leading-relaxed font-light">
              {activeTab === "fabric" && <p>{product.fabric}</p>}
              {activeTab === "fit" && <p>{product.fit}</p>}
              {activeTab === "care" && (
                <p>{product.careInstructions || "Professional dry clean recommended or cold hand wash inside out."}</p>
              )}
              {activeTab === "delivery" && (
                <p>
                  Handcrafted and dispatched within 24–48 hours from our Kochi atelier via Delhivery Express or India Post with online tracking.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
