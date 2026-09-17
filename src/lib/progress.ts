import { SECTIONS, fillableCount } from "./content/sections";

// Pure progress maths, with no database and no node-only imports, so the same code runs on
// the server for the real workbook and in the browser for the preview.

export type Workbook = Record<string, Record<string, unknown>>;

// A field counts as filled when it holds a non-empty trimmed string.
function countValue(value: unknown): number {
  if (typeof value === "string") return value.trim().length > 0 ? 1 : 0;
  if (Array.isArray(value)) {
    return value.reduce<number>((sum, item) => sum + countValue(item), 0);
  }
  if (value && typeof value === "object") {
    return Object.values(value as Record<string, unknown>).reduce<number>(
      (sum, item) => sum + countValue(item),
      0
    );
  }
  return 0;
}

export function countAll(workbook: Workbook): Record<string, number> {
  const out: Record<string, number> = {};
  for (const section of SECTIONS) {
    out[section.id] = countValue(workbook[section.id] ?? {});
  }
  return out;
}

export interface SectionProgress {
  id: string;
  title: string;
  filled: number;
  target: number;
  percent: number;
}

export interface Progress {
  sections: SectionProgress[];
  overall: number;
}

// Percent is capped at 100 because an attendee who adds thirty inventory rows should read
// as done rather than as 340 percent.
export function progress(completion: Record<string, number>): Progress {
  const sections = SECTIONS.map((s) => {
    const filled = completion[s.id] ?? 0;
    const target = Math.max(1, fillableCount(s.id));
    return {
      id: s.id,
      title: s.title,
      filled,
      target,
      percent: Math.min(100, Math.round((filled / target) * 100)),
    };
  });
  const overall = Math.round(
    sections.reduce((sum, s) => sum + s.percent, 0) / Math.max(1, sections.length)
  );
  return { sections, overall };
}
