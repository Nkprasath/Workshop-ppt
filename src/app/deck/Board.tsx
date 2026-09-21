"use client";

import { TILES, COLUMNS, columnTiles } from "@/lib/content/board";
import type { Tile, TileState } from "@/lib/content/board";

// The commencement board.
//
// Laid out as three dated columns, because the subject IS time: what is switched on now,
// what arrives in November, and what arrives in May 2027. An earlier version was a 6 by 4
// grid of section numbers, which made you decode "ss.6(1)-(8), (10)" before you learned
// anything and hid the shape of the argument.
//
// The imbalance between the columns is the argument. Two provisions in the middle column
// against ten either side of it is the whole of Block 2 in one picture, and nobody has to
// read a legend to see it.
//
// Plain English is the headline on every tile; the statutory reference is the small print
// underneath, for the people who want to check.

const TONE: Record<
  TileState,
  { head: string; rule: string; tile: string; name: string; ref: string }
> = {
  live: {
    head: "text-[#1d4ed8]",
    rule: "bg-[#1d4ed8]",
    tile: "border-[#1d4ed8] bg-white",
    name: "text-[#141412]",
    ref: "text-[#6b6659]",
  },
  nov2026: {
    head: "text-[#b45309]",
    rule: "bg-[#b45309]",
    tile: "border-[#b45309] bg-white",
    name: "text-[#141412]",
    ref: "text-[#6b6659]",
  },
  may2027: {
    head: "text-[#57534a]",
    rule: "bg-[#a8a296]",
    tile: "border-[#c5c0b5] bg-[#f2efe9]",
    name: "text-[#4a463e]",
    ref: "text-[#8a857a]",
  },
};

export interface BoardProps {
  // Tiles named here stay at full attention; everything else recedes.
  focus?: string[];
  // Tiles drawn as though already switched on, for the moment a tranche fires.
  lit?: string[];
  scale?: number;
  className?: string;
}

export function Board({ focus, lit = [], scale = 1, className = "" }: BoardProps) {
  const hasFocus = Boolean(focus && focus.length > 0);

  return (
    <div
      className={`relative ${className}`}
      style={{ width: BOARD_W * scale, height: BOARD_H * scale }}
      data-board
    >
      <div
        className="absolute left-0 top-0 flex origin-top-left"
        style={{ width: BOARD_W, gap: COL_GAP, transform: `scale(${scale})` }}
      >
        {COLUMNS.map((col) => {
          const tone = TONE[col.state];
          const tiles = columnTiles(col.state);
          return (
            <div key={col.state} style={{ width: COL_W }} data-column={col.state}>
              <div className={`h-[5px] w-full rounded-full ${tone.rule}`} />
              <div className="mb-3 mt-3">
                <div className={`text-[19px] font-black leading-none ${tone.head}`}>
                  {col.when}
                </div>
                <div className="mt-1.5 font-mono text-[12px] font-bold uppercase tracking-wider text-[#8a857a]">
                  {col.date} · {tiles.length} of {TILES.length}
                </div>
              </div>

              <div className="flex flex-col" style={{ gap: TILE_GAP }}>
                {tiles.map((t) => (
                  <TileCell
                    key={t.id}
                    tile={t}
                    lit={lit.includes(t.id)}
                    dimmed={hasFocus && !focus!.includes(t.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TileCell({
  tile,
  lit,
  dimmed,
}: {
  tile: Tile;
  lit: boolean;
  dimmed: boolean;
}) {
  const state: TileState = lit ? "live" : tile.state;
  const tone = TONE[state];
  return (
    <div
      data-tile={tile.id}
      data-state={state}
      className={`rounded-[3px] border-2 px-3.5 py-2.5 ${tone.tile}`}
      style={{ height: TILE_H, opacity: dimmed ? 0.35 : 1 }}
    >
      <div className={`text-[15px] font-bold leading-tight ${tone.name}`}>
        {tile.name}
      </div>
      <div className={`mt-1 font-mono text-[11px] leading-none ${tone.ref}`}>
        {tile.ref}
      </div>
    </div>
  );
}

// Layout constants, exported so annotations can be positioned from the same numbers the
// board is drawn with rather than from a guess.
export const COL_W = 340;
export const COL_GAP = 30;
export const TILE_H = 56;
export const TILE_GAP = 8;
export const HEAD_H = 5 + 12 + 46;
export const BOARD_W = COL_W * 3 + COL_GAP * 2;
export const BOARD_H = HEAD_H + 6 * TILE_H + 5 * TILE_GAP;
