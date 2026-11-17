import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/db";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, password, email } = body;

    if (!name || !phone || !password) {
      return NextResponse.json(
        { error: "Full name, mobile number, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    const cleanPhone = phone.trim().replace(/\s+/g, "");

    const user = createUser({
      name: name.trim(),
      phone: cleanPhone,
      password,
      email: email?.trim(),
      role: "customer",
    });

    const token = signToken(user);

    const response = NextResponse.json({
      success: true,
      user,
      redirectTo: "/account",
    });

    response.cookies.set("terry_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create account" },
      { status: 400 }
    );
  }
}
