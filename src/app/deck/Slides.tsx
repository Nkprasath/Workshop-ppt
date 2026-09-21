"use client";

import type { Slide, BoardSlide, WiringSlide, ClaimsSlide } from "@/lib/content/deck";
import {
  TitleView,
  CompanyView,
  BrowserView,
  ChainView,
  LedgerView,
  DiagramView,
  CompareView,
  ProportionView,
  DialsView,
  LanesView,
} from "./Kinds";
import { Board, BOARD_W, BOARD_H } from "./Board";
import { tileRect, columnBottom } from "@/lib/content/board";
import type { TileState } from "@/lib/content/board";
import { Layer, Ring, Arrow, Strike } from "./Annotate";

// Every slide renders onto a fixed 1280x720 canvas which is then scaled to the viewport,
// so a strange projector resolution changes the size of the deck and never its layout.
export const CANVAS = { w: 1280, h: 720 };

export function fragmentCount(slide: Slide): number {
  return slide.steps;
}

function Head({ block, title }: { block: string; title: string }) {
  return (
    <header className="mb-7">
      <div className="font-mono text-[12px] uppercase tracking-[0.2em] text-[#8a867c]">
        {block}
      </div>
      <h2 className="mt-1.5 text-[34px] font-black leading-none tracking-tight text-[#1a1a18]">
        {title}
      </h2>
    </header>
  );
}

