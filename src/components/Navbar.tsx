"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cartContext";
import { useAuth } from "@/lib/authContext";
import { ShoppingBag, User as UserIcon, Search, Menu, X, ShieldCheck } from "lucide-react";

export default function Navbar() {
  const { totalItems, setIsCartOpen } = useCart();
  const { user, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-[#0D3D2E] text-[#F4F2EB] text-[11px] tracking-widest uppercase py-2 px-4 text-center font-medium border-b border-[#08281e]">
        <span>Complimentary Domestic Delivery on Boutique Orders · WhatsApp Concierge: +91 83308 89632</span>
      </div>

      {/* Main Navigation */}
      <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#E8E6DF] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Mobile menu toggle */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-800 hover:text-black focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Desktop Links Left */}
          <nav className="hidden lg:flex items-center space-x-8 text-[12px] uppercase tracking-widest font-medium text-neutral-800">
            <Link href="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <Link href="/products" className="hover:text-black transition-colors">
              Collection
            </Link>
            <Link href="/products?category=Corsets+%26+Tops" className="hover:text-black transition-colors">
              Corsets & Tops
            </Link>
            <Link href="/products?category=Blouses+%26+Shirts" className="hover:text-black transition-colors">
              Blouses
            </Link>
            <Link href="/track" className="hover:text-black transition-colors">
              Track Order
            </Link>
          </nav>

          {/* Brand Identity / Logo Center */}
          <div className="flex items-center justify-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative w-11 h-11 rounded-full overflow-hidden border border-[#0D3D2E]/20 shadow-sm transition-transform group-hover:scale-105">
                <Image
                  src="/images/logo.jpg"
                  alt="TERRY WOMEN Logo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl tracking-[0.2em] font-bold text-neutral-900 uppercase">
                  TERRY
                </span>
                <span className="text-[9px] tracking-[0.35em] text-[#0D3D2E] font-semibold uppercase -mt-1">
                  WOMEN
                </span>
              </div>
            </Link>
          </div>

          {/* Right Icons: Search, User/Admin, Bag */}
          <div className="flex items-center space-x-5 text-neutral-800">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-1 hover:text-black transition-colors"
              title="Search Collection"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>

            {/* User / Admin Portal */}
            {isAdmin ? (
              <div className="flex items-center space-x-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center space-x-1.5 px-2.5 py-1 text-[11px] uppercase tracking-wider font-semibold bg-[#0D3D2E] text-white rounded hover:bg-[#092b20] transition-colors"
                  title="Admin Dashboard"
                >
                  <ShieldCheck size={14} />
                  <span>Admin</span>
                </Link>
              </div>
            ) : user ? (
              <Link
                href="/account"
                className="p-1 hover:text-black transition-colors flex items-center space-x-1"
                title="My Account"
              >
                <UserIcon size={20} strokeWidth={1.5} />
                <span className="hidden md:inline text-xs font-medium uppercase tracking-wider">
                  {user.name.split(" ")[0]}
                </span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="p-1 hover:text-black transition-colors flex items-center space-x-1"
                title="Login / Account"
              >
                <UserIcon size={20} strokeWidth={1.5} />
                <span className="hidden md:inline text-[11px] uppercase tracking-wider">
                  Sign In
                </span>
              </Link>
            )}

            {/* Shopping Bag Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-1 hover:text-black transition-colors"
              title="View Cart & Order via WhatsApp"
            >
              <ShoppingBag size={21} strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-neutral-900 text-white text-[10px] font-semibold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#FAF9F5]">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Expandable Search Drawer */}
        {searchOpen && (
          <div className="bg-[#F4F2EB] border-t border-b border-[#E5E3DC] px-4 py-4 animate-fade-in">
            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex items-center gap-3">
              <Search size={18} className="text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dresses, corsets, blouses, or product codes (e.g. TW-CT01)..."
                className="w-full bg-transparent border-b border-neutral-400 py-2 text-sm focus:outline-none focus:border-black placeholder-neutral-500 text-neutral-900"
                autoFocus
              />
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white text-xs uppercase tracking-wider font-medium hover:bg-neutral-800"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-2 text-neutral-500 hover:text-black"
              >
                <X size={18} />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FAF9F5] border-t border-[#E5E3DC] px-6 py-6 space-y-4 animate-fade-in">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm uppercase tracking-widest font-medium text-neutral-900 py-1.5 border-b border-neutral-200"
            >
              Home
            </Link>
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm uppercase tracking-widest font-medium text-neutral-900 py-1.5 border-b border-neutral-200"
            >
              All Garments & Dresses
            </Link>
            <Link
              href="/products?category=Corsets+%26+Tops"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm uppercase tracking-widest font-medium text-neutral-900 py-1.5 border-b border-neutral-200"
            >
              Corsets & Tops
            </Link>
            <Link
              href="/products?category=Blouses+%26+Shirts"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm uppercase tracking-widest font-medium text-neutral-900 py-1.5 border-b border-neutral-200"
            >
              Blouses & Shirts
            </Link>
            <Link
              href="/products?category=Dresses+%26+Tunics"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm uppercase tracking-widest font-medium text-neutral-900 py-1.5 border-b border-neutral-200"
            >
              Dresses & Tunics
            </Link>
            <Link
              href="/track"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm uppercase tracking-widest font-medium text-neutral-900 py-1.5 border-b border-neutral-200"
            >
              Track Order / Shipment
            </Link>
            
            <div className="pt-4 flex flex-col space-y-2">
              {isAdmin ? (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 bg-[#0D3D2E] text-white text-xs uppercase tracking-widest font-medium"
                >
                  Admin Dashboard
                </Link>
              ) : user ? (
                <>
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 bg-neutral-900 text-white text-xs uppercase tracking-widest font-medium"
                  >
                    My Account ({user.name})
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-center py-2 text-xs uppercase tracking-wider text-neutral-600 hover:text-black"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 border border-neutral-900 text-neutral-900 text-xs uppercase tracking-widest font-medium"
                >
                  Sign In / Customer & Admin
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
