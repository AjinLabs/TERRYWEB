"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { Enquiry, Address, OrderStatus } from "@/types";
import {
  User,
  MapPin,
  Package,
  Plus,
  Trash2,
  ExternalLink,
  Loader2,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  LogOut,
  Edit2,
  X,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CustomerAccountPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout, refreshUser } = useAuth();

  const [activeTab, setActiveTab] = useState<"orders" | "addresses" | "profile">("orders");
  const [orders, setOrders] = useState<Enquiry[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Address Modal State
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addrFullName, setAddrFullName] = useState("");
  const [addrPhone, setAddrPhone] = useState("");
  const [addrAltPhone, setAddrAltPhone] = useState("");
  const [addrStreet, setAddrStreet] = useState("");
  const [addrCity, setAddrCity] = useState("");
  const [addrDistrict, setAddrDistrict] = useState("");
  const [addrState, setAddrState] = useState("Kerala");
  const [addrPincode, setAddrPincode] = useState("");
  const [addrLandmark, setAddrLandmark] = useState("");
  const [addrIsDefault, setAddrIsDefault] = useState(false);
  const [addrSaving, setAddrSaving] = useState(false);
  const [addrError, setAddrError] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Fetch customer orders
  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;
      setLoadingOrders(true);
      try {
        const res = await fetch(`/api/enquiries?phone=${encodeURIComponent(user.phone)}`);
        const data = await res.json();
        if (data.enquiries) {
          setOrders(data.enquiries);
        }
      } catch (err) {
        console.error("Failed to fetch customer orders", err);
      } finally {
        setLoadingOrders(false);
      }
    }
    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 size={30} className="animate-spin text-neutral-500 mb-2" />
        <span className="text-xs uppercase tracking-widest text-neutral-500">
          Loading Client Portal...
        </span>
      </div>
    );
  }

  // Open modal for new address
  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddrFullName(user.name);
    setAddrPhone(user.phone);
    setAddrAltPhone("");
    setAddrStreet("");
    setAddrCity("");
    setAddrDistrict("");
    setAddrState("Kerala");
    setAddrPincode("");
    setAddrLandmark("");
    setAddrIsDefault(user.addresses.length === 0);
    setAddrError("");
    setAddressModalOpen(true);
  };

  // Open modal for editing address
  const handleOpenEditAddress = (addr: Address) => {
    setEditingAddressId(addr.id);
    setAddrFullName(addr.fullName);
    setAddrPhone(addr.phone);
    setAddrAltPhone(addr.altPhone || "");
    setAddrStreet(addr.street);
    setAddrCity(addr.city);
    setAddrDistrict(addr.district);
    setAddrState(addr.state);
    setAddrPincode(addr.pincode);
    setAddrLandmark(addr.landmark || "");
    setAddrIsDefault(Boolean(addr.isDefault));
    setAddrError("");
    setAddressModalOpen(true);
  };

  // Save address (Create or Update)
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddrError("");
    setAddrSaving(true);

    try {
      const payload = {
        fullName: addrFullName,
        phone: addrPhone,
        altPhone: addrAltPhone || undefined,
        street: addrStreet,
        city: addrCity,
        district: addrDistrict,
        state: addrState,
        pincode: addrPincode,
        landmark: addrLandmark || undefined,
        isDefault: addrIsDefault,
      };

      let res;
      if (editingAddressId) {
        res = await fetch("/api/user/addresses", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ addressId: editingAddressId, ...payload }),
        });
      } else {
        res = await fetch("/api/user/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save address");
      }

      await refreshUser();
      setAddressModalOpen(false);
    } catch (err: any) {
      setAddrError(err.message);
    } finally {
      setAddrSaving(false);
    }
  };

  // Delete address
  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm("Are you sure you want to remove this saved address?")) return;
    try {
      await fetch(`/api/user/addresses?id=${addressId}`, { method: "DELETE" });
      await refreshUser();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Top Welcome Banner */}
      <div className="bg-[#F4F1EA] border border-[#E5E3DC] p-6 sm:p-8 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#0D3D2E] font-semibold block">
            Boutique Client Lounge
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-neutral-900 mt-1">
            Welcome, {user.name}
          </h1>
          <p className="text-xs text-neutral-600 mt-1 font-light">
            Contact: +91 {user.phone} · Client ID: {user.id}
          </p>
        </div>

        <button
          onClick={logout}
          className="self-start md:self-auto px-5 py-2.5 bg-white border border-neutral-300 hover:border-black text-xs uppercase tracking-wider font-medium text-neutral-800 flex items-center space-x-2 transition-colors"
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E5E3DC] mb-8 text-xs uppercase tracking-widest font-semibold">
        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-3 mr-8 flex items-center space-x-2 transition-colors ${
            activeTab === "orders"
              ? "border-b-2 border-black text-black"
              : "text-neutral-400 hover:text-black"
          }`}
        >
          <Package size={15} />
          <span>My Orders & Enquiries ({orders.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("addresses")}
          className={`pb-3 mr-8 flex items-center space-x-2 transition-colors ${
            activeTab === "addresses"
              ? "border-b-2 border-black text-black"
              : "text-neutral-400 hover:text-black"
          }`}
        >
          <MapPin size={15} />
          <span>Saved Addresses ({user.addresses?.length || 0})</span>
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`pb-3 flex items-center space-x-2 transition-colors ${
            activeTab === "profile"
              ? "border-b-2 border-black text-black"
              : "text-neutral-400 hover:text-black"
          }`}
        >
          <User size={15} />
          <span>Account Profile</span>
        </button>
      </div>

      {/* 1. ORDERS TAB */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          {loadingOrders ? (
            <div className="py-12 text-center text-xs text-neutral-500">
              <Loader2 size={24} className="animate-spin mx-auto mb-2" />
              Loading your boutique order records...
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 bg-white border border-[#E5E3DC] p-8">
              <Package size={32} className="text-neutral-300 mx-auto mb-3" />
              <h3 className="font-serif text-xl text-neutral-800 mb-1">
                No orders or enquiries placed yet
              </h3>
              <p className="text-xs text-neutral-500 mb-6 max-w-sm mx-auto">
                Any order you place is automatically logged here with real-time status and shipping tracking.
              </p>
              <Link
                href="/products"
                className="px-6 py-2.5 bg-black text-white text-xs uppercase tracking-widest font-medium"
              >
                Browse Collection
              </Link>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-[#E5E3DC] p-6 sm:p-8 space-y-6 hover:border-neutral-400 transition-colors"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F0ECE1] gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-sm font-bold text-neutral-900">
                        {order.orderId || order.id}
                      </span>
                      <span className="text-[11px] text-neutral-400 font-mono">
                        (Ref: {order.id})
                      </span>
                    </div>
                    <span className="text-xs text-neutral-500">
                      Date: {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Status Badge */}
                    <span
                      className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "Shipped" || order.status === "In Transit"
                          ? "bg-blue-100 text-blue-900"
                          : order.status === "Order Confirmed" || order.status === "Payment Received"
                          ? "bg-emerald-100 text-[#0D3D2E]"
                          : "bg-amber-100 text-amber-900"
                      }`}
                    >
                      {order.status}
                    </span>

                    {/* Payment Status Badge */}
                    <span className="px-2.5 py-1 text-[11px] bg-neutral-100 text-neutral-700 font-medium border border-neutral-300">
                      Payment: {order.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Tracking Information Box (If Shipped) */}
                {order.trackingNumber && (
                  <div className="p-4 bg-[#F7F5EE] border border-[#E5E3DC] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-[#0D3D2E] text-white rounded">
                        <Truck size={18} />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold block">
                          Dispatched via {order.courierCompany || "Courier"}
                        </span>
                        <span className="font-mono text-xs font-bold text-neutral-900">
                          AWB / Tracking: {order.trackingNumber}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/track?id=${order.id}`}
                        className="px-3.5 py-1.5 bg-neutral-900 text-white text-xs uppercase tracking-wider font-medium hover:bg-neutral-800"
                      >
                        Track Shipment
                      </Link>
                      {order.trackingUrl && (
                        <a
                          href={order.trackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-neutral-600 hover:text-black"
                          title="Open Courier Website"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Items in Order */}
                <div className="space-y-4">
                  {order.items.map((it, idx) => (
                    <div key={idx} className="flex items-center space-x-4">
                      <div className="relative w-14 h-18 bg-[#F4F1EA] border border-neutral-200 overflow-hidden shrink-0">
                        <Image
                          src={it.image}
                          alt={it.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-serif text-sm font-semibold text-neutral-900">
                          {it.productName}
                        </h4>
                        <div className="flex items-center space-x-3 text-xs text-neutral-600 mt-0.5">
                          <span>Size: <strong>{it.size}</strong></span>
                          <span>•</span>
                          <span>Colour: <strong>{it.colour}</strong></span>
                          <span>•</span>
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

                {/* Total */}
                <div className="pt-3 border-t border-[#F0ECE1] flex justify-between items-center text-xs">
                  <span className="text-neutral-500 uppercase tracking-wider">
                    Total Order Value (Manual QR Payment)
                  </span>
                  <span className="font-serif text-lg font-bold text-neutral-900">
                    ₹{order.totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 2. SAVED ADDRESSES TAB */}
      {activeTab === "addresses" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-xs text-neutral-500">
              Save multiple delivery addresses for fast online checkout.
            </p>
            <button
              onClick={handleOpenAddAddress}
              className="px-4 py-2 bg-black text-white text-xs uppercase tracking-wider font-semibold flex items-center space-x-1.5"
            >
              <Plus size={14} />
              <span>Add New Address</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {user.addresses && user.addresses.length > 0 ? (
              user.addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="bg-white border border-[#E5E3DC] p-6 relative hover:border-black transition-colors"
                >
                  {addr.isDefault && (
                    <span className="absolute top-4 right-4 px-2 py-0.5 bg-[#0D3D2E] text-white text-[9px] font-semibold tracking-widest uppercase">
                      DEFAULT
                    </span>
                  )}
                  <h4 className="font-serif text-lg text-neutral-900 mb-1">
                    {addr.fullName}
                  </h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {addr.street}
                    {addr.landmark ? `, Landmark: ${addr.landmark}` : ""}
                    <br />
                    {addr.city}, {addr.district}, {addr.state} — <strong>{addr.pincode}</strong>
                  </p>
                  <p className="text-xs text-neutral-500 mt-2 font-mono">
                    Phone: +91 {addr.phone} {addr.altPhone ? `| Alt: +91 ${addr.altPhone}` : ""}
                  </p>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center space-x-4">
                    <button
                      onClick={() => handleOpenEditAddress(addr)}
                      className="text-xs text-neutral-700 hover:text-black font-medium flex items-center space-x-1"
                    >
                      <Edit2 size={12} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="text-xs text-red-600 hover:text-red-800 font-medium flex items-center space-x-1"
                    >
                      <Trash2 size={12} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-12 bg-white border border-[#E5E3DC] p-6">
                <MapPin size={28} className="text-neutral-300 mx-auto mb-2" />
                <p className="text-xs text-neutral-600">No saved addresses yet.</p>
                <button
                  onClick={handleOpenAddAddress}
                  className="mt-4 text-xs font-semibold text-[#0D3D2E] underline uppercase tracking-wider"
                >
                  Add Your Delivery Address Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. PROFILE TAB */}
      {activeTab === "profile" && (
        <div className="bg-white border border-[#E5E3DC] p-8 max-w-xl space-y-6">
          <h3 className="font-serif text-2xl text-neutral-900">Personal Details</h3>
          
          <div className="space-y-4 text-xs">
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-neutral-400 font-semibold mb-1">
                Full Name
              </span>
              <p className="font-medium text-neutral-900 text-sm">{user.name}</p>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-neutral-400 font-semibold mb-1">
                Registered Mobile Number
              </span>
              <p className="font-medium text-neutral-900 text-sm font-mono">+91 {user.phone}</p>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-neutral-400 font-semibold mb-1">
                Email Address
              </span>
              <p className="font-medium text-neutral-900 text-sm">{user.email || "Not specified"}</p>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-neutral-400 font-semibold mb-1">
                Account Status
              </span>
              <span className="inline-flex px-2 py-0.5 bg-emerald-100 text-[#0D3D2E] font-medium rounded text-[11px]">
                Active Client
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Address Edit/Add Modal */}
      {addressModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF9F5] border border-[#E5E3DC] w-full max-w-lg p-6 sm:p-8 relative">
            <button
              onClick={() => setAddressModalOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-black"
            >
              <X size={20} />
            </button>

            <h3 className="font-serif text-2xl text-neutral-900 mb-4">
              {editingAddressId ? "Edit Delivery Address" : "Add Delivery Address"}
            </h3>

            {addrError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs">
                {addrError}
              </div>
            )}

            <form onSubmit={handleSaveAddress} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-neutral-600 mb-1">
                    Recipient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={addrFullName}
                    onChange={(e) => setAddrFullName(e.target.value)}
                    className="w-full border border-neutral-300 px-3 py-2 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-neutral-600 mb-1">
                    Primary Mobile *
                  </label>
                  <input
                    type="tel"
                    required
                    value={addrPhone}
                    onChange={(e) => setAddrPhone(e.target.value)}
                    className="w-full border border-neutral-300 px-3 py-2 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-neutral-600 mb-1">
                  Complete House / Flat / Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={addrStreet}
                  onChange={(e) => setAddrStreet(e.target.value)}
                  placeholder="Flat 4B, Emerald Heights, MG Road"
                  className="w-full border border-neutral-300 px-3 py-2 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-neutral-600 mb-1">
                    Town / City *
                  </label>
                  <input
                    type="text"
                    required
                    value={addrCity}
                    onChange={(e) => setAddrCity(e.target.value)}
                    placeholder="Kochi"
                    className="w-full border border-neutral-300 px-3 py-2 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-neutral-600 mb-1">
                    District *
                  </label>
                  <input
                    type="text"
                    required
                    value={addrDistrict}
                    onChange={(e) => setAddrDistrict(e.target.value)}
                    placeholder="Ernakulam"
                    className="w-full border border-neutral-300 px-3 py-2 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-neutral-600 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={addrState}
                    onChange={(e) => setAddrState(e.target.value)}
                    className="w-full border border-neutral-300 px-3 py-2 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-neutral-600 mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={addrPincode}
                    onChange={(e) => setAddrPincode(e.target.value)}
                    placeholder="682016"
                    className="w-full border border-neutral-300 px-3 py-2 bg-white"
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
                    value={addrLandmark}
                    onChange={(e) => setAddrLandmark(e.target.value)}
                    className="w-full border border-neutral-300 px-3 py-2 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-neutral-600 mb-1">
                    Alternate Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={addrAltPhone}
                    onChange={(e) => setAddrAltPhone(e.target.value)}
                    className="w-full border border-neutral-300 px-3 py-2 bg-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center">
                <input
                  type="checkbox"
                  id="isDefaultCheck"
                  checked={addrIsDefault}
                  onChange={(e) => setAddrIsDefault(e.target.checked)}
                  className="rounded border-neutral-300 text-black focus:ring-black mr-2"
                />
                <label htmlFor="isDefaultCheck" className="text-neutral-700 cursor-pointer">
                  Set as default shipping address
                </label>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setAddressModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 hover:border-black uppercase tracking-wider text-[11px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addrSaving}
                  className="px-6 py-2 bg-black text-white uppercase tracking-wider text-[11px] font-semibold hover:bg-neutral-800 disabled:opacity-50"
                >
                  {addrSaving ? "Saving..." : "Save Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
