"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cartContext";
import { X, Trash2, Plus, Minus, MessageCircle, ArrowRight, CreditCard } from "lucide-react";
import WhatsAppCheckoutModal from "./WhatsAppCheckoutModal";
import RazorpayModal from "./RazorpayModal";

export default function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    isCartOpen,
    setIsCartOpen,
    subtotal,
  } = useCart();

  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [razorpayOpen, setRazorpayOpen] = useState(false);

  if (!isCartOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          onClick={() => setIsCartOpen(false)}
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-md bg-[#FAF9F5] border-l border-[#E5E3DC] shadow-2xl flex flex-col">
            
            {/* Header */}
            <div className="p-6 border-b border-[#E8E6DF] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#0D3D2E] font-semibold block">
                  Boutique Bag
                </span>
                <h3 className="font-serif text-2xl text-neutral-900 mt-0.5">
                  Shopping Selection ({items.length})
                </h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 text-neutral-500 hover:text-black transition-colors"
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
                    <MessageCircle size={28} strokeWidth={1.5} />
                  </div>
                  <h4 className="font-serif text-xl text-neutral-800">Your selection is empty</h4>
                  <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                    Explore our curated collection of corsets, blouses, and feminine silhouettes.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-6 px-6 py-2.5 bg-black text-white text-xs uppercase tracking-widest font-medium hover:bg-neutral-800"
                  >
                    Explore Garments
                  </button>
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
                            className="text-neutral-400 hover:text-red-600 transition-colors ml-2"
                            title="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <p className="text-[10px] text-neutral-500 tracking-wider uppercase mt-0.5">
                          Code: {item.code}
                        </p>
                        
                        <div className="flex items-center space-x-3 mt-2 text-xs text-neutral-700">
                          <span className="inline-flex items-center px-1.5 py-0.5 bg-[#F2EFE8] text-[10px] font-semibold border border-neutral-300">
                            Size: {item.size}
                          </span>
                          <span className="inline-flex items-center px-1.5 py-0.5 bg-[#F2EFE8] text-[10px] font-medium border border-neutral-300">
                            {item.colour}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-neutral-300 bg-white">
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            className="p-1 hover:bg-neutral-100 text-neutral-600"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-3 text-xs font-semibold text-neutral-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="p-1 hover:bg-neutral-100 text-neutral-600"
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

            {/* Footer / WhatsApp Checkout Trigger */}
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
                    <span>Domestic Shipping</span>
                    <span className="text-[#0D3D2E] font-medium uppercase text-[10px] tracking-wider">
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

                <button
                  onClick={() => setRazorpayOpen(true)}
                  className="w-full py-3.5 bg-[#3395FF] hover:bg-[#2080ea] text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center space-x-2 transition-all shadow-md active:scale-[0.99]"
                >
                  <CreditCard size={17} />
                  <span>Pay ₹{subtotal.toLocaleString("en-IN")} via Razorpay (Instant Reserve)</span>
                </button>

                <button
                  onClick={() => setCheckoutModalOpen(true)}
                  className="w-full py-3 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center space-x-2 transition-all shadow-sm active:scale-[0.99]"
                >
                  <MessageCircle size={16} />
                  <span>Order via WhatsApp</span>
                </button>

                <p className="text-[10px] text-center text-neutral-500 leading-tight">
                  Instant Razorpay Demo (Auto-Deletes garment upon purchase) or Direct WhatsApp Concierge
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <WhatsAppCheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
      />

      <RazorpayModal
        isOpen={razorpayOpen}
        onClose={() => setRazorpayOpen(false)}
      />
    </>
  );
}
