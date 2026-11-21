"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/lib/cartContext";
import { useAuth } from "@/lib/authContext";
import {
  X,
  CreditCard,
  QrCode,
  Building,
  CheckCircle2,
  ShieldCheck,
  Loader2,
  ArrowRight,
  Smartphone,
  Lock,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function RazorpayModal({ isOpen, onClose }: Props) {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("Kochi");
  const [district, setDistrict] = useState("Ernakulam");
  const [state, setState] = useState("Kerala");
  const [pincode, setPincode] = useState("682036");
  const [activeMethod, setActiveMethod] = useState<"upi" | "card" | "netbanking">("upi");

  // Payment Simulation State
  const [processing, setProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);
  const [error, setError] = useState("");

  // Pre-fill if customer logged in
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      if (user.addresses && user.addresses.length > 0) {
        const addr = user.addresses[0];
        setStreet(addr.street || "");
        setCity(addr.city || "Kochi");
        setDistrict(addr.district || "Ernakulam");
        setState(addr.state || "Kerala");
        setPincode(addr.pincode || "682036");
      }
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    if (!street.trim()) {
      setError("Please enter your delivery street address");
      return;
    }

    setProcessing(true);
    setStatusMessage("Opening Razorpay Secure Gateway...");

    // Simulated 1-second gateway processing for demo
    await new Promise((r) => setTimeout(r, 800));
    setStatusMessage("Authorizing payment via Razorpay UPI...");
    await new Promise((r) => setTimeout(r, 600));

    try {
      const simulatedPaymentId = `pay_rzp_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

      const payload = {
        customerName: name.trim(),
        customerPhone: phone.trim(),
        deliveryAddress: {
          fullName: name.trim(),
          phone: phone.trim(),
          street: street.trim(),
          city: city.trim(),
          district: district.trim(),
          state: state.trim(),
          pincode: pincode.trim(),
        },
        items: items.map((it) => ({
          productId: it.productId,
          productName: it.name,
          productCode: it.code,
          image: it.image,
          size: it.size,
          colour: it.colour,
          quantity: it.quantity,
          price: it.price,
          subtotal: it.price * it.quantity,
        })),
        razorpayPaymentId: simulatedPaymentId,
      };

      const res = await fetch("/api/checkout/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Razorpay payment processing failed");
      }

      setConfirmedOrder(data);
      clearCart();
    } catch (err: any) {
      setError(err.message || "Payment failed");
    } finally {
      setProcessing(false);
      setStatusMessage("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white border border-[#E5E3DC] w-full max-w-lg shadow-2xl rounded-lg overflow-hidden relative animate-fade-in">
        
        {/* Top Razorpay Branded Header */}
        <div className="bg-[#0C2340] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-[#3395FF] flex items-center justify-center font-bold text-white text-base">
              R
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-sm tracking-wide">Razorpay</span>
                <span className="text-[10px] bg-[#3395FF]/30 text-[#85C0FF] px-1.5 py-0.2 rounded font-semibold uppercase">
                  Demo Gateway
                </span>
              </div>
              <p className="text-[11px] text-neutral-300">TERRY WOMEN Luxury Boutique</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase text-neutral-400 block font-medium">Amount to Pay</span>
            <span className="font-serif text-xl sm:text-2xl font-bold text-[#85C0FF]">
              ₹{subtotal.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {!confirmedOrder ? (
          <form onSubmit={handlePayNow} className="p-5 sm:p-6 space-y-4 text-xs">
            {error && (
              <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded">
                {error}
              </div>
            )}

            {/* Selected Unique Garments Notice */}
            <div className="p-3 bg-[#FAF9F5] border border-[#E5E3DC] rounded space-y-1">
              <div className="flex items-center justify-between font-semibold text-neutral-900">
                <span>Unique Garments in Bag ({items.length})</span>
                <span className="text-[#0D3D2E] text-[11px]">1-of-1 Piece</span>
              </div>
              <p className="text-[11px] text-neutral-500">
                Upon payment confirmation, these unique pieces will be automatically deleted from the catalogue so no one else can purchase them.
              </p>
            </div>

            {/* Customer Information */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-neutral-600 mb-1 font-semibold">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full border border-neutral-300 px-3 py-2 rounded focus:outline-none focus:border-[#3395FF]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-neutral-600 mb-1 font-semibold">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile"
                  className="w-full border border-neutral-300 px-3 py-2 rounded focus:outline-none focus:border-[#3395FF]"
                />
              </div>
            </div>

            {/* Delivery Address */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-neutral-600 mb-1 font-semibold">
                Delivery Address *
              </label>
              <input
                type="text"
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="House / Flat / Street address"
                className="w-full border border-neutral-300 px-3 py-2 rounded focus:outline-none focus:border-[#3395FF]"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-neutral-500 mb-1">
                  City
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full border border-neutral-300 px-2 py-1.5 rounded text-[11px]"
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-neutral-500 mb-1">
                  State
                </label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full border border-neutral-300 px-2 py-1.5 rounded text-[11px]"
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-neutral-500 mb-1">
                  PIN Code
                </label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full border border-neutral-300 px-2 py-1.5 rounded text-[11px]"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="pt-2">
              <span className="block text-[10px] uppercase tracking-wider text-neutral-600 mb-2 font-semibold">
                Select Payment Method
              </span>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setActiveMethod("upi")}
                  className={`p-2.5 border rounded text-center flex flex-col items-center justify-center space-y-1 transition-all ${
                    activeMethod === "upi"
                      ? "border-[#3395FF] bg-blue-50 text-[#0C2340] font-semibold ring-1 ring-[#3395FF]"
                      : "border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  <Smartphone size={16} className="text-[#3395FF]" />
                  <span className="text-[11px]">UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMethod("card")}
                  className={`p-2.5 border rounded text-center flex flex-col items-center justify-center space-y-1 transition-all ${
                    activeMethod === "card"
                      ? "border-[#3395FF] bg-blue-50 text-[#0C2340] font-semibold ring-1 ring-[#3395FF]"
                      : "border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  <CreditCard size={16} className="text-[#3395FF]" />
                  <span className="text-[11px]">Cards</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMethod("netbanking")}
                  className={`p-2.5 border rounded text-center flex flex-col items-center justify-center space-y-1 transition-all ${
                    activeMethod === "netbanking"
                      ? "border-[#3395FF] bg-blue-50 text-[#0C2340] font-semibold ring-1 ring-[#3395FF]"
                      : "border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  <Building size={16} className="text-[#3395FF]" />
                  <span className="text-[11px]">Netbanking</span>
                </button>
              </div>
            </div>

            {/* Method Details */}
            {activeMethod === "upi" && (
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded flex items-center justify-between text-neutral-700">
                <div className="flex items-center space-x-2">
                  <QrCode size={18} className="text-neutral-500" />
                  <span>Google Pay, PhonePe, Paytm or UPI ID</span>
                </div>
                <span className="text-[10px] text-green-700 font-semibold bg-green-50 px-1.5 py-0.5 rounded">
                  Fast & Zero Fee
                </span>
              </div>
            )}

            {activeMethod === "card" && (
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded text-neutral-600 text-[11px]">
                Demo Mode: All test Visa, MasterCard, and RuPay cards supported automatically.
              </div>
            )}

            {activeMethod === "netbanking" && (
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded text-neutral-600 text-[11px]">
                Supported: HDFC Bank, SBI, ICICI Bank, Axis Bank, and 50+ other Indian banks.
              </div>
            )}

            {/* Security Badge */}
            <div className="flex items-center justify-center space-x-1.5 text-neutral-400 text-[10px] pt-1">
              <Lock size={12} className="text-green-600" />
              <span>Secured by 256-Bit Razorpay Encryption · RBI Compliant</span>
            </div>

            {/* Pay Button */}
            <button
              type="submit"
              disabled={processing}
              className="w-full py-3.5 bg-[#3395FF] hover:bg-[#2080ea] text-white font-semibold text-xs uppercase tracking-widest rounded flex items-center justify-center space-x-2 transition-all shadow-md active:scale-[0.99] disabled:opacity-50"
            >
              {processing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>{statusMessage || "Processing Payment..."}</span>
                </>
              ) : (
                <>
                  <span>Pay ₹{subtotal.toLocaleString("en-IN")} via Razorpay</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Confirmation Screen */
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={36} />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-[#0D3D2E] font-semibold">
                Payment Confirmed · Razorpay Verified
              </span>
              <h3 className="font-serif text-2xl text-neutral-900 font-bold">
                Order Confirmed!
              </h3>
              <p className="text-xs text-neutral-600 max-w-sm mx-auto">
                Thank you, <strong>{confirmedOrder.order.customerName}</strong>! Your payment of{" "}
                <strong>₹{confirmedOrder.order.totalAmount.toLocaleString("en-IN")}</strong> has been received.
              </p>
            </div>

            <div className="bg-[#FAF9F5] border border-[#E5E3DC] p-4 text-left rounded space-y-2 text-xs">
              <div className="flex justify-between pb-1.5 border-b border-neutral-200">
                <span className="text-neutral-500">Order ID:</span>
                <span className="font-mono font-bold text-neutral-900">{confirmedOrder.orderId}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-neutral-200">
                <span className="text-neutral-500">Razorpay Payment ID:</span>
                <span className="font-mono text-neutral-700">{confirmedOrder.paymentId}</span>
              </div>
              <div className="flex justify-between pt-0.5">
                <span className="text-neutral-500">Inventory Status:</span>
                <span className="text-emerald-800 font-medium bg-emerald-50 px-2 py-0.5 rounded">
                  ⚡ Auto-Deleted from Catalog
                </span>
              </div>
            </div>

            <p className="text-[11px] text-neutral-500">
              Because this was a unique 1-of-1 piece, it has been immediately reserved and removed from the boutique catalog.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={`/track?id=${confirmedOrder.orderId}`}
                onClick={onClose}
                className="px-5 py-2.5 bg-black text-white text-xs uppercase tracking-wider font-semibold rounded hover:bg-neutral-800 flex items-center justify-center space-x-1.5"
              >
                <span>Track Shipment</span>
                <ArrowRight size={14} />
              </Link>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 border border-neutral-300 text-neutral-800 text-xs uppercase tracking-wider font-semibold rounded hover:border-black"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
