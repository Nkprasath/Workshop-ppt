"use client";

import type {
  BrowserSlide,
  ChainSlide,
  LedgerSlide,
  DiagramSlide,
  CompareSlide,
  ProportionSlide,
  DialsSlide,
  LanesSlide,
} from "@/lib/content/deck";
import { Head, Fact, Verdict, SHELL } from "./ui";
import { Layer, Arrow, Strike, Ring } from "./Annotate";

// The slide kinds that are not built on the commencement board. Each one still renders an
// object: a browser, a register, a chain, a map, a pair of panels, a proportion, a set of
// dials, a plan. The words are labels attached to those objects.

// ------------------------------------------------------------------- browser

export function BrowserView({ slide, step }: { slide: BrowserSlide; step: number }) {
  return (
    <div className={SHELL}>
      <Head block={slide.block} title={slide.title} />

      <div className="mx-auto mt-4 w-[860px] overflow-hidden rounded-lg border-2 border-[#c5c0b5] shadow-[0_14px_40px_rgba(0,0,0,0.12)]">
        <div className="flex items-center gap-3 border-b-2 border-[#c5c0b5] bg-[#ece8e1] px-4 py-2.5">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#d95c54]" />
            <span className="h-3 w-3 rounded-full bg-[#dfa32b]" />
            <span className="h-3 w-3 rounded-full bg-[#4fae5a]" />
          </div>
          <div className="flex flex-1 items-center rounded-md border border-[#d5d0c6] bg-white px-3 py-1.5">
            <span
              data-anim="url"
              data-url={slide.url}
              className="font-mono text-[15px] text-[#141412]"
            />
            <span className="ml-0.5 inline-block h-[16px] w-[2px] animate-pulse bg-[#141412] align-middle" />
          </div>
        </div>

        <div className="flex h-[280px] items-center justify-center bg-white">
          {step >= 2 && (
            <div className="max-w-lg px-10 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#ece8e1]">
                <svg
                  className="h-8 w-8 text-[#8a857a]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M15 9l-6 6M9 9l6 6" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-[24px] font-medium text-[#3d3a34]">
                {slide.outcome.headline}
              </p>
              <p className="mt-3 font-mono text-[13px] uppercase tracking-wider text-[#9c978c]">
                {slide.outcome.detail}
              </p>
            </div>
          )}
        </div>
      </div>

      {step >= 3 && (
        <Verdict tone="false" fact={slide.fact}>
          {slide.verdict}
        </Verdict>
      )}
    </div>
  );
}

// --------------------------------------------------------------------- chain

export function ChainView({ slide, step }: { slide: ChainSlide; step: number }) {
  const shown = Math.max(0, Math.min(step - 1, slide.nodes.length));
  const BOX_W = 336;
  const GAP = 38;
  const LEFT = 64;
  const TOP = 232;
  const H = 168;
  const cx = (i: number) => LEFT + i * (BOX_W + GAP) + BOX_W / 2;

  return (
    <div className={SHELL}>
      <Head block={slide.block} title={slide.title} />
      {slide.intro && (
        <p className="max-w-[900px] text-[16px] leading-snug text-[#5c5850]">
          {slide.intro}
        </p>
      )}

      <div className="absolute" style={{ left: LEFT, top: TOP }}>
        <div className="flex" style={{ gap: GAP }}>
          {slide.nodes.map((n, i) => {
            const on = i < shown;
            const absent = n.state === "absent";
            return (
              <div
                key={i}
                data-node={i}
                className={`rounded-[3px] border-2 px-5 py-4 ${
                  !on
                    ? "border-[#d8d3c9] bg-[#f2efe9]"
                    : absent
                      ? "border-[#c0392b] bg-white"
                      : "border-[#1d4ed8] bg-white"
                }`}
                style={{ width: BOX_W, height: H, opacity: on ? 1 : 0.45 }}
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#6b6659]">
                    Step {i + 1}
                  </span>
                  {on && (
                    <span
                      className={`font-mono text-[11px] font-bold uppercase tracking-wider ${
                        absent ? "text-[#c0392b]" : "text-[#1d4ed8]"
                      }`}
                    >
                      {absent ? "Does not exist" : "Exists"}
                    </span>
                  )}
                </div>
                <div className="text-[19px] font-bold leading-tight text-[#141412]">
                  {n.label}
                </div>
                <p className="mt-2 text-[13.5px] leading-snug text-[#5c5850]">
                  {n.sub}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <Layer>
        {slide.nodes.slice(0, shown).map((n, i) =>
          n.state === "absent" ? (
            <Strike
              key={i}
              x1={cx(i) - BOX_W / 2 + 16}
              y1={TOP + 34}
              x2={cx(i) + BOX_W / 2 - 16}
              y2={TOP + H - 30}
              seed={91 + i * 7}
              opacity={0.55}
              group={`x${i}`}
            />
          ) : null
        )}
        {slide.nodes.slice(0, Math.max(0, shown - 1)).map((_, i) => (
          <Arrow
            key={`a${i}`}
            from={[cx(i) + BOX_W / 2 + 4, TOP + H / 2]}
            to={[cx(i + 1) - BOX_W / 2 - 6, TOP + H / 2]}
            bend={0}
            seed={41 + i * 5}
            group={`link${i}`}
          />
        ))}
      </Layer>

      {step > slide.nodes.length + 1 && (
        <Verdict fact={slide.fact}>{slide.verdict}</Verdict>
      )}
    </div>
  );
}

// -------------------------------------------------------------------- ledger

export function LedgerView({ slide, step }: { slide: LedgerSlide; step: number }) {
  const empty = slide.rows.length === 0;
  const shownRows = empty ? 0 : Math.min(step, slide.rows.length);
  const scored = new Set(slide.scored ?? []);

  return (
    <div className={SHELL}>
      <Head block={slide.block} title={slide.title} />

      <div className="flex h-[440px] flex-col justify-center">
        <table className="w-full">
          <thead>
            <tr>
              {slide.headers.map((h, i) => (
                <th
                  key={h}
                  className={`border-b-2 border-[#141412] px-5 pb-2.5 text-left font-mono text-[12px] font-bold uppercase tracking-wider ${
                    i === slide.headers.length - 1
                      ? "text-[#141412]"
                      : "text-[#8a857a]"
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {empty
              ? Array.from({ length: 5 }, (_, r) => (
                  <tr key={r} className="h-[58px]">
                    {slide.headers.map((h) => (
                      <td key={h} className="border-b border-[#ddd8ce] px-5" />
                    ))}
                  </tr>
                ))
              : slide.rows.map((row, r) => (
                  <tr
                    key={r}
                    data-row={r}
                    className="align-top"
                    style={{ opacity: r < shownRows ? 1 : 0.28 }}
                  >
                    {row.map((cell, c) => (
                      <td
                        key={c}
                        data-cell={`${r},${c}`}
                        className={`border-b border-[#ddd8ce] px-5 py-5 leading-snug ${
                          c === 0
                            ? "text-[17px] font-bold text-[#141412]"
                            : scored.has(`${r},${c}`) && r < shownRows
                              ? "text-[16px] font-bold text-[#c0392b]"
                              : c === row.length - 1
                                ? "text-[16px] font-semibold text-[#141412]"
                                : "text-[15px] text-[#57534a]"
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {empty && step >= 2 && (
        <p className="mt-5 max-w-[860px] text-[16px] leading-snug text-[#5c5850]">
          {slide.emptyNote}
        </p>
      )}

      {step >= (empty ? 3 : slide.rows.length + 1) && (
        <Verdict fact={slide.fact}>{slide.verdict}</Verdict>
      )}
    </div>
  );
}

// ------------------------------------------------------------------- diagram

const NODE_H = 62;

export function DiagramView({ slide, step }: { slide: DiagramSlide; step: number }) {
  const byId = Object.fromEntries(slide.nodes.map((n) => [n.id, n]));

  return (
    <div className={SHELL}>
      <Head block={slide.block} title={slide.title} />

      {slide.nodes.map((n, i) => {
        // Nodes arrive with the edge that reaches them, so the map builds rather than
        // appearing all at once.
        const arrivesAt =
          slide.edges.find((e) => e.to === n.id)?.at ?? 2;
        const on = step >= (i === 0 ? 1 : arrivesAt);
        return (
          <div
            key={n.id}
            data-node={n.id}
            className={`absolute rounded-[3px] border-2 px-3.5 py-2.5 ${
              n.tone === "warn"
                ? "border-[#b45309] bg-white"
                : "border-[#4a463e] bg-white"
            }`}
            style={{
              left: n.x,
              top: n.y,
              width: n.w,
              height: NODE_H,
              opacity: on ? 1 : 0.18,
            }}
          >
            <div className="text-[15px] font-bold leading-tight text-[#141412]">
              {n.label}
            </div>
            {n.sub && (
              <div className="mt-0.5 font-mono text-[11px] text-[#6b6659]">
                {n.sub}
              </div>
            )}
          </div>
        );
      })}

      <Layer>
        {slide.edges
          .filter((e) => step >= e.at)
          .map((e, i) => {
            const a = byId[e.from];
            const b = byId[e.to];
            if (!a || !b) return null;
            return (
              <Arrow
                key={i}
                from={[a.x + a.w + 4, a.y + NODE_H / 2]}
                to={[b.x - 6, b.y + NODE_H / 2]}
                bend={e.bend ?? 0}
                seed={17 + i * 11}
                group={`edge${i}`}
              />
            );
          })}
        {step >= 5 &&
          slide.nodes
            .filter((n) => n.tone === "warn")
            .map((n, i) => (
              <Ring
                key={n.id}
                x={n.x + n.w / 2}
                y={n.y + NODE_H / 2}
                w={n.w + 34}
                h={NODE_H + 28}
                seed={61 + i * 13}
                tone="false"
                group={`warn${i}`}
              />
            ))}
      </Layer>

      {step >= 5 && (
        <Verdict tone="false" fact={slide.fact} top={556}>
          {slide.verdict}
        </Verdict>
      )}
    </div>
  );
}

// ------------------------------------------------------------------- compare

export function CompareView({ slide, step }: { slide: CompareSlide; step: number }) {
  return (
    <div className={SHELL}>
      <Head block={slide.block} title={slide.title} />

      <div className="mt-2 grid grid-cols-2 gap-8">
        {slide.panels.map((p, i) => {
          const on = step >= i + 1;
          const live = p.state === "live";
          return (
            <div
              key={i}
              data-panel={i}
              className={`rounded-[3px] border-2 ${
                live ? "border-[#c0392b]" : "border-[#c5c0b5]"
              } ${live ? "bg-white" : "bg-[#f2efe9]"}`}
              style={{ opacity: on ? 1 : 0.3 }}
            >
              <div
                className={`flex items-center justify-between border-b-2 px-5 py-3 ${
                  live
                    ? "border-[#c0392b] bg-[#fbeeec]"
                    : "border-[#c5c0b5] bg-[#ece8e1]"
                }`}
              >
                <div>
                  <div className="text-[19px] font-bold leading-tight text-[#141412]">
                    {p.title}
                  </div>
                  <div className="mt-0.5 font-mono text-[11px] text-[#6b6659]">
                    {p.source}
                  </div>
                </div>
                <span
                  className={`h-[13px] w-[13px] shrink-0 rounded-full ${
                    live
                      ? "bg-[#c0392b] ring-[3px] ring-[#c0392b]/25"
                      : "border-[2px] border-[#9c978c] bg-transparent"
                  }`}
                />
              </div>
              <dl className="divide-y divide-[#ddd8ce]">
                {p.rows.map((r) => (
                  <div key={r.label} className="flex gap-4 px-5 py-2.5">
                    <dt className="w-[150px] shrink-0 font-mono text-[11px] font-bold uppercase tracking-wider text-[#6b6659]">
                      {r.label}
                    </dt>
                    <dd className="text-[14px] leading-snug text-[#141412]">
                      {r.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          );
        })}
      </div>

      {step >= 3 && (
        <Verdict tone="false" fact={slide.fact}>
          {slide.verdict}
        </Verdict>
      )}
    </div>
  );
}

// ---------------------------------------------------------------- proportion

export function ProportionView({
  slide,
  step,
}: {
  slide: ProportionSlide;
  step: number;
}) {
  return (
    <div className={SHELL}>
      <Head block={slide.block} title={slide.title} />

      <div className="mt-6 flex items-center gap-16">
        <div className="w-[430px]">
          {step >= 2 && (
            <>
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[54px] font-black leading-none text-[#1d4ed8]">
                  {slide.subset.n}
                </span>
                <span className="text-[19px] text-[#5c5850]">
                  {slide.subset.label}
                </span>
              </div>
              <div className="mt-1.5 font-mono text-[15px] text-[#8a857a]">
                of {slide.total.n} {slide.total.label}
              </div>
            </>
          )}
          {step >= 3 && (
            <p className="mt-7 border-l-[3px] border-[#1d4ed8] pl-5 text-[17px] leading-snug text-[#3d3a34]">
              {slide.consequence}
            </p>
          )}
          {step >= 3 && (
            <div className="mt-5">
              <Fact>{slide.fact}</Fact>
            </div>
          )}
        </div>

        <div className="grid flex-1 grid-cols-10 gap-2.5">
          {Array.from({ length: slide.dots }, (_, i) => (
            <div
              key={i}
              data-anim="dot"
              className="aspect-square rounded-full"
              style={{
                background: i < slide.subset.count ? "#1d4ed8" : "#dcd8cf",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------- dials

export function DialsView({ slide, step }: { slide: DialsSlide; step: number }) {
  return (
    <div className={SHELL}>
      <Head block={slide.block} title={slide.title} />

      <div className="mt-8 grid grid-cols-4 gap-7">
        {slide.dials.map((d, i) => {
          const on = step >= i + 1;
          return (
            <div key={i} className="text-center" style={{ opacity: on ? 1 : 0.22 }}>
              <svg viewBox="0 0 120 120" className="mx-auto h-[150px] w-[150px]">
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  strokeWidth="5"
                  stroke={d.running ? "#c0392b" : "#c5c0b5"}
                />
                {d.running && (
                  <path
                    d="M60 12a48 48 0 0 1 41.6 24"
                    fill="none"
                    stroke="#c0392b"
                    strokeWidth="9"
                    strokeLinecap="round"
                  />
                )}
                {/* Hands. The stopped dials all read the same dead time. */}
                <line
                  x1="60"
                  y1="60"
                  x2="60"
                  y2="26"
                  stroke={d.running ? "#c0392b" : "#9c978c"}
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <line
                  x1="60"
                  y1="60"
                  x2={d.running ? 88 : 60}
                  y2={d.running ? 74 : 92}
                  stroke={d.running ? "#c0392b" : "#9c978c"}
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <circle cx="60" cy="60" r="5" fill={d.running ? "#c0392b" : "#9c978c"} />
              </svg>
              <div
                className={`mt-2 font-mono text-[26px] font-black leading-none ${
                  d.running ? "text-[#c0392b]" : "text-[#8a857a]"
                }`}
              >
                {d.time}
              </div>
              <div className="mt-2 text-[14px] font-bold leading-tight text-[#141412]">
                {d.who}
              </div>
              <div className="mt-1 font-mono text-[11px] text-[#6b6659]">
                {d.starts}
              </div>
              <div
                className={`mt-2 font-mono text-[11px] font-bold uppercase tracking-wider ${
                  d.running ? "text-[#c0392b]" : "text-[#9c978c]"
                }`}
              >
                {d.running ? "Running today" : "Not in force"}
              </div>
            </div>
          );
        })}
      </div>

      {step >= slide.dials.length + 1 && (
        <Verdict fact={slide.fact}>{slide.footnote}</Verdict>
      )}
    </div>
  );
}

// --------------------------------------------------------------------- lanes

export function LanesView({ slide, step }: { slide: LanesSlide; step: number }) {
  const cols = ["Today", "Day 30", "Day 90"] as const;
  return (
    <div className={SHELL}>
      <Head block={slide.block} title={slide.title} />

      <div className="mt-2 overflow-hidden rounded-[3px] border-2 border-[#c5c0b5]">
        <div className="grid grid-cols-[190px_repeat(3,1fr)] border-b-2 border-[#c5c0b5] bg-[#ece8e1]">
          <div className="px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-wider text-[#4a463e]">
            Area
          </div>
          {cols.map((c, i) => (
            <div
              key={c}
              className={`px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-wider ${
                i === 2 ? "text-[#6b6659]" : "text-[#4a463e]"
              }`}
            >
              {c}
            </div>
          ))}
        </div>
        {slide.lanes.map((lane, r) => (
          <div
            key={lane.area}
            className="grid grid-cols-[190px_repeat(3,1fr)] border-b border-[#ddd8ce] last:border-b-0"
            style={{ opacity: step >= 2 || r === 0 ? 1 : 0.4 }}
          >
            <div className="bg-[#f5f2ec] px-4 py-3 text-[14px] font-bold text-[#141412]">
              {lane.area}
            </div>
            {[lane.now, lane.day30, lane.day90].map((v, i) => (
              <div
                key={i}
                className={`px-4 py-3 text-[13.5px] leading-snug ${
                  i === 0
                    ? "text-[#141412]"
                    : i === 1
                      ? "text-[#4a463e]"
                      : "text-[#8a857a]"
                }`}
              >
                {v}
              </div>
            ))}
          </div>
        ))}
      </div>

      {step >= 3 && <Verdict fact={slide.fact}>{slide.verdict}</Verdict>}
    </div>
  );
}
