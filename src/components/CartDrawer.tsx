"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cartContext";
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, ShoppingBag } from "lucide-react";

export default function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    isCartOpen,
    setIsCartOpen,
    subtotal,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF9F5] border-l border-[#E5E3DC] shadow-2xl flex flex-col animate-slide-left">
          
          {/* Header */}
          <div className="p-6 border-b border-[#E8E6DF] flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#0D3D2E] font-semibold block optical-badge">
                Boutique Bag
              </span>
              <h3 className="font-serif text-2xl text-neutral-900 mt-0.5">
                Shopping Selection ({items.length})
              </h3>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-neutral-500 hover:text-black transition-colors press-scale"
              aria-label="Close cart"
            >
              <X size={20} />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-4">
                  <ShoppingBag size={28} strokeWidth={1.5} />
                </div>
                <h4 className="font-serif text-xl text-neutral-800">Your selection is empty</h4>
                <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                  Explore our curated collection of corsets, blouses, and feminine silhouettes.
                </p>
                <Link
                  href="/products"
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 px-6 py-2.5 bg-black text-white text-xs uppercase tracking-widest font-medium hover:bg-neutral-800"
                >
                  Explore Garments
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.cartItemId}
                  className="flex space-x-4 pb-6 border-b border-[#EAE7DE] last:border-0"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-26 bg-neutral-100 shrink-0 border border-[#E5E3DC] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif text-sm font-semibold text-neutral-900 leading-snug">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.cartItemId)}
                          className="text-neutral-400 hover:text-red-600 transition-colors ml-2 press-scale p-1"
                          title="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p className="text-[10px] text-neutral-500 tracking-wider uppercase mt-0.5">
                        Code: {item.code}
                      </p>
                      
                      <div className="flex items-center space-x-2 mt-2 text-xs text-neutral-700">
                        <span className="inline-flex items-center px-1.5 py-0.5 bg-[#F2EFE8] text-[10px] font-semibold border border-neutral-300">
                          Size: {item.size}
                        </span>
                        <span className="inline-flex items-center px-1.5 py-0.5 bg-[#F2EFE8] text-[10px] font-medium border border-neutral-300">
                          {item.colour}
                        </span>
                        <span className="text-[10px] text-[#0D3D2E] font-medium">1-of-1</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-neutral-300 bg-white rounded-xs">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="p-1 hover:bg-neutral-100 text-neutral-600 press-scale"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-3 text-xs font-semibold text-neutral-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="p-1 hover:bg-neutral-100 text-neutral-600 press-scale"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <span className="text-xs font-semibold text-neutral-900">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                        {item.quantity > 1 && (
                          <span className="block text-[10px] text-neutral-500">
                            ₹{item.price.toLocaleString("en-IN")} each
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Trigger */}
          {items.length > 0 && (
            <div className="p-6 bg-[#F4F2EB] border-t border-[#E5E3DC] space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-neutral-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-neutral-900">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-neutral-600">
                  <span>Shipping (Kerala & India)</span>
                  <span className="text-[#0D3D2E] font-semibold uppercase text-[10px] tracking-wider">
                    Complimentary
                  </span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-neutral-900 pt-2 border-t border-neutral-300">
                  <span>Total Amount</span>
                  <span className="font-serif text-lg">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Primary Direct Checkout Action with Apple press physics */}
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full py-4 bg-[#0D3D2E] hover:bg-[#08281e] text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center space-x-2 transition-all shadow-md press-scale rounded-xs"
              >
                <span>Proceed to Checkout · ₹{subtotal.toLocaleString("en-IN")}</span>
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/cart"
                onClick={() => setIsCartOpen(false)}
                className="block text-center text-xs text-neutral-600 hover:text-black uppercase tracking-wider underline pt-1"
              >
                View Full Selection Bag
              </Link>

              <div className="pt-2 border-t border-neutral-200 text-[10px] text-neutral-500 space-y-1 text-center">
                <p className="flex items-center justify-center space-x-1 font-medium text-neutral-700">
                  <ShieldCheck size={12} className="text-[#0D3D2E]" />
                  <span>100% Secure Online Payment · Fast Express Delivery</span>
                </p>
                <p className="text-amber-800 font-semibold uppercase tracking-wider">
                  ⚠️ Policy: No Replacement & No Return
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
