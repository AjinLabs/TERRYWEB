const fs = require('fs');

async function testOne() {
  // Use Facebook external hit bot or Twitter bot user agent which Pinterest always sends full OG metadata to!
  const res = await fetch('https://in.pinterest.com/pin/1011691503815958072/', {
    headers: {
      'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)'
    }
  });
  const html = await res.text();
  fs.writeFileSync('scripts/sample-pin.html', html);
  console.log('HTML size:', html.length);
  
  const matches = [...html.matchAll(/https:\/\/i\.pinimg\.com\/[^\s"']+\.(?:jpg|png|webp)/gi)].map(m => m[0]);
  console.log('Found pinimg matches:', matches);
  
  const ogImage = html.match(/<meta property="og:image" content="([^"]+)"/i);
  console.log('OG Image:', ogImage ? ogImage[1] : 'None');
  
  const ogTitle = html.match(/<meta property="og:title" content="([^"]+)"/i);
  console.log('OG Title:', ogTitle ? ogTitle[1] : 'None');
}

testOne();
