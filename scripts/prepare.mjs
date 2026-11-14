// Builds the web folder used by the desktop app (src/).
// It copies index.html and swaps the online hls.js link for a local copy,
// so the app can play streams without loading anything from a CDN.
import { cpSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

mkdirSync("src/vendor", { recursive: true });
cpSync("node_modules/hls.js/dist/hls.min.js", "src/vendor/hls.min.js");

const cdn = /https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/hls\.js\/[\d.]+\/hls\.min\.js/;
const html = readFileSync("index.html", "utf8");
if (!cdn.test(html)) {
  throw new Error("hls.js script link not found in index.html");
}
writeFileSync("src/index.html", html.replace(cdn, "vendor/hls.min.js"));
console.log("src/ is ready");
