async function checkPin2() {
  const url = "https://www.pinterest.com/pin/612208143091365463/";
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
  });
  const text = await res.text();
  const title = text.match(/<title>([^<]+)<\/title>/);
  console.log("Title:", title ? title[1] : "none");
  const imgMatch = text.match(/https:\/\/i\.pinimg\.com\/[^\s"']+\.jpg/g);
  console.log("Images found:", imgMatch ? imgMatch.slice(0, 3) : "none");
}
checkPin2().catch(console.error);
