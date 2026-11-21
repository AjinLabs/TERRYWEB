const http = require("http");

async function runTest() {
  console.log("Starting verification of product list and auto-delete...");
  
  // 1. Fetch products
  const res = await fetch("http://localhost:3000/api/products");
  const data = await res.json();
  console.log(`Current active products count: ${data.products.length}`);
  
  const testProduct = data.products.find(p => p.name.includes("Denim Contoured Corset"));
  if (!testProduct) {
    console.log("Test product not found, using first product:", data.products[0].name);
  }
  const target = testProduct || data.products[0];
  console.log(`Target product to purchase & auto-delete: ID ${target.id} - ${target.name} (Size: ${target.sizes[0]})`);

  // 2. Perform Razorpay Checkout
  const checkoutPayload = {
    customerName: "Priya Sharma",
    customerPhone: "+91 98765 43210",
    customerAddress: "Flat 4B, Panampilly Nagar, Kochi, Kerala",
    paymentMethod: "UPI (Google Pay / PhonePe)",
    paymentId: "pay_demo_test_" + Date.now(),
    items: [
      {
        productId: target.id,
        name: target.name,
        price: target.price,
        size: target.sizes[0],
        colour: target.colours[0],
        quantity: 1,
        image: target.images[0]
      }
    ],
    totalAmount: target.price
  };

  const checkoutRes = await fetch("http://localhost:3000/api/checkout/razorpay", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(checkoutPayload)
  });

  const checkoutData = await checkoutRes.json();
  console.log("Checkout response:", checkoutData);

  // 3. Verify product is deleted from catalog
  const verifyRes = await fetch("http://localhost:3000/api/products");
  const verifyData = await verifyRes.json();
  const found = verifyData.products.find(p => p.id === target.id);
  console.log(`Was target product deleted? ${!found ? "YES (Successfully Auto-Deleted!)" : "NO (Still present!)"}`);
  console.log(`Updated products count: ${verifyData.products.length}`);

  // 4. Verify order enquiry tracking ID
  console.log(`Order Enquiry ID generated: ${checkoutData.enquiry?.id}`);
}

runTest().catch(console.error);
