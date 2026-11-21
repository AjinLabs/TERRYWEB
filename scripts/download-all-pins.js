const fs = require('fs');
const path = require('path');

const PINS = [
  'https://in.pinterest.com/pin/1011691503815958072/',
  'https://in.pinterest.com/pin/390968811422076913/',
  'https://in.pinterest.com/pin/615374736620820853/',
  'https://in.pinterest.com/pin/1144899536553422095/',
  'https://in.pinterest.com/pin/1099933909037329866/',
  'https://in.pinterest.com/pin/1140607043163274666/',
  'https://in.pinterest.com/pin/1068619817842920473/',
  'https://in.pinterest.com/pin/119838040088574962/',
  'https://in.pinterest.com/pin/1143703267906666828/',
  'https://in.pinterest.com/pin/1066086543092977990/',
  'https://in.pinterest.com/pin/1135188649844770291/',
  'https://in.pinterest.com/pin/1061512574676380530/',
  'https://in.pinterest.com/pin/1126885138042316750/',
  'https://in.pinterest.com/pin/994028949022061276/',
  'https://in.pinterest.com/pin/4607534391800771904/',
  'https://in.pinterest.com/pin/1146236542703841314/',
  'https://in.pinterest.com/pin/1143281055429915654/',
  'https://in.pinterest.com/pin/4606408494662519104/',
  'https://in.pinterest.com/pin/1133851643711784805/',
  'https://in.pinterest.com/pin/357473289193810277/',
  'https://in.pinterest.com/pin/188658671876086078/',
  'https://in.pinterest.com/pin/957507570798090131/',
  'https://in.pinterest.com/pin/871235490429623029/',
  'https://in.pinterest.com/pin/1109644795734854515/',
  'https://in.pinterest.com/pin/1002473198323951656/',
  'https://in.pinterest.com/pin/582442164349294219/',
  'https://in.pinterest.com/pin/666180969917299676/',
  'https://in.pinterest.com/pin/4599019741439883840/',
  'https://in.pinterest.com/pin/1013028509951785854/',
  'https://in.pinterest.com/pin/982769949956608103/',
  'https://in.pinterest.com/pin/545146729913365518/',
  'https://in.pinterest.com/pin/584693964166224810/',
  'https://in.pinterest.com/pin/4609715821567083072/',
  'https://in.pinterest.com/pin/4609786178305169024/',
  'https://in.pinterest.com/pin/4607112128211053952/',
  'https://in.pinterest.com/pin/359584351473852526/',
  'https://in.pinterest.com/pin/750693831677488185/',
  'https://in.pinterest.com/pin/106538347430487995/',
  'https://in.pinterest.com/pin/965037026416021989/',
  'https://in.pinterest.com/pin/1074319686128650520/',
  'https://in.pinterest.com/pin/1103944927444287114/'
];

async function downloadImage(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buffer);
  return buffer.length;
}

async function processPin(pinUrl, index) {
  const pinIdMatch = pinUrl.match(/\/pin\/(\d+)\/?/);
  const pinId = pinIdMatch ? pinIdMatch[1] : `pin_${index}`;

  try {
    const res = await fetch(pinUrl, {
      headers: {
        'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    const html = await res.text();

    // Find main image
    // Look for 736x or 564x or originals
    let imgUrl = null;
    const matches736 = [...html.matchAll(/https:\/\/i\.pinimg\.com\/736x\/[a-z0-9\/]+\.(?:jpg|png|webp)/gi)].map(m => m[0]);
    const matches564 = [...html.matchAll(/https:\/\/i\.pinimg\.com\/564x\/[a-z0-9\/]+\.(?:jpg|png|webp)/gi)].map(m => m[0]);
    const matchesOrig = [...html.matchAll(/https:\/\/i\.pinimg\.com\/originals\/[a-z0-9\/]+\.(?:jpg|png|webp)/gi)].map(m => m[0]);

    if (matches736.length > 0) {
      imgUrl = matches736[0];
    } else if (matches564.length > 0) {
      imgUrl = matches564[0];
    } else if (matchesOrig.length > 0) {
      imgUrl = matchesOrig[0];
    }

    // Extract title
    let title = null;
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    if (titleMatch) {
      title = titleMatch[1].replace(/ \| Pinterest.*/, '').replace(/ - Pinterest.*/, '').trim();
    }
    if (!title || title.length < 3) {
      title = `Atelier Boutique Garment ${pinId.slice(-4)}`;
    }

    if (!imgUrl) {
      console.warn(`[${index + 1}/${PINS.length}] Pin ${pinId}: No pinimg found!`);
      return null;
    }

    const fileName = `pin_${pinId}.jpg`;
    const targetPath1 = path.join(process.cwd(), 'public', 'images', 'products', fileName);
    const targetPath2 = path.join(process.cwd(), 'public', 'uploads', fileName);

    const size = await downloadImage(imgUrl, targetPath1);
    fs.copyFileSync(targetPath1, targetPath2);

    console.log(`[${index + 1}/${PINS.length}] ✅ Downloaded ${fileName} (${Math.round(size / 1024)} KB) - ${title.substring(0, 35)}...`);
    return {
      pinId,
      pinUrl,
      fileName,
      localUrl: `/images/products/${fileName}`,
      remoteUrl: imgUrl,
      title
    };
  } catch (err) {
    console.error(`[${index + 1}/${PINS.length}] Error on pin ${pinId}:`, err.message);
    return null;
  }
}

async function run() {
  console.log(`Starting extraction & download of ${PINS.length} pins...`);
  const downloaded = [];

  for (let i = 0; i < PINS.length; i++) {
    const item = await processPin(PINS[i], i);
    if (item) downloaded.push(item);
    await new Promise(r => setTimeout(r, 150));
  }

  fs.writeFileSync('scripts/downloaded-garments.json', JSON.stringify(downloaded, null, 2));
  console.log(`\n🎉 Success! Downloaded ${downloaded.length} of ${PINS.length} garments.`);
}

run();
