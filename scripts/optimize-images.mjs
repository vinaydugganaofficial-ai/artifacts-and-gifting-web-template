import sharp from "sharp";
import { mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("public/images");

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (entry.name.endsWith(".png")) files.push(full);
  }
  return files;
}

const files = await walk(root);

await Promise.all(
  files.map(async (file) => {
    const out = file.replace(/\.png$/i, ".jpg");
    const info = await stat(file);
    if (info.size < 10_000) return;
    await mkdir(path.dirname(out), { recursive: true });
    await sharp(file)
      .rotate()
      .resize({ width: 1600, height: 2000, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: "4:4:4" })
      .toFile(out);
    console.log("wrote", path.relative(root, out));
  }),
);
