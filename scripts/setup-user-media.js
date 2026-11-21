const fs = require("fs");
const path = require("path");

const userUploadDir = "C:/Users/ajina/.gemini/antigravity/brain/b86847de-cfb3-4342-b2de-f3ee1d878523/.user_uploaded";
const publicImages = path.join(__dirname, "../public/images");
const publicProducts = path.join(__dirname, "../public/images/products");
const publicUploads = path.join(__dirname, "../public/uploads");

[publicImages, publicProducts, publicUploads].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

if (fs.existsSync(userUploadDir)) {
  const files = fs.readdirSync(userUploadDir);
  console.log("Found files:", files);

  // Logo file
  const logoFile = "media_1794890050832_c49866a2.jpg";
  if (files.includes(logoFile)) {
    const src = path.join(userUploadDir, logoFile);
    fs.copyFileSync(src, path.join(publicImages, "logo.jpg"));
    fs.copyFileSync(src, path.join(publicImages, "logo.png"));
    fs.copyFileSync(src, path.join(__dirname, "../public/logo.jpg"));
    console.log("Successfully copied brand logo!");
  }

  // Uploaded garment images mapping
  const garmentMap = [
    { file: "media_1794890277111_57dccb60.jpg", name: "garment_denim_corset.jpg", title: "Denim Contoured Corset Bodice", category: "Corsets & Tops", size: "M", colour: "Blue", price: 249, originalPrice: 699, code: "TW-UP01" },
    { file: "media_1794890296859_41fcbcbf.jpg", name: "garment_brown_ruched_crop.jpg", title: "Chocolate Ruched Sweetheart Crop Top", category: "Corsets & Tops", size: "L", colour: "Brown", price: 229, originalPrice: 649, code: "TW-UP02" },
    { file: "media_1794890304127_4e915fac.jpg", name: "garment_shirt_denim_corset.jpg", title: "White Shirt Overlay Denim Lace Corset", category: "Corsets & Tops", size: "M", colour: "White", price: 299, originalPrice: 799, code: "TW-UP03" },
    { file: "media_1794890311805_5c0432d9.jpg", name: "garment_floral_puff_blouse.jpg", title: "Feminine Floral Sweetheart Puff Blouse", category: "Blouses & Shirts", size: "XL", colour: "Cream", price: 279, originalPrice: 749, code: "TW-UP04" },
    { file: "media_1794890327815_79cd810b.jpg", name: "garment_boho_tunic_tassels.jpg", title: "Artisan Tassel Hand-Embroidered Halter Tunic", category: "Blouses & Shirts", size: "XXL", colour: "Pink", price: 269, originalPrice: 729, code: "TW-UP05" },
    { file: "media_1794890337345_17a59b67.jpg", name: "garment_sheer_brown_flaresleeve.jpg", title: "Sheer Chocolate Dramatic Bell-Sleeve Blouse", category: "Blouses & Shirts", size: "M", colour: "Brown", price: 299, originalPrice: 799, code: "TW-UP06" },
    { file: "media_1794890344687_33150f63.jpg", name: "garment_mint_pocket_shirt.jpg", title: "Light Mint Minimalist Pocket Overshirt", category: "Blouses & Shirts", size: "L", colour: "Green", price: 249, originalPrice: 699, code: "TW-UP07" },
    { file: "media_1794890358661_c55b4667.jpg", name: "garment_blue_striped_linen_tunic.jpg", title: "Indigo Striped Pure Linen Slub Tunic", category: "Blouses & Shirts", size: "XL", colour: "Light Blue", price: 239, originalPrice: 659, code: "TW-UP08" },
    { file: "media_1794890364609_3fd57d41.jpg", name: "garment_pink_striped_ruffle_smock.jpg", title: "Candy Striped Gathered Smock Blouse", category: "Blouses & Shirts", size: "XXL", colour: "Pink", price: 289, originalPrice: 789, code: "TW-UP09" },
  ];

  const newProducts = [];
  garmentMap.forEach((g, idx) => {
    if (files.includes(g.file)) {
      const src = path.join(userUploadDir, g.file);
      const destProd = path.join(publicProducts, g.name);
      const destUpload = path.join(publicUploads, g.name);
      fs.copyFileSync(src, destProd);
      fs.copyFileSync(src, destUpload);

      newProducts.push({
        id: `prod_upload_${idx + 1}`,
        name: g.title,
        code: g.code,
        price: g.price,
        originalPrice: g.originalPrice,
        category: g.category,
        sizes: [g.size],
        colours: [g.colour],
        availability: "In Stock (1-of-1 Piece)",
        isNewArrival: true,
        images: [`/images/products/${g.name}`, `/uploads/${g.name}`],
        description: `Exclusive 1-of-1 boutique release. Expertly tailored in size ${g.size} with fine finishings, delicate draping, and timeless luxury editorial silhouette.`,
        fabric: "Premium natural woven blend / artisanal boutique cotton finish",
        fit: `Tailored feminine silhouette in Size ${g.size} (Single piece available)`,
        careInstructions: "Delicate cold wash or dry clean recommended",
        tags: ["featured", "exclusive", "1-of-1", g.category.toLowerCase(), g.size.toLowerCase()],
        createdAt: new Date().toISOString()
      });
      console.log(`Copied ${g.name}`);
    }
  });

  // Now update database.json
  const dbPath = path.join(__dirname, "../data/database.json");
  if (fs.existsSync(dbPath)) {
    const db = JSON.parse(fs.readFileSync(dbPath, "utf8"));
    // Keep existing products that aren't old upload items, and prepend newProducts
    const existing = (db.products || []).filter(p => !p.id.startsWith("prod_upload_"));
    db.products = [...newProducts, ...existing];
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    console.log(`Database updated! Total products now: ${db.products.length}`);
  }
} else {
  console.log("Directory not found:", userUploadDir);
}
