import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import {
  Product,
  Enquiry,
  User,
  StoreSettings,
  Address,
  ProductSize,
  ProductColor,
  OrderStatus,
} from "@/types";

interface DatabaseSchema {
  settings: StoreSettings;
  users: (User & { passwordHash: string })[];
  products: Product[];
  enquiries: Enquiry[];
}

function getDbPath(): string {
  if (process.env.VERCEL) {
    return path.join("/tmp", "database.json");
  }
  return path.join(process.cwd(), "data", "database.json");
}

function ensureDirectoryExists(filePath: string) {
  try {
    const dirname = path.dirname(filePath);
    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname, { recursive: true });
    }
  } catch (e) {
    // ignore
  }
}

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: "TERRY WOMEN",
  storeTagline: "Luxury Boutique Fashion & Contemporary Silhouettes",
  whatsappNumber: "+91 83308 89632",
  whatsappCleanNumber: "918330889632",
  storeLogo: "/images/logo.jpg",
  upiId: "8330889632@okaxis",
  upiName: "Terry Women Boutique",
  contactEmail: "concierge@terrywomen.com",
  contactAddress: "Marine Drive Promenade, Kochi, Kerala, India - 682031",
  announcementBar: "COMPLIMENTARY SHIPPING ACROSS INDIA · LUXURY HANDCRAFTED APPAREL · ORDER VIA WHATSAPP",
  smsOtpProvider: "Fast2SMS (Configured in Sandbox / Test Mode: OTP 123456)",
};

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Sculpted Denim Corset Bodice",
    code: "TW-CT01",
    slug: "sculpted-denim-corset-bodice",
    price: 1850,
    originalPrice: 2450,
    description:
      "Engineered with architectural precision, this sculpted denim corset features vertical contoured boning channels, a structural square neckline, and a flattering curved basque hemline. Designed for versatile styling over crisp poplin shirts or standalone as high-fashion statement wear.",
    fabric: "100% Premium Cotton Denim with Subtle Stretch",
    fit: "Tailored Corset Fit with Basque Waist",
    careInstructions: "Dry clean only or delicate cold hand wash inside out",
    availability: "In Stock",
    images: ["/images/products/denim-corset.jpg"],
    sizes: ["M", "L", "XL"],
    colours: ["Dark Blue", "Light Blue", "Navy Blue"],
    category: "Corsets & Tops",
    isNewArrival: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-2",
    name: "Ruched Sweetheart Mocha Corset",
    code: "TW-CT02",
    slug: "ruched-sweetheart-mocha-corset",
    price: 1950,
    originalPrice: 2600,
    description:
      "Sultry ruched mocha corset crafted from ultra-soft stretch mesh with gathered sweetheart neckline and wide draped shoulder straps. An ethereal contouring silhouette inspired by contemporary Paris runways.",
    fabric: "Premium Micro-Mesh & Silk Blend Jersey",
    fit: "Fitted Sweetheart Bodice",
    careInstructions: "Dry clean recommended",
    availability: "In Stock",
    images: ["/images/products/brown-ruched-corset.jpg"],
    sizes: ["M", "L", "XL", "XXL"],
    colours: ["Brown", "Beige", "Black", "Wine"],
    category: "Corsets & Tops",
    isNewArrival: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-3",
    name: "Aristocrat Poplin & Denim Corset Blouse",
    code: "TW-BL03",
    slug: "aristocrat-poplin-denim-corset-blouse",
    price: 2450,
    originalPrice: 3200,
    description:
      "A couture hybrid statement piece marrying a crisp white cotton poplin collared shirt with romantic gathered puff sleeves and an integrated lace-up indigo denim corset overlay.",
    fabric: "100% Crisp Egyptian Cotton Poplin & Washed Denim",
    fit: "Relaxed Shirt with Structured Lace-Up Waist",
    careInstructions: "Gentle machine wash cold or professional dry clean",
    availability: "In Stock",
    images: ["/images/products/white-shirt-denim-corset.jpg"],
    sizes: ["M", "L", "XL"],
    colours: ["White", "Dark Blue"],
    category: "Blouses & Shirts",
    isNewArrival: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-4",
    name: "Peony Meadow Sweetheart Blouse",
    code: "TW-BL04",
    slug: "peony-meadow-sweetheart-blouse",
    price: 1750,
    originalPrice: 2200,
    description:
      "Delicate cream and blush floral peasant blouse featuring a sweetheart cinch front, adjustable romantic drawstring ties, and billowy three-quarter balloon sleeves with soft elastic cuffs.",
    fabric: "Hand-printed Voile Rayon & Organic Cotton",
    fit: "Empire Waist with Cinch Bustier Ties",
    careInstructions: "Hand wash in cold water with mild detergent",
    availability: "In Stock",
    images: ["/images/products/floral-tie-blouse.jpg"],
    sizes: ["M", "L", "XL", "XXL"],
    colours: ["Cream", "Pink", "White"],
    category: "Blouses & Shirts",
    isNewArrival: true,
    isFeatured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-5",
    name: "Bohemian Tassel Embroidered Camisole",
    code: "TW-TP05",
    slug: "bohemian-tassel-embroidered-camisole",
    price: 2100,
    originalPrice: 2800,
    description:
      "Artisan resort camisole adorned with intricate geometric ikat embroidery, plunging V-neckline, dual side cinch cords, and handcrafted purple silk tassels. Finished with subtle mirror sequin accents.",
    fabric: "Raw Textured Linen-Cotton Slub",
    fit: "Flared A-line with Adjustable Side Ties",
    careInstructions: "Dry clean only to protect delicate tassel embroidery",
    availability: "In Stock",
    images: ["/images/products/boho-embroidered-camisole.jpg"],
    sizes: ["M", "L", "XL"],
    colours: ["Cream", "Orange", "Pink", "Purple"],
    category: "Corsets & Tops",
    isNewArrival: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-6",
    name: "Ethereal Chocolate Bell-Sleeve Chiffon Corset",
    code: "TW-TP06",
    slug: "ethereal-chocolate-bell-sleeve-chiffon-corset",
    price: 2650,
    originalPrice: 3400,
    description:
      "Dramatic sheer chocolate chiffon blouse featuring cascading bell flutter sleeves, ruched corset bodice, and delicate drawstring cinch cord. An evening showstopper exuding modern gothic glamour.",
    fabric: "Multi-layered Fluid Sheer Chiffon",
    fit: "Cinched Corset Waist with Dramatic Flared Sleeves",
    careInstructions: "Gentle dry clean only",
    availability: "In Stock",
    images: ["/images/products/sheer-bell-sleeve-corset.jpg"],
    sizes: ["M", "L", "XL", "XXL"],
    colours: ["Brown", "Wine", "Black"],
    category: "Corsets & Tops",
    isNewArrival: false,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-7",
    name: "Atelier Boxy Oversized Utility Shirt",
    code: "TW-SH07",
    slug: "atelier-boxy-oversized-utility-shirt",
    price: 1650,
    originalPrice: 2100,
    description:
      "Minimalist relaxed-fit summer shirt in light sage mint with wide cuffed sleeves, structured flap chest pockets, and clean tonal buttons. Inspired by Japanese architectural minimalism.",
    fabric: "Crisp Washed Poplin & Breathable Linen",
    fit: "Relaxed Boxy Silhouette",
    careInstructions: "Machine wash cold on delicate cycle",
    availability: "In Stock",
    images: ["/images/products/mint-oversized-shirt.jpg"],
    sizes: ["M", "L", "XL", "XXL"],
    colours: ["Olive", "Green", "White", "Beige"],
    category: "Blouses & Shirts",
    isNewArrival: false,
    isFeatured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-8",
    name: "Riviera Striped Pure Linen V-Neck Top",
    code: "TW-TP08",
    slug: "riviera-striped-pure-linen-v-neck-top",
    price: 1790,
    originalPrice: 2300,
    description:
      "Breathable textured woven linen top in coastal azure stripes with a relaxed split mandarin neckline and dolman cap sleeves. Ideal for warm Mediterranean vacations and coastal weekends.",
    fabric: "100% Natural Flax French Linen",
    fit: "Breezy Relaxed Fit",
    careInstructions: "Hand wash or gentle machine wash in cold water",
    availability: "In Stock",
    images: ["/images/products/striped-linen-top.jpg"],
    sizes: ["M", "L", "XL"],
    colours: ["Sky Blue", "Light Blue", "Navy Blue", "White"],
    category: "Corsets & Tops",
    isNewArrival: false,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-9",
    name: "Coral Sorbet Gathered Babydoll Tunic",
    code: "TW-DR09",
    slug: "coral-sorbet-gathered-babydoll-tunic",
    price: 2250,
    originalPrice: 2900,
    description:
      "Romantic tiered babydoll tunic dress in candy stripe cotton featuring a ruffled stand collar, keyhole split neckline, and dramatic pleated balloon sleeves.",
    fabric: "100% Handloom Striped Mulmul Cotton",
    fit: "Voluminous Babydoll Silhouette",
    careInstructions: "Gentle cold hand wash, line dry in shade",
    availability: "In Stock",
    images: ["/images/products/coral-striped-tunic.jpg"],
    sizes: ["M", "L", "XL", "XXL"],
    colours: ["Pink", "Red", "Orange", "White"],
    category: "Dresses & Tunics",
    isNewArrival: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function getInitialDatabase(): DatabaseSchema {
  const adminPasswordHash = bcrypt.hashSync("admin123", 10);
  const userPasswordHash = bcrypt.hashSync("user123", 10);

  const sampleCustomerAddress: Address = {
    id: "addr-1",
    userId: "usr-1",
    fullName: "Priya Sharma",
    phone: "9876543210",
    altPhone: "9876543211",
    street: "Flat 4B, Emerald Heights, MG Road",
    city: "Kochi",
    district: "Ernakulam",
    state: "Kerala",
    pincode: "682016",
    landmark: "Near Marine Drive Walkway",
    isDefault: true,
  };

  const sampleEnquiry: Enquiry = {
    id: "ENQ-10492",
    orderId: "TW-ORD-7001",
    userId: "usr-1",
    customerName: "Priya Sharma",
    customerPhone: "9876543210",
    customerEmail: "priya.sharma@example.com",
    deliveryAddress: sampleCustomerAddress,
    items: [
      {
        productId: "prod-1",
        productName: "Sculpted Denim Corset Bodice",
        productCode: "TW-CT01",
        image: "/images/products/denim-corset.jpg",
        size: "M",
        colour: "Dark Blue",
        quantity: 1,
        price: 1850,
        subtotal: 1850,
      },
      {
        productId: "prod-2",
        productName: "Ruched Sweetheart Mocha Corset",
        productCode: "TW-CT02",
        image: "/images/products/brown-ruched-corset.jpg",
        size: "L",
        colour: "Brown",
        quantity: 1,
        price: 1950,
        subtotal: 1950,
      },
    ],
    totalAmount: 3800,
    status: "Shipped",
    paymentStatus: "Payment Received",
    paymentMethod: "UPI Google Pay",
    paymentReference: "UPI-REF-938210948",
    paymentDate: new Date(Date.now() - 86400000).toISOString(),
    courierCompany: "Delhivery",
    trackingNumber: "DEL193820491IN",
    trackingUrl: "https://www.delhivery.com/track/package/DEL193820491IN",
    shippingDate: new Date(Date.now() - 43200000).toISOString().split("T")[0],
    estimatedDelivery: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
    adminNotes: "Customer paid via WhatsApp QR code. Dispatched via Delhivery Express.",
    customerNotes: "Please deliver in luxury boutique gift packaging.",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 43200000).toISOString(),
  };

  return {
    settings: DEFAULT_SETTINGS,
    users: [
      {
        id: "adm-1",
        name: "Store Administrator",
        phone: "admin",
        email: "admin@terrywomen.com",
        role: "admin",
        passwordHash: adminPasswordHash,
        addresses: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "usr-1",
        name: "Priya Sharma",
        phone: "9876543210",
        email: "priya.sharma@example.com",
        role: "customer",
        passwordHash: userPasswordHash,
        addresses: [sampleCustomerAddress],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    products: INITIAL_PRODUCTS,
    enquiries: [sampleEnquiry],
  };
}

export function readDb(): DatabaseSchema {
  const dbPath = getDbPath();
  ensureDirectoryExists(dbPath);

  if (!fs.existsSync(dbPath)) {
    // If on Vercel, try copying from bundled data/database.json first
    const bundledPath = path.join(process.cwd(), "data", "database.json");
    if (process.env.VERCEL && fs.existsSync(bundledPath)) {
      try {
        const bundledContent = fs.readFileSync(bundledPath, "utf-8");
        fs.writeFileSync(dbPath, bundledContent, "utf-8");
        return JSON.parse(bundledContent);
      } catch (e) {
        // fallback to initial
      }
    }

    const initial = getInitialDatabase();
    try {
      fs.writeFileSync(dbPath, JSON.stringify(initial, null, 2), "utf-8");
    } catch (e) {
      // ignore in read-only environment
    }
    return initial;
  }

  try {
    const raw = fs.readFileSync(dbPath, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading database, creating fresh one:", err);
    const initial = getInitialDatabase();
    try {
      fs.writeFileSync(dbPath, JSON.stringify(initial, null, 2), "utf-8");
    } catch (e) {
      // ignore
    }
    return initial;
  }
}

export function writeDb(data: DatabaseSchema): void {
  const dbPath = getDbPath();
  ensureDirectoryExists(dbPath);
  try {
    const tempPath = `${dbPath}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf-8");
    fs.renameSync(tempPath, dbPath);
  } catch (err) {
    console.error("Failed to write to database:", err);
  }
}

// ---------------- PRODUCTS ---------------- //
export function getProducts(): Product[] {
  return readDb().products;
}

export function getProductById(id: string): Product | undefined {
  return readDb().products.find((p) => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return readDb().products.find((p) => p.slug === slug || p.id === slug);
}

export function createProduct(productData: Omit<Product, "id" | "createdAt" | "updatedAt">): Product {
  const db = readDb();
  const newProduct: Product = {
    ...productData,
    id: `prod-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.products.unshift(newProduct);
  writeDb(db);
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const db = readDb();
  const index = db.products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  db.products[index] = {
    ...db.products[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  writeDb(db);
  return db.products[index];
}

export function deleteProduct(id: string): boolean {
  const db = readDb();
  const originalLength = db.products.length;
  db.products = db.products.filter((p) => p.id !== id);
  if (db.products.length !== originalLength) {
    writeDb(db);
    return true;
  }
  return false;
}

// ---------------- ENQUIRIES / ORDERS ---------------- //
export function getEnquiries(): Enquiry[] {
  return readDb().enquiries;
}

export function getEnquiryById(id: string): Enquiry | undefined {
  const db = readDb();
  return db.enquiries.find((e) => e.id.toLowerCase() === id.toLowerCase() || (e.orderId && e.orderId.toLowerCase() === id.toLowerCase()));
}

export function getEnquiriesByPhoneOrUser(phone?: string, userId?: string): Enquiry[] {
  const db = readDb();
  return db.enquiries.filter((e) => {
    if (userId && e.userId === userId) return true;
    if (phone && e.customerPhone.replace(/\D/g, "").endsWith(phone.replace(/\D/g, ""))) return true;
    return false;
  });
}

export function createEnquiry(enquiryData: Omit<Enquiry, "id" | "createdAt" | "updatedAt">): Enquiry {
  const db = readDb();
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const newId = `ENQ-${randomSuffix}`;
  const newOrderId = `TW-ORD-${Math.floor(1000 + Math.random() * 9000)}`;

  const newEnquiry: Enquiry = {
    ...enquiryData,
    id: newId,
    orderId: newOrderId,
    status: enquiryData.status || "Enquiry Received",
    paymentStatus: enquiryData.paymentStatus || "Pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.enquiries.unshift(newEnquiry);
  writeDb(db);
  return newEnquiry;
}

export function updateEnquiry(id: string, updates: Partial<Enquiry>): Enquiry | null {
  const db = readDb();
  const index = db.enquiries.findIndex((e) => e.id.toLowerCase() === id.toLowerCase() || (e.orderId && e.orderId.toLowerCase() === id.toLowerCase()));
  if (index === -1) return null;

  db.enquiries[index] = {
    ...db.enquiries[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  writeDb(db);
  return db.enquiries[index];
}

// ---------------- USERS & AUTH ---------------- //
export function getUsers(): User[] {
  return readDb().users.map(({ passwordHash, ...rest }) => rest);
}

export function findUserByCredentials(usernameOrPhone: string, plainPassword: string) {
  const db = readDb();
  const cleanQuery = usernameOrPhone.trim().toLowerCase();

  const user = db.users.find(
    (u) =>
      u.phone.toLowerCase() === cleanQuery ||
      (u.email && u.email.toLowerCase() === cleanQuery) ||
      (cleanQuery === "admin" && u.role === "admin")
  );

  if (!user) return null;

  const isValid = bcrypt.compareSync(plainPassword, user.passwordHash);
  if (!isValid) return null;

  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

export function findUserById(id: string): User | null {
  const db = readDb();
  const user = db.users.find((u) => u.id === id);
  if (!user) return null;
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

export function createUser(userData: {
  name: string;
  phone: string;
  password: string;
  email?: string;
  role?: "customer" | "admin";
}): User {
  const db = readDb();
  const existing = db.users.find((u) => u.phone === userData.phone);
  if (existing) {
    throw new Error("Mobile number already registered");
  }

  const passwordHash = bcrypt.hashSync(userData.password, 10);
  const newUser = {
    id: `usr-${Date.now()}`,
    name: userData.name,
    phone: userData.phone,
    email: userData.email,
    role: userData.role || ("customer" as const),
    passwordHash,
    addresses: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  writeDb(db);

  const { passwordHash: _, ...safeUser } = newUser;
  return safeUser;
}

export function resetPassword(phone: string, newPassword: string): boolean {
  const db = readDb();
  const user = db.users.find((u) => u.phone.replace(/\D/g, "") === phone.replace(/\D/g, ""));
  if (!user) return false;

  user.passwordHash = bcrypt.hashSync(newPassword, 10);
  user.updatedAt = new Date().toISOString();
  writeDb(db);
  return true;
}

export function addAddress(userId: string, addressData: Omit<Address, "id">): Address | null {
  const db = readDb();
  const user = db.users.find((u) => u.id === userId);
  if (!user) return null;

  const newAddress: Address = {
    ...addressData,
    id: `addr-${Date.now()}`,
    userId,
  };

  if (addressData.isDefault) {
    user.addresses.forEach((a) => (a.isDefault = false));
  }

  user.addresses.push(newAddress);
  user.updatedAt = new Date().toISOString();
  writeDb(db);
  return newAddress;
}

export function updateAddress(userId: string, addressId: string, updates: Partial<Address>): Address | null {
  const db = readDb();
  const user = db.users.find((u) => u.id === userId);
  if (!user) return null;

  const index = user.addresses.findIndex((a) => a.id === addressId);
  if (index === -1) return null;

  if (updates.isDefault) {
    user.addresses.forEach((a) => (a.isDefault = false));
  }

  user.addresses[index] = {
    ...user.addresses[index],
    ...updates,
  };

  user.updatedAt = new Date().toISOString();
  writeDb(db);
  return user.addresses[index];
}

export function deleteAddress(userId: string, addressId: string): boolean {
  const db = readDb();
  const user = db.users.find((u) => u.id === userId);
  if (!user) return false;

  const initialLength = user.addresses.length;
  user.addresses = user.addresses.filter((a) => a.id !== addressId);
  if (user.addresses.length !== initialLength) {
    user.updatedAt = new Date().toISOString();
    writeDb(db);
    return true;
  }
  return false;
}

// ---------------- SETTINGS ---------------- //
export function getSettings(): StoreSettings {
  return readDb().settings;
}

export function updateSettings(updates: Partial<StoreSettings>): StoreSettings {
  const db = readDb();
  db.settings = {
    ...db.settings,
    ...updates,
  };
  writeDb(db);
  return db.settings;
}
