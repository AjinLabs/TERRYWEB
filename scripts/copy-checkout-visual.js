const fs = require("fs");
const path = require("path");

const userUploadDir = "C:/Users/ajina/.gemini/antigravity/brain/b86847de-cfb3-4342-b2de-f3ee1d878523/.user_uploaded";
const visualSrc = path.join(userUploadDir, "media_1795240595465_eeabc022.jpg");
const dest = path.join(__dirname, "../public/images/checkout-visual.jpg");

if (fs.existsSync(visualSrc)) {
  fs.copyFileSync(visualSrc, dest);
  console.log("Copied checkout visual mockup to public/images/checkout-visual.jpg");
}
