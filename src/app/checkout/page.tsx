"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cartContext";
import { useAuth } from "@/lib/authContext";
import {
  MapPin,
  CreditCard,
  ShieldCheck,
  Truck,
  Heart,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  AlertTriangle,
  QrCode,
  Building2,
  Check,
  ChevronRight
} from "lucide-react";

const KERALA_DISTRICTS = [
  "Ernakulam (Kochi)",
  "Thiruvananthapuram",
  "Kozhikode",
  "Thrissur",
  "Kottayam",
  "Kollam",
  "Palakkad",
  "Malappuram",
  "Kannur",
  "Alappuzha",
  "Idukki",
  "Kasaragod",
  "Pathanamthitta",
  "Wayanad"
];

const INDIAN_STATES = [
  "Kerala",
  "Tamil Nadu",
  "Karnataka",
  "Maharashtra",
  "Delhi",
  "Andhra Pradesh",
  "Telangana",
  "Goa",
  "Gujarat",
  "West Bengal",
  "Other"
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();

  // Address Form State
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [state, setState] = useState("Kerala");
  const [district, setDistrict] = useState("Ernakulam (Kochi)");
  const [pinCode, setPinCode] = useState("");
  const [addressSaved, setAddressSaved] = useState(false);

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking">("upi");

  // Interactive Payment / Button Animation State
  // States: "idle" | "processing" | "confirmed"
  const [btnState, setBtnState] = useState<"idle" | "processing" | "confirmed">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Prepopulate if user has profile address
  useEffect(() => {
    if (user) {
      if (user.name && !fullName) setFullName(user.name);
      if (user.phone && !phoneNumber) setPhoneNumber(user.phone);
      if (user.addresses && user.addresses.length > 0) {
        const def = user.addresses.find((a) => a.isDefault) || user.addresses[0];
        setAddressLine1(def.street || "");
        setDistrict(def.city || "Ernakulam (Kochi)");
        setState(def.state || "Kerala");
        setPinCode(def.pincode || "");
      }
    }
  }, [user]);

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phoneNumber.trim() || !addressLine1.trim() || !pinCode.trim()) {
      setErrorMsg("Please fill in all required address fields (*).");
      return;
    }
    setErrorMsg("");
    setAddressSaved(true);
    setTimeout(() => setAddressSaved(false), 2500);
  };

  const handleProceedToPay = async () => {
    // Basic validation
    if (!fullName.trim() || !phoneNumber.trim() || !addressLine1.trim() || !pinCode.trim()) {
      setErrorMsg("Please enter your delivery address details before proceeding.");
      window.scrollTo({ top: 150, behavior: "smooth" });
      return;
    }
    if (items.length === 0) {
      setErrorMsg("Your shopping selection is empty.");
      return;
    }

    setErrorMsg("");
    // Step 1: Start Button Animation -> Processing
    setBtnState("processing");

    try {
      // Simulate payment verification delay (1.2s)
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Call Razorpay demo checkout endpoint
      const fullAddressString = `${addressLine1}${addressLine2 ? ", " + addressLine2 : ""}, ${district}, ${state} - ${pinCode}`;
      const payload = {
        customerName: fullName,
        customerPhone: phoneNumber,
        customerAddress: fullAddressString,
        paymentMethod: paymentMethod === "upi" ? "Online UPI / QR" : paymentMethod === "card" ? "Debit / Credit Card" : "Netbanking",
        paymentId: `pay_demo_${Date.now()}`,
        items: items.map((it) => ({
          productId: it.productId,
          name: it.name,
          price: it.price,
          size: it.size,
          colour: it.colour,
          quantity: it.quantity,
          image: it.image
        })),
        totalAmount: subtotal
      };

      const res = await fetch("/api/checkout/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        // Step 2: Button Animation -> Confirmed / Order Placed (green checkmark pulse)
        setBtnState("confirmed");

        // Clear cart
        clearCart();

        // Redirect after brief victory animation
        setTimeout(() => {
          const orderId = data.orderId || (data.order && data.order.orderId) || "TW-ORD-" + Math.floor(1000 + Math.random() * 9000);
          router.push(`/order-confirmed?orderId=${encodeURIComponent(orderId)}&customer=${encodeURIComponent(fullName)}&phone=${encodeURIComponent(phoneNumber)}&total=${encodeURIComponent(subtotal)}`);
        }, 1400);
      } else {
        setBtnState("idle");
        setErrorMsg(data.error || "Failed to process order. Please try again.");
      }
    } catch (err) {
      console.error("Order error:", err);
      setBtnState("idle");
      setErrorMsg("Connection error. Please try again.");
    }
  };

  if (items.length === 0 && btnState === "idle") {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 bg-[#FAF9F5] border border-[#E5E3DC] rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
          <ShoppingBag size={28} />
        </div>
        <h2 className="font-serif text-3xl text-neutral-900 mb-2">Your selection bag is empty</h2>
        <p className="text-xs text-neutral-500 mb-6">
          Add an exclusive 1-of-1 boutique piece to proceed with your address and payment.
        </p>
        <Link
          href="/products"
          className="inline-flex px-8 py-3 bg-[#0D3D2E] text-white text-xs uppercase tracking-widest font-medium hover:bg-[#08281e]"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-[11px] uppercase tracking-wider text-neutral-400 mb-6">
          <Link href="/" className="hover:text-black">Home</Link>
          <ChevronRight size={12} />
          <Link href="/cart" className="hover:text-black">Bag</Link>
          <ChevronRight size={12} />
          <span className="text-neutral-900 font-semibold">Address & Payment</span>
        </div>

        {/* Page Title & Subtitle Banner */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 bg-[#EBE7DD] text-[#0D3D2E] rounded-full text-xs font-serif italic mb-2">
            <span>Complete your order with ease ♡</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-neutral-900 tracking-tight font-normal">
            Address & Payment
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 mt-2 font-light">
            Enter your delivery address and complete your online payment.
          </p>
        </div>

        {errorMsg && (
          <div className="max-w-4xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 text-red-800 text-xs flex items-center space-x-2 rounded">
            <AlertTriangle size={16} className="text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Main Grid: Left Form (Address + Payment), Right (Bag Summary) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Delivery Address & Payment Method */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* SECTION 1: DELIVERY ADDRESS */}
            <div className="bg-white border border-[#EBE8E0] rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-[#F0EDE6] mb-6">
                <div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-[#EBF3EF] flex items-center justify-center text-[#0D3D2E]">
                      <MapPin size={18} />
                    </div>
                    <h2 className="font-serif text-2xl text-neutral-900">
                      Delivery Address
                    </h2>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1 pl-10 font-light">
                    Please provide your delivery address to get your order to your doorstep. ♡
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <form onSubmit={handleSaveAddress} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Anjali Nair"
                      className="w-full bg-[#FAF9F6] border border-[#DDD9CE] rounded-lg px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-[#0D3D2E] focus:bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full bg-[#FAF9F6] border border-[#DDD9CE] rounded-lg px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-[#0D3D2E] focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    placeholder="House / Flat No, Villa name, Street name"
                    className="w-full bg-[#FAF9F6] border border-[#DDD9CE] rounded-lg px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-[#0D3D2E] focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                    Address Line 2 (Optional)
                  </label>
                  <input
                    type="text"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    placeholder="Landmark, Post office, Area"
                    className="w-full bg-[#FAF9F6] border border-[#DDD9CE] rounded-lg px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-[#0D3D2E] focus:bg-white transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                      State *
                    </label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-[#FAF9F6] border border-[#DDD9CE] rounded-lg px-3 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-[#0D3D2E] focus:bg-white transition-colors"
                    >
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                      District *
                    </label>
                    {state === "Kerala" ? (
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full bg-[#FAF9F6] border border-[#DDD9CE] rounded-lg px-3 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-[#0D3D2E] focus:bg-white transition-colors"
                      >
                        {KERALA_DISTRICTS.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        placeholder="District / City"
                        className="w-full bg-[#FAF9F6] border border-[#DDD9CE] rounded-lg px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-[#0D3D2E] focus:bg-white"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                      Pin Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      placeholder="682031"
                      className="w-full bg-[#FAF9F6] border border-[#DDD9CE] rounded-lg px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-[#0D3D2E] focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="submit"
                    className="inline-flex items-center space-x-2 px-6 py-2.5 bg-[#0D3D2E] hover:bg-[#08281e] text-white text-xs uppercase tracking-wider font-medium rounded-full transition-colors shadow-xs"
                  >
                    <MapPin size={14} />
                    <span>{addressSaved ? "Address Saved ✓" : "Save Address"}</span>
                  </button>

                  {addressSaved && (
                    <span className="text-xs text-emerald-700 font-medium animate-fade-in">
                      Address details locked in!
                    </span>
                  )}
                </div>
              </form>

              {/* Trust Badges */}
              <div className="mt-8 pt-6 border-t border-[#F0EDE6] grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center justify-center p-3 bg-[#FAF8F3] rounded-xl border border-[#EDE9DF]">
                  <ShieldCheck size={20} className="text-[#0D3D2E] mb-1" />
                  <span className="text-xs font-semibold text-neutral-800">Safe & Secure</span>
                  <span className="text-[10px] text-neutral-500">100% Verified Delivery</span>
                </div>
                <div className="flex flex-col items-center justify-center p-3 bg-[#FAF8F3] rounded-xl border border-[#EDE9DF]">
                  <Truck size={20} className="text-[#0D3D2E] mb-1" />
                  <span className="text-xs font-semibold text-neutral-800">Across Kerala</span>
                  <span className="text-[10px] text-neutral-500">Fast Express Dispatch</span>
                </div>
                <div className="flex flex-col items-center justify-center p-3 bg-[#FAF8F3] rounded-xl border border-[#EDE9DF]">
                  <Heart size={20} className="text-[#0D3D2E] mb-1" />
                  <span className="text-xs font-semibold text-neutral-800">Boutique Guarantee</span>
                  <span className="text-[10px] text-neutral-500">Shop with Confidence</span>
                </div>
              </div>
            </div>

            {/* SECTION 2: PAYMENT METHOD */}
            <div className="bg-white border border-[#EBE8E0] rounded-2xl p-6 sm:p-8 shadow-xs">
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-[#F0EDE6] mb-6">
                <div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-[#EBF3EF] flex items-center justify-center text-[#0D3D2E]">
                      <CreditCard size={18} />
                    </div>
                    <h2 className="font-serif text-2xl text-neutral-900">
                      Payment Method
                    </h2>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1 pl-10 font-light">
                    Choose your preferred payment method. ♡
                  </p>
                </div>
              </div>

              {/* Payment Method Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                {/* Option 1: UPI / QR */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("upi")}
                  className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                    paymentMethod === "upi"
                      ? "border-[#0D3D2E] bg-[#F3F8F5] ring-1 ring-[#0D3D2E]"
                      : "border-[#DDD9CE] hover:border-neutral-400 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <QrCode size={22} className={paymentMethod === "upi" ? "text-[#0D3D2E]" : "text-neutral-500"} />
                    {paymentMethod === "upi" && (
                      <CheckCircle2 size={18} className="text-[#0D3D2E]" />
                    )}
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-neutral-900">UPI / QR</span>
                    <span className="text-[10px] text-neutral-500 block leading-tight mt-0.5">
                      GPay, PhonePe, Paytm
                    </span>
                  </div>
                </button>

                {/* Option 2: Cards */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                    paymentMethod === "card"
                      ? "border-[#0D3D2E] bg-[#F3F8F5] ring-1 ring-[#0D3D2E]"
                      : "border-[#DDD9CE] hover:border-neutral-400 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <CreditCard size={22} className={paymentMethod === "card" ? "text-[#0D3D2E]" : "text-neutral-500"} />
                    {paymentMethod === "card" && (
                      <CheckCircle2 size={18} className="text-[#0D3D2E]" />
                    )}
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-neutral-900">Debit / Credit</span>
                    <span className="text-[10px] text-neutral-500 block leading-tight mt-0.5">
                      Visa, MasterCard, RuPay
                    </span>
                  </div>
                </button>

                {/* Option 3: Netbanking */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("netbanking")}
                  className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                    paymentMethod === "netbanking"
                      ? "border-[#0D3D2E] bg-[#F3F8F5] ring-1 ring-[#0D3D2E]"
                      : "border-[#DDD9CE] hover:border-neutral-400 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Building2 size={22} className={paymentMethod === "netbanking" ? "text-[#0D3D2E]" : "text-neutral-500"} />
                    {paymentMethod === "netbanking" && (
                      <CheckCircle2 size={18} className="text-[#0D3D2E]" />
                    )}
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-neutral-900">Netbanking</span>
                    <span className="text-[10px] text-neutral-500 block leading-tight mt-0.5">
                      All Indian Banks
                    </span>
                  </div>
                </button>
              </div>

              {/* Security info */}
              <div className="flex items-center justify-center space-x-1.5 text-xs text-neutral-600 mb-6 bg-[#FAF8F3] py-2 px-4 rounded-lg border border-[#EDE9DF]">
                <Lock size={13} className="text-[#0D3D2E]" />
                <span className="font-medium">Your payment information is 100% encrypted & secure</span>
              </div>

              {/* CRITICAL POLICY NOTICE (As requested by user) */}
              <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl mb-6">
                <div className="flex items-center space-x-2 text-amber-900 font-semibold text-xs uppercase tracking-wider mb-1">
                  <AlertTriangle size={15} className="text-amber-700 shrink-0" />
                  <span>Important Boutique Policy: No Replacement & No Return</span>
                </div>
                <p className="text-xs text-amber-900/90 leading-relaxed font-light pl-6">
                  Every garment in our boutique is an exclusive, handcrafted <strong>1-of-1 piece</strong> with a unique size. Once your order is completed, this item is permanently deleted from our catalog and reserved solely for you. Therefore, <strong>no return or replacement is accepted</strong>.
                </p>
              </div>

              {/* ANIMATED CHECKOUT BUTTON (From Pinterest reference https://pin.it/6PPNMoVFF) */}
              <div>
                <button
                  type="button"
                  onClick={handleProceedToPay}
                  disabled={btnState !== "idle"}
                  className={`w-full py-4 rounded-full text-xs uppercase tracking-widest font-semibold flex items-center justify-center space-x-3 transition-all duration-300 shadow-lg ${
                    btnState === "confirmed"
                      ? "bg-emerald-600 text-white scale-[1.02]"
                      : btnState === "processing"
                      ? "bg-[#0D3D2E] text-white opacity-90 cursor-wait"
                      : "bg-[#0D3D2E] hover:bg-[#08281e] text-white active:scale-[0.99]"
                  }`}
                >
                  {btnState === "idle" && (
                    <>
                      <span>Proceed to Pay ₹{subtotal.toLocaleString("en-IN")}</span>
                      <ArrowRight size={17} />
                    </>
                  )}

                  {btnState === "processing" && (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying & Reserving 1-of-1 Piece...</span>
                    </>
                  )}

                  {btnState === "confirmed" && (
                    <>
                      <CheckCircle2 size={20} className="text-white animate-bounce" />
                      <span>Order Confirmed! Redirecting...</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Bag Items */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-[#EBE8E0] rounded-2xl p-6 sm:p-8 shadow-xs sticky top-28 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EDE6]">
                <h3 className="font-serif text-2xl text-neutral-900">
                  Shopping Bag ({items.length})
                </h3>
                <Link
                  href="/cart"
                  className="text-xs text-[#0D3D2E] hover:underline uppercase tracking-wider font-medium"
                >
                  Edit Bag
                </Link>
              </div>

              {/* Items List */}
              <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.cartItemId} className="flex space-x-3 pb-4 border-b border-[#F2EFE8] last:border-b-0">
                    <div className="relative w-16 h-22 bg-[#FAF8F3] border border-[#E5E3DC] rounded-md overflow-hidden shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif text-sm text-neutral-900 font-semibold leading-snug">
                          {item.name}
                        </h4>
                        <p className="text-[10px] text-neutral-500 font-mono tracking-wider mt-0.5">
                          CODE: {item.code}
                        </p>
                        <div className="flex items-center space-x-2 mt-1.5 text-[10px]">
                          <span className="px-2 py-0.5 bg-[#FAF8F3] border border-neutral-300 rounded font-semibold text-neutral-800">
                            Size: {item.size}
                          </span>
                          <span className="px-2 py-0.5 bg-[#FAF8F3] border border-neutral-300 rounded text-neutral-600">
                            {item.colour}
                          </span>
                          <span className="text-[#0D3D2E] font-medium">1-of-1</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-[11px] text-neutral-500">Qty: {item.quantity}</span>
                        <span className="text-xs font-semibold text-neutral-900">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Financial Calculation */}
              <div className="pt-4 border-t border-[#F0EDE6] space-y-2.5 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-neutral-900">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Express Courier (Kerala & India)</span>
                  <span className="text-[#0D3D2E] font-semibold uppercase tracking-wider text-[11px]">
                    FREE / Complimentary
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span className="text-neutral-500">Included in price</span>
                </div>
                <div className="pt-3 border-t border-[#EAE6DD] flex justify-between text-base font-semibold text-neutral-900">
                  <span>Order Total</span>
                  <span className="font-serif text-2xl text-[#0D3D2E]">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Auto-Delete Assurance Card */}
              <div className="p-3.5 bg-[#FAF8F3] border border-[#E8E4D8] rounded-xl text-[11px] text-neutral-600 space-y-1">
                <div className="flex items-center space-x-1.5 text-neutral-900 font-semibold">
                  <Sparkles size={13} className="text-[#0D3D2E]" />
                  <span>Immediate Auto-Delete Guarantee</span>
                </div>
                <p className="leading-relaxed text-[11px]">
                  Upon payment confirmation, these exact piece(s) are permanently removed from our store so that no other shopper can claim them.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
