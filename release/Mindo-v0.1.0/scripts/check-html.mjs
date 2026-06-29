import fs from "node:fs";

const htmlPath = new URL("../app/index.html", import.meta.url);
const html = fs.readFileSync(htmlPath, "utf8");
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((match) => match[1]).join("\n");

new Function(scripts);
console.log("JS syntax OK");
