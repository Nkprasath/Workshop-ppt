import { build } from "esbuild";
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Builds the whole static site: a landing page, the deck, and the workbook.
//
// Every page is one self-contained HTML file with React, its libraries, the compiled CSS
// and the Lato faces inlined. Nothing is fetched at runtime, which is what lets the
// workbook truthfully tell an attendee that nothing they type leaves their browser: there
// is no request for it to leave in.

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const out = path.join(root, "docs");

const PAGES = [
  { entry: "src/standalone/entry.tsx", file: "deck.html", title: "DPDP Workshop deck" },
  {
    entry: "src/standalone/workbook-entry.tsx",
    file: "workbook.html",
    title: "DPDP Workshop workbook",
  },
];

async function compileCss() {
  const tmp = path.join(out, ".build.css");
  execSync(
    `npx tailwindcss -i "${path.join(root, "src", "app", "globals.css")}" -o "${tmp}" --minify`,
    { cwd: root, stdio: "inherit" }
  );
  let css = await readFile(tmp, "utf8");
  for (const weight of [400, 700, 900]) {
    const file = path.join(root, "public", "fonts", `lato-${weight}.woff2`);
    if (!existsSync(file)) continue;
    const b64 = (await readFile(file)).toString("base64");
    css = css.replaceAll(
      `/fonts/lato-${weight}.woff2`,
      `data:font/woff2;base64,${b64}`
    );
  }
  await rm(tmp, { force: true });
  return css;
}

function page(title, css, js) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>${title}</title>
<style>${css}</style>
</head>
<body>
<div id="root"></div>
<script>${js.replace(/<\/script>/gi, "<\\/script>")}</scr` + `ipt>
</body>
</html>`;
}

async function main() {
  await mkdir(out, { recursive: true });
  const css = await compileCss();

  for (const p of PAGES) {
    const bundle = await build({
      entryPoints: [path.join(root, p.entry)],
      bundle: true,
      minify: true,
      format: "iife",
      target: "es2020",
      jsx: "automatic",
      write: false,
      // The content modules read configuration from process.env, which does not exist in a
      // browser. Without these the bundle throws on import and the page renders nothing.
      define: {
        "process.env.NODE_ENV": '"production"',
        "process.env.WORKBOOK_RETENTION_DAYS": '"30"',
        "process.env.WORKBOOK_GRIEVANCE_EMAIL": '"privacy@theprivacylabs.com"',
        "process.env.WORKBOOK_WORKSHOP_DATE": '"2026-09-26"',
      },
      alias: { "@": path.join(root, "src") },
      loader: { ".woff2": "dataurl", ".svg": "dataurl" },
    });
    const js = bundle.outputFiles[0].text;
    const html = page(p.title, css, js);
    await writeFile(path.join(out, p.file), html, "utf8");
    console.log(
      `  ${p.file.padEnd(14)} ${(Buffer.byteLength(html, "utf8") / 1024).toFixed(0)} KB`
    );
  }

  // GitHub Pages serves this repo through Jekyll by default, which ignores files and
  // folders beginning with an underscore. Nothing here starts with one, but the marker
  // costs nothing and removes a class of surprise.
  await writeFile(path.join(out, ".nojekyll"), "", "utf8");

  // Plain HTML pages: the landing page, and the review page written for Olivia. Both take
  // the same compiled CSS so the whole site is one visual system.
  for (const name of ["index.html", "review.html"]) {
    const shell = await readFile(path.join(root, "src", "standalone", name), "utf8");
    const html = shell.replace("__CSS__", css);
    await writeFile(path.join(out, name), html, "utf8");
    console.log(
      `  ${name.padEnd(14)} ${(Buffer.byteLength(html, "utf8") / 1024).toFixed(0)} KB`
    );
  }
  console.log(`\nwrote ${path.relative(root, out)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
