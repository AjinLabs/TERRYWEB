"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cartContext";
import WhatsAppCheckoutModal from "@/components/WhatsAppCheckoutModal";
import { Trash2, Plus, Minus, MessageCircle, ArrowRight, ShieldCheck, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, subtotal } = useCart();
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
            className="inline-flex px-8 py-3.5 bg-black text-white text-xs uppercase tracking-widest font-medium hover:bg-neutral-800"
          >
            Discover Collection
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Items List */}
          <div className="lg:col-span-8 space-y-6">
            <div className="hidden sm:grid grid-cols-12 text-[11px] uppercase tracking-widest text-neutral-400 font-semibold pb-3 border-b border-[#E5E3DC]">
              <span className="col-span-6">Garment</span>
              <span className="col-span-2 text-center">Quantity</span>
              <span className="col-span-2 text-right">Price</span>
              <span className="col-span-2 text-right">Subtotal</span>
            </div>

            {items.map((item) => (
              <div
                key={item.cartItemId}
                className="flex flex-col sm:grid sm:grid-cols-12 items-start sm:items-center py-6 border-b border-[#EBE8E0] gap-4"
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
                      {item.code}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="px-2 py-0.5 bg-[#F4F1EA] text-[10px] font-semibold border border-neutral-300">
                        Size: {item.size}
                      </span>
                      <span className="px-2 py-0.5 bg-[#F4F1EA] text-[10px] font-medium border border-neutral-300">
                        {item.colour}
                      </span>
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
                  <span className="text-xs text-neutral-700">
                    ₹{item.price.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Subtotal & Delete */}
                <div className="sm:col-span-2 text-right flex items-center justify-between sm:justify-end space-x-4 w-full">
                  <span className="sm:hidden text-xs text-neutral-500">Total:</span>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-neutral-900 block">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <button
                    onClick={() => removeItem(item.cartItemId)}
                    className="text-neutral-400 hover:text-red-600 transition-colors"
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
            <div className="bg-[#F4F1EA] border border-[#E5E3DC] p-6 sm:p-8 space-y-6">
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
                  <span>Domestic Courier</span>
                  <span className="text-[#0D3D2E] font-medium uppercase tracking-wider text-[11px]">
                    Complimentary
                  </span>
                </div>
                <div className="pt-3 border-t border-[#E0DCCE] flex justify-between text-base font-semibold text-neutral-900">
                  <span>Total Amount</span>
                  <span className="font-serif text-2xl">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setCheckoutModalOpen(true)}
                className="w-full py-4 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center space-x-2 transition-all shadow-md active:scale-[0.99]"
              >
                <MessageCircle size={18} />
                <span>Order via WhatsApp</span>
              </button>

              <div className="pt-4 border-t border-[#E0DCCE] space-y-2 text-[11px] text-neutral-500">
                <div className="flex items-center space-x-2">
                  <ShieldCheck size={14} className="text-[#0D3D2E]" />
                  <span>No payment gateway required</span>
                </div>
                <p className="leading-relaxed">
                  Your WhatsApp will open with your order enquiry. The boutique administrator will check availability and send you our UPI payment QR code directly.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <WhatsAppCheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
      />
    </div>
  );
}
