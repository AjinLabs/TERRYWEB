import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getProducts, getSettings } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import { ArrowRight, MessageCircle, Sparkles, Shield, Compass, CheckCircle } from "lucide-react";

export const revalidate = 0;

export default function HomePage() {
  const products = getProducts();
  const settings = getSettings();

  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 4);
  const featured = products.filter((p) => p.isFeatured).slice(0, 6);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Editorial Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-[#F4F1EA] overflow-hidden px-4 sm:px-6">
        {/* Subtle background grain/glow */}
        <div className="absolute inset-0 bg-[radial-gradient(#141413_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03]" />
        
        <div className="relative max-w-5xl mx-auto text-center py-16 sm:py-24 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#0D3D2E]/10 border border-[#0D3D2E]/20 text-[#0D3D2E] text-[11px] uppercase tracking-widest font-semibold rounded-full mb-2">
            <Sparkles size={13} />
            <span>Autumn / Winter Luxury Boutique Edit</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-neutral-900 leading-[1.08]">
            Architectural Silhouettes & <br />
            <span className="italic font-light">Artisan Tailored Elegance</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-neutral-600 leading-relaxed font-light">
            Indulge in couture-grade corsets, ruched basques, and romantic poplin blouses.
            Designed for effortless presence, ordered directly through our WhatsApp concierge.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/products"
              className="w-full sm:w-auto px-9 py-4 bg-black hover:bg-neutral-800 text-white text-xs uppercase tracking-widest font-medium transition-all shadow-md flex items-center justify-center space-x-2"
            >
              <span>Explore The Collection</span>
              <ArrowRight size={14} />
            </Link>

            <a
              href={`https://wa.me/${settings.whatsappCleanNumber}?text=Hello%20${encodeURIComponent(settings.storeName)},%20I%20would%20like%20to%20enquire%20about%20your%20boutique%20garments.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-9 py-4 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs uppercase tracking-widest font-semibold transition-all shadow-md flex items-center justify-center space-x-2"
            >
              <MessageCircle size={16} />
              <span>WhatsApp Concierge</span>
            </a>
          </div>

          {/* Quick Stats Pill */}
          <div className="pt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs text-neutral-500 uppercase tracking-wider">
            <span>Sizes: M · L · XL · XXL</span>
            <span>•</span>
            <span>20 Predefined Colorways</span>
            <span>•</span>
            <span>Complimentary Pan-India Dispatch</span>
          </div>
        </div>
      </section>

      {/* Featured Categories Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/products?category=Corsets+%26+Tops"
            className="group relative h-96 bg-[#EBE8E0] overflow-hidden border border-[#E5E3DC] flex flex-col justify-end p-8"
          >
            <Image
              src="/images/products/denim-corset.jpg"
              alt="Corsets & Bodices"
              fill
              className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="relative z-10 text-white space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-semibold">
                Sculpted Silhouettes
              </span>
              <h3 className="font-serif text-2xl font-normal">Corsets & Bodices</h3>
              <p className="text-xs text-neutral-300">From ₹1,850 · Sizes M to XXL</p>
            </div>
          </Link>

          <Link
            href="/products?category=Blouses+%26+Shirts"
            className="group relative h-96 bg-[#EBE8E0] overflow-hidden border border-[#E5E3DC] flex flex-col justify-end p-8"
          >
            <Image
              src="/images/products/white-shirt-denim-corset.jpg"
              alt="Blouses & Shirts"
              fill
              className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="relative z-10 text-white space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-semibold">
                Haute Poplin
              </span>
              <h3 className="font-serif text-2xl font-normal">Artisan Blouses & Shirts</h3>
              <p className="text-xs text-neutral-300">Hybrid tailoring and romantic sleeves</p>
            </div>
          </Link>

          <Link
            href="/products?category=Dresses+%26+Tunics"
            className="group relative h-96 bg-[#EBE8E0] overflow-hidden border border-[#E5E3DC] flex flex-col justify-end p-8"
          >
            <Image
              src="/images/products/coral-striped-tunic.jpg"
              alt="Dresses & Tunics"
              fill
              className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="relative z-10 text-white space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-semibold">
                Effortless Movement
              </span>
              <h3 className="font-serif text-2xl font-normal">Tunics & Babydoll Dresses</h3>
              <p className="text-xs text-neutral-300">Tiered mulmul and artisanal weaves</p>
            </div>
          </Link>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#E5E3DC] pb-4 mb-8">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#0D3D2E] font-semibold block">
              Curated Selection
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-neutral-900 mt-1">
              New Arrivals
            </h2>
          </div>
          <Link
            href="/products?sort=newest"
            className="mt-3 sm:mt-0 text-xs uppercase tracking-widest font-medium text-neutral-800 hover:text-black inline-flex items-center space-x-1"
          >
            <span>View All Garments</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* WhatsApp Concierge Workflow Explanation */}
      <section className="bg-[#F3EFE6] border-y border-[#E2DDD2] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[10px] uppercase tracking-widest text-[#0D3D2E] font-semibold block">
              Direct Boutique Service
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-neutral-900 mt-1">
              How WhatsApp Ordering Works
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-2">
              No complicated gateways or payment risks. Direct communication with the boutique atelier.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 border border-[#E5E3DC] relative">
              <span className="font-serif text-3xl font-light text-[#C5A880]">01</span>
              <h3 className="font-serif text-xl text-neutral-900 mt-2 mb-2">Curate Your Bag</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Browse our collection without any forced login. Select your size (M, L, XL, XXL) and preferred colour from our 20 predefined shades, then add to bag.
              </p>
            </div>

            <div className="bg-white p-8 border border-[#E5E3DC] relative">
              <span className="font-serif text-3xl font-light text-[#C5A880]">02</span>
              <h3 className="font-serif text-xl text-neutral-900 mt-2 mb-2">Send WhatsApp Enquiry</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Click “Order via WhatsApp”. A unique Enquiry ID is generated and WhatsApp opens with your full item list, photos, sizes, and pricing to +91 83308 89632.
              </p>
            </div>

            <div className="bg-white p-8 border border-[#E5E3DC] relative">
              <span className="font-serif text-3xl font-light text-[#C5A880]">03</span>
              <h3 className="font-serif text-xl text-neutral-900 mt-2 mb-2">Manual QR & Track</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Admin verifies stock, shares the payment QR code on WhatsApp. Once paid, the order is confirmed and shipped via Delhivery or India Post with online tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Atelier Editorial Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#E5E3DC] pb-4 mb-8">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#0D3D2E] font-semibold block">
              Boutique Signature
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-neutral-900 mt-1">
              Editorial Favorites
            </h2>
          </div>
          <Link
            href="/products"
            className="mt-3 sm:mt-0 text-xs uppercase tracking-widest font-medium text-neutral-800 hover:text-black inline-flex items-center space-x-1"
          >
            <span>See Entire Boutique</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
