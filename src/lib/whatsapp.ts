import { Enquiry, StoreSettings } from "@/types";

export function formatWhatsAppMessage(enquiry: Enquiry, settings: StoreSettings, baseUrl: string): string {
  const lines: string[] = [];

  lines.push(`✨ *NEW ORDER ENQUIRY — ${settings.storeName.toUpperCase()}* ✨`);
  lines.push(`Enquiry ID: *${enquiry.id}*`);
  lines.push(`Date: ${new Date(enquiry.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`);
  lines.push(``);
  lines.push(`*CUSTOMER DETAILS:*`);
  lines.push(`• Name: ${enquiry.customerName}`);
  lines.push(`• Contact: ${enquiry.customerPhone}`);

  if (enquiry.deliveryAddress) {
    const addr = enquiry.deliveryAddress;
    const addrStr = [
      addr.street,
      addr.landmark ? `(Landmark: ${addr.landmark})` : "",
      addr.city,
      addr.district,
      addr.state,
      `PIN: ${addr.pincode}`,
      addr.altPhone ? `Alt Phone: ${addr.altPhone}` : "",
    ]
      .filter(Boolean)
      .join(", ");
    lines.push(`• Delivery Address: ${addrStr}`);
  }

  lines.push(``);
  lines.push(`*ORDER ITEMS (${enquiry.items.length}):*`);

  enquiry.items.forEach((item, index) => {
    lines.push(``);
    lines.push(`${index + 1}. *${item.productName}*`);
    lines.push(`   • Code: ${item.productCode}`);
    lines.push(`   • Size: *${item.size}* | Colour: *${item.colour}*`);
    lines.push(`   • Qty: ${item.quantity} × ₹${item.price.toLocaleString("en-IN")} = ₹${item.subtotal.toLocaleString("en-IN")}`);
    
    // Convert relative image path to full URL
    const fullImageUrl = item.image.startsWith("http")
      ? item.image
      : `${baseUrl}${item.image}`;
    lines.push(`   • Photo Link: ${fullImageUrl}`);
  });

  lines.push(``);
  lines.push(`━━━━━━━━━━━━━━━━━━━━━`);
  lines.push(`*TOTAL AMOUNT: ₹${enquiry.totalAmount.toLocaleString("en-IN")}*`);
  lines.push(`━━━━━━━━━━━━━━━━━━━━━`);

  if (enquiry.customerNotes) {
    lines.push(``);
    lines.push(`*Customer Note:* ${enquiry.customerNotes}`);
  }

  lines.push(``);
  lines.push(`_Hello ${settings.storeName}! Please confirm garment availability for my selected sizes and colours, and share your payment QR code._`);

  return lines.join("\n");
}

export function generateWhatsAppUrl(phone: string, message: string): string {
  // Strip non-digits
  const cleanPhone = phone.replace(/\D/g, "");
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}
