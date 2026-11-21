import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/authContext";
import { CartProvider } from "@/lib/cartContext";
import AppLayout from "@/components/AppLayout";

export const metadata: Metadata = {
  title: "TERRY WOMEN — Luxury Boutique Garments & Haute Pret",
  description:
    "Discover handcrafted feminine silhouettes, structured corsets, and timeless bespoke blouses. Exclusive 1-of-1 pieces with express delivery across Kerala and pan-India.",
  icons: {
    icon: "/images/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Inter:wght@200;300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#FAF9F5] text-neutral-900 min-h-screen flex flex-col selection:bg-neutral-900 selection:text-white">
        <AuthProvider>
          <CartProvider>
            <AppLayout>{children}</AppLayout>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
