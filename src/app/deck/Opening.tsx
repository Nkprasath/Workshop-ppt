"use client";

import type { CoverSlide, HostsSlide, AgendaSlide } from "@/lib/content/deck";
import { PRASATH_PHOTO, OLIVIA_PHOTO } from "@/lib/content/photos";
import { Head, Verdict, SHELL } from "./ui";

// The three opening slides: the cover, the facilitators and the agenda. They carry more
// motion than the rest of the deck on purpose: each element rises into place once, as it
// is revealed, so the room has something to follow before the content starts.

// --------------------------------------------------------------------- cover

// The three commencement dates sit beside the title from the first step, because they
// are what the whole session turns on.
export function CoverView({ slide, step }: { slide: CoverSlide; step: number }) {
  return (
    <div className="relative h-full overflow-hidden bg-[#fbfaf7] px-20 pt-16">
      <div className="absolute left-0 top-0 h-full w-[6px] bg-[#1d4ed8]" />

      <div className="flex gap-14">
        <div className="w-[680px]">
          <div className="font-mono text-[13px] font-bold uppercase tracking-[0.22em] text-[#1d4ed8]">
            {slide.eyebrow}
          </div>
          {/* The title splits at its line break: the subject large, the question under it. */}
          <h1 className="mt-4 font-black tracking-tight text-[#141412]">
            <span className="block text-[64px] leading-none">{slide.title.split("\n")[0]}</span>
            {slide.title.includes("\n") && (
              <span className="mt-3 block text-[40px] leading-[1.1] text-[#1d4ed8]">
                {slide.title.split("\n")[1]}
              </span>
            )}
          </h1>
          {step >= 2 && (
            <p className="deck-rise mt-6 text-[20px] leading-snug text-[#4a463e]">
              {slide.lead}
            </p>
          )}
        </div>

        <div className="relative mt-2 w-[330px] shrink-0">
          <div className="deck-grow absolute left-[9px] top-3 h-[250px] w-[3px] bg-[#d6d1c6]" />
          {slide.dates.map((d, i) => (
            <div
              key={d.date}
              className="deck-rise relative mb-7 pl-10"
              style={{ animationDelay: `${250 + i * 220}ms` }}
            >
              <span
                className={`absolute left-0 top-[6px] h-[21px] w-[21px] rounded-full border-[3px] ${
                  d.main ? "border-[#1d4ed8] bg-[#1d4ed8]" : "border-[#9c978c] bg-[#fbfaf7]"
                }`}
              />
              <div
                className={`font-mono font-black leading-none ${
                  d.main ? "text-[30px] text-[#1d4ed8]" : "text-[20px] text-[#6b6659]"
                }`}
              >
                {d.date}
              </div>
              <div
                className={`mt-1.5 leading-snug ${
                  d.main ? "text-[16px] font-bold text-[#141412]" : "text-[14px] text-[#6b6659]"
                }`}
              >
                {d.what}
              </div>
            </div>
          ))}
        </div>
      </div>

      {step >= 3 && (
        <div className="absolute bottom-[78px] left-20 right-16 grid grid-cols-4 gap-4">
          {slide.outcomes.map((o, i) => (
            <div
              key={o}
              className="deck-rise rounded-[6px] border border-[#ddd8ce] bg-white px-4 py-4"
              style={{ animationDelay: `${i * 110}ms` }}
            >
              <div className="font-mono text-[12px] font-bold text-[#1d4ed8]">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="mt-1.5 text-[15px] font-semibold leading-snug text-[#141412]">
                {o}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="absolute bottom-9 left-20 font-mono text-[13px] tracking-wide text-[#8a857a]">
        {slide.meta}
      </p>
    </div>
  );
}

// --------------------------------------------------------------------- hosts

const PHOTOS = { prasath: PRASATH_PHOTO, olivia: OLIVIA_PHOTO };

export function HostsView({ slide, step }: { slide: HostsSlide; step: number }) {
  return (
    <div className={SHELL}>
      <Head block={slide.block} title={slide.title} />
      <p className="-mt-2 text-[17px] leading-snug text-[#57534a]">{slide.lead}</p>

      <div className="mt-7 grid grid-cols-2 gap-8">
        {slide.hosts.map((h, i) => (
          <div
            key={h.name}
            className="deck-rise flex items-center gap-6 rounded-[8px] border border-[#ddd8ce] bg-white p-5"
            style={{ animationDelay: `${i * 160}ms` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PHOTOS[h.photo]}
              alt=""
              className="h-[170px] w-[146px] shrink-0 rounded-[6px] object-cover"
            />
            <div className="pt-1">
              <div className="text-[25px] font-black leading-tight text-[#141412]">{h.name}</div>
              <div className="mt-1 font-mono text-[12px] font-bold uppercase tracking-[0.16em] text-[#1d4ed8]">
                {h.role}
              </div>
              {h.also && (
                <div className="mt-1 font-mono text-[12px] font-bold uppercase tracking-[0.16em] text-[#6b6659]">
                  {h.also}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {step >= 2 && (
        <div className="mt-8">
          <div className="font-mono text-[12px] font-bold uppercase tracking-[0.2em] text-[#6b6659]">
            How each block runs
          </div>
          <div className="mt-3 flex items-center gap-3">
            {slide.rhythm.map((r, i) => (
              <div key={r} className="contents">
                {i > 0 && (
                  <span
                    className="deck-rise text-[22px] text-[#1d4ed8]"
                    style={{ animationDelay: `${i * 160 - 80}ms` }}
                  >
                    &rarr;
                  </span>
                )}
                <div
                  className="deck-rise flex flex-1 items-center gap-3 rounded-[6px] bg-[#eef2ff] px-4 py-3"
                  style={{ animationDelay: `${i * 160}ms` }}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1d4ed8] font-mono text-[13px] font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="text-[15px] font-semibold leading-snug text-[#141412]">{r}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {step >= 2 && (
        <p className="deck-rise absolute bottom-10 left-16 right-16 text-[15px] text-[#57534a]">
          {slide.note}
        </p>
      )}
    </div>
  );
}

// -------------------------------------------------------------------- agenda

// One card per block. Each step lights the next card, so the agenda is walked through
// rather than read in one glance.
export function AgendaView({ slide, step }: { slide: AgendaSlide; step: number }) {
  return (
    <div className={SHELL}>
      <Head block={slide.block} title={slide.title} />

      <div className="mt-2 grid grid-cols-3 gap-4">
        {slide.blocks.map((b, i) => {
          const on = step >= i + 1;
          return (
            <div
              key={b.name}
              className={`rounded-[8px] border px-5 py-4 ${
                on ? "deck-rise border-[#ddd8ce] bg-white" : "border-dashed border-[#d6d1c6]"
              }`}
              style={{ opacity: on ? 1 : 0.4 }}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono text-[16px] font-black ${
                    on ? "bg-[#1d4ed8] text-white" : "bg-[#e3dfd6] text-[#9c978c]"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="text-[20px] font-black leading-tight text-[#141412]">{b.name}</span>
              </div>
              <p className="mt-3 min-h-[44px] text-[14px] leading-snug text-[#57534a]">{b.covers}</p>
              <div className="mt-3 border-t border-[#eeeae2] pt-2.5">
                <div className="font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#9c978c]">
                  You produce
                </div>
                <div className="mt-0.5 text-[14.5px] font-bold leading-snug text-[#141412]">
                  {b.produce}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {step >= slide.blocks.length && <Verdict>{slide.verdict}</Verdict>}
    </div>
  );
}
