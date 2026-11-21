import { NextRequest, NextResponse } from "next/server";
import { createEnquiry, deleteProduct, getProducts, getSettings } from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";

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
      razorpayPaymentId,
      customerNotes,
    } = body;

    if (!customerName || !customerPhone) {
      return NextResponse.json(
        { error: "Customer name and phone number are required" },
        { status: 400 }
      );
    }

    if (!items || !items.length) {
      return NextResponse.json(
        { error: "Selection bag is empty" },
        { status: 400 }
      );
    }

    const totalAmount = items.reduce(
      (sum: number, it: any) => sum + Number(it.price) * Number(it.quantity),
      0
    );

    const paymentId = razorpayPaymentId || `pay_rzp_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // 1. Create Confirmed Order in database
    const newOrder = createEnquiry({
      userId: session?.userId,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail?.trim(),
      deliveryAddress,
      items,
      totalAmount,
      status: "Order Confirmed",
      paymentStatus: "Payment Received",
      paymentMethod: "Razorpay (Online Payment)",
      paymentReference: paymentId,
      paymentDate: new Date().toISOString(),
      adminNotes: `Payment verified via Razorpay ID: ${paymentId}. Ready for dispatch.`,
      customerNotes,
    });

    // 2. AUTOMATICALLY DELETE / REMOVE the purchased products from database
    // Because each dress is a unique single-size piece (1 of 1), once bought,
    // it must be completely removed so no other customer can see or buy it!
    const deletedProductIds: string[] = [];
    for (const item of items) {
      if (item.productId) {
        const deleted = deleteProduct(item.productId);
        if (deleted) {
          deletedProductIds.push(item.productId);
        }
      }
    }

    console.log(`[Razorpay Checkout] Order ${newOrder.orderId} placed. Auto-deleted sold garments:`, deletedProductIds);

    return NextResponse.json({
      success: true,
      order: newOrder,
      orderId: newOrder.orderId || newOrder.id,
      paymentId,
      deletedProductIds,
      message: "Payment confirmed successfully! Garment reserved and removed from catalogue.",
    });
  } catch (error: any) {
    console.error("Razorpay checkout error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
