import { build } from "esbuild";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Builds the deck as ONE self-contained .html file.
//
// Everything is inlined: React, anime.js, Rough.js, the compiled Tailwind, and the Lato
// woff2 faces as data URIs. The result opens from a double click over file://, works with
// no network, and can be emailed. That is the point: it can be reviewed without deploying
// anything, and without anyone needing to trust a link.

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const out = path.join(root, "dist");

async function main() {
  await mkdir(out, { recursive: true });

  // 1. Compile Tailwind against the deck source only.
  const cssTmp = path.join(out, ".deck.css");
  // Shell form, because the Windows shim is a .cmd and cannot be spawned directly.
  execSync(
    `npx tailwindcss -i "${path.join(root, "src", "app", "globals.css")}" -o "${cssTmp}" --minify`,
    { cwd: root, stdio: "inherit" }
  );
  let css = await readFile(cssTmp, "utf8");

  // 2. Inline the fonts. Without this the file would silently fall back to a system face
  //    on a machine that has never opened the site.
  for (const weight of [400, 700, 900]) {
    const file = path.join(root, "fonts", `lato-${weight}.woff2`);
    if (!existsSync(file)) continue;
    const b64 = (await readFile(file)).toString("base64");
    css = css.replaceAll(
      `/fonts/lato-${weight}.woff2`,
      `data:font/woff2;base64,${b64}`
    );
  }

  // 3. Bundle the deck, React included, as one classic script.
  const bundle = await build({
    entryPoints: [path.join(root, "src", "entry.tsx")],
    bundle: true,
    minify: true,
    format: "iife",
    target: "es2020",
    jsx: "automatic",
    write: false,
    define: { "process.env.NODE_ENV": '"production"' },
    // The app's TypeScript path alias, which esbuild does not read from tsconfig.
    alias: { "@": path.join(root, "src") },
    loader: { ".woff2": "dataurl", ".svg": "dataurl" },
  });
  const js = bundle.outputFiles[0].text;

  // 4. Assemble. The closing script tag is split so a stray </script> inside the bundle
  //    cannot terminate the block early.
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>DPDP Workshop deck</title>
<style>${css}</style>
</head>
<body>
<div id="root"></div>
<script>${js.replace(/<\/script>/gi, "<\\/script>")}</scr` + `ipt>
</body>
</html>`;

  const file = path.join(out, "dpdp-deck.html");
  await writeFile(file, html, "utf8");

  const kb = (Buffer.byteLength(html, "utf8") / 1024).toFixed(0);
  console.log(`\nwrote ${path.relative(root, file)}  (${kb} KB)`);
  console.log(`  css ${(css.length / 1024).toFixed(0)} KB, js ${(js.length / 1024).toFixed(0)} KB`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
