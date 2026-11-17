"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Enquiry, OrderStatus } from "@/types";
import {
  Search,
  Truck,
  Package,
  CheckCircle2,
  Clock,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
  MessageCircle,
  Loader2,
} from "lucide-react";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || "";

  const [queryId, setQueryId] = useState(initialId);
  const [enquiry, setEnquiry] = useState<Enquiry | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const fetchTracking = async (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setError("");
    setSearched(true);

    try {
      const res = await fetch(`/api/enquiries/${encodeURIComponent(id.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Order or enquiry not found");
      }
      setEnquiry(data.enquiry);
    } catch (err: any) {
      setError(err.message || "Unable to locate order");
      setEnquiry(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      fetchTracking(initialId);
    }
  }, [initialId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTracking(queryId);
  };

  const copyAwb = () => {
    if (enquiry?.trackingNumber) {
      navigator.clipboard.writeText(enquiry.trackingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Determine active step index (0 to 4)
  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case "Enquiry Received":
      case "Awaiting Payment":
        return 0;
      case "Payment Received":
      case "Order Confirmed":
        return 1;
      case "Processing":
      case "Packed":
        return 2;
      case "Shipped":
      case "In Transit":
      case "Out for Delivery":
        return 3;
      case "Delivered":
        return 4;
      case "Cancelled":
        return -1;
      default:
        return 0;
    }
  };

  const steps = [
    { title: "Enquiry Received", desc: "Concierge reviewing selection" },
    { title: "Payment Verified", desc: "Manual QR payment confirmed" },
    { title: "Packed & Sealed", desc: "Boutique quality inspection" },
    { title: "In Transit", desc: "Handed to courier partner" },
    { title: "Delivered", desc: "Received by client" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      {/* Editorial Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-[10px] uppercase tracking-widest text-[#0D3D2E] font-semibold block">
          Client Courier Tracker
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-neutral-900 mt-1">
          Track Your Garments
        </h1>
        <p className="text-xs text-neutral-600 mt-2 font-light">
          Enter your unique Enquiry ID (e.g., <code className="bg-neutral-100 px-1.5 py-0.5 font-bold">ENQ-10492</code>) or Order ID to view current dispatch status and courier AWB details.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-12">
        <div className="flex bg-white border border-[#DCDAD2] shadow-sm focus-within:border-black">
          <input
            type="text"
            value={queryId}
            onChange={(e) => setQueryId(e.target.value)}
            placeholder="e.g. ENQ-10492 or TW-ORD-7001"
            className="flex-1 px-4 py-3 text-xs text-neutral-900 focus:outline-none placeholder-neutral-400 font-mono"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-black text-white text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Track"}
          </button>
        </div>
      </form>

      {/* Results Section */}
      {loading && (
        <div className="text-center py-12">
          <Loader2 size={28} className="animate-spin text-neutral-500 mx-auto mb-2" />
          <span className="text-xs text-neutral-500 uppercase tracking-widest">
            Querying Boutique Dispatch Records...
          </span>
        </div>
      )}

      {error && searched && !loading && (
        <div className="bg-white border border-[#E5E3DC] p-8 text-center max-w-md mx-auto">
          <AlertCircle size={32} className="text-amber-600 mx-auto mb-2" />
          <h3 className="font-serif text-xl text-neutral-900">Record Not Found</h3>
          <p className="text-xs text-neutral-600 mt-1 mb-4 leading-relaxed">
            We couldn&apos;t locate an order matching &ldquo;{queryId}&rdquo;. Please verify your ID or contact our concierge directly on WhatsApp.
          </p>
          <a
            href={`https://wa.me/918330889632?text=Hello%20TERRY%20WOMEN,%20I%20am%20inquiring%20about%20my%20order%20status%20for%20reference:%20${queryId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#25D366] text-white text-xs uppercase tracking-wider font-semibold"
          >
            <MessageCircle size={14} />
            <span>Check with Concierge (+91 83308 89632)</span>
          </a>
        </div>
      )}

      {enquiry && !loading && (
        <div className="bg-white border border-[#E5E3DC] shadow-md p-6 sm:p-10 space-y-8 animate-fade-in">
          
          {/* Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#F0ECE1] gap-4">
            <div>
              <div className="flex items-center space-x-3">
                <span className="font-mono text-base font-bold text-neutral-900">
                  {enquiry.orderId || enquiry.id}
                </span>
                <span className="text-xs text-neutral-400 font-mono">
                  Ref: {enquiry.id}
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                Placed on {new Date(enquiry.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} · Recipient: {enquiry.customerName}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded ${
                  enquiry.status === "Delivered"
                    ? "bg-green-100 text-green-800"
                    : enquiry.status === "Shipped" || enquiry.status === "In Transit"
                    ? "bg-blue-100 text-blue-900"
                    : enquiry.status === "Order Confirmed" || enquiry.status === "Payment Received"
                    ? "bg-emerald-100 text-[#0D3D2E]"
                    : "bg-amber-100 text-amber-900"
                }`}
              >
                {enquiry.status}
              </span>
              <span className="px-2.5 py-1 text-[11px] bg-neutral-100 text-neutral-700 font-medium border border-neutral-300">
                Payment: {enquiry.paymentStatus}
              </span>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="py-4">
            <span className="text-[10px] uppercase tracking-widest text-[#0D3D2E] font-semibold block mb-6">
              Fulfilment Progression
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
              {steps.map((st, i) => {
                const currentIdx = getStepIndex(enquiry.status);
                const isPassed = currentIdx >= i;
                const isCurrent = currentIdx === i;

                return (
                  <div key={i} className="flex sm:flex-col items-center sm:items-start space-x-3 sm:space-x-0 relative">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mb-2 transition-all ${
                        isPassed
                          ? "bg-[#0D3D2E] text-white"
                          : "bg-neutral-100 text-neutral-400 border border-neutral-300"
                      }`}
                    >
                      {isPassed ? <Check size={14} /> : i + 1}
                    </div>
                    <div>
                      <h4
                        className={`text-xs font-semibold ${
                          isCurrent
                            ? "text-black underline underline-offset-4"
                            : isPassed
                            ? "text-neutral-900"
                            : "text-neutral-400"
                        }`}
                      >
                        {st.title}
                      </h4>
                      <p className="text-[10px] text-neutral-500 leading-tight mt-0.5">
                        {st.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Courier Dispatch Card */}
          {enquiry.trackingNumber ? (
            <div className="bg-[#F7F5EE] border border-[#E5E3DC] p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-[#0D3D2E] text-white rounded">
                    <Truck size={22} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold block">
                      Dispatched via {enquiry.courierCompany || "Express Courier"}
                    </span>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="font-mono text-base font-bold text-neutral-900">
                        {enquiry.trackingNumber}
                      </span>
                      <button
                        onClick={copyAwb}
                        className="p-1 text-neutral-500 hover:text-black transition-colors"
                        title="Copy tracking number"
                      >
                        {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                      </button>
                    </div>
                    {enquiry.shippingDate && (
                      <span className="text-xs text-neutral-500 block mt-0.5">
                        Shipped Date: {enquiry.shippingDate}
                      </span>
                    )}
                  </div>
                </div>

                {enquiry.trackingUrl && (
                  <a
                    href={enquiry.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs uppercase tracking-widest font-semibold transition-colors"
                  >
                    <span>Track on {enquiry.courierCompany || "Courier"}</span>
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-[#FAF9F5] border border-neutral-200 p-4 text-xs text-neutral-600 flex items-center space-x-3">
              <Clock size={16} className="text-amber-600 shrink-0" />
              <span>
                Courier tracking number will be updated here as soon as the boutique hands your package to Delhivery / India Post.
              </span>
            </div>
          )}

          {/* Garments Breakdown */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-neutral-800 pb-3 border-b border-[#F0ECE1]">
              Garments in This Order ({enquiry.items.length})
            </h4>
            <div className="divide-y divide-[#F0ECE1]">
              {enquiry.items.map((it, idx) => (
                <div key={idx} className="py-4 flex items-center space-x-4">
                  <div className="relative w-16 h-20 bg-[#F4F1EA] border border-neutral-200 overflow-hidden shrink-0">
                    <Image
                      src={it.image}
                      alt={it.productName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-serif text-base text-neutral-900 font-medium">
                      {it.productName}
                    </h5>
                    <p className="text-[10px] text-neutral-400 font-mono uppercase">
                      Code: {it.productCode}
                    </p>
                    <div className="flex items-center space-x-3 text-xs text-neutral-600 mt-1">
                      <span>Size: <strong>{it.size}</strong></span>
                      <span>Colour: <strong>{it.colour}</strong></span>
                      <span>Qty: {it.quantity}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-neutral-900">
                      ₹{it.subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery & Valuation Footer */}
          <div className="pt-4 border-t border-[#F0ECE1] flex flex-col sm:flex-row justify-between text-xs text-neutral-600 gap-4">
            <div>
              {enquiry.deliveryAddress ? (
                <>
                  <span className="font-semibold text-neutral-900 block mb-0.5">Shipping Destination:</span>
                  <p>
                    {enquiry.deliveryAddress.street}, {enquiry.deliveryAddress.city},{" "}
                    {enquiry.deliveryAddress.state} - {enquiry.deliveryAddress.pincode}
                  </p>
                </>
              ) : (
                <span className="italic text-neutral-400">Delivery address shared on WhatsApp</span>
              )}
            </div>
            <div className="sm:text-right">
              <span className="text-neutral-500 uppercase tracking-wider block">Total Order Valuation</span>
              <span className="font-serif text-2xl font-bold text-neutral-900">
                ₹{enquiry.totalAmount.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-xs uppercase tracking-widest text-neutral-400">Loading Order Tracker...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
