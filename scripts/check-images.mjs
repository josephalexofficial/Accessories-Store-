import fs from "fs";

const text = fs.readFileSync("prisma/product-seed-data.ts", "utf8");
const ids = [...text.matchAll(/imageUrl: img\("([^"]+)"\)/g)].map((m) => m[1]);
const unique = [...new Set(ids)];

const bad = [];
for (const id of unique) {
  const url = `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=85`;
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow" });
    if (!res.ok) bad.push({ id, status: res.status });
  } catch (e) {
    bad.push({ id, status: e.message });
  }
}

console.log(`Checked ${unique.length} unique image IDs`);
console.log(`Broken: ${bad.length}`);
for (const item of bad) console.log(item);
