// Guards the dev server against "Outdated Optimize Dep" 504s that stop React islands
// from hydrating: every npm module imported by src/**/*.ts(x) must be pre-bundled.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const src = new URL("../src/", import.meta.url);
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
  entry.isDirectory() ? walk(path.join(dir, entry.name)) : /\.tsx?$/.test(entry.name) ? [path.join(dir, entry.name)] : []);

test("every npm module imported by TS/TSX sources is in optimizeDeps.include", () => {
  const config = fs.readFileSync(new URL("../astro.config.mjs", import.meta.url), "utf8");
  const include = new Set([...config.match(/include:\s*\[([\s\S]*?)\]/)[1].matchAll(/'([^']+)'/g)].map((match) => match[1]));
  const imported = new Set();
  for (const file of walk(src.pathname)) {
    // Type-only imports and CSS are erased or handled outside dependency optimization.
    for (const [, kind, spec] of fs.readFileSync(file, "utf8").matchAll(/import\s+(type\s+)?[^"']*?from\s+["']([^"']+)["']/g)) {
      if (!kind) imported.add(spec);
    }
  }
  const npm = [...imported].filter((spec) => !/^(\.|@\/|astro[:/]|astro$|react$|react-dom)/.test(spec) && !spec.endsWith(".css"));
  const missing = npm.filter((spec) => !include.has(spec)).sort();
  assert.deepEqual(missing, [], `add to optimizeDeps.include in astro.config.mjs: ${missing.join(", ")}`);
});
