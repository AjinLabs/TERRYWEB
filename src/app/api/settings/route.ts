import { NextRequest, NextResponse } from "next/server";
import { getSettings, updateSettings } from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET() {
  try {
    const settings = getSettings();
    return NextResponse.json({ settings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized. Administrator rights required." },
        { status: 403 }
      );
    }

    const updates = await req.json();
    const cleanWhatsApp = updates.whatsappNumber
      ? updates.whatsappNumber.replace(/\D/g, "")
      : undefined;

    const newSettings = updateSettings({
      ...updates,
      ...(cleanWhatsApp ? { whatsappCleanNumber: cleanPhone(cleanWhatsApp) } : {}),
    });

    return NextResponse.json({ success: true, settings: newSettings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function cleanPhone(num: string): string {
  if (num.startsWith("0")) return "91" + num.slice(1);
  if (!num.startsWith("91") && num.length === 10) return "91" + num;
  return num;
}
