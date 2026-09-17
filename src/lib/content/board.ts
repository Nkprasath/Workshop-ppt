// The commencement board.
//
// Every tile is a provision or group of provisions of the DPDP Act, in the state
// G.S.R. 843(E) actually put it in. The three states are the three clauses of that
// notification, nothing invented:
//
//   clause (a) -> LIVE on 13 November 2025
//   clause (b) -> one year later, 13 November 2026
//   clause (c) -> eighteen months later, 13 May 2027
//
// This file is the single source of truth for what is switched on. If a slide wants to
// claim a provision is in force, it points at a tile here rather than asserting it.

export type TileState = "live" | "nov2026" | "may2027";

export interface Tile {
  id: string;
  // Rendered in mono. The statutory reference, exactly as the notification words it.
  ref: string;
  // Two or three words of plain English. What a room would call it.
  name: string;
  state: TileState;
  // Grid placement on a 6 column board.
  col: number;
  row: number;
  span?: number;
}

export const STATE_LABEL: Record<TileState, string> = {
  live: "In force",
  nov2026: "13 Nov 2026",
  may2027: "13 May 2027",
};

export const TILES: Tile[] = [
  // ---- clause (a), live since 13 November 2025 -----------------------------
  { id: "s1", ref: "s.1(2)", name: "Commencement", state: "live", col: 1, row: 1 },
  { id: "s2", ref: "s.2", name: "Definitions", state: "live", col: 2, row: 1 },
  { id: "s18-26", ref: "ss.18-26", name: "The Board exists", state: "live", col: 3, row: 1, span: 2 },
  { id: "s35-44", ref: "ss.35, 38-43", name: "Rule-making power", state: "live", col: 5, row: 1, span: 2 },

  // ---- clause (b), one year, 13 November 2026 ------------------------------
  { id: "s6-9", ref: "s.6(9)", name: "Consent Manager duties", state: "nov2026", col: 1, row: 2, span: 3 },
  { id: "s27-1-d", ref: "s.27(1)(d)", name: "Board registers CMs", state: "nov2026", col: 4, row: 2, span: 3 },

  // ---- clause (c), eighteen months, 13 May 2027 ----------------------------
  { id: "s3-5", ref: "ss.3-5", name: "Scope, grounds, notice", state: "may2027", col: 1, row: 3, span: 2 },
  { id: "s6", ref: "s.6(1)-(8), (10)", name: "Consent", state: "may2027", col: 3, row: 3, span: 2 },
  { id: "s7-10", ref: "ss.7-10", name: "Duties, children, SDFs", state: "may2027", col: 5, row: 3, span: 2 },

  { id: "s11-17", ref: "ss.11-17", name: "Rights and grievance", state: "may2027", col: 1, row: 4, span: 2 },
  { id: "s27", ref: "s.27 (rest)", name: "Board powers", state: "may2027", col: 3, row: 4, span: 2 },
  { id: "s28-34", ref: "ss.28-34", name: "Inquiry and penalties", state: "may2027", col: 5, row: 4, span: 2 },
];

export const BOARD_COLS = 6;
export const BOARD_ROWS = 4;

export function tile(id: string): Tile {
  const found = TILES.find((t) => t.id === id);
  if (!found) throw new Error(`Unknown board tile: ${id}`);
  return found;
}

// Board geometry, so annotations are derived from where a tile actually is rather than
// guessed. The board is a 6 column grid of 84px rows with 10px gaps, drawn 1080 wide and
// then scaled, so every position follows from that.
const COL_GAP = 10;
const ROW_H = 84;
const ROW_GAP = 10;
const BOARD_W = 1080;
const COL_W = (BOARD_W - COL_GAP * (BOARD_COLS - 1)) / BOARD_COLS;

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
  cx: number;
  cy: number;
}

export function tileRect(
  id: string,
  originX: number,
  originY: number,
  scale: number
): Rect {
  const t = tile(id);
  const span = t.span ?? 1;
  const left = (t.col - 1) * (COL_W + COL_GAP);
  const width = span * COL_W + (span - 1) * COL_GAP;
  const top = (t.row - 1) * (ROW_H + ROW_GAP);
  return {
    x: originX + left * scale,
    y: originY + top * scale,
    w: width * scale,
    h: ROW_H * scale,
    cx: originX + (left + width / 2) * scale,
    cy: originY + (top + ROW_H / 2) * scale,
  };
}
