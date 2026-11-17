"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Product, ProductSize, ProductColor, ALL_COLORS } from "@/types";
import { useCart } from "@/lib/cartContext";
import WhatsAppCheckoutModal from "@/components/WhatsAppCheckoutModal";
import {
  MessageCircle,
  ShoppingBag,
  Shield,
  Truck,
  RotateCcw,
  Check,
  ChevronRight,
  Sparkles,
  Info,
  Loader2,
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const idOrSlug = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<ProductSize>("M");
  const [selectedColour, setSelectedColour] = useState<ProductColor>("Black");
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);
  const [directCheckoutOpen, setDirectCheckoutOpen] = useState(false);
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
          setSelectedImage(data.product.images[0] || "");
          if (data.product.sizes && data.product.sizes.length > 0) {
            setSelectedSize(data.product.sizes[0]);
          }
          if (data.product.colours && data.product.colours.length > 0) {
            setSelectedColour(data.product.colours[0]);
          }
        }
      } catch (e) {
        console.error("Error loading product:", e);
      } finally {
        setLoading(false);
      }
    }
    if (idOrSlug) {
      fetchProduct();
    }
  }, [idOrSlug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 size={32} className="animate-spin text-neutral-500 mb-3" />
        <span className="text-xs uppercase tracking-widest text-neutral-500 font-medium">
          Loading Garment Details...
        </span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto py-24 px-4 text-center">
        <h2 className="font-serif text-3xl text-neutral-900 mb-2">Garment Not Found</h2>
        <p className="text-xs text-neutral-600 mb-6">
          The requested design may have been archived or retired from our boutique collection.
        </p>
        <Link
          href="/products"
          className="px-6 py-3 bg-black text-white text-xs uppercase tracking-widest font-medium"
        >
          Return to Collection
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, selectedSize, selectedColour, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const handleOrderDirectWhatsApp = () => {
    // Add to cart and open WhatsApp checkout modal immediately
    addItem(product, selectedSize, selectedColour, quantity);
    setDirectCheckoutOpen(true);
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left: Gallery (Thumbnails + Primary Image) */}
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

            {/* Size Selector (M, L, XL, XXL) */}
            <div className="pt-2">
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-[11px] uppercase tracking-widest font-semibold text-neutral-800">
                  Select Size: <span className="font-bold text-black">{selectedSize}</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider text-neutral-500">
                  Standard Boutique Fit
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2.5">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`py-3 text-xs font-semibold uppercase tracking-wider border transition-all ${
                      selectedSize === sz
                        ? "bg-black text-white border-black shadow-sm"
                        : "bg-white text-neutral-800 border-neutral-300 hover:border-black"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Colour Selector */}
            <div className="pt-2">
              <span className="text-[11px] uppercase tracking-widest font-semibold text-neutral-800 block mb-2.5">
                Select Colour: <span className="font-bold text-black">{selectedColour}</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {product.colours.map((colorName) => {
                  const colorDef = ALL_COLORS.find(
                    (c) => c.name.toLowerCase() === colorName.toLowerCase()
                  );
                  const isSelected = selectedColour === colorName;
                  return (
                    <button
                      key={colorName}
                      onClick={() => setSelectedColour(colorName)}
                      className={`flex items-center space-x-2 px-3 py-1.5 text-xs border transition-all ${
                        isSelected
                          ? "border-black bg-neutral-100 font-semibold text-black"
                          : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-neutral-300"
                        style={{ backgroundColor: colorDef?.hex || "#999" }}
                      />
                      <span>{colorName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="pt-2 flex items-center space-x-4">
              <span className="text-[11px] uppercase tracking-widest font-semibold text-neutral-800">
                Quantity
              </span>
              <div className="flex items-center border border-neutral-300 bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100"
                >
                  -
                </button>
                <span className="px-4 text-xs font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions: Add to Bag & Direct WhatsApp Order */}
            <div className="space-y-3 pt-4">
              <button
                onClick={handleAddToCart}
                className="w-full py-4 bg-black hover:bg-neutral-800 text-white text-xs uppercase tracking-widest font-medium transition-all flex items-center justify-center space-x-2 shadow-sm"
              >
                {addedNotice ? (
                  <>
                    <Check size={16} className="text-green-400" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    <span>Add to Selection Bag</span>
                  </>
                )}
              </button>

              <button
                onClick={handleOrderDirectWhatsApp}
                className="w-full py-4 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs uppercase tracking-widest font-semibold transition-all flex items-center justify-center space-x-2 shadow-md"
              >
                <MessageCircle size={18} />
                <span>Order via WhatsApp (+91 83308 89632)</span>
              </button>
            </div>

            {/* Concierge Guarantee Info */}
            <div className="bg-[#F4F1EA] p-4 border border-[#E5E3DC] text-[11px] text-neutral-600 space-y-2">
              <div className="flex items-center space-x-2 text-neutral-900 font-medium">
                <Sparkles size={14} className="text-[#0D3D2E]" />
                <span>Direct WhatsApp Verification</span>
              </div>
              <p className="leading-relaxed">
                When you click Order via WhatsApp, your garment selection, size, and photo links will be pre-formatted for direct verification with our boutique manager.
              </p>
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
                  Handcrafted and dispatched within 24–48 hours from our Kochi atelier via Delhivery Express or India Post. Tracking ID provided directly upon shipment.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <WhatsAppCheckoutModal
        isOpen={directCheckoutOpen}
        onClose={() => setDirectCheckoutOpen(false)}
      />
    </div>
  );
}
