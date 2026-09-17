"use client";

import { useMemo } from "react";
import { roughEllipse, roughArrow, roughLine } from "./rough";

// The annotation layer. Hand-drawn marks laid over the crisp board, the way a person
// marks up a printed copy. Geometry comes from Rough.js as path data; anime draws it on
// in reveal.ts. Nothing here animates by itself.
//
// Marks are positioned in the slide's own 1280x720 coordinate space, so a slide places
// them against the board rather than nesting them inside it.

const RED = "#c0392b";
const INK = "#2563eb";

function Strokes({
  ds,
  stroke,
  group,
  width = 2.4,
  opacity = 1,
}: {
  ds: string[];
  stroke: string;
  group: string;
  width?: number;
  opacity?: number;
}) {
  return (
    <>
      {ds.map((d, i) => (
        <path
          key={i}
          data-draw={group}
          pathLength="1"
          d={d}
          fill="none"
          stroke={stroke}
          strokeWidth={width}
          strokeOpacity={opacity}
          strokeLinecap="round"
        />
      ))}
    </>
  );
}

// A ring round something that matters. Red is reserved for marking a published claim
// false; everything else rings in ink.
export function Ring({
  x,
  y,
  w,
  h,
  seed = 7,
  tone = "ink",
  group = "ring",
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  seed?: number;
  tone?: "ink" | "false";
  group?: string;
}) {
  const ds = useMemo(() => roughEllipse(x, y, w, h, seed), [x, y, w, h, seed]);
  return <Strokes ds={ds} stroke={tone === "false" ? RED : INK} group={group} />;
}

export function Arrow({
  from,
  to,
  bend = -40,
  seed = 11,
  tone = "ink",
  group = "arrow",
}: {
  from: [number, number];
  to: [number, number];
  bend?: number;
  seed?: number;
  tone?: "ink" | "false";
  group?: string;
}) {
  const ds = useMemo(
    () => roughArrow(from, to, bend, seed),
    [from[0], from[1], to[0], to[1], bend, seed]
  );
  return <Strokes ds={ds} stroke={tone === "false" ? RED : INK} group={group} width={2.2} />;
}

// Struck through, for a claim that turned out to be false.
export function Strike({
  x1,
  y1,
  x2,
  y2,
  seed = 3,
  group = "strike",
  opacity = 1,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  seed?: number;
  group?: string;
  opacity?: number;
}) {
  const ds = useMemo(() => roughLine(x1, y1, x2, y2, seed), [x1, y1, x2, y2, seed]);
  return (
    <Strokes ds={ds} stroke={RED} group={group} width={2.6} opacity={opacity} />
  );
}

// The full-slide surface every annotation sits on.
export function Layer({ children }: { children: React.ReactNode }) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 z-20"
      width={1280}
      height={720}
      viewBox="0 0 1280 720"
      fill="none"
      aria-hidden
    >
      {children}
    </svg>
  );
}
