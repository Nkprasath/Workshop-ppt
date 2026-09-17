import { SECTIONS } from "./content/sections";
import type { Workbook } from "./progress";

// Export that runs entirely in the browser.
//
// The server build uses ExcelJS and PDFKit, which are Node libraries. The static build has
// no server, so the download has to be produced here. CSV rather than xlsx: it opens in
// Excel, Sheets and Numbers, it is a format nobody can claim not to have, and it costs
// nothing to generate. The PDF route is the browser's own print dialogue, which every
// browser can turn into a PDF.

function esc(v: unknown): string {
  const s = v === null || v === undefined ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// Flattens the workbook into rows a spreadsheet can hold. Table parts become one row per
// row; checklists become one row per item; forms become one row per field.
export function workbookToCsv(workbook: Workbook): string {
  const lines: string[] = [];
  lines.push(["Section", "Part", "Field", "Value"].map(esc).join(","));

  for (const section of SECTIONS) {
    const sectionData = workbook[section.id];
    if (!sectionData) continue;

    for (const part of section.parts) {
      const value = sectionData[part.id];
      if (value === undefined || value === null) continue;

      if (Array.isArray(value)) {
        value.forEach((row, i) => {
          if (!row || typeof row !== "object") return;
          for (const [key, cell] of Object.entries(row as Record<string, unknown>)) {
            if (!cell) continue;
            lines.push(
              [section.title, part.title, `Row ${i + 1}: ${key}`, cell]
                .map(esc)
                .join(",")
            );
          }
        });
      } else if (typeof value === "object") {
        for (const [key, cell] of Object.entries(value as Record<string, unknown>)) {
          if (cell && typeof cell === "object") {
            for (const [sub, v] of Object.entries(cell as Record<string, unknown>)) {
              if (!v) continue;
              lines.push(
                [section.title, part.title, `${key} (${sub})`, v].map(esc).join(",")
              );
            }
          } else if (cell) {
            lines.push([section.title, part.title, key, cell].map(esc).join(","));
          }
        }
      }
    }
  }

  if (lines.length === 1) {
    lines.push(["", "", "", "Workbook is empty"].map(esc).join(","));
  }
  return lines.join("\n");
}

export function downloadCsv(workbook: Workbook): void {
  const csv = workbookToCsv(workbook);
  // The BOM makes Excel open UTF-8 correctly, which matters for the rupee sign and for
  // any name typed in an Indic script.
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `dpdp-workbook-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Revoked on the next tick so the click has taken the URL first.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
