"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cartContext";
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, ShoppingBag, Truck } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, subtotal } = useCart();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header */}
      <div className="border-b border-[#E5E3DC] pb-6 mb-8 flex items-end justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#0D3D2E] font-semibold block">
            Your Selection
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-neutral-900 mt-1">
            Boutique Shopping Bag
          </h1>
        </div>
        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs text-neutral-500 hover:text-black underline uppercase tracking-wider"
          >
            Clear All
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-24 bg-white border border-[#E5E3DC] p-8 max-w-xl mx-auto">
          <div className="w-16 h-16 bg-[#F7F5EE] rounded-full flex items-center justify-center text-neutral-400 mx-auto mb-4">
            <ShoppingBag size={28} />
          </div>
          <h3 className="font-serif text-2xl text-neutral-900 mb-2">
            Your shopping bag is currently empty
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-6">
            Explore our curated line of architectural corsets, poplin shirts, and artisanal garments.
          </p>
          <Link
            href="/products"
            className="inline-flex px-8 py-3.5 bg-[#0D3D2E] text-white text-xs uppercase tracking-widest font-medium hover:bg-[#08281e]"
          >
            Discover Collection
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Items Table List */}
          <div className="lg:col-span-8 bg-white border border-[#E5E3DC] p-4 sm:p-6 shadow-xs">
            <div className="hidden sm:grid grid-cols-12 text-[11px] uppercase tracking-widest text-neutral-400 font-semibold pb-4 border-b border-[#E5E3DC]">
              <span className="col-span-6">Garment</span>
              <span className="col-span-2 text-center">Quantity</span>
              <span className="col-span-2 text-right">Price</span>
              <span className="col-span-2 text-right">Action</span>
            </div>

            {items.map((item) => (
              <div
                key={item.cartItemId}
                className="flex flex-col sm:grid sm:grid-cols-12 items-start sm:items-center py-6 border-b border-[#EBE8E0] last:border-b-0 gap-4"
              >
                {/* Product info */}
                <div className="sm:col-span-6 flex space-x-4 items-center w-full">
                  <div className="relative w-20 h-26 bg-[#F4F1EA] border border-[#E5E3DC] overflow-hidden shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-serif text-base text-neutral-900 font-medium">
                      {item.name}
                    </h3>
                    <p className="text-[10px] uppercase font-mono text-neutral-500 tracking-wider">
                      CODE: {item.code}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="px-2 py-0.5 bg-[#F4F1EA] text-[10px] font-semibold border border-neutral-300">
                        Size: {item.size}
                      </span>
                      <span className="px-2 py-0.5 bg-[#F4F1EA] text-[10px] font-medium border border-neutral-300">
                        {item.colour}
                      </span>
                      <span className="text-[10px] text-[#0D3D2E] font-medium">1-of-1 Piece</span>
                    </div>
                  </div>
                </div>

                {/* Quantity */}
                <div className="sm:col-span-2 sm:text-center w-full flex justify-between sm:justify-center items-center">
                  <span className="sm:hidden text-xs text-neutral-500">Qty:</span>
                  <div className="flex items-center border border-neutral-300 bg-white">
                    <button
                      onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                      className="px-2.5 py-1 text-neutral-600 hover:bg-neutral-100"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="px-3 text-xs font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                      className="px-2.5 py-1 text-neutral-600 hover:bg-neutral-100"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                {/* Unit Price */}
                <div className="sm:col-span-2 text-right hidden sm:block">
                  <span className="text-sm font-semibold text-neutral-900">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                  {item.quantity > 1 && (
                    <span className="block text-[10px] text-neutral-500">
                      ₹{item.price.toLocaleString("en-IN")} each
                    </span>
                  )}
                </div>

                {/* Action Remove */}
                <div className="sm:col-span-2 text-right flex items-center justify-between sm:justify-end w-full">
                  <span className="sm:hidden text-xs font-semibold">
                    Total: ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                  <button
                    onClick={() => removeItem(item.cartItemId)}
                    className="p-2 text-neutral-400 hover:text-red-600 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Summary Card */}
          <div className="lg:col-span-4">
            <div className="bg-[#FAF9F5] border border-[#E5E3DC] p-6 sm:p-8 space-y-6">
              <h3 className="font-serif text-xl text-neutral-900 pb-3 border-b border-[#E0DCCE]">
                Order Summary
              </h3>

              <div className="space-y-3 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-semibold text-neutral-900">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Express Courier (Kerala & India)</span>
                  <span className="text-[#0D3D2E] font-semibold uppercase tracking-wider text-[11px]">
                    Complimentary (Free)
                  </span>
                </div>
                <div className="pt-3 border-t border-[#E0DCCE] flex justify-between text-base font-semibold text-neutral-900">
                  <span>Total Amount</span>
                  <span className="font-serif text-2xl text-[#0D3D2E]">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Direct Checkout Button */}
              <Link
                href="/checkout"
                className="w-full py-4 bg-[#0D3D2E] hover:bg-[#08281e] text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center space-x-2 transition-all shadow-md active:scale-[0.99] rounded-xs"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} />
              </Link>

              {/* Policy & Trust */}
              <div className="pt-4 border-t border-[#E0DCCE] space-y-3 text-[11px] text-neutral-600">
                <div className="flex items-start space-x-2">
                  <ShieldCheck size={16} className="text-[#0D3D2E] shrink-0 mt-0.5" />
                  <p className="leading-snug">
                    <strong className="text-neutral-900">Auto-Delete Guarantee:</strong> Once your payment completes, these 1-of-1 pieces are instantly removed from the catalog.
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <Truck size={16} className="text-[#0D3D2E] shrink-0 mt-0.5" />
                  <p className="leading-snug">
                    Fast express dispatch across all Kerala districts and Pan-India.
                  </p>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xs">
                  <span className="font-semibold uppercase tracking-wider block text-[10px]">
                    ⚠️ Policy: No Replacement & No Return
                  </span>
                  <span className="text-[10px] leading-tight block mt-0.5">
                    Because every garment is an exclusive 1-of-1 couture design, all purchases are final.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
