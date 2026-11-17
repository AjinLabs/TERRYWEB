# TERRY WOMEN — Luxury Clothing Boutique

A production-ready luxury fashion boutique web application inspired by **Zara** and European fashion editorial aesthetics.

- **Store WhatsApp Concierge:** `+91 83308 89632`
- **Zero Payment Gateway Risk:** Direct WhatsApp order verification with manual UPI QR code payments.
- **Order Tracking:** Integrated Delhivery & India Post tracking support.
- **Browsing:** 100% public access — no registration or login required to browse garments or order.

---

## 🚀 One-Click Deploy to Vercel

1. Push this repository to your GitHub: `https://github.com/AjinLabs/TERRYWEB`
2. Go to [Vercel](https://vercel.com/) and click **"Add New Project"**.
3. Import `AjinLabs/TERRYWEB`.
4. Leave build settings as default (**Framework Preset: Next.js**).
5. (Optional) Set environment variables:
   - `JWT_SECRET`: Any random 32-character string.
   - `FAST2SMS_API_KEY`: (Optional) for live SMS OTP delivery.
6. Click **Deploy**!

---

## 🔑 Demo & Admin Credentials

Both Admin and Customer logins are unified on `/login` with 1-click fast autofill buttons:

| Account | Username / Mobile | Password | Destination |
| :--- | :--- | :--- | :--- |
| **Store Administrator** | `admin` | `admin123` | `/admin` (Admin Dashboard) |
| **Customer (Demo)** | `9876543210` | `user123` | `/account` (Customer Portal) |

---

## 👗 Garment Sizing & Predefined Colours

- **Sizes:** `M`, `L`, `XL`, `XXL`
- **20 Predefined Colourways:** Black, White, Light Blue, Dark Blue, Navy Blue, Sky Blue, Yellow, Red, Green, Pink, Beige, Brown, Grey, Maroon, Purple, Orange, Cream, Olive, Lavender, Wine.
- **Categories:** Corsets & Tops, Blouses & Shirts, Dresses & Tunics.

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Run local development server
npm run dev

# Or build and start production server
npm run build
npm start
```

Visit [http://localhost:3000](http://localhost:3000) to view the boutique storefront.
