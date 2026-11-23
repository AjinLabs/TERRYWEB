"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { useCart } from "@/lib/cartContext";
import { ShoppingBag, Eye, Check } from "lucide-react";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "M");
  const [selectedColour, setSelectedColour] = useState(product.colours[0] || "Black");
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, selectedSize, selectedColour, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  return (
    <div
      className="group relative flex flex-col bg-white border border-[#EBE8E0] hover:border-neutral-400 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with Editorial Aspect Ratio */}
      <Link href={`/products/${product.slug || product.id}`} className="relative aspect-[3/4] overflow-hidden bg-[#F7F5EE] block">
        <Image
          src={product.images[0] || "/images/placeholder.jpg"}
          alt={product.name}
          fill
          loading="lazy"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.isNewArrival && (
            <span className="px-2 py-0.5 bg-neutral-900 text-white text-[9px] font-semibold tracking-widest uppercase">
              NEW
            </span>
          )}
          {product.availability === "Low Stock" && (
            <span className="px-2 py-0.5 bg-amber-700 text-white text-[9px] font-semibold tracking-widest uppercase">
              FEW LEFT
            </span>
          )}
        </div>

        {/* Quick View / Add Floating Overlay on desktop hover */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between gap-2">
          <button
            onClick={handleQuickAdd}
            className="flex-1 py-2.5 bg-white text-black text-[10px] uppercase tracking-widest font-semibold hover:bg-neutral-100 flex items-center justify-center space-x-1.5 shadow-sm transition-transform active:scale-95"
          >
            {addedAnimation ? (
              <>
                <Check size={12} className="text-green-600" />
                <span>ADDED TO BAG</span>
              </>
            ) : (
              <>
                <ShoppingBag size={12} />
                <span>QUICK ADD ({selectedSize})</span>
              </>
            )}
          </button>
        </div>
      </Link>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Category & Code */}
          <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-neutral-400 font-medium mb-1">
            <span>{product.category || "Garment"}</span>
            <span className="font-mono">{product.code}</span>
          </div>

          {/* Title */}
          <Link href={`/products/${product.slug || product.id}`}>
            <h3 className="font-serif text-base text-neutral-900 font-medium tracking-wide group-hover:text-[#0D3D2E] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Single Unique Size Badge */}
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-[10px] font-bold px-2 py-0.5 bg-neutral-900 text-white uppercase tracking-wider">
              Size {product.sizes[0]}
            </span>
            <span className="text-[10px] text-[#0D3D2E] font-medium uppercase tracking-wider">
              1-of-1 Piece
            </span>
          </div>
        </div>

        {/* Price and Action */}
        <div className="mt-4 pt-3 border-t border-[#F2EFE8] flex items-center justify-between">
          <div className="flex items-baseline space-x-2">
            <span className="text-sm font-semibold text-neutral-900">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-neutral-400 line-through">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          <span className="text-[10px] text-neutral-500 uppercase tracking-wider">
            {product.colours[0] || "Curated"}
          </span>
        </div>
      </div>
    </div>
  );
}
