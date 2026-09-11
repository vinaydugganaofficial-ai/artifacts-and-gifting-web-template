#!/usr/bin/env node
/**
 * Guards against theme drift.
 *
 * `config/theme.ts` is the canonical source for the design tokens, but Tailwind
 * v4 requires them declared statically in `app/globals.css`. That duplication is
 * unavoidable — this script makes it safe by failing the build if the two ever
 * disagree.
 *
 * Run via `npm run check:theme` (and as part of `npm run verify`).
 */

import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const THEME_FILE = path.resolve("config/theme.ts");
const CSS_FILE = path.resolve("app/globals.css");

/** `ivoryDeep` -> `ivory-deep` */
function kebab(value) {
  return value.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

/** Extracts `key: "#value"` pairs from a named `export const <name> = { … }`. */
function parseTsObject(source, exportName) {
  const start = source.indexOf(`export const ${exportName} = {`);
  if (start === -1) {
    throw new Error(`Could not find "export const ${exportName}" in config/theme.ts`);
  }

  const open = source.indexOf("{", start);
  let depth = 0;
  let end = -1;

  for (let index = open; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    else if (source[index] === "}") {
      depth -= 1;
      if (depth === 0) {
        end = index;
        break;
      }
    }
  }

  if (end === -1) throw new Error(`Unbalanced braces in "${exportName}"`);

  const body = source.slice(open + 1, end);
  const entries = new Map();

  for (const match of body.matchAll(/^\s*([A-Za-z0-9_]+)\s*:\s*"([^"]+)"\s*,?\s*$/gm)) {
    entries.set(match[1], match[2]);
  }

  return entries;
}

/** Extracts `--name: value;` declarations from a CSS block. */
function parseCssVars(source, blockPattern) {
  const match = source.match(blockPattern);
  if (!match) throw new Error(`Could not find the ${blockPattern} block in globals.css`);

  const entries = new Map();
  for (const decl of match[1].matchAll(/^\s*(--[a-z0-9-]+)\s*:\s*([^;]+);/gm)) {
    entries.set(decl[1], decl[2].trim());
  }

  return entries;
}

async function main() {
  const [themeSource, cssSource] = await Promise.all([
    readFile(THEME_FILE, "utf8"),
    readFile(CSS_FILE, "utf8"),
  ]);

  const problems = [];

  // --- palette ------------------------------------------------------------
  const palette = parseTsObject(themeSource, "palette");
  const themeBlock = parseCssVars(cssSource, /@theme inline\s*\{([\s\S]*?)\n\}/);

  for (const [name, value] of palette) {
    const cssName = `--color-${kebab(name)}`;
    const cssValue = themeBlock.get(cssName);

    if (cssValue === undefined) {
      problems.push(`Missing in globals.css @theme: ${cssName} (palette.${name})`);
    } else if (cssValue.toLowerCase() !== value.toLowerCase()) {
      problems.push(
        `Value mismatch for ${cssName}: theme.ts has ${value}, globals.css has ${cssValue}`,
      );
    }
  }

  for (const cssName of themeBlock.keys()) {
    if (!cssName.startsWith("--color-")) continue;
    const key = cssName.replace("--color-", "");
    const known = [...palette.keys()].some((name) => kebab(name) === key);
    if (!known) {
      problems.push(`Orphan colour in globals.css: ${cssName} has no entry in palette`);
    }
  }

  // --- z-index ------------------------------------------------------------
  const zIndex = new Map(
    [...themeSource.matchAll(/^\s*([a-zA-Z]+):\s*(\d+),\s*$/gm)]
      .filter(() => true)
      .map((match) => [match[1], match[2]]),
  );
  const rootBlock = parseCssVars(cssSource, /:root\s*\{([\s\S]*?)\n\}/);

  const zStart = themeSource.indexOf("export const zIndex = {");
  const zEnd = themeSource.indexOf("}", zStart);
  const zBody = themeSource.slice(zStart, zEnd);

  for (const match of zBody.matchAll(/^\s*([a-zA-Z]+):\s*(\d+),\s*$/gm)) {
    const [, name, value] = match;
    const cssName = `--z-${kebab(name)}`;
    const cssValue = rootBlock.get(cssName);

    if (cssValue === undefined) {
      problems.push(`Missing in globals.css :root: ${cssName} (zIndex.${name})`);
    } else if (cssValue !== value) {
      problems.push(
        `Value mismatch for ${cssName}: theme.ts has ${value}, globals.css has ${cssValue}`,
      );
    }
  }

  void zIndex;

  // --- report -------------------------------------------------------------
  if (problems.length > 0) {
    console.error("Theme drift detected between config/theme.ts and app/globals.css:\n");
    for (const problem of problems) console.error(`  • ${problem}`);
    console.error(
      "\nUpdate config/theme.ts first, then mirror the change in globals.css.",
    );
    process.exit(1);
  }

  console.log(
    `Theme tokens in sync (${palette.size} colours, ${[...rootBlock.keys()].filter((k) => k.startsWith("--z-")).length} layers).`,
  );
}

main().catch((error) => {
  console.error(`check-theme failed: ${error.message}`);
  process.exit(1);
});
