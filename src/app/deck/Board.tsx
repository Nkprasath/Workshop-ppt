"use client";

import { TILES, BOARD_COLS, STATE_LABEL } from "@/lib/content/board";
import type { Tile, TileState } from "@/lib/content/board";

// The commencement board. Every slide that makes a claim about what is in force is built
// on this object, so the room learns one picture and then watches it change.
//
// Tiles are machine-crisp on purpose. Lamps are the only thing that carries colour, so a
// lit tile is the only thing on any slide that can pull the eye.

const LAMP: Record<TileState, string> = {
  // Solid, ringed: in force.
  live: "bg-[#1d4ed8] ring-[3px] ring-[#1d4ed8]/25",
  // Hollow centre, heavy rim: pending. Reads as different from solid even at low bitrate.
  nov2026: "bg-transparent border-[3px] border-[#b45309]",
  // Thin outline, empty: not yet.
  may2027: "bg-transparent border-[2px] border-[#9c978c]",
};

const TILE_SHELL: Record<TileState, string> = {
  live: "border-[#1d4ed8] bg-white",
  nov2026: "border-[#b45309] bg-white",
  may2027: "border-[#c5c0b5] bg-[#f2efe9]",
};

const TILE_TEXT: Record<TileState, string> = {
  live: "text-[#141412]",
  nov2026: "text-[#141412]",
  may2027: "text-[#7d786d]",
};

export interface BoardProps {
  // Tiles named here are drawn at full attention. Everything else recedes. An empty or
  // absent list means the whole board is at equal weight.
  focus?: string[];
  // Tiles forced to render as though already switched on, for the moment a slide shows a
  // tranche firing.
  lit?: string[];
  scale?: number;
  className?: string;
}

export function Board({ focus, lit = [], scale = 1, className = "" }: BoardProps) {
  const hasFocus = Boolean(focus && focus.length > 0);

  return (
    <div
      className={`relative ${className}`}
      style={{ width: 1080 * scale, height: 372 * scale }}
      data-board
    >
      <div
        className="absolute left-0 top-0 grid origin-top-left gap-2.5"
        style={{
          width: 1080,
          gridTemplateColumns: `repeat(${BOARD_COLS}, 1fr)`,
          gridAutoRows: "84px",
          transform: `scale(${scale})`,
        }}
      >
        {TILES.map((t) => (
          <TileCell
            key={t.id}
            tile={t}
            dimmed={hasFocus && !focus!.includes(t.id)}
            forcedLive={lit.includes(t.id)}
          />
        ))}
      </div>
    </div>
  );
}

function TileCell({
  tile,
  dimmed,
  forcedLive,
}: {
  tile: Tile;
  dimmed: boolean;
  forcedLive: boolean;
}) {
  const state: TileState = forcedLive ? "live" : tile.state;
  return (
    <div
      data-tile={tile.id}
      data-state={state}
      className={`relative flex flex-col justify-between rounded-[3px] border-2 px-3 py-2.5 ${TILE_SHELL[state]}`}
      style={{
        gridColumn: `${tile.col} / span ${tile.span ?? 1}`,
        gridRow: tile.row,
        opacity: dimmed ? 0.5 : 1,
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={`font-mono text-[14px] font-bold leading-none ${TILE_TEXT[state]}`}
        >
          {tile.ref}
        </span>
        <span
          data-lamp={tile.id}
          className={`mt-[1px] h-[11px] w-[11px] shrink-0 rounded-full ${LAMP[state]}`}
        />
      </div>
      <div>
        <div className={`text-[15px] font-bold leading-tight ${TILE_TEXT[state]}`}>
          {tile.name}
        </div>
        <div
          className={`mt-1 font-mono text-[11px] font-bold uppercase tracking-wider ${
            state === "may2027" ? "text-[#9c978c]" : "text-[#6b6659]"
          }`}
        >
          {STATE_LABEL[state]}
        </div>
      </div>
    </div>
  );
}

// The legend, shown wherever the board is introduced or re-introduced after a gap.
export function BoardKey({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-6 ${className}`}>
      {(["live", "nov2026", "may2027"] as TileState[]).map((s) => (
        <span key={s} className="flex items-center gap-2">
          <span className={`h-[11px] w-[11px] rounded-full ${LAMP[s]}`} />
          <span className="font-mono text-[12px] font-bold uppercase tracking-wider text-[#6b6659]">
            {STATE_LABEL[s]}
          </span>
        </span>
      ))}
    </div>
  );
}
