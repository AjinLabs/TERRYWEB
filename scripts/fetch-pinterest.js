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

async function fetchPin(url, index) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      }
    });
    const html = await res.text();
    
    // Look for og:image
    let imgUrl = null;
    const ogMatch = html.match(/<meta\s+(?:property|name)=["']og:image["']\s+content=["']([^"']+)["']/i) ||
                    html.match(/content=["']([^"']+)["']\s+(?:property|name)=["']og:image["']/i);
    if (ogMatch) {
      imgUrl = ogMatch[1];
    } else {
      // Look for pinimg regex
      const pinimgMatch = html.match(/https:\/\/[a-z0-9]+\.pinimg\.com\/[0-9a-z_x\/-]+\.(?:jpg|png|webp)/i);
      if (pinimgMatch) {
        imgUrl = pinimgMatch[0];
      }
    }

    // Title / Description
    let title = null;
    const titleMatch = html.match(/<meta\s+(?:property|name)=["']og:title["']\s+content=["']([^"']+)["']/i) ||
                       html.match(/<title>([^<]+)<\/title>/i);
    if (titleMatch) {
      title = titleMatch[1].replace(/ \| Pinterest.*/, '').replace(/ - Pinterest.*/, '').trim();
    }

    console.log(`[${index + 1}/${PINS.length}] Found: ${imgUrl ? imgUrl.substring(0, 50) + '...' : 'NONE'} | Title: ${title || 'N/A'}`);
    return { url, imgUrl, title };
  } catch (err) {
    console.error(`Error fetching pin ${index + 1}:`, err.message);
    return { url, imgUrl: null, title: null };
  }
}

async function run() {
  console.log(`Starting fetch of ${PINS.length} Pinterest pins...`);
  const results = [];
  for (let i = 0; i < PINS.length; i++) {
    const res = await fetchPin(PINS[i], i);
    results.push(res);
    // slight delay to be gentle
    await new Promise(r => setTimeout(r, 200));
  }

  fs.writeFileSync('scripts/pinterest-results.json', JSON.stringify(results, null, 2));
  console.log('Finished! Results saved to scripts/pinterest-results.json');
}

run();
