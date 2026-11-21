"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/lib/authContext";
import {
  Product,
  Enquiry,
  StoreSettings,
  User,
  ProductSize,
  ProductColor,
  OrderStatus,
  PaymentStatus,
  CourierCompany,
  ALL_SIZES,
  ALL_COLORS,
} from "@/types";
import {
  ShieldCheck,
  Package,
  ShoppingBag,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  MessageCircle,
  Truck,
  DollarSign,
  Settings,
  Users,
  Search,
  Check,
  X,
  Upload,
  RefreshCw,
  Eye,
  LogOut,
  AlertCircle,
  ArrowRight,
  Filter,
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout, isAdmin } = useAuth();

  const [activeSection, setActiveSection] = useState<"orders" | "products" | "customers" | "settings">("orders");

  // Data states
  const [orders, setOrders] = useState<Enquiry[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [customers, setCustomers] = useState<User[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Modals & form states
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Product Form
  const [prodName, setProdName] = useState("");
  const [prodCode, setProdCode] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodOriginalPrice, setProdOriginalPrice] = useState("");
  const [prodCategory, setProdCategory] = useState("Corsets & Tops");
  const [prodDescription, setProdDescription] = useState("");
  const [prodFabric, setProdFabric] = useState("");
  const [prodFit, setProdFit] = useState("");
  const [prodAvailability, setProdAvailability] = useState<any>("In Stock");
  const [prodSizes, setProdSizes] = useState<ProductSize[]>(["M", "L", "XL"]);
  const [prodColours, setProdColours] = useState<ProductColor[]>(["Dark Blue", "Black"]);
  const [prodImages, setProdImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Order Details / Edit Modal
  const [selectedOrder, setSelectedOrder] = useState<Enquiry | null>(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [editStatus, setEditStatus] = useState<OrderStatus>("Enquiry Received");
  const [editPaymentStatus, setEditPaymentStatus] = useState<PaymentStatus>("Pending");
  const [editPaymentRef, setEditPaymentRef] = useState("");
  const [editCourier, setEditCourier] = useState<CourierCompany>("Delhivery");
  const [editTrackingNumber, setEditTrackingNumber] = useState("");
  const [editTrackingUrl, setEditTrackingUrl] = useState("");
  const [editAdminNotes, setEditAdminNotes] = useState("");
  const [savingOrder, setSavingOrder] = useState(false);

  // Settings Form
  const [settingsStoreName, setSettingsStoreName] = useState("");
  const [settingsWhatsApp, setSettingsWhatsApp] = useState("");
  const [settingsUpiId, setSettingsUpiId] = useState("");
  const [settingsTagline, setSettingsTagline] = useState("");
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState("");

  // Search & Filter
  const [orderSearch, setOrderSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");

  // Check admin rights
  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== "admin") {
        router.push("/login?tab=login");
      }
    }
  }, [user, authLoading, router]);

  // Load Admin Data
  const loadDashboardData = async () => {
    setLoadingData(true);
    try {
      const [ordRes, prodRes, setRes] = await Promise.all([
        fetch("/api/enquiries"),
        fetch("/api/products"),
        fetch("/api/settings"),
      ]);

      const ordData = await ordRes.json();
      const prodData = await prodRes.json();
      const setData = await setRes.json();

      if (ordData.enquiries) setOrders(ordData.enquiries);
      if (prodData.products) setProducts(prodData.products);
      if (setData.settings) {
        setSettings(setData.settings);
        setSettingsStoreName(setData.settings.storeName);
        setSettingsWhatsApp(setData.settings.whatsappNumber);
        setSettingsUpiId(setData.settings.upiId);
        setSettingsTagline(setData.settings.storeTagline);
      }
    } catch (err) {
      console.error("Failed to load admin dashboard data", err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      loadDashboardData();
    }
  }, [user]);

  if (authLoading || !user || user.role !== "admin") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <ShieldCheck size={36} className="text-[#0D3D2E] animate-pulse mb-3" />
        <span className="text-xs uppercase tracking-widest text-neutral-600 font-semibold">
          Verifying Atelier Administrator Privileges...
        </span>
      </div>
    );
  }

  // Handle open Product Modal
  const openNewProductModal = () => {
    setEditingProduct(null);
    setProdName("");
    setProdCode(`TW-${Math.floor(100 + Math.random() * 900)}`);
    setProdPrice("1850");
    setProdOriginalPrice("2400");
    setProdCategory("Corsets & Tops");
    setProdDescription("");
    setProdFabric("Fine Boutique Cotton Blend");
    setProdFit("Tailored Fit");
    setProdAvailability("In Stock");
    setProdSizes(["M", "L", "XL"]);
    setProdColours(["Dark Blue", "Black"]);
    setProdImages(["/images/products/denim-corset.jpg"]);
    setProductModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setProdName(product.name);
    setProdCode(product.code);
    setProdPrice(product.price.toString());
    setProdOriginalPrice(product.originalPrice ? product.originalPrice.toString() : "");
    setProdCategory(product.category);
    setProdDescription(product.description);
    setProdFabric(product.fabric);
    setProdFit(product.fit);
    setProdAvailability(product.availability);
    setProdSizes(product.sizes);
    setProdColours(product.colours);
    setProdImages(product.images);
    setProductModalOpen(true);
  };

  // Image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.urls) {
        setProdImages((prev) => [...prev, ...data.urls]);
      }
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploadingImage(false);
    }
  };

  // Save Product (Create or Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodPrice || prodImages.length === 0) {
      alert("Please provide Product Name, Price, and at least 1 image");
      return;
    }

    const payload = {
      name: prodName,
      code: prodCode,
      price: Number(prodPrice),
      originalPrice: prodOriginalPrice ? Number(prodOriginalPrice) : undefined,
      category: prodCategory,
      description: prodDescription,
      fabric: prodFabric,
      fit: prodFit,
      availability: prodAvailability,
      sizes: prodSizes,
      colours: prodColours,
      images: prodImages,
    };

    try {
      if (editingProduct) {
        await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      await loadDashboardData();
      setProductModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Stock Out & Auto-Delete (Saves Database Storage)
  const handleStockOutProduct = async (product: Product) => {
    if (
      confirm(
        `Mark "${product.name}" (${product.code}) as Stock Out?\n\nThis will automatically remove the garment and its data from the catalogue to save storage space.`
      )
    ) {
      try {
        await fetch(`/api/products/${product.id}`, { method: "DELETE" });
        await loadDashboardData();
      } catch (err) {
        console.error("Failed to stock out", err);
      }
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product from the boutique?")) return;
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      await loadDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  // Open Order Modal
  const openOrderModal = (ord: Enquiry) => {
    setSelectedOrder(ord);
    setEditStatus(ord.status);
    setEditPaymentStatus(ord.paymentStatus);
    setEditPaymentRef(ord.paymentReference || "");
    setEditCourier(ord.courierCompany || "Delhivery");
    setEditTrackingNumber(ord.trackingNumber || "");
    setEditTrackingUrl(ord.trackingUrl || "");
    setEditAdminNotes(ord.adminNotes || "");
    setOrderModalOpen(true);
  };

  // Save Order Updates
  const handleSaveOrderUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setSavingOrder(true);
    try {
      const payload: Partial<Enquiry> = {
        status: editStatus,
        paymentStatus: editPaymentStatus,
        paymentReference: editPaymentRef,
        courierCompany: editCourier,
        trackingNumber: editTrackingNumber,
        trackingUrl: editTrackingUrl || undefined,
        adminNotes: editAdminNotes,
        ...(editStatus === "Shipped" && !selectedOrder.shippingDate
          ? { shippingDate: new Date().toISOString().split("T")[0] }
          : {}),
        ...(editPaymentStatus === "Payment Received" && !selectedOrder.paymentDate
          ? { paymentDate: new Date().toISOString() }
          : {}),
      };

      const res = await fetch(`/api/enquiries/${selectedOrder.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await loadDashboardData();
        setOrderModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingOrder(false);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaving(true);
    setSettingsSuccess("");

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeName: settingsStoreName,
          whatsappNumber: settingsWhatsApp,
          upiId: settingsUpiId,
          storeTagline: settingsTagline,
        }),
      });

      if (res.ok) {
        setSettingsSuccess("Settings updated successfully!");
        setTimeout(() => setSettingsSuccess(""), 3000);
        await loadDashboardData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSettingsSaving(false);
    }
  };

  // Quick Stats
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "Payment Received" || o.paymentStatus === "Verified")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingEnquiries = orders.filter((o) => o.status === "Enquiry Received").length;
  const inTransitCount = orders.filter((o) => o.status === "Shipped" || o.status === "In Transit").length;

  return (
    <div className="min-h-screen bg-[#F5F4EE] pb-24">
      {/* Top Admin Bar */}
      <div className="bg-[#141413] text-white border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-neutral-700">
              <Image src="/images/logo.jpg" alt="TERRY WOMEN" fill className="object-cover" />
            </div>
            <div>
              <span className="font-serif text-lg tracking-widest uppercase font-bold block leading-none">
                TERRY WOMEN
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#C5A880] font-semibold">
                Store Administrator Portal
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={loadDashboardData}
              className="p-2 text-neutral-400 hover:text-white transition-colors"
              title="Refresh Data"
            >
              <RefreshCw size={16} />
            </button>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-neutral-300 hover:text-white inline-flex items-center space-x-1 uppercase tracking-wider"
            >
              <span>View Storefront</span>
              <ExternalLink size={12} />
            </a>
            <button
              onClick={logout}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-200 uppercase tracking-wider font-semibold rounded flex items-center space-x-1"
            >
              <LogOut size={12} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Admin Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Metric Cards Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 border border-[#E5E3DC]">
            <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold block">
              Total Enquiries / Orders
            </span>
            <span className="font-serif text-3xl font-bold text-neutral-900 mt-1 block">
              {orders.length}
            </span>
            <span className="text-[11px] text-[#0D3D2E] font-medium mt-1 block">
              Boutique Online Orders
            </span>
          </div>

          <div className="bg-white p-5 border border-[#E5E3DC]">
            <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold block">
              Pending Review
            </span>
            <span className="font-serif text-3xl font-bold text-amber-700 mt-1 block">
              {pendingEnquiries}
            </span>
            <span className="text-[11px] text-neutral-500 mt-1 block">
              Awaiting stock confirmation
            </span>
          </div>

          <div className="bg-white p-5 border border-[#E5E3DC]">
            <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold block">
              Live Shipments
            </span>
            <span className="font-serif text-3xl font-bold text-blue-800 mt-1 block">
              {inTransitCount}
            </span>
            <span className="text-[11px] text-neutral-500 mt-1 block">
              Delhivery & India Post
            </span>
          </div>

          <div className="bg-white p-5 border border-[#E5E3DC]">
            <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold block">
              Confirmed Revenue
            </span>
            <span className="font-serif text-3xl font-bold text-[#0D3D2E] mt-1 block">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </span>
            <span className="text-[11px] text-neutral-500 mt-1 block">
              Manual UPI QR payments
            </span>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex border-b border-[#DCDAD2] mb-8 text-xs uppercase tracking-widest font-semibold space-x-8">
          <button
            onClick={() => setActiveSection("orders")}
            className={`pb-3.5 flex items-center space-x-2 transition-colors ${
              activeSection === "orders"
                ? "border-b-2 border-black text-black font-bold"
                : "text-neutral-500 hover:text-black"
            }`}
          >
            <ShoppingBag size={15} />
            <span>Orders & Enquiries ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveSection("products")}
            className={`pb-3.5 flex items-center space-x-2 transition-colors ${
              activeSection === "products"
                ? "border-b-2 border-black text-black font-bold"
                : "text-neutral-500 hover:text-black"
            }`}
          >
            <Package size={15} />
            <span>Garment Catalogue ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveSection("settings")}
            className={`pb-3.5 flex items-center space-x-2 transition-colors ${
              activeSection === "settings"
                ? "border-b-2 border-black text-black font-bold"
                : "text-neutral-500 hover:text-black"
            }`}
          >
            <Settings size={15} />
            <span>Store & Payment Settings</span>
          </button>
        </div>

        {/* SECTION 1: ORDERS & ENQUIRIES */}
        {activeSection === "orders" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Filter by Enquiry ID, customer name, phone, or AWB..."
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#DCDAD2] text-xs focus:outline-none focus:border-black"
                />
              </div>

              <div className="text-xs text-neutral-500">
                Click any enquiry to verify payment, assign tracking AWB, or update status.
              </div>
            </div>

            <div className="bg-white border border-[#E5E3DC] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF9F5] border-b border-[#E5E3DC] text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">
                    <tr>
                      <th className="p-4">Enquiry / Order ID</th>
                      <th className="p-4">Customer Details</th>
                      <th className="p-4">Garments Ordered</th>
                      <th className="p-4">Valuation</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4">Order Status</th>
                      <th className="p-4">Shipping Tracking</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0ECE1]">
                    {orders
                      .filter((o) => {
                        if (!orderSearch.trim()) return true;
                        const q = orderSearch.toLowerCase();
                        return (
                          o.id.toLowerCase().includes(q) ||
                          (o.orderId && o.orderId.toLowerCase().includes(q)) ||
                          o.customerName.toLowerCase().includes(q) ||
                          o.customerPhone.includes(q) ||
                          (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q))
                        );
                      })
                      .map((ord) => (
                        <tr key={ord.id} className="hover:bg-[#FAF9F5] transition-colors">
                          <td className="p-4 font-mono font-bold text-neutral-900">
                            <div>{ord.orderId || ord.id}</div>
                            <span className="text-[10px] text-neutral-400 block font-normal">
                              {ord.id}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-neutral-900 block">
                              {ord.customerName}
                            </span>
                            <a
                              href={`https://wa.me/${ord.customerPhone.replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-[#0D3D2E] hover:underline flex items-center space-x-1 mt-0.5"
                            >
                              <MessageCircle size={12} />
                              <span>+91 {ord.customerPhone}</span>
                            </a>
                            {ord.deliveryAddress && (
                              <span className="text-[10px] text-neutral-400 block truncate max-w-xs mt-0.5">
                                {ord.deliveryAddress.city}, {ord.deliveryAddress.state}
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="space-y-1 max-w-xs">
                              {ord.items.map((it, idx) => (
                                <div key={idx} className="text-[11px] text-neutral-700 truncate">
                                  <strong>{it.quantity}x</strong> {it.productName} ({it.size}/{it.colour})
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="p-4 font-serif font-bold text-neutral-900 text-sm">
                            ₹{ord.totalAmount.toLocaleString("en-IN")}
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-0.5 text-[10px] font-semibold uppercase rounded ${
                                ord.paymentStatus === "Payment Received" || ord.paymentStatus === "Verified"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {ord.paymentStatus}
                            </span>
                            {ord.paymentReference && (
                              <span className="text-[10px] text-neutral-400 block font-mono mt-0.5">
                                Ref: {ord.paymentReference}
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-1 text-[11px] font-semibold uppercase rounded inline-block ${
                                ord.status === "Delivered"
                                  ? "bg-green-100 text-green-900"
                                  : ord.status === "Shipped" || ord.status === "In Transit"
                                  ? "bg-blue-100 text-blue-900"
                                  : ord.status === "Order Confirmed"
                                  ? "bg-emerald-100 text-emerald-900"
                                  : "bg-amber-100 text-amber-900"
                              }`}
                            >
                              {ord.status}
                            </span>
                          </td>
                          <td className="p-4 font-mono text-[11px]">
                            {ord.trackingNumber ? (
                              <div>
                                <span className="font-bold text-neutral-900 block">
                                  {ord.courierCompany}: {ord.trackingNumber}
                                </span>
                                {ord.trackingUrl && (
                                  <a
                                    href={ord.trackingUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[10px] text-blue-600 hover:underline"
                                  >
                                    Live Courier Link
                                  </a>
                                )}
                              </div>
                            ) : (
                              <span className="text-neutral-400 italic">Not Shipped</span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => openOrderModal(ord)}
                              className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-[11px] uppercase tracking-wider font-semibold"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: PRODUCTS CATALOGUE */}
        {activeSection === "products" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Filter garments by name, code, or category..."
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#DCDAD2] text-xs focus:outline-none focus:border-black"
                />
              </div>

              <button
                onClick={openNewProductModal}
                className="px-4 py-2 bg-black hover:bg-neutral-800 text-white text-xs uppercase tracking-widest font-semibold flex items-center space-x-1.5 self-start sm:self-auto"
              >
                <Plus size={15} />
                <span>Add New Garment</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products
                .filter((p) => {
                  if (!productSearch.trim()) return true;
                  const q = productSearch.toLowerCase();
                  return (
                    p.name.toLowerCase().includes(q) ||
                    p.code.toLowerCase().includes(q) ||
                    p.category.toLowerCase().includes(q)
                  );
                })
                .map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-white border border-[#E5E3DC] p-4 flex flex-col justify-between hover:border-black transition-colors"
                  >
                    <div>
                      <div className="relative aspect-[3/4] bg-[#F7F5EE] border border-[#EBE8E0] overflow-hidden mb-3">
                        <Image
                          src={prod.images[0] || "/images/placeholder.jpg"}
                          alt={prod.name}
                          fill
                          className="object-cover"
                        />
                        <span className="absolute top-2 right-2 px-2 py-0.5 bg-black/80 text-white text-[9px] uppercase tracking-wider font-semibold">
                          {prod.availability}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-neutral-400">
                        <span>{prod.category}</span>
                        <span className="font-mono">{prod.code}</span>
                      </div>

                      <h4 className="font-serif text-base font-semibold text-neutral-900 mt-1 line-clamp-1">
                        {prod.name}
                      </h4>

                      <div className="mt-1 flex items-baseline space-x-2">
                        <span className="font-semibold text-neutral-900">
                          ₹{prod.price.toLocaleString("en-IN")}
                        </span>
                        {prod.originalPrice && (
                          <span className="text-xs text-neutral-400 line-through">
                            ₹{prod.originalPrice.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1 mt-2">
                        {prod.sizes.map((s) => (
                          <span key={s} className="px-1.5 py-0.5 bg-neutral-100 text-[9px] font-semibold border">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-[#F0ECE1] space-y-2">
                      <button
                        onClick={() => handleStockOutProduct(prod)}
                        className="w-full py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-[10px] uppercase tracking-wider font-semibold flex items-center justify-center space-x-1 transition-colors"
                        title="Mark Stock Out and auto-delete to save database storage"
                      >
                        <span>⚡ Mark Stock Out (Auto-Delete)</span>
                      </button>

                      <div className="flex items-center justify-between pt-1">
                        <button
                          onClick={() => openEditProductModal(prod)}
                          className="text-xs text-neutral-700 hover:text-black font-medium flex items-center space-x-1"
                        >
                          <Edit size={13} />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="text-xs text-red-600 hover:text-red-800 font-medium flex items-center space-x-1"
                        >
                          <Trash2 size={13} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* SECTION 3: STORE & WHATSAPP SETTINGS */}
        {activeSection === "settings" && (
          <div className="max-w-2xl bg-white border border-[#E5E3DC] p-8 shadow-sm">
            <h3 className="font-serif text-2xl text-neutral-900 mb-1">
              Boutique Store & Payment Configuration
            </h3>
            <p className="text-xs text-neutral-500 mb-6">
              Configure boutique store identity, concierge support contact, and UPI payment details.
            </p>

            {settingsSuccess && (
              <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-800 text-xs flex items-center space-x-2">
                <Check size={16} />
                <span>{settingsSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-700 font-semibold mb-1">
                  Store Name
                </label>
                <input
                  type="text"
                  required
                  value={settingsStoreName}
                  onChange={(e) => setSettingsStoreName(e.target.value)}
                  className="w-full border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-700 font-semibold mb-1">
                  Concierge Support Phone Number *
                </label>
                <input
                  type="text"
                  required
                  value={settingsWhatsApp}
                  onChange={(e) => setSettingsWhatsApp(e.target.value)}
                  placeholder="+91 83308 89632"
                  className="w-full border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black font-mono font-bold"
                />
                <span className="text-[10px] text-neutral-500 mt-1 block">
                  Official boutique contact phone number.
                </span>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-700 font-semibold mb-1">
                  Store UPI ID (For Manual Payment QR Code)
                </label>
                <input
                  type="text"
                  value={settingsUpiId}
                  onChange={(e) => setSettingsUpiId(e.target.value)}
                  placeholder="e.g. 8330889632@okaxis"
                  className="w-full border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-700 font-semibold mb-1">
                  Boutique Editorial Tagline
                </label>
                <input
                  type="text"
                  value={settingsTagline}
                  onChange={(e) => setSettingsTagline(e.target.value)}
                  className="w-full border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={settingsSaving}
                  className="px-6 py-3 bg-black hover:bg-neutral-800 text-white text-xs uppercase tracking-widest font-semibold flex items-center space-x-2 disabled:opacity-50"
                >
                  {settingsSaving ? (
                    <span>Saving Settings...</span>
                  ) : (
                    <span>Save Store Settings</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* MODAL: ADD / EDIT PRODUCT */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FAF9F5] border border-[#E5E3DC] w-full max-w-2xl p-6 sm:p-8 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setProductModalOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-black"
            >
              <X size={20} />
            </button>

            <h3 className="font-serif text-2xl text-neutral-900 mb-4">
              {editingProduct ? "Edit Boutique Garment" : "Add New Garment to Collection"}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-neutral-600 mb-1">
                    Garment Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    placeholder="e.g. Sculpted Denim Corset Bodice"
                    className="w-full border border-neutral-300 px-3 py-2 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-neutral-600 mb-1">
                    Product Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={prodCode}
                    onChange={(e) => setProdCode(e.target.value)}
                    placeholder="e.g. TW-CT01"
                    className="w-full border border-neutral-300 px-3 py-2 bg-white font-mono uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-neutral-600 mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    placeholder="1850"
                    className="w-full border border-neutral-300 px-3 py-2 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-neutral-600 mb-1">
                    Original Price (₹) (Optional)
                  </label>
                  <input
                    type="number"
                    value={prodOriginalPrice}
                    onChange={(e) => setProdOriginalPrice(e.target.value)}
                    placeholder="2450"
                    className="w-full border border-neutral-300 px-3 py-2 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-neutral-600 mb-1">
                    Category *
                  </label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full border border-neutral-300 px-3 py-2 bg-white font-medium"
                  >
                    <option value="Corsets & Tops">Corsets & Tops</option>
                    <option value="Blouses & Shirts">Blouses & Shirts</option>
                    <option value="Dresses & Tunics">Dresses & Tunics</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-neutral-600 mb-1">
                  Availability
                </label>
                <select
                  value={prodAvailability}
                  onChange={(e) => setProdAvailability(e.target.value)}
                  className="w-full border border-neutral-300 px-3 py-2 bg-white font-medium"
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Made to Order">Made to Order</option>
                  <option value="Sold Out">Sold Out</option>
                </select>
              </div>

              {/* Sizes (M, L, XL, XXL) */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-neutral-600 mb-1.5 font-semibold">
                  Available Sizes (M, L, XL, XXL)
                </label>
                <div className="flex gap-2">
                  {ALL_SIZES.map((sz) => {
                    const isSelected = prodSizes.includes(sz);
                    return (
                      <button
                        type="button"
                        key={sz}
                        onClick={() => {
                          setProdSizes(
                            isSelected ? prodSizes.filter((s) => s !== sz) : [...prodSizes, sz]
                          );
                        }}
                        className={`flex-1 py-2 text-xs font-semibold uppercase border transition-all ${
                          isSelected
                            ? "bg-black text-white border-black"
                            : "bg-white text-neutral-700 border-neutral-300"
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Predefined Colours Selector */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-neutral-600 mb-1.5 font-semibold">
                  Available Colours (Select from 20 predefined colors)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 max-h-36 overflow-y-auto p-2 bg-white border border-neutral-200">
                  {ALL_COLORS.map(({ name, hex, border }) => {
                    const isSelected = prodColours.includes(name);
                    return (
                      <button
                        type="button"
                        key={name}
                        onClick={() => {
                          setProdColours(
                            isSelected
                              ? prodColours.filter((c) => c !== name)
                              : [...prodColours, name]
                          );
                        }}
                        className={`flex items-center space-x-1.5 px-2 py-1 text-[11px] text-left border rounded ${
                          isSelected
                            ? "border-black bg-neutral-100 font-semibold text-black"
                            : "border-neutral-200 text-neutral-700"
                        }`}
                      >
                        <span
                          className={`w-3 h-3 rounded-full shrink-0 ${border ? "border border-neutral-300" : ""}`}
                          style={{ backgroundColor: hex }}
                        />
                        <span className="truncate">{name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Photos Management (2-5 Photos) */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-neutral-600 font-semibold">
                    Garment Photos ({prodImages.length} of 5)
                  </label>
                  <label className="cursor-pointer text-[11px] uppercase tracking-wider font-semibold text-[#0D3D2E] hover:underline flex items-center space-x-1">
                    <Upload size={12} />
                    <span>Upload From Device</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {uploadingImage && (
                  <p className="text-[11px] text-neutral-500 italic">Uploading photos to server...</p>
                )}

                <div className="grid grid-cols-5 gap-2 mt-2">
                  {prodImages.map((img, idx) => (
                    <div key={idx} className="relative aspect-[3/4] bg-neutral-200 border overflow-hidden group">
                      <Image src={img} alt="preview" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => setProdImages(prodImages.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-neutral-600 mb-1">
                  Editorial Description
                </label>
                <textarea
                  rows={2}
                  value={prodDescription}
                  onChange={(e) => setProdDescription(e.target.value)}
                  className="w-full border border-neutral-300 px-3 py-2 bg-white"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 uppercase tracking-wider text-[11px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-black text-white uppercase tracking-wider text-[11px] font-semibold hover:bg-neutral-800"
                >
                  {editingProduct ? "Update Product" : "Publish Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ORDER DETAILS & STATUS UPDATE */}
      {orderModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FAF9F5] border border-[#E5E3DC] w-full max-w-2xl p-6 sm:p-8 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setOrderModalOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-black"
            >
              <X size={20} />
            </button>

            <span className="text-[10px] uppercase tracking-widest text-[#0D3D2E] font-semibold block">
              Manage Client Order
            </span>
            <h3 className="font-serif text-2xl text-neutral-900 mt-0.5 mb-4">
              Enquiry ID: {selectedOrder.id} ({selectedOrder.orderId || "Pending Confirmed"})
            </h3>

            {/* Customer Details Summary */}
            <div className="bg-white p-4 border border-[#E5E3DC] mb-6 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-500">Customer:</span>
                <span className="font-semibold text-neutral-900">{selectedOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Phone:</span>
                <span className="text-[#0D3D2E] font-mono font-bold">
                  {selectedOrder.customerPhone}
                </span>
              </div>
              {selectedOrder.deliveryAddress && (
                <div className="flex justify-between pt-1 border-t border-neutral-100">
                  <span className="text-neutral-500">Delivery Address:</span>
                  <span className="text-right text-neutral-700 max-w-sm">
                    {selectedOrder.deliveryAddress.street}, {selectedOrder.deliveryAddress.city},{" "}
                    {selectedOrder.deliveryAddress.state} - {selectedOrder.deliveryAddress.pincode}
                  </span>
                </div>
              )}
            </div>

            {/* Items Ordered */}
            <div className="mb-6">
              <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold block mb-2">
                Order Items ({selectedOrder.items.length})
              </span>
              <div className="space-y-2 bg-white p-3 border border-[#E5E3DC]">
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-xs py-1 border-b last:border-0 border-neutral-100">
                    <div>
                      <span className="font-semibold text-neutral-900">{it.productName}</span>
                      <span className="text-neutral-500 ml-2">
                        Size: {it.size} | Colour: {it.colour} | Qty: {it.quantity}
                      </span>
                    </div>
                    <span className="font-mono font-semibold">
                      ₹{it.subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
                <div className="pt-2 flex justify-between font-bold text-sm text-neutral-900 border-t">
                  <span>Total Amount</span>
                  <span>₹{selectedOrder.totalAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            {/* Order Management Form */}
            <form onSubmit={handleSaveOrderUpdate} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-neutral-600 mb-1 font-semibold">
                    Fulfilment Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as OrderStatus)}
                    className="w-full border border-neutral-300 px-3 py-2 bg-white font-medium"
                  >
                    <option value="Enquiry Received">Enquiry Received</option>
                    <option value="Awaiting Payment">Awaiting Payment</option>
                    <option value="Payment Received">Payment Received</option>
                    <option value="Order Confirmed">Order Confirmed</option>
                    <option value="Processing">Processing</option>
                    <option value="Packed">Packed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-neutral-600 mb-1 font-semibold">
                    Manual Payment Status
                  </label>
                  <select
                    value={editPaymentStatus}
                    onChange={(e) => setEditPaymentStatus(e.target.value as PaymentStatus)}
                    className="w-full border border-neutral-300 px-3 py-2 bg-white font-medium"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Awaiting Payment">Awaiting Payment</option>
                    <option value="Payment Received">Payment Received</option>
                    <option value="Verified">Verified</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-neutral-600 mb-1">
                  Payment Reference / UTR Number (From WhatsApp screenshot)
                </label>
                <input
                  type="text"
                  value={editPaymentRef}
                  onChange={(e) => setEditPaymentRef(e.target.value)}
                  placeholder="e.g. UPI-UTR-938210492"
                  className="w-full border border-neutral-300 px-3 py-2 bg-white font-mono"
                />
              </div>

              {/* Shipping Details */}
              <div className="pt-2 border-t border-[#E5E3DC]">
                <span className="text-[10px] uppercase tracking-widest text-[#0D3D2E] font-semibold block mb-2">
                  Shipping & Courier Information
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-neutral-600 mb-1">
                      Courier Partner
                    </label>
                    <select
                      value={editCourier}
                      onChange={(e) => setEditCourier(e.target.value as CourierCompany)}
                      className="w-full border border-neutral-300 px-3 py-2 bg-white font-medium"
                    >
                      <option value="Delhivery">Delhivery</option>
                      <option value="India Post">India Post</option>
                      <option value="Blue Dart">Blue Dart</option>
                      <option value="DTDC">DTDC</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-neutral-600 mb-1">
                      Tracking / AWB Number
                    </label>
                    <input
                      type="text"
                      value={editTrackingNumber}
                      onChange={(e) => setEditTrackingNumber(e.target.value)}
                      placeholder="e.g. DEL102938491"
                      className="w-full border border-neutral-300 px-3 py-2 bg-white font-mono"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-[10px] uppercase tracking-wider text-neutral-600 mb-1">
                    Direct Courier Tracking Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={editTrackingUrl}
                    onChange={(e) => setEditTrackingUrl(e.target.value)}
                    placeholder="https://www.delhivery.com/track/package/..."
                    className="w-full border border-neutral-300 px-3 py-2 bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-neutral-600 mb-1">
                  Internal Notes (Visible only to Admin)
                </label>
                <textarea
                  rows={2}
                  value={editAdminNotes}
                  onChange={(e) => setEditAdminNotes(e.target.value)}
                  placeholder="e.g. Verified payment on Google Pay, packaged in luxury gift wrap."
                  className="w-full border border-neutral-300 px-3 py-2 bg-white"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setOrderModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 uppercase tracking-wider text-[11px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingOrder}
                  className="px-6 py-2 bg-black text-white uppercase tracking-wider text-[11px] font-semibold hover:bg-neutral-800 disabled:opacity-50"
                >
                  {savingOrder ? "Saving..." : "Update Order & Tracking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
