import rough from "roughjs/bin/rough";
import type { Options } from "roughjs/bin/core";

// Rough.js is used for one job only: producing hand-drawn geometry as SVG path data,
// which is then rendered declaratively and drawn on by anime's createDrawable.
//
// The split is deliberate. The board is machine-crisp, because that is the law as
// notified and we do not get to draw it loosely. Everything we say *about* the board is
// hand-drawn, because that is a person pointing at it.
//
// Every shape takes a seed so the sketch is identical on every render. Without it React
// would re-roll the roughness on each paint and the annotations would jitter.

const gen = rough.generator();

const PEN: Options = {
  roughness: 1.35,
  bowing: 1.6,
  strokeWidth: 2.4,
  disableMultiStroke: false,
};

function paths(drawable: ReturnType<typeof gen.circle>): string[] {
  return gen.toPaths(drawable).map((p) => p.d);
}

export function roughEllipse(
  x: number,
  y: number,
  w: number,
  h: number,
  seed: number
): string[] {
  return paths(gen.ellipse(x, y, w, h, { ...PEN, seed }));
}

export function roughLine(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  seed: number
): string[] {
  return paths(gen.line(x1, y1, x2, y2, { ...PEN, seed }));
}

export function roughRect(
  x: number,
  y: number,
  w: number,
  h: number,
  seed: number
): string[] {
  return paths(gen.rectangle(x, y, w, h, { ...PEN, seed }));
}

// A freehand run through a list of points. Used for connectors and flows.
export function roughPath(points: [number, number][], seed: number): string[] {
  return paths(gen.curve(points, { ...PEN, seed }));
}

// An arrow is a curve plus two head strokes, returned together so the whole gesture
// draws as one.
export function roughArrow(
  from: [number, number],
  to: [number, number],
  bend: number,
  seed: number
): string[] {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 + bend;
  const shaft = paths(gen.curve([from, [mx, my], to], { ...PEN, seed }));

  // Head angle taken from the final approach, so it points where the shaft arrives.
  const angle = Math.atan2(y2 - my, x2 - mx);
  const len = 16;
  const spread = 0.42;
  const head = paths(
    gen.linearPath(
      [
        [x2 - len * Math.cos(angle - spread), y2 - len * Math.sin(angle - spread)],
        [x2, y2],
        [x2 - len * Math.cos(angle + spread), y2 - len * Math.sin(angle + spread)],
      ],
      { ...PEN, seed: seed + 1 }
    )
  );
  return [...shaft, ...head];
}
