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
    "id": "pin-1011691503815958072",
    "name": "Cotton tops for jeans western",
    "code": "TW-P001",
    "slug": "tw-1011691503815958072",
    "price": 199,
    "originalPrice": 299,
    "description": "Exclusive single-piece luxury boutique garment. Hand-curated silhouette in unique size M. Crafted in premium soft woven fabric.",
    "fabric": "100% Curated Boutique Cotton & Voile Weave",
    "fit": "Tailored Fit · Exclusive Size M (Single Piece)",
    "careInstructions": "Gentle hand wash cold or professional dry clean",
    "availability": "In Stock",
    "images": [
      "/images/products/pin_1011691503815958072.jpg"
    ],
    "sizes": [
      "M"
    ],
    "colours": [
      "Cream"
    ],
    "category": "Corsets & Tops",
    "isNewArrival": true,
    "isFeatured": true,
    "createdAt": "2026-11-21T05:35:28.161Z",
    "updatedAt": "2026-11-21T05:35:28.162Z"
  },
  {
    "id": "pin-390968811422076913",
    "name": "Aktuelle Trends, günstig kaufen",
    "code": "TW-P002",
    "slug": "tw-390968811422076913",
    "price": 229,
    "originalPrice": 329,
    "description": "Exclusive single-piece luxury boutique garment. Hand-curated silhouette in unique size L. Crafted in premium soft woven fabric.",
    "fabric": "100% Curated Boutique Cotton & Voile Weave",
    "fit": "Tailored Fit · Exclusive Size L (Single Piece)",
    "careInstructions": "Gentle hand wash cold or professional dry clean",
    "availability": "In Stock",
    "images": [
      "/images/products/pin_390968811422076913.jpg"
    ],
    "sizes": [
      "L"
    ],
    "colours": [
      "White"
    ],
    "category": "Corsets & Tops",
    "isNewArrival": true,
    "isFeatured": false,
    "createdAt": "2026-11-21T04:35:28.162Z",
    "updatedAt": "2026-11-21T05:35:28.162Z"
  },
  {
    "id": "pin-615374736620820853",
    "name": "SHEIN",
    "code": "TW-P003",
    "slug": "tw-615374736620820853",
    "price": 249,
    "originalPrice": 349,
    "description": "Exclusive single-piece luxury boutique garment. Hand-curated silhouette in unique size XL. Crafted in premium soft woven fabric.",
    "fabric": "100% Curated Boutique Cotton & Voile Weave",
    "fit": "Tailored Fit · Exclusive Size XL (Single Piece)",
    "careInstructions": "Gentle hand wash cold or professional dry clean",
    "availability": "In Stock",
    "images": [
      "/images/products/pin_615374736620820853.jpg"
    ],
    "sizes": [
      "XL"
    ],
    "colours": [
      "Pink"
    ],
    "category": "Corsets & Tops",
    "isNewArrival": true,
    "isFeatured": false,
    "createdAt": "2026-11-21T03:35:28.162Z",
    "updatedAt": "2026-11-21T05:35:28.162Z"
  },
  {
    "id": "pin-1144899536553422095",
    "name": "White Crochet Tie",
    "code": "TW-P004",
    "slug": "tw-1144899536553422095",
    "price": 279,
    "originalPrice": 379,
    "description": "Exclusive single-piece luxury boutique garment. Hand-curated silhouette in unique size XXL. Crafted in premium soft woven fabric.",
    "fabric": "100% Curated Boutique Cotton & Voile Weave",
    "fit": "Tailored Fit · Exclusive Size XXL (Single Piece)",
    "careInstructions": "Gentle hand wash cold or professional dry clean",
    "availability": "In Stock",
    "images": [
      "/images/products/pin_1144899536553422095.jpg"
    ],
    "sizes": [
      "XXL"
    ],
    "colours": [
      "White"
    ],
    "category": "Corsets & Tops",
    "isNewArrival": true,
    "isFeatured": true,
    "createdAt": "2026-11-21T02:35:28.162Z",
    "updatedAt": "2026-11-21T05:35:28.162Z"
  },
  {
    "id": "pin-1099933909037329866",
    "name": "Yellow Crochet Daisy Bell Sleeve Crop To",
    "code": "TW-P005",
    "slug": "tw-1099933909037329866",
    "price": 299,
    "originalPrice": 399,
    "description": "Exclusive single-piece luxury boutique garment. Hand-curated silhouette in unique size M. Crafted in premium soft woven fabric.",
    "fabric": "100% Curated Boutique Cotton & Voile Weave",
    "fit": "Tailored Fit · Exclusive Size M (Single Piece)",
    "careInstructions": "Gentle hand wash cold or professional dry clean",
    "availability": "In Stock",
    "images": [
      "/images/products/pin_1099933909037329866.jpg"
    ],
    "sizes": [
      "M"
    ],
    "colours": [
      "Yellow"
    ],
    "category": "Corsets & Tops",
    "isNewArrival": true,
    "isFeatured": false,
    "createdAt": "2026-11-21T01:35:28.162Z",
    "updatedAt": "2026-11-21T05:35:28.162Z"
  },
  {
    "id": "pin-1140607043163274666",
    "name": "How to Style an Ivory Floral Crochet Top",
    "code": "TW-P006",
    "slug": "tw-1140607043163274666",
    "price": 199,
    "originalPrice": 299,
    "description": "Exclusive single-piece luxury boutique garment. Hand-curated silhouette in unique size L. Crafted in premium soft woven fabric.",
    "fabric": "100% Curated Boutique Cotton & Voile Weave",
    "fit": "Tailored Fit · Exclusive Size L (Single Piece)",
    "careInstructions": "Gentle hand wash cold or professional dry clean",
    "availability": "In Stock",
    "images": [
      "/images/products/pin_1140607043163274666.jpg"
    ],
    "sizes": [
      "L"
    ],
    "colours": [
      "Light Blue"
    ],
    "category": "Corsets & Tops",
    "isNewArrival": true,
    "isFeatured": false,
    "createdAt": "2026-11-21T00:35:28.162Z",
    "updatedAt": "2026-11-21T05:35:28.162Z"
  },
  {
    "id": "pin-1068619817842920473",
    "name": "Granny square flower sweater",
    "code": "TW-P007",
    "slug": "tw-1068619817842920473",
    "price": 229,
    "originalPrice": 329,
    "description": "Exclusive single-piece luxury boutique garment. Hand-curated silhouette in unique size XL. Crafted in premium soft woven fabric.",
    "fabric": "100% Curated Boutique Cotton & Voile Weave",
    "fit": "Tailored Fit · Exclusive Size XL (Single Piece)",
    "careInstructions": "Gentle hand wash cold or professional dry clean",
    "availability": "In Stock",
    "images": [
      "/images/products/pin_1068619817842920473.jpg"
    ],
    "sizes": [
      "XL"
    ],
    "colours": [
      "Brown"
    ],
    "category": "Corsets & Tops",
    "isNewArrival": true,
    "isFeatured": true,
    "createdAt": "2026-11-20T23:35:28.162Z",
    "updatedAt": "2026-11-21T05:35:28.162Z"
  },
  {
    "id": "pin-119838040088574962",
    "name": "여성 & 남성 의류, 쇼핑 온라인 패션",
    "code": "TW-P008",
    "slug": "tw-119838040088574962",
    "price": 249,
    "originalPrice": 349,
    "description": "Exclusive single-piece luxury boutique garment. Hand-curated silhouette in unique size XXL. Crafted in premium soft woven fabric.",
    "fabric": "100% Curated Boutique Cotton & Voile Weave",
    "fit": "Tailored Fit · Exclusive Size XXL (Single Piece)",
    "careInstructions": "Gentle hand wash cold or professional dry clean",
    "availability": "In Stock",
    "images": [
      "/images/products/pin_119838040088574962.jpg"
    ],
    "sizes": [
      "XXL"
    ],
    "colours": [
      "Black"
    ],
    "category": "Corsets & Tops",
    "isNewArrival": true,
    "isFeatured": false,
    "createdAt": "2026-11-20T22:35:28.162Z",
    "updatedAt": "2026-11-21T05:35:28.162Z"
  },
  {
    "id": "pin-1143703267906666828",
    "name": "Halter neck top design for women!",
    "code": "TW-P009",
    "slug": "tw-1143703267906666828",
    "price": 279,
    "originalPrice": 379,
    "description": "Exclusive single-piece luxury boutique garment. Hand-curated silhouette in unique size M. Crafted in premium soft woven fabric.",
    "fabric": "100% Curated Boutique Cotton & Voile Weave",
    "fit": "Tailored Fit · Exclusive Size M (Single Piece)",
    "careInstructions": "Gentle hand wash cold or professional dry clean",
    "availability": "In Stock",
    "images": [
      "/images/products/pin_1143703267906666828.jpg"
    ],
    "sizes": [
      "M"
    ],
    "colours": [
      "Cream"
    ],
    "category": "Corsets & Tops",
    "isNewArrival": true,
    "isFeatured": false,
    "createdAt": "2026-11-20T21:35:28.162Z",
    "updatedAt": "2026-11-21T05:35:28.162Z"
  },
  {
    "id": "pin-1066086543092977990",
    "name": "Women Peplum Top.",
    "code": "TW-P010",
    "slug": "tw-1066086543092977990",
    "price": 299,
    "originalPrice": 399,
    "description": "Exclusive single-piece luxury boutique garment. Hand-curated silhouette in unique size L. Crafted in premium soft woven fabric.",
    "fabric": "100% Curated Boutique Cotton & Voile Weave",
    "fit": "Tailored Fit · Exclusive Size L (Single Piece)",
    "careInstructions": "Gentle hand wash cold or professional dry clean",
    "availability": "In Stock",
    "images": [
      "/images/products/pin_1066086543092977990.jpg"
    ],
    "sizes": [
      "L"
    ],
    "colours": [
      "Yellow"
    ],
    "category": "Corsets & Tops",
    "isNewArrival": true,
    "isFeatured": true,
    "createdAt": "2026-11-20T20:35:28.162Z",
    "updatedAt": "2026-11-21T05:35:28.162Z"
  },
  {
    "id": "pin-1135188649844770291",
    "name": "Burgundy Floral Sweetheart Neck Top with",
    "code": "TW-P011",
    "slug": "tw-1135188649844770291",
    "price": 199,
    "originalPrice": 299,
    "description": "Exclusive single-piece luxury boutique garment. Hand-curated silhouette in unique size XL. Crafted in premium soft woven fabric.",
    "fabric": "100% Curated Boutique Cotton & Voile Weave",
    "fit": "Tailored Fit · Exclusive Size XL (Single Piece)",
    "careInstructions": "Gentle hand wash cold or professional dry clean",
    "availability": "In Stock",
    "images": [
      "/images/products/pin_1135188649844770291.jpg"
    ],
    "sizes": [
      "XL"
    ],
    "colours": [
      "Red"
    ],
    "category": "Corsets & Tops",
    "isNewArrival": true,
    "isFeatured": false,
    "createdAt": "2026-11-20T19:35:28.162Z",
    "updatedAt": "2026-11-21T05:35:28.162Z"
  },
  {
    "id": "pin-1061512574676380530",
    "name": "20 BEAUTIFUL CASUAL WEAR BLOUSE IDEAS FO",
    "code": "TW-P012",
    "slug": "tw-1061512574676380530",
    "price": 229,
    "originalPrice": 329,
    "description": "Exclusive single-piece luxury boutique garment. Hand-curated silhouette in unique size XXL. Crafted in premium soft woven fabric.",
    "fabric": "100% Curated Boutique Cotton & Voile Weave",
    "fit": "Tailored Fit · Exclusive Size XXL (Single Piece)",
    "careInstructions": "Gentle hand wash cold or professional dry clean",
    "availability": "In Stock",
    "images": [
      "/images/products/pin_1061512574676380530.jpg"
    ],
    "sizes": [
      "XXL"
    ],
    "colours": [
      "Beige"
    ],
    "category": "Blouses & Shirts",
    "isNewArrival": true,
    "isFeatured": false,
    "createdAt": "2026-11-20T18:35:28.162Z",
    "updatedAt": "2026-11-21T05:35:28.162Z"
  },
  {
    "id": "pin-1126885138042316750",
    "name": "Daisy & Ladybug Peplum Top 🌼 Cottagecor",
    "code": "TW-P013",
    "slug": "tw-1126885138042316750",
    "price": 249,
    "originalPrice": 349,
    "description": "Exclusive single-piece luxury boutique garment. Hand-curated silhouette in unique size M. Crafted in premium soft woven fabric.",
    "fabric": "100% Curated Boutique Cotton & Voile Weave",
    "fit": "Tailored Fit · Exclusive Size M (Single Piece)",
    "careInstructions": "Gentle hand wash cold or professional dry clean",
    "availability": "In Stock",
    "images": [
      "/images/products/pin_1126885138042316750.jpg"
    ],
    "sizes": [
      "M"
    ],
    "colours": [
      "White"
    ],
    "category": "Blouses & Shirts",
    "isNewArrival": false,
    "isFeatured": true,
    "createdAt": "2026-11-20T17:35:28.162Z",
    "updatedAt": "2026-11-21T05:35:28.162Z"
  },
  {
    "id": "pin-994028949022061276",
    "name": "Pink top png",
    "code": "TW-P014",
    "slug": "tw-994028949022061276",
    "price": 279,
    "originalPrice": 379,
    "description": "Exclusive single-piece luxury boutique garment. Hand-curated silhouette in unique size L. Crafted in premium soft woven fabric.",
    "fabric": "100% Curated Boutique Cotton & Voile Weave",
    "fit": "Tailored Fit · Exclusive Size L (Single Piece)",
    "careInstructions": "Gentle hand wash cold or professional dry clean",
    "availability": "In Stock",
    "images": [
      "/images/products/pin_994028949022061276.jpg"
    ],
    "sizes": [
      "L"
    ],
    "colours": [
      "White"
    ],
    "category": "Corsets & Tops",
    "isNewArrival": false,
    "isFeatured": false,
    "createdAt": "2026-11-20T16:35:28.162Z",
    "updatedAt": "2026-11-21T05:35:28.162Z"
  },
  {
    "id": "pin-4607534391800771904",
    "name": "BSK&TRAF Women's Clothing 2025 Summer Ne",
    "code": "TW-P015",
    "slug": "tw-4607534391800771904",
    "price": 299,
    "originalPrice": 399,
    "description": "Exclusive single-piece luxury boutique garment. Hand-curated silhouette in unique size XL. Crafted in premium soft woven fabric.",
    "fabric": "100% Curated Boutique Cotton & Voile Weave",
    "fit": "Tailored Fit · Exclusive Size XL (Single Piece)",
    "careInstructions": "Gentle hand wash cold or professional dry clean",
    "availability": "In Stock",
    "images": [
      "/images/products/pin_4607534391800771904.jpg"
    ],
    "sizes": [
      "XL"
    ],
    "colours": [
      "Red"
    ],
    "category": "Blouses & Shirts",
    "isNewArrival": false,
    "isFeatured": false,
    "createdAt": "2026-11-20T15:35:28.162Z",
    "updatedAt": "2026-11-21T05:35:28.162Z"
  },
  {
    "id": "pin-1146236542703841314",
    "name": "Brown top",
    "code": "TW-P016",
    "slug": "tw-1146236542703841314",
    "price": 199,
    "originalPrice": 299,
    "description": "Exclusive single-piece luxury boutique garment. Hand-curated silhouette in unique size XXL. Crafted in premium soft woven fabric.",
    "fabric": "100% Curated Boutique Cotton & Voile Weave",
    "fit": "Tailored Fit · Exclusive Size XXL (Single Piece)",
    "careInstructions": "Gentle hand wash cold or professional dry clean",
    "availability": "In Stock",
    "images": [
      "/images/products/pin_1146236542703841314.jpg"
    ],
    "sizes": [
      "XXL"
    ],
    "colours": [
      "Brown"
    ],
    "category": "Blouses & Shirts",
    "isNewArrival": false,
    "isFeatured": true,
    "createdAt": "2026-11-20T14:35:28.162Z",
    "updatedAt": "2026-11-21T05:35:28.162Z"
  },
  {
    "id": "pin-1143281055429915654",
    "name": "Baby Pink Off",
    "code": "TW-P017",
    "slug": "tw-1143281055429915654",
    "price": 229,
    "originalPrice": 329,
    "description": "Exclusive single-piece luxury boutique garment. Hand-curated silhouette in unique size M. Crafted in premium soft woven fabric.",
    "fabric": "100% Curated Boutique Cotton & Voile Weave",
    "fit": "Tailored Fit · Exclusive Size M (Single Piece)",
    "careInstructions": "Gentle hand wash cold or professional dry clean",
    "availability": "In Stock",
    "images": [
      "/images/products/pin_1143281055429915654.jpg"
    ],
    "sizes": [
      "M"
    ],
    "colours": [
      "Pink"
    ],
    "category": "Corsets & Tops",
    "isNewArrival": false,
    "isFeatured": false,
    "createdAt": "2026-11-20T13:35:28.162Z",
    "updatedAt": "2026-11-21T05:35:28.162Z"
  },
  {
    "id": "pin-4606408494662519104",
    "name": "Pink Shorts Set Woman 2 Pieces Summer Em",
    "code": "TW-P018",
    "slug": "tw-4606408494662519104",
    "price": 249,
    "originalPrice": 349,
    "description": "Exclusive single-piece luxury boutique garment. Hand-curated silhouette in unique size L. Crafted in premium soft woven fabric.",
    "fabric": "100% Curated Boutique Cotton & Voile Weave",
    "fit": "Tailored Fit · Exclusive Size L (Single Piece)",
    "careInstructions": "Gentle hand wash cold or professional dry clean",
    "availability": "In Stock",
    "images": [
      "/images/products/pin_4606408494662519104.jpg"
    ],
    "sizes": [
      "L"
    ],
    "colours": [
      "Pink"
    ],
    "category": "Dresses & Tunics",
    "isNewArrival": false,
    "isFeatured": false,
    "createdAt": "2026-11-20T12:35:28.162Z",
    "updatedAt": "2026-11-21T05:35:28.162Z"
  },
  {
    "id": "pin-1133851643711784805",
    "name": "Sewing Patterns Dress",
    "code": "TW-P019",
    "slug": "tw-1133851643711784805",
    "price": 279,
    "originalPrice": 379,
    "description": "Exclusive single-piece luxury boutique garment. Hand-curated silhouette in unique size XL. Crafted in premium soft woven fabric.",
    "fabric": "100% Curated Boutique Cotton & Voile Weave",
    "fit": "Tailored Fit · Exclusive Size XL (Single Piece)",
    "careInstructions": "Gentle hand wash cold or professional dry clean",
    "availability": "In Stock",
    "images": [
      "/images/products/pin_1133851643711784805.jpg"
    ],
    "sizes": [
      "XL"
    ],
    "colours": [
      "Yellow"
    ],
    "category": "Dresses & Tunics",
    "isNewArrival": false,
    "isFeatured": true,
    "createdAt": "2026-11-20T11:35:28.162Z",
    "updatedAt": "2026-11-21T05:35:28.162Z"
  },
  {
    "id": "pin-357473289193810277",
    "name": "Flower applique cap sleeve knit top",
    "code": "TW-P020",
    "slug": "tw-357473289193810277",
    "price": 299,
    "originalPrice": 399,
    "description": "Exclusive single-piece luxury boutique garment. Hand-curated silhouette in unique size XXL. Crafted in premium soft woven fabric.",
    "fabric": "100% Curated Boutique Cotton & Voile Weave",
    "fit": "Tailored Fit · Exclusive Size XXL (Single Piece)",
    "careInstructions": "Gentle hand wash cold or professional dry clean",
    "availability": "In Stock",
    "images": [
      "/images/products/pin_357473289193810277.jpg"
    ],
    "sizes": [
      "XXL"
    ],
    "colours": [
      "Red"
    ],
    "category": "Corsets & Tops",
    "isNewArrival": false,
    "isFeatured": false,
    "createdAt": "2026-11-20T10:35:28.162Z",
    "updatedAt": "2026-11-21T05:35:28.162Z"
  },
  {
    "id": "pin-188658671876086078",
    "name": "Nice Saves: 15 Must",
    "code": "TW-P021",
    "slug": "tw-188658671876086078",
    "price": 199,
    "originalPrice": 299,
    "description": "Exclusive single-piece luxury boutique garment. Hand-curated silhouette in unique size M. Crafted in premium soft woven fabric.",
    "fabric": "100% Curated Boutique Cotton & Voile Weave",
    "fit": "Tailored Fit · Exclusive Size M (Single Piece)",
    "careInstructions": "Gentle hand wash cold or professional dry clean",
    "availability": "In Stock",
    "images": [
      "/images/products/pin_188658671876086078.jpg"
    ],
    "sizes": [
      "M"
    ],
    "colours": [
      "Yellow"
    ],
    "category": "Corsets & Tops",
    "isNewArrival": false,
    "isFeatured": false,
    "createdAt": "2026-11-20T09:35:28.162Z",
    "updatedAt": "2026-11-21T05:35:28.162Z"
  },
  {
    "id": "pin-957507570798090131",
    "name": "Cute yellow clothes png",
    "code": "TW-P022",
    "slug": "tw-957507570798090131",
    "price": 229,
    "originalPrice": 329,
    "description": "Exclusive single-piece luxury boutique garment. Hand-curated silhouette in unique size L. Crafted in premium soft woven fabric.",
    "fabric": "100% Curated Boutique Cotton & Voile Weave",
    "fit": "Tailored Fit · Exclusive Size L (Single Piece)",
    "careInstructions": "Gentle hand wash cold or professional dry clean",
    "availability": "In Stock",
    "images": [
      "/images/products/pin_957507570798090131.jpg"
    ],
    "sizes": [
      "L"
    ],
    "colours": [
      "Yellow"
    ],
    "category": "Corsets & Tops",
    "isNewArrival": false,
    "isFeatured": true,
    "createdAt": "2026-11-20T08:35:28.162Z",
    "updatedAt": "2026-11-21T05:35:28.162Z"
  },
  {
    "id": "pin-871235490429623029",
    "name": "Atelier Boutique Garment 3029",
    "code": "TW-P023",
    "slug": "tw-871235490429623029",
    "price": 249,
    "originalPrice": 349,
    "description": "Exclusive single-piece luxury boutique garment. Hand-curated silhouette in unique size XL. Crafted in premium soft woven fabric.",
    "fabric": "100% Curated Boutique Cotton & Voile Weave",
    "fit": "Tailored Fit · Exclusive Size XL (Single Piece)",
    "careInstructions": "Gentle hand wash cold or professional dry clean",
    "availability": "In Stock",
    "images": [
      "/images/products/pin_871235490429623029.jpg"
    ],
    "sizes": [
      "XL"
    ],
    "colours": [
      "Brown"
    ],
    "category": "Corsets & Tops",
    "isNewArrival": false,
    "isFeatured": false,
    "createdAt": "2026-11-20T07:35:28.162Z",
    "updatedAt": "2026-11-21T05:35:28.162Z"
  },
  {
    "id": "pin-1109644795734854515",
    "name": "Милые наряды",
    "code": "TW-P024",
    "slug": "tw-1109644795734854515",
    "price": 279,
    "originalPrice": 379,
    "description": "Exclusive single-piece luxury boutique garment. Hand-curated silhouette in unique size XXL. Crafted in premium soft woven fabric.",
    "fabric": "100% Curated Boutique Cotton & Voile Weave",
    "fit": "Tailored Fit · Exclusive Size XXL (Single Piece)",
    "careInstructions": "Gentle hand wash cold or professional dry clean",
    "availability": "In Stock",
    "images": [
      "/images/products/pin_1109644795734854515.jpg"
    ],
    "sizes": [
      "XXL"
    ],
    "colours": [
      "Black"
    ],
    "category": "Corsets & Tops",
    "isNewArrival": false,
    "isFeatured": false,
    "createdAt": "2026-11-20T06:35:28.162Z",
    "updatedAt": "2026-11-21T05:35:28.162Z"
  },
  {
    "id": "pin-1002473198323951656",
    "name": "Beige and White Vertical Striped Peplum",
    "code": "TW-P025",
    "slug": "tw-1002473198323951656",
    "price": 299,
    "originalPrice": 399,
    "description": "Exclusive single-piece luxury boutique garment. Hand-curated silhouette in unique size M. Crafted in premium soft woven fabric.",
    "fabric": "100% Curated Boutique Cotton & Voile Weave",
    "fit": "Tailored Fit · Exclusive Size M (Single Piece)",
    "careInstructions": "Gentle hand wash cold or professional dry clean",
    "availability": "In Stock",
    "images": [
      "/images/products/pin_1002473198323951656.jpg"
    ],
    "sizes": [
      "M"
    ],
    "colours": [
      "White"
    ],
    "category": "Blouses & Shirts",
    "isNewArrival": false,
    "isFeatured": true,
    "createdAt": "2026-11-20T05:35:28.162Z",
    "updatedAt": "2026-11-21T05:35:28.162Z"
  },
  {
    "id": "pin-582442164349294219",
    "name": "GORGLITTER Women's Cute Bow Cardigan Swe",
    "code": "TW-P026",
    "slug": "tw-582442164349294219",
    "price": 199,
    "originalPrice": 299,
    "description": "Exclusive single-piece luxury boutique garment. Hand-curated silhouette in unique size L. Crafted in premium soft woven fabric.",
    "fabric": "100% Curated Boutique Cotton & Voile Weave",
    "fit": "Tailored Fit · Exclusive Size L (Single Piece)",
    "careInstructions": "Gentle hand wash cold or professional dry clean",
    "availability": "In Stock",
    "images": [
      "/images/products/pin_582442164349294219.jpg"
    ],
    "sizes": [
      "L"
    ],
    "colours": [
      "Pink"
    ],
    "category": "Blouses & Shirts",
    "isNewArrival": false,
    "isFeatured": false,
    "createdAt": "2026-11-20T04:35:28.162Z",
    "updatedAt": "2026-11-21T05:35:28.162Z"
  },
  {
    "id": "pin-666180969917299676",
    "name": "Fashion Starts With A Feeling",
    "code": "TW-P027",
    "slug": "tw-666180969917299676",
    "price": 229,
    "originalPrice": 329,
    "description": "Exclusive single-piece luxury boutique garment. Hand-curated silhouette in unique size XL. Crafted in premium soft woven fabric.",
    "fabric": "100% Curated Boutique Cotton & Voile Weave",
    "fit": "Tailored Fit · Exclusive Size XL (Single Piece)",
    "careInstructions": "Gentle hand wash cold or professional dry clean",
    "availability": "In Stock",
    "images": [
      "/images/products/pin_666180969917299676.jpg"
    ],
    "sizes": [
      "XL"
    ],
    "colours": [
      "Pink"
    ],
    "category": "Corsets & Tops",
    "isNewArrival": false,
    "isFeatured": false,
    "createdAt": "2026-11-20T03:35:28.162Z",
    "updatedAt": "2026-11-21T05:35:28.162Z"
  },
  {
    "id": "pin-4599019741439883840",
    "name": "ZRN",
    "code": "TW-P028",
    "slug": "tw-4599019741439883840",
    "price": 249,
    "originalPrice": 349,
    "description": "Exclusive single-piece luxury boutique garment. Hand-curated silhouette in unique size XXL. Crafted in premium soft woven fabric.",
    "fabric": "100% Curated Boutique Cotton & Voile Weave",
    "fit": "Tailored Fit · Exclusive Size XXL (Single Piece)",
    "careInstructions": "Gentle hand wash cold or professional dry clean",
    "availability": "In Stock",
    "images": [
      "/images/products/pin_4599019741439883840.jpg"
    ],
    "sizes": [
      "XXL"
    ],
    "colours": [
      "Beige"
    ],
    "category": "Blouses & Shirts",
    "isNewArrival": false,
    "isFeatured": true,
    "createdAt": "2026-11-20T02:35:28.162Z",
    "updatedAt": "2026-11-21T05:35:28.162Z"
  },
  {
    "id": "pin-1013028509951785854",
    "name": "Vestidos icônicos",
    "code": "TW-P029",
    "slug": "tw-1013028509951785854",
    "price": 279,
    "originalPrice": 379,
    "description": "Exclusive single-piece luxury boutique garment. Hand-curated silhouette in unique size M. Crafted in premium soft woven fabric.",
    "fabric": "100% Curated Boutique Cotton & Voile Weave",
    "fit": "Tailored Fit · Exclusive Size M (Single Piece)",
    "careInstructions": "Gentle hand wash cold or professional dry clean",
    "availability": "In Stock",
    "images": [
      "/images/products/pin_1013028509951785854.jpg"
    ],
    "sizes": [
      "M"
    ],
    "colours": [
      "Yellow"
    ],
    "category": "Corsets & Tops",
    "isNewArrival": false,
    "isFeatured": false,
    "createdAt": "2026-11-20T01:35:28.162Z",
    "updatedAt": "2026-11-21T05:35:28.162Z"
  },
  {
    "id": "pin-982769949956608103",
    "name": "Verdusa Women's Y2K Babydoll Tops Lace S",
    "code": "TW-P030",
    "slug": "tw-982769949956608103",
    "price": 299,
    "originalPrice": 399,
    "description": "Exclusive single-piece luxury boutique garment. Hand-curated silhouette in unique size L. Crafted in premium soft woven fabric.",
    "fabric": "100% Curated Boutique Cotton & Voile Weave",
    "fit": "Tailored Fit · Exclusive Size L (Single Piece)",
    "careInstructions": "Gentle hand wash cold or professional dry clean",
    "availability": "In Stock",
    "images": [
      "/images/products/pin_982769949956608103.jpg"
    ],
    "sizes": [
      "L"
    ],
    "colours": [
      "Green"
    ],
    "category": "Dresses & Tunics",
    "isNewArrival": false,
    "isFeatured": false,
    "createdAt": "2026-11-20T00:35:28.162Z",
    "updatedAt": "2026-11-21T05:35:28.162Z"
  },
  {
    "id": "pin-545146729913365518",
    "name": "Black spring picnic top",
    "code": "TW-P031",
    "slug": "tw-545146729913365518",
    "price": 199,
    "originalPrice": 299,
    "description": "Exclusive single-piece luxury boutique garment. Hand-curated silhouette in unique size XL. Crafted in premium soft woven fabric.",
    "fabric": "100% Curated Boutique Cotton & Voile Weave",
    "fit": "Tailored Fit · Exclusive Size XL (Single Piece)",
    "careInstructions": "Gentle hand wash cold or professional dry clean",
    "availability": "In Stock",
    "images": [
      "/images/products/pin_545146729913365518.jpg"
    ],
    "sizes": [
      "XL"
    ],
    "colours": [
      "Black"
    ],
    "category": "Corsets & Tops",
    "isNewArrival": false,
    "isFeatured": true,
    "createdAt": "2026-11-19T23:35:28.162Z",
    "updatedAt": "2026-11-21T05:35:28.162Z"
  },
  {
    "id": "pin-584693964166224810",
    "name": "The Alba Top in Cream has definitely bee",
    "code": "TW-P032",
    "slug": "tw-584693964166224810",
    "price": 229,
    "originalPrice": 329,
    "description": "Exclusive single-piece luxury boutique garment. Hand-curated silhouette in unique size XXL. Crafted in premium soft woven fabric.",
    "fabric": "100% Curated Boutique Cotton & Voile Weave",
    "fit": "Tailored Fit · Exclusive Size XXL (Single Piece)",
    "careInstructions": "Gentle hand wash cold or professional dry clean",
    "availability": "In Stock",
    "images": [
      "/images/products/pin_584693964166224810.jpg"
    ],
    "sizes": [
      "XXL"
    ],
    "colours": [
      "Red"
    ],
    "category": "Corsets & Tops",
    "isNewArrival": false,
    "isFeatured": false,
    "createdAt": "2026-11-19T22:35:28.162Z",
    "updatedAt": "2026-11-21T05:35:28.162Z"
  },
  {
    "id": "pin-4609715821567083072",
    "name": "Felpa corta con scollo a V e spalle sces",
    "code": "TW-P033",
    "slug": "tw-4609715821567083072",
    "price": 249,
    "originalPrice": 349,
    "description": "Exclusive single-piece luxury boutique garment. Hand-curated silhouette in unique size M. Crafted in premium soft woven fabric.",
    "fabric": "100% Curated Boutique Cotton & Voile Weave",
    "fit": "Tailored Fit · Exclusive Size M (Single Piece)",
    "careInstructions": "Gentle hand wash cold or professional dry clean",
    "availability": "In Stock",
    "images": [
      "/images/products/pin_4609715821567083072.jpg"
    ],
    "sizes": [
      "M"
    ],
    "colours": [
      "Green"
    ],
    "category": "Corsets & Tops",
    "isNewArrival": false,
    "isFeatured": false,
    "createdAt": "2026-11-19T21:35:28.162Z",
    "updatedAt": "2026-11-21T05:35:28.162Z"
  },
  {
    "id": "pin-4609786178305169024",
    "name": "Fabric: Crafted from a soft and breathab",
    "code": "TW-P034",
    "slug": "tw-4609786178305169024",
    "price": 279,
    "originalPrice": 379,
    "description": "Exclusive single-piece luxury boutique garment. Hand-curated silhouette in unique size L. Crafted in premium soft woven fabric.",
    "fabric": "100% Curated Boutique Cotton & Voile Weave",
    "fit": "Tailored Fit · Exclusive Size L (Single Piece)",
    "careInstructions": "Gentle hand wash cold or professional dry clean",
    "availability": "In Stock",
    "images": [
      "/images/products/pin_4609786178305169024.jpg"
    ],
    "sizes": [
      "L"
    ],
    "colours": [
      "White"
    ],
    "category": "Corsets & Tops",
    "isNewArrival": false,
    "isFeatured": true,
    "createdAt": "2026-11-19T20:35:28.162Z",
    "updatedAt": "2026-11-21T05:35:28.162Z"
  },
  {
    "id": "pin-4607112128211053952",
    "name": "Petal Party Shapeless Cami by Intimately",
    "code": "TW-P035",
    "slug": "tw-4607112128211053952",
    "price": 299,
    "originalPrice": 399,
    "description": "Exclusive single-piece luxury boutique garment. Hand-curated silhouette in unique size XL. Crafted in premium soft woven fabric.",
    "fabric": "100% Curated Boutique Cotton & Voile Weave",
    "fit": "Tailored Fit · Exclusive Size XL (Single Piece)",
    "careInstructions": "Gentle hand wash cold or professional dry clean",
    "availability": "In Stock",
    "images": [
      "/images/products/pin_4607112128211053952.jpg"
    ],
    "sizes": [
      "XL"
    ],
    "colours": [
      "Pink"
    ],
    "category": "Corsets & Tops",
    "isNewArrival": false,
    "isFeatured": false,
    "createdAt": "2026-11-19T19:35:28.162Z",
    "updatedAt": "2026-11-21T05:35:28.162Z"
  },
  {
    "id": "pin-359584351473852526",
    "name": "Best Valentines Outfit for Date (2015)",
    "code": "TW-P036",
    "slug": "tw-359584351473852526",
    "price": 199,
    "originalPrice": 299,
    "description": "Exclusive single-piece luxury boutique garment. Hand-curated silhouette in unique size XXL. Crafted in premium soft woven fabric.",
    "fabric": "100% Curated Boutique Cotton & Voile Weave",
    "fit": "Tailored Fit · Exclusive Size XXL (Single Piece)",
    "careInstructions": "Gentle hand wash cold or professional dry clean",
    "availability": "In Stock",
    "images": [
      "/images/products/pin_359584351473852526.jpg"
    ],
    "sizes": [
      "XXL"
    ],
    "colours": [
      "Beige"
    ],
    "category": "Corsets & Tops",
    "isNewArrival": false,
    "isFeatured": false,
    "createdAt": "2026-11-19T18:35:28.162Z",
    "updatedAt": "2026-11-21T05:35:28.162Z"
  },
  {
    "id": "pin-750693831677488185",
    "name": "Light blue/striped Cotton Peplum Top for",
    "code": "TW-P037",
    "slug": "tw-750693831677488185",
    "price": 229,
    "originalPrice": 329,
    "description": "Exclusive single-piece luxury boutique garment. Hand-curated silhouette in unique size M. Crafted in premium soft woven fabric.",
    "fabric": "100% Curated Boutique Cotton & Voile Weave",
    "fit": "Tailored Fit · Exclusive Size M (Single Piece)",
    "careInstructions": "Gentle hand wash cold or professional dry clean",
    "availability": "In Stock",
    "images": [
      "/images/products/pin_750693831677488185.jpg"
    ],
    "sizes": [
      "M"
    ],
    "colours": [
      "Light Blue"
    ],
    "category": "Corsets & Tops",
    "isNewArrival": false,
    "isFeatured": true,
    "createdAt": "2026-11-19T17:35:28.162Z",
    "updatedAt": "2026-11-21T05:35:28.162Z"
  },
  {
    "id": "pin-106538347430487995",
    "name": "Peasant Blouses Are The Most Versatile S",
    "code": "TW-P038",
    "slug": "tw-106538347430487995",
    "price": 249,
    "originalPrice": 349,
    "description": "Exclusive single-piece luxury boutique garment. Hand-curated silhouette in unique size L. Crafted in premium soft woven fabric.",
    "fabric": "100% Curated Boutique Cotton & Voile Weave",
    "fit": "Tailored Fit · Exclusive Size L (Single Piece)",
    "careInstructions": "Gentle hand wash cold or professional dry clean",
    "availability": "In Stock",
    "images": [
      "/images/products/pin_106538347430487995.jpg"
    ],
    "sizes": [
      "L"
    ],
    "colours": [
      "Yellow"
    ],
    "category": "Blouses & Shirts",
    "isNewArrival": false,
    "isFeatured": false,
    "createdAt": "2026-11-19T16:35:28.162Z",
    "updatedAt": "2026-11-21T05:35:28.162Z"
  },
  {
    "id": "pin-965037026416021989",
    "name": "Very stiylish",
    "code": "TW-P039",
    "slug": "tw-965037026416021989",
    "price": 279,
    "originalPrice": 379,
    "description": "Exclusive single-piece luxury boutique garment. Hand-curated silhouette in unique size XL. Crafted in premium soft woven fabric.",
    "fabric": "100% Curated Boutique Cotton & Voile Weave",
    "fit": "Tailored Fit · Exclusive Size XL (Single Piece)",
    "careInstructions": "Gentle hand wash cold or professional dry clean",
    "availability": "In Stock",
    "images": [
      "/images/products/pin_965037026416021989.jpg"
    ],
    "sizes": [
      "XL"
    ],
    "colours": [
      "White"
    ],
    "category": "Corsets & Tops",
    "isNewArrival": false,
    "isFeatured": false,
    "createdAt": "2026-11-19T15:35:28.162Z",
    "updatedAt": "2026-11-21T05:35:28.162Z"
  },
  {
    "id": "pin-1074319686128650520",
    "name": "What`s the Secret to a Prefect Body ?",
    "code": "TW-P040",
    "slug": "tw-1074319686128650520",
    "price": 299,
    "originalPrice": 399,
    "description": "Exclusive single-piece luxury boutique garment. Hand-curated silhouette in unique size XXL. Crafted in premium soft woven fabric.",
    "fabric": "100% Curated Boutique Cotton & Voile Weave",
    "fit": "Tailored Fit · Exclusive Size XXL (Single Piece)",
    "careInstructions": "Gentle hand wash cold or professional dry clean",
    "availability": "In Stock",
    "images": [
      "/images/products/pin_1074319686128650520.jpg"
    ],
    "sizes": [
      "XXL"
    ],
    "colours": [
      "Black"
    ],
    "category": "Blouses & Shirts",
    "isNewArrival": false,
    "isFeatured": true,
    "createdAt": "2026-11-19T14:35:28.162Z",
    "updatedAt": "2026-11-21T05:35:28.162Z"
  },
  {
    "id": "pin-1103944927444287114",
    "name": "Verdusa Y2K Pink Babydoll Halter Crop To",
    "code": "TW-P041",
    "slug": "tw-1103944927444287114",
    "price": 199,
    "originalPrice": 299,
    "description": "Exclusive single-piece luxury boutique garment. Hand-curated silhouette in unique size M. Crafted in premium soft woven fabric.",
    "fabric": "100% Curated Boutique Cotton & Voile Weave",
    "fit": "Tailored Fit · Exclusive Size M (Single Piece)",
    "careInstructions": "Gentle hand wash cold or professional dry clean",
    "availability": "In Stock",
    "images": [
      "/images/products/pin_1103944927444287114.jpg"
    ],
    "sizes": [
      "M"
    ],
    "colours": [
      "Red"
    ],
    "category": "Dresses & Tunics",
    "isNewArrival": false,
    "isFeatured": false,
    "createdAt": "2026-11-19T13:35:28.162Z",
    "updatedAt": "2026-11-21T05:35:28.162Z"
  }
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