function Fact({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[11px] tracking-wide text-[#b5b1a7]">
      {children}
    </span>
  );
}

// --------------------------------------------------------------------- board

// Where the board sits on a board slide, and the helper that turns a tile id into ring
// geometry, so a mark always lands on the thing it is marking.
const BOARD_AT = { x: (1280 - BOARD_W * 0.88) / 2, y: 196, scale: 0.88 };

function ringOn(
  id: string,
  at: { x: number; y: number; scale: number }
): { x: number; y: number; w: number; h: number } {
  const r = tileRect(id, at.x, at.y, at.scale);
  return { x: r.cx, y: r.cy, w: r.w + 34, h: r.h + 26 };
}

function BoardSlideView({ slide, step }: { slide: BoardSlide; step: number }) {
  const focus = slide.focusByStep?.[step - 1];
  const lit = slide.litByStep?.[step - 1] ?? [];
  const readout = slide.readout.filter((r) => r.at <= step).slice(-1)[0];
  const ringing = slide.id === "november-fires" && step >= 3;

  return (
    <div className="relative h-full bg-[#fbfaf7] px-16 py-12">
      <Head block={slide.block} title={slide.title} />

      <p className="mb-6 max-w-[820px] text-[17px] leading-snug text-[#5c5850]">
        {slide.caption}
      </p>

      <div style={{ position: "absolute", left: BOARD_AT.x, top: BOARD_AT.y }}>
        <Board focus={focus} lit={lit} scale={BOARD_AT.scale} />
      </div>

      <div className="absolute bottom-12 left-16 right-16 flex items-end justify-between gap-10">
        <div className="min-h-[52px] max-w-[820px]">
          {readout && (
            <p
              data-readout
              className="border-l-[3px] border-[#2563eb] pl-4 text-[19px] font-semibold leading-snug text-[#1a1a18]"
            >
              {readout.text}
            </p>
          )}
        </div>
        <div className="shrink-0">
          <Fact>{slide.fact}</Fact>
        </div>
      </div>

      {ringing && (
        <Layer>
          <Ring
            {...ringOn("s28-34", BOARD_AT)}
            seed={19}
            group="ring"
          />
        </Layer>
      )}
    </div>
  );
}

// -------------------------------------------------------------------- wiring

// Board geometry on this slide, in canvas coordinates. Row centres are derived from the
// board's own 84px rows and 10px gaps at the scale it is drawn here.
const WIRE_BOARD = { x: (1280 - BOARD_W * 0.66) / 2, y: 104, scale: 0.66 };

function WiringSlideView({ slide, step }: { slide: WiringSlide; step: number }) {
  // Step 1 is the board and the notification, cold. Steps 2 to 4 energise one clause
  // each. Step 5 rings the provisions clause (c) holds back.
  const activeClauses = Math.max(0, Math.min(step - 1, slide.clauses.length));
  const focus =
    activeClauses > 0 ? slide.clauses[activeClauses - 1]?.energises : undefined;


  // Each wire runs from its clause block up to the tile that clause actually energises.
  const CLAUSE_TOP = 450;
  const anchors: { tile: string; column: TileState }[] = [
    { tile: "s18-26", column: "live" },
    { tile: "s27-1-d", column: "nov2026" },
    { tile: "s28-34", column: "may2027" },
  ];
  const wires = slide.clauses.map((_, i) => {
    const a = anchors[i];
    const r = tileRect(a.tile, WIRE_BOARD.x, WIRE_BOARD.y, WIRE_BOARD.scale);
    const colW = (1152 - 32) / 3;
    const cx = 64 + i * (colW + 16) + colW / 2;
    return {
      from: [cx, CLAUSE_TOP] as [number, number],
      to: [
        r.cx,
        columnBottom(a.column, WIRE_BOARD.y, WIRE_BOARD.scale) + 10,
      ] as [number, number],
    };
  });

  return (
    <div className="relative h-full bg-[#fbfaf7] px-16 py-10">
      <Head block={slide.block} title={slide.title} />

      <div style={{ position: "absolute", left: WIRE_BOARD.x, top: WIRE_BOARD.y }}>
        <Board focus={focus} scale={WIRE_BOARD.scale} />
      </div>

      {/* The notification, as an instruction label rather than a page to read. */}
      <div className="absolute left-16 right-16" style={{ top: 462 }}>
        <div className="mb-3 flex items-baseline gap-4 border-b border-[#ddd9d0] pb-2">
          <span className="font-mono text-[13px] font-bold tracking-wide text-[#1a1a18]">
            G.S.R. 843(E)
          </span>
          <span className="font-mono text-[11px] text-[#8a867c]">
            {slide.masthead[0]}
          </span>
          <span className="ml-auto font-mono text-[11px] text-[#8a867c]">
            New Delhi, 13 November 2025
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {slide.clauses.map((c, i) => {
            const on = i < activeClauses;
            return (
              <div
                key={c.ref}
                data-clause={c.ref}
                className={`rounded-[3px] border px-4 py-3 ${
                  on
                    ? "border-[#2563eb]/45 bg-white"
                    : "border-[#e3dfd6] bg-[#f5f3ee]"
                }`}
                style={{ opacity: on ? 1 : 0.42 }}
              >
                <div className="mb-1.5 flex items-baseline justify-between">
                  <span className="font-mono text-[15px] font-bold text-[#1a1a18]">
                    {c.ref}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#8a867c]">
                    {c.when}
                  </span>
                </div>
                <p className="text-[12.5px] leading-[1.5] text-[#3d3a34]">
                  {c.extract}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <Layer>
        {wires.slice(0, activeClauses).map((w, i) => (
          <Arrow
            key={i}
            from={w.from}
            to={w.to}
            bend={-26}
            seed={31 + i * 7}
            group={`wire${i}`}
          />
        ))}
        {step >= 5 && (
          <Ring
            {...ringOn("s28-34", WIRE_BOARD)}
            seed={19}
            group="ring"
          />
        )}
      </Layer>

      {step >= 5 && (
        <div
          data-verdict
          className="absolute bottom-8 left-16 right-16 z-30 border-l-[3px] border-[#2563eb] pl-5"
        >
          <p className="text-[19px] font-semibold leading-snug text-[#1a1a18]">
            {slide.verdict}
          </p>
          <div className="mt-1.5">
            <Fact>{slide.fact}</Fact>
          </div>
        </div>
      )}
    </div>
  );
}


// -------------------------------------------------------------------- claims

const CLAIMS_BOARD = { x: (1280 - BOARD_W * 0.62) / 2, y: 100, scale: 0.62 };
const CLAIMS_BOARD_BOTTOM = CLAIMS_BOARD.y + BOARD_H * 0.62;

function ClaimsSlideView({ slide, step }: { slide: ClaimsSlide; step: number }) {
  // Steps 2 to 4 take one claim each; step 5 strikes all three at once.
  const active = Math.max(0, Math.min(step - 1, slide.claims.length));
  const struck = step >= slide.claims.length + 2;
  const focus =
    active > 0 && !struck ? [slide.claims[active - 1].assumes] : undefined;

  const CARD_TOP = 408;
  const ARROW_FROM = CARD_TOP - 10;
  const STRIKE_Y = CARD_TOP + 40;
  const colW = (1152 - 32) / 3;
  const cx = (i: number) => 64 + i * (colW + 16) + colW / 2;

  return (
    <div className="relative h-full bg-[#fbfaf7] px-16 py-10">
      <Head block={slide.block} title={slide.title} />

      <div style={{ position: "absolute", left: CLAIMS_BOARD.x, top: CLAIMS_BOARD.y }}>
        <Board focus={focus} scale={CLAIMS_BOARD.scale} />
      </div>

      <div className="absolute left-16 right-16" style={{ top: CARD_TOP }}>
        <div className="grid grid-cols-3 gap-4">
          {slide.claims.map((c, i) => {
            const on = i < active || struck;
            return (
              <figure
                key={i}
                data-claim={i}
                className={`rounded-[3px] border-2 px-4 py-3 ${
                  on ? "border-[#c0392b]/60 bg-white" : "border-[#d8d3c9] bg-[#f2efe9]"
                }`}
                style={{ opacity: on ? 1 : 0.5 }}
              >
                <blockquote className="text-[14px] font-semibold leading-snug text-[#141412]">
                  &ldquo;{c.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-2 flex items-baseline justify-between gap-2">
                  <span className="font-mono text-[11px] text-[#6b6659]">
                    {c.source}
                  </span>
                  <Fact>{c.fact}</Fact>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>

      <Layer>
        {slide.claims.slice(0, active).map((c, i) => {
          const r = tileRect(c.assumes, CLAIMS_BOARD.x, CLAIMS_BOARD.y, CLAIMS_BOARD.scale);
          return (
            <Arrow
              key={i}
              from={[cx(i), ARROW_FROM]}
              to={[r.cx, CLAIMS_BOARD_BOTTOM + 9]}
              bend={-22}
              seed={53 + i * 9}
              tone="false"
              group={`claim${i}`}
            />
          );
        })}
        {struck &&
          slide.claims.map((_, i) => (
            <Strike
              key={i}
              x1={cx(i) - colW / 2 + 12}
              y1={STRIKE_Y}
              x2={cx(i) + colW / 2 - 12}
              y2={STRIKE_Y + 4}
              seed={71 + i * 5}
              group={`struck${i}`}
            />
          ))}
      </Layer>

      {struck && (
        <div className="absolute left-16 right-16 border-l-[3px] border-[#c0392b] pl-5"
          style={{ top: 566 }}>
          <p className="text-[19px] font-semibold leading-snug text-[#141412]">
            {slide.verdict}
          </p>
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------------- router

export function SlideView({ slide, step }: { slide: Slide; step: number }) {
  switch (slide.kind) {
    case "title":
      return <TitleView slide={slide} step={step} />;
    case "company":
      return <CompanyView slide={slide} step={step} />;
    case "board":
      return <BoardSlideView slide={slide} step={step} />;
    case "claims":
      return <ClaimsSlideView slide={slide} step={step} />;
    case "wiring":
      return <WiringSlideView slide={slide} step={step} />;
    case "browser":
      return <BrowserView slide={slide} step={step} />;
    case "chain":
      return <ChainView slide={slide} step={step} />;
    case "ledger":
      return <LedgerView slide={slide} step={step} />;
    case "diagram":
      return <DiagramView slide={slide} step={step} />;
    case "compare":
      return <CompareView slide={slide} step={step} />;
    case "proportion":
      return <ProportionView slide={slide} step={step} />;
    case "dials":
      return <DialsView slide={slide} step={step} />;
    case "lanes":
      return <LanesView slide={slide} step={step} />;
  }
}
