import { NextRequest, NextResponse } from "next/server";
import { getEnquiryById, updateEnquiry } from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const enquiry = getEnquiryById(params.id);
    if (!enquiry) {
      return NextResponse.json(
        { error: "No order or enquiry found with this ID" },
        { status: 404 }
      );
    }
    return NextResponse.json({ enquiry });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized. Administrator rights required." },
        { status: 403 }
      );
    }

    const updates = await req.json();

    // If tracking number is updated and no custom URL provided, auto-generate standard tracking URLs
    if (updates.trackingNumber && !updates.trackingUrl) {
      if (updates.courierCompany === "Delhivery") {
        updates.trackingUrl = `https://www.delhivery.com/track/package/${updates.trackingNumber}`;
      } else if (updates.courierCompany === "India Post") {
        updates.trackingUrl = `https://www.indiapost.gov.in/_layouts/15/dpt.cptc.etracking/tracking.aspx`;
      }
    }

    const updated = updateEnquiry(params.id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, enquiry: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
