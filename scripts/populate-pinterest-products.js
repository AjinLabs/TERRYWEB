const fs = require('fs');

const downloaded = JSON.parse(fs.readFileSync('scripts/downloaded-garments.json', 'utf8'));
console.log(`Loaded ${downloaded.length} downloaded items.`);

const SIZES = ['M', 'L', 'XL', 'XXL'];
const CATEGORIES = ['Corsets & Tops', 'Blouses & Shirts', 'Dresses & Tunics'];
const PRICES = [199, 229, 249, 279, 299];

const PREDEFINED_COLORS = [
  'Black', 'White', 'Light Blue', 'Dark Blue', 'Navy Blue', 'Sky Blue',
  'Yellow', 'Red', 'Green', 'Pink', 'Beige', 'Brown', 'Grey',
  'Maroon', 'Purple', 'Orange', 'Cream', 'Olive', 'Lavender', 'Wine'
];

function cleanTitle(raw, idx) {
  if (!raw) return `Boutique Atelier Piece ${idx + 1}`;
  let t = raw.split('|')[0].split('-')[0].trim();
  t = t.replace(/&#x27;/g, "'").replace(/&amp;/g, '&').replace(/["\\]/g, '');
  if (t.length > 40) {
    t = t.substring(0, 40).trim();
  }
  return t;
}

function detectColor(title, idx) {
  const lower = (title || '').toLowerCase();
  for (const c of PREDEFINED_COLORS) {
    if (lower.includes(c.toLowerCase())) return c;
  }
  const defaults = ['Cream', 'White', 'Pink', 'Beige', 'Yellow', 'Light Blue', 'Brown', 'Black'];
  return defaults[idx % defaults.length];
}

function detectCategory(title, idx) {
  const lower = (title || '').toLowerCase();
  if (lower.includes('dress') || lower.includes('tunic') || lower.includes('babydoll')) return 'Dresses & Tunics';
  if (lower.includes('blouse') || lower.includes('shirt') || lower.includes('button')) return 'Blouses & Shirts';
  return 'Corsets & Tops';
}

const products = downloaded.map((item, idx) => {
  const size = SIZES[idx % SIZES.length]; // Each product has exactly ONE unique size: M, L, XL, or XXL
  const price = PRICES[idx % PRICES.length];
  const origPrice = price + 100;
  const name = cleanTitle(item.title, idx);
  const color = detectColor(item.title, idx);
  const category = detectCategory(item.title, idx);
  const code = `TW-P${String(idx + 1).padStart(3, '0')}`;

  return {
    id: `pin-${item.pinId}`,
    name,
    code,
    slug: `tw-${item.pinId}`,
    price,
    originalPrice: origPrice,
    description: `Exclusive single-piece luxury boutique garment. Hand-curated silhouette in unique size ${size}. Crafted in premium soft woven fabric.`,
    fabric: '100% Curated Boutique Cotton & Voile Weave',
    fit: `Tailored Fit · Exclusive Size ${size} (Single Piece)`,
    careInstructions: 'Gentle hand wash cold or professional dry clean',
    availability: 'In Stock',
    images: [item.localUrl],
    sizes: [size], // Exactly ONE single size!
    colours: [color],
    category,
    isNewArrival: idx < 12,
    isFeatured: idx % 3 === 0,
    createdAt: new Date(Date.now() - idx * 3600000).toISOString(),
    updatedAt: new Date().toISOString()
  };
});

// Update data/database.json
const db = JSON.parse(fs.readFileSync('data/database.json', 'utf8'));
db.products = products;
fs.writeFileSync('data/database.json', JSON.stringify(db, null, 2), 'utf8');

console.log(`✅ Successfully updated database with ${products.length} unique Pinterest boutique garments!`);
console.log('Size distribution:');
SIZES.forEach(s => {
  const count = products.filter(p => p.sizes.includes(s)).length;
  console.log(`- Size ${s}: ${count} garments`);
});
