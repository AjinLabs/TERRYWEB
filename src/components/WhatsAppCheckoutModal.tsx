"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/lib/cartContext";
import { useAuth } from "@/lib/authContext";
import { X, MessageCircle, ShieldCheck, CheckCircle2, ArrowRight, Loader2, MapPin } from "lucide-react";
import Link from "next/link";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function WhatsAppCheckoutModal({ isOpen, onClose }: Props) {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("Kerala");
  const [pincode, setPincode] = useState("");
  const [landmark, setLandmark] = useState("");
  const [altPhone, setAltPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [includeAddress, setIncludeAddress] = useState(true);

  const [loading, setLoading] = useState(false);
  const [orderCreated, setOrderCreated] = useState<any>(null);
  const [error, setError] = useState("");

  // Pre-fill user details if logged in
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      if (user.addresses && user.addresses.length > 0) {
        const defaultAddr = user.addresses.find((a) => a.isDefault) || user.addresses[0];
        setStreet(defaultAddr.street || "");
        setCity(defaultAddr.city || "");
        setDistrict(defaultAddr.district || "");
        setState(defaultAddr.state || "Kerala");
        setPincode(defaultAddr.pincode || "");
        setLandmark(defaultAddr.landmark || "");
        setAltPhone(defaultAddr.altPhone || "");
      }
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your full name");
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
      setError("Please enter a valid 10-digit WhatsApp phone number");
      return;
    }

    setLoading(true);

    try {
      const deliveryAddress = includeAddress && street.trim()
        ? {
            fullName: name.trim(),
            phone: phone.trim(),
            altPhone: altPhone.trim() || undefined,
            street: street.trim(),
            city: city.trim(),
            district: district.trim(),
            state: state.trim(),
            pincode: pincode.trim(),
            landmark: landmark.trim() || undefined,
          }
        : undefined;

      const orderPayload = {
        customerName: name.trim(),
        customerPhone: phone.trim(),
        deliveryAddress,
        customerNotes: notes.trim() || undefined,
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
      };

      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit enquiry");
      }

      setOrderCreated(data);
      clearCart();

      // Automatically open WhatsApp in new tab
      if (data.whatsappUrl) {
        window.open(data.whatsappUrl, "_blank", "noopener,noreferrer");
      }
    } catch (err: any) {
      setError(err.message || "Failed to process order via WhatsApp");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF9F5] border border-[#E5E3DC] w-full max-w-xl rounded-none shadow-2xl p-6 sm:p-8 relative max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-black transition-colors"
        >
          <X size={22} />
        </button>

        {!orderCreated ? (
          <div>
            {/* Header */}
            <div className="border-b border-[#E5E3DC] pb-4 mb-6">
              <span className="text-[10px] uppercase tracking-widest text-[#0D3D2E] font-semibold block">
                Boutique WhatsApp Ordering
              </span>
              <h2 className="font-serif text-2xl text-neutral-900 mt-1">
                Complete Your Order Enquiry
              </h2>
              <p className="text-xs text-neutral-600 mt-1">
                We will format your cart into an official boutique enquiry and open WhatsApp directly with our concierge (+91 83308 89632).
              </p>
            </div>

            {/* Cart Quick Summary */}
            <div className="bg-[#F4F2EB] p-4 mb-6 border border-[#E8E6DF]">
              <div className="flex justify-between items-center text-xs font-medium text-neutral-800 mb-2">
                <span>Selected Pieces ({items.length})</span>
                <span className="font-semibold text-neutral-900">Total: ₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.cartItemId} className="flex justify-between text-[11px] text-neutral-600">
                    <span className="truncate pr-2">
                      {item.name} ({item.size} / {item.colour}) × {item.quantity}
                    </span>
                    <span className="font-medium text-neutral-900 shrink-0">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-700 font-medium mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full bg-white border border-[#DCDAD2] px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-700 font-medium mb-1">
                    WhatsApp Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full bg-white border border-[#DCDAD2] px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* Delivery Address Toggle */}
              <div className="pt-2 border-t border-[#E5E3DC]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <MapPin size={15} className="text-[#0D3D2E]" />
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-800">
                      Delivery Address (Optional for initial enquiry)
                    </span>
                  </div>
                  <label className="flex items-center cursor-pointer text-xs text-neutral-600">
                    <input
                      type="checkbox"
                      checked={includeAddress}
                      onChange={(e) => setIncludeAddress(e.target.checked)}
                      className="rounded border-neutral-300 text-black focus:ring-black mr-1.5"
                    />
                    Include Address
                  </label>
                </div>

                {includeAddress && (
                  <div className="space-y-3 bg-white p-4 border border-[#E5E3DC]">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-neutral-600 mb-1">
                        House / Flat / Street Address *
                      </label>
                      <input
                        type="text"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="Flat 4B, Emerald Heights, MG Road"
                        className="w-full border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-black"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-neutral-600 mb-1">
                          Town / City
                        </label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Kochi"
                          className="w-full border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-black"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-neutral-600 mb-1">
                          District
                        </label>
                        <input
                          type="text"
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          placeholder="Ernakulam"
                          className="w-full border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-neutral-600 mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          placeholder="Kerala"
                          className="w-full border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-black"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-neutral-600 mb-1">
                          PIN Code
                        </label>
                        <input
                          type="text"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          placeholder="682016"
                          className="w-full border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-neutral-600 mb-1">
                          Landmark (Optional)
                        </label>
                        <input
                          type="text"
                          value={landmark}
                          onChange={(e) => setLandmark(e.target.value)}
                          placeholder="Near Marine Drive Walkway"
                          className="w-full border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-black"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-neutral-600 mb-1">
                          Alternate Phone (Optional)
                        </label>
                        <input
                          type="tel"
                          value={altPhone}
                          onChange={(e) => setAltPhone(e.target.value)}
                          placeholder="Secondary contact"
                          className="w-full border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-700 font-medium mb-1">
                  Custom Sizing or Order Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Need urgent dispatch, or gift packaging requested..."
                  className="w-full bg-white border border-[#DCDAD2] px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-black"
                />
              </div>

              {/* Trust Badge */}
              <div className="flex items-center space-x-2 text-[11px] text-neutral-500 pt-1">
                <ShieldCheck size={16} className="text-[#0D3D2E] shrink-0" />
                <span>Zero online card risk. The store owner will reply with garment availability and official UPI QR code.</span>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center space-x-2 transition-all shadow-md disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Formatting Enquiry & Opening WhatsApp...</span>
                  </>
                ) : (
                  <>
                    <MessageCircle size={18} />
                    <span>Send Order via WhatsApp (+91 83308 89632)</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Confirmation State */
          <div className="text-center py-6 animate-fade-in">
            <div className="w-16 h-16 bg-[#0D3D2E]/10 text-[#0D3D2E] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={36} />
            </div>

            <span className="text-[10px] uppercase tracking-widest text-[#0D3D2E] font-semibold block">
              Enquiry Dispatched to WhatsApp
            </span>
            <h3 className="font-serif text-3xl text-neutral-900 mt-1 mb-2">
              Thank You, {orderCreated.enquiry.customerName}
            </h3>

            <div className="bg-[#F4F2EB] border border-[#E5E3DC] p-5 my-6 text-left max-w-md mx-auto">
              <div className="flex justify-between items-center pb-3 border-b border-neutral-300">
                <span className="text-xs text-neutral-600 uppercase tracking-wider">Enquiry ID</span>
                <span className="font-mono text-sm font-bold text-neutral-900">{orderCreated.enquiry.id}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-neutral-300 text-xs">
                <span className="text-neutral-600">Total Valuation</span>
                <span className="font-semibold text-neutral-900">₹{orderCreated.enquiry.totalAmount.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between items-center pt-2 text-xs">
                <span className="text-neutral-600">Current Status</span>
                <span className="inline-flex px-2 py-0.5 bg-amber-100 text-amber-900 font-medium rounded text-[11px]">
                  Enquiry Received · Awaiting Concierge Review
                </span>
              </div>
            </div>

            <p className="text-xs text-neutral-600 max-w-md mx-auto leading-relaxed mb-6">
              Your inquiry has been stored in our system and opened on WhatsApp. If WhatsApp did not open automatically, click the green button below:
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {orderCreated.whatsappUrl && (
                <a
                  href={orderCreated.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs uppercase tracking-widest font-semibold inline-flex items-center justify-center space-x-2"
                >
                  <MessageCircle size={16} />
                  <span>Open WhatsApp Again</span>
                </a>
              )}
              <Link
                href={`/track?id=${orderCreated.enquiry.id}`}
                onClick={onClose}
                className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-widest font-semibold inline-flex items-center justify-center space-x-2"
              >
                <span>Track Enquiry Status</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
