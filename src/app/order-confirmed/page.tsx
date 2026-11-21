"use client";

import React, { Suspense, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Sparkles,
  Truck,
  ShieldCheck,
  MapPin,
  Clock,
  ArrowRight,
  Package,
  AlertTriangle,
  Mail,
  ShoppingBag
} from "lucide-react";

function OrderConfirmedContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "TW-ORD-" + Math.floor(1000 + Math.random() * 9000);
  const customerName = searchParams.get("customer") || "Valued Boutique Guest";
  const customerPhone = searchParams.get("phone") || "+91 98765 43210";
  const totalAmount = searchParams.get("total") || "229";

  const [orderDate, setOrderDate] = useState("");

  useEffect(() => {
    const now = new Date();
    setOrderDate(
      now.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
      })
    );
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Celebration Banner */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="w-16 h-16 bg-[#EBF3EF] text-[#0D3D2E] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#C5DDD1] shadow-xs">
            <CheckCircle2 size={36} className="text-[#0D3D2E]" />
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-neutral-900 tracking-tight font-normal">
            Your Order Confirmed
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 mt-2 font-light">
            Your order has been confirmed and will be shipping within the next two days.
          </p>
          <div className="inline-flex items-center space-x-2 mt-4 px-4 py-1.5 bg-[#FAF8F3] border border-[#E5E1D5] rounded-full text-xs font-mono text-neutral-800">
            <span>Order ID: <strong>{orderId}</strong></span>
            <span>·</span>
            <span>Placed on {orderDate || "Today"}</span>
          </div>
        </div>

        {/* 1-of-1 Auto-Delete Confirmation Ribbon */}
        <div className="mb-10 p-4 bg-[#EBF3EF] border border-[#BBDAC9] rounded-xl flex items-center justify-between flex-col sm:flex-row gap-3">
          <div className="flex items-center space-x-3 text-xs text-[#0D3D2E]">
            <Sparkles size={18} className="shrink-0" />
            <span>
              <strong>Garment Auto-Deleted from Catalog:</strong> Your selected 1-of-1 handcrafted piece has been officially reserved and removed from our active boutique inventory.
            </span>
          </div>
          <span className="shrink-0 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 bg-[#0D3D2E] text-white rounded">
            Reserved
          </span>
        </div>

        {/* Main Grid: Details Left, Summary Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Customer, Shipping, Payment, Policy */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Customer & Shipping Info Card */}
            <div className="bg-white border border-[#EBE8E0] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
              
              {/* Customer Info */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-[#0D3D2E] pb-2 border-b border-[#F0EDE6] mb-3">
                  Customer Info
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-neutral-500 block text-[11px]">Full Name</span>
                    <span className="font-semibold text-neutral-900">{customerName}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[11px]">Contact Phone</span>
                    <span className="font-semibold text-neutral-900">{customerPhone}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Method */}
              <div className="pt-2">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-[#0D3D2E] pb-2 border-b border-[#F0EDE6] mb-3">
                  Shipping Method
                </h3>
                <div className="flex items-start space-x-3 text-xs bg-[#FAF9F6] p-4 rounded-xl border border-[#EDE9DF]">
                  <Truck size={20} className="text-[#0D3D2E] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-neutral-900 block">
                      Complimentary Express Delivery (Kerala & India)
                    </span>
                    <span className="text-neutral-500 text-[11px] block mt-0.5 leading-relaxed">
                      Handcrafted and dispatched within 24–48 hours via Delhivery Express or India Post. Estimated delivery: 2–3 business days.
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="pt-2">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-[#0D3D2E] pb-2 border-b border-[#F0EDE6] mb-3">
                  Payment Info
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-neutral-500 block text-[11px]">Payment Method</span>
                    <span className="font-semibold text-neutral-900">Prepaid Online Payment (UPI / QR)</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[11px]">Payment Status</span>
                    <span className="inline-flex items-center px-2 py-0.5 bg-emerald-50 text-emerald-800 font-semibold rounded text-[11px] border border-emerald-200">
                      Payment Received ✓
                    </span>
                  </div>
                </div>
              </div>

              {/* Policy Warning Box */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                <div className="flex items-center space-x-2 font-semibold">
                  <AlertTriangle size={15} className="text-amber-700 shrink-0" />
                  <span>Exclusive 1-of-1 Piece Policy</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-900/90 pl-5">
                  Notice: All garments are exclusive single-piece creations. Due to the unique nature of each couture design, <strong>no replacement or return is accepted</strong>.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                <Link
                  href="/products"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 bg-[#0D3D2E] hover:bg-[#08281e] text-white text-xs uppercase tracking-widest font-medium rounded-full transition-colors shadow-xs"
                >
                  <ShoppingBag size={15} />
                  <span>Continue Shopping</span>
                </Link>

                <Link
                  href={`/track?orderId=${encodeURIComponent(orderId)}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 border border-neutral-300 hover:border-black text-neutral-800 text-xs uppercase tracking-wider font-medium rounded-full transition-colors"
                >
                  <Package size={15} />
                  <span>Track Shipment Status</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary Card */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-[#EBE8E0] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 sticky top-28">
              <h3 className="font-serif text-2xl text-neutral-900 pb-3 border-b border-[#F0EDE6]">
                Order Summary
              </h3>

              <div className="space-y-3 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-neutral-900">₹{totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Express Shipping Fees</span>
                  <span className="text-[#0D3D2E] font-semibold uppercase text-[11px]">
                    FREE (Complimentary)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes</span>
                  <span className="text-neutral-500">Included in price</span>
                </div>
                <div className="pt-3 border-t border-[#EAE6DD] flex justify-between text-base font-semibold text-neutral-900">
                  <span>Total Paid</span>
                  <span className="font-serif text-2xl text-[#0D3D2E]">₹{totalAmount}</span>
                </div>
              </div>

              {/* Atelier Assurance */}
              <div className="pt-4 border-t border-[#F0EDE6] space-y-2.5 text-[11px] text-neutral-500">
                <div className="flex items-center space-x-2 text-neutral-800 font-medium">
                  <ShieldCheck size={16} className="text-[#0D3D2E]" />
                  <span>Handcrafted Quality Guarantee</span>
                </div>
                <p className="leading-relaxed">
                  Carefully packed in signature TERRY WOMEN boutique packaging and dispatched from our atelier.
                </p>
                <div className="pt-2 text-[10px] text-neutral-400">
                  Questions about your order? Email us at <strong className="text-neutral-700">concierge@terrywomen.com</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-2 border-[#0D3D2E] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs uppercase tracking-widest text-neutral-500">
              Loading Order Confirmation...
            </p>
          </div>
        </div>
      }
    >
      <OrderConfirmedContent />
    </Suspense>
  );
}
