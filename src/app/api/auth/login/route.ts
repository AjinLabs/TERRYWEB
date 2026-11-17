import { NextRequest, NextResponse } from "next/server";
import { findUserByCredentials } from "@/lib/db";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Please enter your username/phone and password" },
        { status: 400 }
      );
    }

    const user = findUserByCredentials(username, password);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials. For Admin, use: admin / admin123" },
        { status: 401 }
      );
    }

    const token = signToken(user);

    const response = NextResponse.json({
      success: true,
      user,
      role: user.role,
      redirectTo: user.role === "admin" ? "/admin" : "/account",
    });

    // Set secure HTTP-only cookie
    response.cookies.set("terry_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during login" },
      { status: 500 }
    );
  }
}
