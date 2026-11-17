"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import {
  ShieldCheck,
  User,
  KeyRound,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Info,
  Phone,
  Lock,
} from "lucide-react";
import Link from "next/link";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "register" ? "register" : "login";

  const { refreshUser } = useAuth();

  const [activeTab, setActiveTab] = useState<"login" | "register" | "forgot">(initialTab);

  // Login form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Register form state
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regEmail, setRegEmail] = useState("");

  // Forgot Password / OTP state
  const [forgotPhone, setForgotPhone] = useState("");
  const [otpStep, setOtpStep] = useState<"phone" | "verify">("phone");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpStatusMsg, setOtpStatusMsg] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Quick Credential Autofill Helper (Requested by client)
  const autofillAdmin = () => {
    setUsername("admin");
    setPassword("admin123");
    setError("");
  };

  const autofillCustomer = () => {
    setUsername("9876543210");
    setPassword("user123");
    setError("");
  };

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      await refreshUser();
      if (data.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/account");
      }
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  // Handle Register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName,
          phone: regPhone,
          password: regPassword,
          email: regEmail,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      await refreshUser();
      router.push("/account");
    } catch (err: any) {
      setError(err.message || "Failed to register account");
    } finally {
      setLoading(false);
    }
  };

  // Handle Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: forgotPhone, action: "send_otp" }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }

      setOtpStatusMsg(data.message);
      if (data.testOtp) {
        setOtpCode(data.testOtp);
      }
      setOtpStep("verify");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Reset Password with OTP
  const handleVerifyOtpReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: forgotPhone,
          otp: otpCode,
          newPassword,
          action: "reset",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setSuccessMsg("Password reset successfully! Please log in.");
      setActiveTab("login");
      setUsername(forgotPhone);
      setPassword(newPassword);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      {/* Editorial Card */}
      <div className="bg-white border border-[#E5E3DC] shadow-lg p-8 sm:p-10 relative">
        
        {/* Brand Heading */}
        <div className="text-center mb-8">
          <span className="text-[10px] uppercase tracking-widest text-[#0D3D2E] font-semibold block">
            TERRY WOMEN ATELIER
          </span>
          <h1 className="font-serif text-3xl text-neutral-900 mt-1">
            {activeTab === "login" && "Sign In"}
            {activeTab === "register" && "Create Account"}
            {activeTab === "forgot" && "Reset Password"}
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Browse freely without login · Sign in for admin or saved addresses
          </p>
        </div>

        {/* Demo Fast Login Pills (As requested: shows admin and user passwords clearly) */}
        <div className="bg-[#FAF9F5] border border-[#E5E3DC] p-3.5 mb-6 text-xs">
          <div className="flex items-center space-x-1.5 text-neutral-800 font-semibold text-[11px] uppercase tracking-wider mb-2">
            <KeyRound size={13} className="text-[#0D3D2E]" />
            <span>Fast Credentials (1-Click Fill)</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={autofillAdmin}
              className="p-2 bg-white border border-neutral-300 hover:border-black text-left transition-colors"
            >
              <span className="block font-semibold text-neutral-900 text-[11px]">
                🛡️ Admin Account
              </span>
              <span className="block text-[10px] text-neutral-500">
                admin / admin123
              </span>
            </button>
            <button
              type="button"
              onClick={autofillCustomer}
              className="p-2 bg-white border border-neutral-300 hover:border-black text-left transition-colors"
            >
              <span className="block font-semibold text-neutral-900 text-[11px]">
                👤 User Account
              </span>
              <span className="block text-[10px] text-neutral-500">
                9876543210 / user123
              </span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E5E3DC] mb-6 text-xs uppercase tracking-widest font-semibold">
          <button
            onClick={() => {
              setActiveTab("login");
              setError("");
            }}
            className={`flex-1 pb-3 transition-colors ${
              activeTab === "login"
                ? "border-b-2 border-black text-black"
                : "text-neutral-400 hover:text-black"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setActiveTab("register");
              setError("");
            }}
            className={`flex-1 pb-3 transition-colors ${
              activeTab === "register"
                ? "border-b-2 border-black text-black"
                : "text-neutral-400 hover:text-black"
            }`}
          >
            Register
          </button>
        </div>

        {/* Error / Success Alert */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 text-xs flex items-center space-x-2">
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1. LOGIN FORM (Unified for Admin & Customer) */}
        {activeTab === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-neutral-700 font-medium mb-1">
                Username / Mobile Number / Email
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter 'admin' or mobile number"
                className="w-full border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] uppercase tracking-wider text-neutral-700 font-medium">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("forgot");
                    setError("");
                  }}
                  className="text-[11px] text-neutral-500 hover:text-black underline"
                >
                  Forgot?
                </button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-black hover:bg-neutral-800 text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center space-x-2 transition-all mt-6 shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>
        )}

        {/* 2. REGISTRATION FORM */}
        {activeTab === "register" && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-neutral-700 font-medium mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                className="w-full border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-neutral-700 font-medium mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                required
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-neutral-700 font-medium mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="e.g. priya@example.com"
                className="w-full border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-neutral-700 font-medium mb-1">
                Create Password (min 6 characters) *
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Choose a secure password"
                className="w-full border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-black hover:bg-neutral-800 text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center space-x-2 transition-all mt-6 shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>
        )}

        {/* 3. FORGOT PASSWORD / REAL SMS OTP FORM */}
        {activeTab === "forgot" && (
          <div className="space-y-4">
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
              <strong>SMS OTP Verification Gateway:</strong>
              <p className="mt-0.5">
                Backend sends authentic SMS codes. If SMS API credentials are not yet configured in production environment, development sandbox code <strong>123456</strong> is used.
              </p>
            </div>

            {otpStep === "phone" ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-700 font-medium mb-1">
                    Registered Mobile Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={forgotPhone}
                    onChange={(e) => setForgotPhone(e.target.value)}
                    placeholder="Enter 10-digit mobile number"
                    className="w-full border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-black hover:bg-neutral-800 text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <span>Request Verification Code</span>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtpReset} className="space-y-4">
                {otpStatusMsg && (
                  <div className="text-xs text-neutral-700 bg-neutral-100 p-2.5 border border-neutral-200">
                    {otpStatusMsg}
                  </div>
                )}

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-700 font-medium mb-1">
                    Enter 6-Digit OTP Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="e.g. 123456"
                    className="w-full border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black font-mono tracking-widest text-center"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-700 font-medium mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-black hover:bg-neutral-800 text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <span>Set New Password & Sign In</span>
                  )}
                </button>
              </form>
            )}

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("login");
                  setError("");
                }}
                className="text-xs text-neutral-600 hover:text-black underline uppercase tracking-wider"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-xs uppercase tracking-widest text-neutral-400">Loading Portal...</div>}>
      <LoginContent />
    </Suspense>
  );
}
