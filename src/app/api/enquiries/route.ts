import { NextRequest, NextResponse } from "next/server";
import { createEnquiry, getEnquiries, getEnquiriesByPhoneOrUser, getSettings } from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";
import { formatWhatsAppMessage, generateWhatsAppUrl } from "@/lib/whatsapp";

export async function GET(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone");

    // If Admin, can view all enquiries
    if (session && session.role === "admin") {
      const enquiries = getEnquiries();
      return NextResponse.json({ enquiries });
    }

    // If customer session or customer querying their phone
    if (session) {
      const enquiries = getEnquiriesByPhoneOrUser(session.phone, session.userId);
      return NextResponse.json({ enquiries });
    }

    if (phone) {
      const enquiries = getEnquiriesByPhoneOrUser(phone);
      return NextResponse.json({ enquiries });
    }

    return NextResponse.json({ enquiries: [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    const body = await req.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      deliveryAddress,
      items,
      customerNotes,
    } = body;

    if (!customerName || !customerPhone) {
      return NextResponse.json(
        { error: "Customer name and WhatsApp phone number are required." },
        { status: 400 }
      );
    }

    if (!items || !items.length) {
      return NextResponse.json(
        { error: "Cart is empty. Please select products to order." },
        { status: 400 }
      );
    }

    const totalAmount = items.reduce(
      (sum: number, it: any) => sum + Number(it.price) * Number(it.quantity),
      0
    );

    const newEnquiry = createEnquiry({
      userId: session?.userId,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail?.trim(),
      deliveryAddress,
      items,
      totalAmount,
      status: "Enquiry Received",
      paymentStatus: "Pending",
      customerNotes,
    });

    const settings = getSettings();
    const baseUrl = req.headers.get("origin") || "http://localhost:3000";
    const formattedMessage = formatWhatsAppMessage(newEnquiry, settings, baseUrl);
    const whatsappUrl = generateWhatsAppUrl(settings.whatsappNumber, formattedMessage);

    return NextResponse.json({
      success: true,
      enquiry: newEnquiry,
      whatsappUrl,
      whatsappMessage: formattedMessage,
    });
  } catch (error: any) {
    console.error("Error creating enquiry:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
