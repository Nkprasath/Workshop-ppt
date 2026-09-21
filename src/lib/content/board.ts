// The commencement board.
//
// Every tile is a provision or group of provisions of the DPDP Act, in the state
// G.S.R. 843(E) actually put it in. The three states are the three clauses of that
// notification, nothing invented:
//
//   clause (a) -> in force since 13 November 2025
//   clause (b) -> one year later, 13 November 2026
//   clause (c) -> eighteen months later, 13 May 2027
//
// This file is the single source of truth for what is switched on. If a slide wants to
// claim a provision is in force, it points at a tile here rather than asserting it.
//
// `name` is what a room would call the provision and it is the headline on the tile.
// `ref` is the statutory reference, in the notification's own words, and it is the small
// print. That order matters: somebody meeting this for the first time should learn what
// the provision does before being asked to parse a subsection list.

export type TileState = "live" | "nov2026" | "may2027";

export interface Tile {
  id: string;
  ref: string;
  name: string;
  state: TileState;
}

export const COLUMNS: { state: TileState; when: string; date: string }[] = [
  { state: "live", when: "In force now", date: "Since 13 Nov 2025" },
  { state: "nov2026", when: "Next", date: "13 Nov 2026" },
  { state: "may2027", when: "Then everything else", date: "13 May 2027" },
];

export const TILES: Tile[] = [
  // ---- clause (a), in force since 13 November 2025 -------------------------
  { id: "s2", ref: "s.2", name: "Definitions", state: "live" },
  { id: "s18-26", ref: "ss.18-26", name: "The Board exists on paper", state: "live" },
  { id: "s35-44", ref: "ss.35, 38-43", name: "Power to make the Rules", state: "live" },
  { id: "s1", ref: "s.1(2)", name: "Commencement itself", state: "live" },

  // ---- clause (b), one year, 13 November 2026 ------------------------------
  { id: "s6-9", ref: "s.6(9)", name: "Consent Manager duties", state: "nov2026" },
  { id: "s27-1-d", ref: "s.27(1)(d)", name: "Board can register Consent Managers", state: "nov2026" },

  // ---- clause (c), eighteen months, 13 May 2027 ----------------------------
  { id: "s3-5", ref: "ss.3-5", name: "Notice you must give people", state: "may2027" },
  { id: "s6", ref: "s.6(1)-(8), (10)", name: "Consent, and withdrawing it", state: "may2027" },
  { id: "s7-10", ref: "ss.7-10", name: "Your duties, children, big firms", state: "may2027" },
  { id: "s11-17", ref: "ss.11-17", name: "People's rights, and complaints", state: "may2027" },
  { id: "s27", ref: "s.27 (rest)", name: "Everything else the Board can do", state: "may2027" },
  { id: "s28-34", ref: "ss.28-34", name: "Investigations and fines", state: "may2027" },
];

export function tile(id: string): Tile {
  const found = TILES.find((t) => t.id === id);
  if (!found) throw new Error(`Unknown board tile: ${id}`);
  return found;
}

export function columnTiles(state: TileState): Tile[] {
  return TILES.filter((t) => t.state === state);
}

// Geometry, so annotations are derived from where a tile actually is rather than guessed.
// These have to match the constants the board is drawn with in Board.tsx.
const COL_W = 340;
const COL_GAP = 30;
const TILE_H = 56;
const TILE_GAP = 8;
const HEAD_H = 5 + 12 + 46;

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
  const colIndex = COLUMNS.findIndex((c) => c.state === t.state);
  const rowIndex = columnTiles(t.state).findIndex((x) => x.id === id);

  const left = colIndex * (COL_W + COL_GAP);
  const top = HEAD_H + rowIndex * (TILE_H + TILE_GAP);
  return {
    x: originX + left * scale,
    y: originY + top * scale,
    w: COL_W * scale,
    h: TILE_H * scale,
    cx: originX + (left + COL_W / 2) * scale,
    cy: originY + (top + TILE_H / 2) * scale,
  };
}

// The bottom of a whole column, for marks that point at a tranche rather than a tile.
export function columnBottom(
  state: TileState,
  originY: number,
  scale: number
): number {
  const n = columnTiles(state).length;
  return originY + (HEAD_H + n * TILE_H + (n - 1) * TILE_GAP) * scale;
}
