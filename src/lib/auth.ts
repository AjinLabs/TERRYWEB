import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { User } from "@/types";

const JWT_SECRET = process.env.JWT_SECRET || "terry-women-boutique-secret-key-2026-luxury-couture";

export interface TokenPayload {
  userId: string;
  name: string;
  phone: string;
  role: "customer" | "admin";
}

export function signToken(user: User): string {
  const payload: TokenPayload = {
    userId: user.id,
    name: user.name,
    phone: user.phone,
    role: user.role,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<TokenPayload | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("terry_session")?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

export function getSessionFromRequest(req: NextRequest): TokenPayload | null {
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (decoded) return decoded;
  }

  const cookieToken = req.cookies.get("terry_session")?.value;
  if (cookieToken) {
    return verifyToken(cookieToken);
  }

  return null;
}
