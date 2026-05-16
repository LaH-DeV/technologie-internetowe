const fs = require("fs");
const path = require("path");

// use: node embed.js [input.html] [output.html]

const INPUT = process.argv[2] || "index.html";;
const OUTPUT = process.argv[3] || "presentation.html";

const CURRENT_DIR = __dirname;

let html = fs.readFileSync(path.resolve(CURRENT_DIR, INPUT), "utf8");

function mimeType(file) {
  const ext = path.extname(file).toLowerCase();

  switch (ext) {
    case ".png":
      return "image/png";

    case ".jpg":
    case ".jpeg":
      return "image/jpeg";

    case ".gif":
      return "image/gif";

    case ".webp":
      return "image/webp";

    case ".svg":
      return "image/svg+xml";

    default:
      return "application/octet-stream";
  }
}

html = html.replaceAll(
  /<img([^>]+)src=["']([^"']+)["']([^>]*)>/g,
  (match, before, src, after) => {

    if (
      src.startsWith("data:") ||
      src.startsWith("http://") ||
      src.startsWith("https://")
    ) {
      return match;
    }

    try {
      const filePath = path.resolve(CURRENT_DIR, src);

      const data = fs.readFileSync(filePath);
      const base64 = data.toString("base64");

      const mime = mimeType(filePath);
      const dataUri = `data:${mime};base64,${base64}`;

      return `<img${before}src="${dataUri}"${after}>`;
    } catch (error) {
      console.error("Error embedding image:", src);
      return match;
    }
  }
);

html = html.replaceAll(
  /<link([^>]+)href=["']([^"']+)["']([^>]*)>/g,
  (match, before, href, after) => {
    if (
      href.startsWith("http://") ||
      href.startsWith("https://") ||
      !href.endsWith(".css")
    ) {
      return match;
    }

    try {
      const filePath = path.resolve(CURRENT_DIR, href);
      const cssSource = fs.readFileSync(filePath, "utf8");
      const css = cssSource.trim().replace(/\s+/g, " ");
      return `<style>${css}</style>`;
    } catch (error) {
      console.error("Error embedding CSS:", href);
      return match;
    }
  }
);

html = html.replaceAll(
  /<script([^>]+)src=["']([^"']+)["']([^>]*)><\/script>/g,
  (match, before, src, after) => {

    if (
      src.startsWith("http://") ||
      src.startsWith("https://")
    ) {
      return match;
    }

    try {
      const filePath = path.resolve(CURRENT_DIR, src);
      const jsSource = fs.readFileSync(filePath, "utf8");
      return `<script${before}>${jsSource}</script>`;
    } catch (error) {
      console.error("Error embedding JavaScript:", src);
      return match;
    }
  }
);

fs.writeFileSync(path.resolve(CURRENT_DIR, OUTPUT), html);
