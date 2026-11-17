export type ProductSize = "M" | "L" | "XL" | "XXL";

export type ProductColor =
  | "Black"
  | "White"
  | "Light Blue"
  | "Dark Blue"
  | "Navy Blue"
  | "Sky Blue"
  | "Yellow"
  | "Red"
  | "Green"
  | "Pink"
  | "Beige"
  | "Brown"
  | "Grey"
  | "Maroon"
  | "Purple"
  | "Orange"
  | "Cream"
  | "Olive"
  | "Lavender"
  | "Wine";

export const ALL_SIZES: ProductSize[] = ["M", "L", "XL", "XXL"];

export const ALL_COLORS: { name: ProductColor; hex: string; border?: boolean }[] = [
  { name: "Black", hex: "#111111" },
  { name: "White", hex: "#FFFFFF", border: true },
  { name: "Light Blue", hex: "#93C5FD" },
  { name: "Dark Blue", hex: "#1D4ED8" },
  { name: "Navy Blue", hex: "#0F172A" },
  { name: "Sky Blue", hex: "#38BDF8" },
  { name: "Yellow", hex: "#FACC15" },
  { name: "Red", hex: "#EF4444" },
  { name: "Green", hex: "#15803D" },
  { name: "Pink", hex: "#F472B6" },
  { name: "Beige", hex: "#D4C3A3" },
  { name: "Brown", hex: "#5C3D2E" },
  { name: "Grey", hex: "#6B7280" },
  { name: "Maroon", hex: "#800000" },
  { name: "Purple", hex: "#7E22CE" },
  { name: "Orange", hex: "#EA580C" },
  { name: "Cream", hex: "#FFFDD0", border: true },
  { name: "Olive", hex: "#556B2F" },
  { name: "Lavender", hex: "#C084FC" },
  { name: "Wine", hex: "#722F37" },
];

export type ProductAvailability = "In Stock" | "Low Stock" | "Made to Order" | "Sold Out";

export interface Product {
  id: string;
  name: string;
  code: string;
  slug: string;
  price: number;
  originalPrice?: number;
  description: string;
  fabric: string;
  fit: string;
  careInstructions?: string;
  availability: ProductAvailability;
  images: string[];
  sizes: ProductSize[];
  colours: ProductColor[];
  category: string;
  isNewArrival?: boolean;
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  userId?: string;
  fullName: string;
  phone: string;
  altPhone?: string;
  street: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault?: boolean;
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  name: string;
  code: string;
  price: number;
  image: string;
  size: ProductSize;
  colour: ProductColor;
  quantity: number;
}

export type OrderStatus =
  | "Enquiry Received"
  | "Awaiting Payment"
  | "Payment Received"
  | "Order Confirmed"
  | "Processing"
  | "Packed"
  | "Shipped"
  | "In Transit"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled";

export type PaymentStatus = "Pending" | "Awaiting Payment" | "Payment Received" | "Verified";

export type CourierCompany = "Delhivery" | "India Post" | "Blue Dart" | "DTDC" | "Other";

export interface EnquiryItem {
  productId: string;
  productName: string;
  productCode: string;
  image: string;
  size: ProductSize;
  colour: ProductColor;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Enquiry {
  id: string; // e.g. ENQ-84920
  orderId?: string; // e.g. TW-ORD-1092
  userId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress?: Address;
  items: EnquiryItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  paymentReference?: string;
  paymentDate?: string;
  courierCompany?: CourierCompany;
  trackingNumber?: string;
  trackingUrl?: string;
  shippingDate?: string;
  estimatedDelivery?: string;
  adminNotes?: string;
  customerNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: "customer" | "admin";
  addresses: Address[];
  createdAt: string;
  updatedAt: string;
}

export interface StoreSettings {
  storeName: string;
  storeTagline: string;
  whatsappNumber: string;
  whatsappCleanNumber: string;
  storeLogo: string;
  upiId: string;
  upiName: string;
  contactEmail: string;
  contactAddress: string;
  announcementBar: string;
  smsOtpProvider: string;
}
