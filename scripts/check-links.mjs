import fs from "node:fs";
import path from "node:path";
const files = [];
(function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { if (["node_modules", ".next", ".git"].includes(e.name)) continue; const p = path.join(d, e.name); e.isDirectory() ? walk(p) : p.endsWith(".md") && files.push(p); } })(".");
let bad = 0, total = 0;
for (const f of files) {
  const text = fs.readFileSync(f, "utf8");
  for (const m of text.matchAll(/\]\(([^)\s]+)\)/g)) {
    const raw = m[1];
    if (/^(https?:|mailto:|#)/.test(raw)) continue;
    const target = decodeURIComponent(raw.split("#")[0]);
    if (!target) continue;
    total++;
    const resolved = path.resolve(path.dirname(f), target);
    if (!fs.existsSync(resolved)) { bad++; console.log("QUEBRADO", f, "->", raw); }
  }
}
console.log(`${total} links relativos verificados, ${bad} quebrados`);
