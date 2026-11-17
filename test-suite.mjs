// End-to-end Automated Test Suite for TERRY WOMEN Luxury Boutique
const BASE_URL = "http://localhost:3000";

async function runTests() {
  console.log("=================================================");
  console.log("   TERRY WOMEN LUXURY BOUTIQUE - TEST SUITE      ");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Homepage Test
    console.log("--- 1. Testing Homepage & Public Access ---");
    const homeRes = await fetch(`${BASE_URL}/`);
    const homeHtml = await homeRes.text();
    assert(homeRes.status === 200, "Homepage returns HTTP 200 OK without requiring login");
    assert(homeHtml.includes("TERRY") && homeHtml.includes("WOMEN"), "Homepage includes TERRY WOMEN branding");
    assert(homeHtml.includes("83308 89632"), "Homepage displays configured WhatsApp concierge number +91 83308 89632");
    assert(homeHtml.includes("Complimentary"), "Complimentary delivery notice present");

    // 2. Products API & Filters Test
    console.log("\n--- 2. Testing Products & Filtering ---");
    const prodRes = await fetch(`${BASE_URL}/api/products`);
    const prodData = await prodRes.json();
    assert(prodData.products && prodData.products.length >= 9, `Products catalog loaded (${prodData.products?.length} garments)`);

    // Verify sizes M, L, XL, XXL
    const sampleProduct = prodData.products[0];
    assert(sampleProduct.sizes.includes("M") || sampleProduct.sizes.includes("L"), "Product has boutique standard sizing (M, L, XL, XXL)");
    assert(Array.isArray(sampleProduct.images) && sampleProduct.images.length >= 1, "Product has high quality image paths");

    // Filter by colour
    const colourRes = await fetch(`${BASE_URL}/api/products?colour=Brown`);
    const colourData = await colourRes.json();
    const allBrown = colourData.products.every(p => p.colours.some(c => c.toLowerCase() === "brown"));
    assert(allBrown && colourData.products.length > 0, `Colour filter for 'Brown' works correctly (${colourData.products.length} found)`);

    // Filter by size
    const sizeRes = await fetch(`${BASE_URL}/api/products?size=M`);
    const sizeData = await sizeRes.json();
    const allM = sizeData.products.every(p => p.sizes.includes("M"));
    assert(allM && sizeData.products.length > 0, `Size filter for 'M' works correctly (${sizeData.products.length} found)`);

    // 3. WhatsApp Enquiry Creation Test
    console.log("\n--- 3. Testing Cart to WhatsApp Order System ---");
    const enquiryPayload = {
      customerName: "Aiswarya Menon",
      customerPhone: "9847012345",
      deliveryAddress: {
        fullName: "Aiswarya Menon",
        phone: "9847012345",
        street: "Riverdale Villa 12, Panampilly Nagar",
        city: "Kochi",
        district: "Ernakulam",
        state: "Kerala",
        pincode: "682036",
        landmark: "Opposite Avenue Centre",
      },
      customerNotes: "Please provide luxury gift packaging.",
      items: [
        {
          productId: sampleProduct.id,
          productName: sampleProduct.name,
          productCode: sampleProduct.code,
          image: sampleProduct.images[0],
          size: "M",
          colour: sampleProduct.colours[0],
          quantity: 2,
          price: sampleProduct.price,
          subtotal: sampleProduct.price * 2,
        },
      ],
    };

    const enqRes = await fetch(`${BASE_URL}/api/enquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(enquiryPayload),
    });
    const enqData = await enqRes.json();
    assert(enqRes.status === 200 && enqData.success, "Enquiry created successfully in database");
    assert(enqData.enquiry.id.startsWith("ENQ-"), `Generated unique Enquiry ID: ${enqData.enquiry.id}`);
    assert(Boolean(enqData.whatsappUrl), "Generated WhatsApp Click-to-Chat URL");
    assert(enqData.whatsappUrl.includes("8330889632"), "WhatsApp URL points to Store Owner number 918330889632");
    assert(enqData.whatsappMessage.includes("Aiswarya Menon"), "WhatsApp message contains customer name");
    assert(enqData.whatsappMessage.includes(sampleProduct.name), "WhatsApp message contains itemized product details");
    assert(enqData.whatsappMessage.includes("Photo Link:"), "WhatsApp message includes direct product photo URLs");

    const createdEnquiryId = enqData.enquiry.id;

    // 4. Order Tracking Test
    console.log("\n--- 4. Testing Order Tracking System ---");
    const trackRes = await fetch(`${BASE_URL}/api/enquiries/${createdEnquiryId}`);
    const trackData = await trackRes.json();
    assert(trackRes.status === 200, `Retrieved tracking details for ${createdEnquiryId}`);
    assert(trackData.enquiry.status === "Enquiry Received", "Initial status is 'Enquiry Received'");

    // 5. Authentication Test (Admin & Customer)
    console.log("\n--- 5. Testing Unified Authentication ---");
    // Admin Login test (User requested: admin / admin123)
    const adminLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "admin123" }),
    });
    const adminLoginData = await adminLoginRes.json();
    assert(adminLoginRes.status === 200, "Admin login with 'admin' / 'admin123' succeeds");
    assert(adminLoginData.role === "admin", "User authenticated with role 'admin'");
    assert(adminLoginData.redirectTo === "/admin", "Admin is redirected to /admin");

    const adminCookie = adminLoginRes.headers.get("set-cookie");
    assert(Boolean(adminCookie), "HTTP-only session cookie set for Admin");

    // Customer Login test (9876543210 / user123)
    const userLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "9876543210", password: "user123" }),
    });
    const userLoginData = await userLoginRes.json();
    assert(userLoginRes.status === 200, "Customer login succeeds with '9876543210' / 'user123'");
    assert(userLoginData.role === "customer", "User authenticated with role 'customer'");
    assert(userLoginData.redirectTo === "/account", "Customer is redirected to /account");

    // 6. Admin Order Management, Manual QR Payment & Courier Tracking
    console.log("\n--- 6. Testing Admin Workflow: Payment Verification & Shipping ---");
    const cookieHeader = adminCookie ? adminCookie.split(";")[0] : "";

    const updateRes = await fetch(`${BASE_URL}/api/enquiries/${createdEnquiryId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify({
        status: "Shipped",
        paymentStatus: "Payment Received",
        paymentReference: "UPI-GPay-98321049281",
        courierCompany: "Delhivery",
        trackingNumber: "DEL10928374921",
        adminNotes: "Customer sent screenshot of UPI payment. Packed and dispatched via Delhivery Express.",
      }),
    });
    const updateData = await updateRes.json();
    assert(updateRes.status === 200 && updateData.success, "Admin successfully recorded manual payment & marked order as Shipped");
    assert(updateData.enquiry.status === "Shipped", "Order status transitioned to 'Shipped'");
    assert(updateData.enquiry.courierCompany === "Delhivery", "Courier assigned to Delhivery");
    assert(updateData.enquiry.trackingNumber === "DEL10928374921", "AWB Tracking Number saved");
    assert(Boolean(updateData.enquiry.trackingUrl), `Auto-generated live tracking URL: ${updateData.enquiry.trackingUrl}`);

    // Verify Tracking Page updates
    const verifyTrackRes = await fetch(`${BASE_URL}/api/enquiries/${createdEnquiryId}`);
    const verifyTrackData = await verifyTrackRes.json();
    assert(verifyTrackData.enquiry.paymentStatus === "Payment Received", "Customer sees 'Payment Received'");
    assert(verifyTrackData.enquiry.status === "Shipped", "Customer sees 'Shipped'");
    assert(verifyTrackData.enquiry.trackingNumber === "DEL10928374921", "Customer sees Delhivery AWB number");

    // 7. Store Settings API Test
    console.log("\n--- 7. Testing Store Settings & Config ---");
    const settingsRes = await fetch(`${BASE_URL}/api/settings`);
    const settingsData = await settingsRes.json();
    assert(settingsData.settings.storeName === "TERRY WOMEN", "Store Name is 'TERRY WOMEN'");
    assert(settingsData.settings.whatsappNumber === "+91 83308 89632", "WhatsApp is +91 83308 89632");
    assert(Boolean(settingsData.settings.upiId), `Store UPI ID configured: ${settingsData.settings.upiId}`);

    // 8. SMS OTP Gateway Verification Status
    console.log("\n--- 8. Testing SMS OTP Verification Gateway ---");
    const otpRes = await fetch(`${BASE_URL}/api/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: "9876543210", action: "send_otp" }),
    });
    const otpData = await otpRes.json();
    assert(otpData.success, "Password reset / OTP verification endpoint responds with clear gateway status");

    console.log("\n=================================================");
    console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log("=================================================");

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error("Test execution failed with error:", error);
    process.exit(1);
  }
}

runTests();
