"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Shield, Truck, Sparkles, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#141413] text-[#FAF9F5] pt-16 pb-12 border-t border-neutral-800">
      {/* Brand Values Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-neutral-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-full text-[#C5A880]">
              <Sparkles size={20} />
            </div>
            <div>
              <h4 className="font-serif text-lg text-white">Boutique Craftsmanship</h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Hand-curated silhouettes, corset boning, and premium fabrics tailored for timeless elegance.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-full text-[#C5A880]">
              <Shield size={20} />
            </div>
            <div>
              <h4 className="font-serif text-lg text-white">Instant Online Checkout</h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Secure digital checkout, automated 1-of-1 reserve, and fast dispatch across Kerala & India.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-full text-[#C5A880]">
              <Truck size={20} />
            </div>
            <div>
              <h4 className="font-serif text-lg text-white">Pan-India Express Dispatch</h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Delivered safely via Delhivery Express & India Post with real-time tracking IDs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-neutral-700">
                <Image
                  src="/images/logo.jpg"
                  alt="TERRY WOMEN"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="font-serif text-xl tracking-[0.2em] font-bold text-white uppercase block">
                  TERRY
                </span>
                <span className="text-[9px] tracking-[0.35em] text-[#C5A880] font-semibold uppercase block -mt-1">
                  WOMEN
                </span>
              </div>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Zara-inspired luxury boutique fashion. Contemporary feminine silhouettes designed for effortless distinction and modern allure.
            </p>
            <div className="pt-2">
              <span className="inline-block px-3 py-1 bg-neutral-900 border border-neutral-800 text-[11px] text-[#C5A880] uppercase tracking-wider font-semibold">
                No Return & No Replacement Policy
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h5 className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold">
              The Collection
            </h5>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  All Garments & Dresses
                </Link>
              </li>
              <li>
                <Link href="/products?category=Corsets+%26+Tops" className="hover:text-white transition-colors">
                  Corset Tops & Bodices
                </Link>
              </li>
              <li>
                <Link href="/products?category=Blouses+%26+Shirts" className="hover:text-white transition-colors">
                  Artisan Blouses & Shirts
                </Link>
              </li>
              <li>
                <Link href="/products?category=Dresses+%26+Tunics" className="hover:text-white transition-colors">
                  Tunics & Babydoll Dresses
                </Link>
              </li>
              <li>
                <Link href="/products?isNew=true" className="hover:text-white transition-colors">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service & Tracking */}
          <div className="space-y-3">
            <h5 className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold">
              Client Concierge
            </h5>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <Link href="/track" className="hover:text-white transition-colors">
                  Track Your Shipment
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-white transition-colors">
                  Customer Dashboard
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Client & Admin Sign In
                </Link>
              </li>
              <li>
                <span className="text-neutral-500">Sizes Available: M, L, XL, XXL</span>
              </li>
              <li>
                <span className="text-neutral-500">20 Predefined Colorways</span>
              </li>
            </ul>
          </div>

          {/* Contact & Boutique Details */}
          <div className="space-y-3 text-xs text-neutral-400">
            <h5 className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold">
              Boutique Desk
            </h5>
            <div className="flex items-start space-x-2">
              <Phone size={14} className="mt-0.5 text-[#C5A880]" />
              <span>+91 83308 89632 (Client Concierge)</span>
            </div>
            <div className="flex items-start space-x-2">
              <Mail size={14} className="mt-0.5 text-[#C5A880]" />
              <span>orders@terrywomen.com</span>
            </div>
            <div className="flex items-start space-x-2">
              <MapPin size={14} className="mt-0.5 text-[#C5A880]" />
              <span>Marine Drive Promenade, Kochi, Kerala, India</span>
            </div>
            <div className="pt-2">
              <Link
                href="/login?tab=admin"
                className="inline-flex items-center space-x-1.5 text-[11px] uppercase tracking-wider text-neutral-400 hover:text-white transition-colors border border-neutral-700 px-3 py-1.5 rounded"
              >
                <Shield size={12} />
                <span>Admin Portal</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-neutral-800 text-[11px] text-neutral-500 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          © {new Date().getFullYear()} TERRY WOMEN Boutique. All Rights Reserved. Exclusive Handcrafted Garments.
        </div>
        <div className="flex items-center space-x-6">
          <span>100% Encrypted Checkout</span>
          <span>•</span>
          <span>Immediate 1-of-1 Catalog Auto-Delete</span>
          <span>•</span>
          <span>Express Delivery Across Kerala & India</span>
        </div>
      </div>
    </footer>
  );
}
