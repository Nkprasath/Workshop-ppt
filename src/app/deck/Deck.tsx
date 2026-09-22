"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SLIDES, slideLabel } from "@/lib/content/deck";
import { SlideView, fragmentCount, CANVAS } from "./Slides";
import { revealSlide } from "./reveal";

export default function Deck() {
  const slides = SLIDES;

  const [i, setI] = useState(0);
  // Fragments are 1-indexed: a slide arrives showing its first fragment, never blank.
  const [step, setStep] = useState(1);
  const [presenter, setPresenter] = useState(false);
  const [overview, setOverview] = useState(false);
  const [scale, setScale] = useState(1);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const prev = useRef({ step: 1, id: "", index: 0 });

  const slide = slides[Math.min(i, slides.length - 1)];
  const frags = fragmentCount(slide);

  // Scale the fixed canvas to whatever the projector gives us. Layout never changes, only
  // its size, so what is checked on a laptop is what appears on the wall.
  useEffect(() => {
    function fit() {
      const box = stageRef.current?.getBoundingClientRect();
      if (!box) return;
      setScale(Math.min(box.width / CANVAS.w, box.height / CANVAS.h));
    }
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [presenter, overview]);

  // anime.js drives every reveal. React decides what should be visible; this decides how
  // it arrives. It runs after paint so the nodes for the current slide already exist.
  useEffect(() => {
    const root = stageRef.current;
    if (!root) return;
    const sameSlide = prev.current.id === slide.id;
    revealSlide(root, slide.id, step, prev.current.step, sameSlide);
    prev.current = { step, id: slide.id, index: i };
  }, [slide, step, i]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const next = useCallback(() => {
    setRunning(true);
    if (step < frags) {
      setStep((s) => s + 1);
      return;
    }
    if (i < slides.length - 1) {
      setI(i + 1);
      setStep(1);
    }
  }, [step, frags, i, slides.length]);

  const back = useCallback(() => {
    if (step > 1) {
      setStep((s) => s - 1);
      return;
    }
    if (i > 0) {
      const prev = i - 1;
      setI(prev);
      // Land on the previous slide fully revealed, not blank, so stepping back during a
      // question does not replay the whole build.
      setStep(fragmentCount(slides[prev]));
    }
  }, [step, i, slides]);

  function goto(index: number) {
    setI(index);
    setStep(1);
    setOverview(false);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const k = e.key;
      if (k === "ArrowRight" || k === " " || k === "PageDown") {
        e.preventDefault();
        next();
      } else if (k === "ArrowLeft" || k === "PageUp") {
        e.preventDefault();
        back();
      } else if (k === "ArrowDown") {
        e.preventDefault();
        if (i < slides.length - 1) goto(i + 1);
      } else if (k === "ArrowUp") {
        e.preventDefault();
        if (i > 0) goto(i - 1);
      } else if (k === "p" || k === "P") {
        setPresenter((v) => !v);
      } else if (k === "o" || k === "O" || k === "Escape") {
        setOverview((v) => !v);
      } else if (k === "f" || k === "F") {
        if (document.fullscreenElement) void document.exitFullscreen();
        else void document.documentElement.requestFullscreen();
      } else if (k === "r" || k === "R") {
        setElapsed(0);
        setRunning(false);
      } else if (/^[1-9]$/.test(k)) {
        const n = Number(k) - 1;
        if (n < slides.length) goto(n);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, back, i, slides.length]);

  const budget = slides.reduce((sum, s) => sum + s.seconds, 0);
  const spent = slides.slice(0, i).reduce((sum, s) => sum + s.seconds, 0);
  const behind = elapsed - spent;

  const clock = (s: number) =>
    `${Math.floor(Math.abs(s) / 60)}:${String(Math.abs(s) % 60).padStart(2, "0")}`;

  const controls = {
    next,
    back,
    presenter: () => setPresenter((v) => !v),
    overview: () => setOverview((v) => !v),
    fullscreen: () => {
      if (document.fullscreenElement) void document.exitFullscreen();
      else void document.documentElement.requestFullscreen();
    },
    reset: () => {
      setElapsed(0);
      setRunning(false);
    },
  };

  // ---------------------------------------------------------------- overview
  if (overview) {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="mb-6 flex items-baseline justify-between">
          <h1 className="text-lg font-bold text-white">
            All slides
            <span className="ml-3 font-mono text-sm font-normal text-gray-400">
              press O to close, or a number to jump
            </span>
          </h1>
          <span className="font-mono text-sm text-gray-400">
            {slides.length} slides · {clock(budget)} budgeted
          </span>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {slides.map((s, n) => (
            <button
              key={s.id}
              onClick={() => goto(n)}
              className={`overflow-hidden rounded-lg border-2 bg-white text-left transition-all hover:scale-[1.02] ${
                n === i ? "border-blue-500" : "border-transparent"
              }`}
            >
              <div className="relative h-[135px] w-full overflow-hidden">
                <div
                  className="deck-static absolute left-0 top-0 origin-top-left"
                  style={{
                    width: CANVAS.w,
                    height: CANVAS.h,
                    transform: "scale(0.1875)",
                  }}
                >
                  <SlideView slide={s} step={99} />
                </div>
              </div>
              <div className="border-t border-gray-200 px-3 py-2">
                <span className="font-mono text-[11px] text-gray-400">
                  {n + 1}
                </span>
                <span className="ml-2 text-[12px] font-semibold text-gray-700">
                  {s.block}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const stage = (
    <div ref={stageRef} className="group relative flex-1 overflow-hidden bg-white">
      <div
        className="absolute left-1/2 top-1/2 bg-white"
        style={{
          width: CANVAS.w,
          height: CANVAS.h,
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
      >
        <SlideView key={`${slide.id}-${step}`} slide={slide} step={step} />
        <span className="pointer-events-none absolute bottom-5 right-7 font-mono text-[13px] font-bold tracking-wider text-[#b8b3a8]">
          {i + 1}
        </span>
      </div>

      {/* Click to drive. A remote sends arrow keys, but a laptop trackpad is what is
          actually to hand, and the keyboard only works while this window has focus. */}
      <button
        type="button"
        onClick={back}
        aria-label="Previous"
        className="absolute inset-y-0 left-0 w-[18%] cursor-w-resize focus:outline-none"
      >
        <span className="ml-4 flex h-11 w-11 items-center justify-center rounded-full bg-gray-900/70 text-xl text-white opacity-0 transition-opacity group-hover:opacity-100">
          &#8249;
        </span>
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next"
        className="absolute inset-y-0 right-0 w-[82%] cursor-e-resize focus:outline-none"
      >
        <span className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-gray-900/70 text-xl text-white opacity-0 transition-opacity group-hover:opacity-100">
          &#8250;
        </span>
      </button>
    </div>
  );

  // --------------------------------------------------------------- presenter
  if (presenter) {
    const upcoming = slides[i + 1];
    return (
      <div className="flex h-screen flex-col bg-gray-900 text-white">
        <div className="flex flex-1 overflow-hidden">
          <div className="flex w-[58%] flex-col border-r border-gray-700">
            {stage}
          </div>
          <div className="flex w-[42%] flex-col overflow-hidden p-5">
            <div className="mb-4 flex items-center gap-4">
              <div>
                <div className="font-mono text-3xl font-bold tabular-nums">
                  {clock(elapsed)}
                </div>
                <div className="text-[11px] uppercase tracking-wider text-gray-500">
                  elapsed
                </div>
              </div>
              <div
                className={`rounded px-2.5 py-1 font-mono text-sm font-bold ${
                  behind > 60
                    ? "bg-red-500/20 text-red-400"
                    : behind < -60
                      ? "bg-blue-500/20 text-blue-300"
                      : "bg-green-500/20 text-green-400"
                }`}
              >
                {behind > 0 ? "+" : "-"}
                {clock(behind)}
              </div>
              <div className="ml-auto text-right">
                <div className="font-mono text-sm text-gray-400">
                  {i + 1} / {slides.length}
                </div>
                <div className="font-mono text-[11px] text-gray-600">
                  step {step}/{frags}
                </div>
              </div>
            </div>

            <div className="mb-3 rounded bg-gray-800 px-3 py-2">
              <span className="font-mono text-[11px] uppercase tracking-wider text-blue-400">
                {slide.block}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="mb-2 text-[11px] uppercase tracking-wider text-gray-500">
                Say this
              </div>
              <ul className="space-y-3">
                {slide.notes.map((n, k) => (
                  <li key={k} className="flex gap-2.5">
                    <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600" />
                    <span className="text-[15px] leading-relaxed text-gray-200">
                      {n}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {upcoming && (
              <div className="mt-4 border-t border-gray-700 pt-3">
                <div className="mb-1 text-[11px] uppercase tracking-wider text-gray-500">
                  Next
                </div>
                <div className="text-[13px] text-gray-400">
                  {upcoming.block}
                  {" · "}
                  {slideLabel(upcoming)}
                </div>
              </div>
            )}
          </div>
        </div>
        <Keys on={controls} />
      </div>
    );
  }

  // ------------------------------------------------------------------ normal
  return (
    <div className="flex h-screen flex-col bg-gray-100">
      {stage}
      <div className="h-1 bg-gray-200">
        <div
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${((i + 1) / slides.length) * 100}%` }}
        />
      </div>
      <Keys on={controls} />
    </div>
  );
}

function Keys({ on }: { on: Record<string, () => void> }) {
  const items: [string, string, () => void][] = [
    ["space", "next", on.next],
    ["←", "back", on.back],
    ["P", "presenter", on.presenter],
    ["O", "overview", on.overview],
    ["F", "fullscreen", on.fullscreen],
    ["R", "reset timer", on.reset],
  ];
  return (
    <div className="flex items-center gap-1 bg-gray-900 px-3 py-1.5">
      {items.map(([key, label, fn]) => (
        <button
          key={label}
          type="button"
          onClick={fn}
          className="flex items-center gap-1.5 rounded px-2 py-1 font-mono text-[11px] text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
        >
          <kbd className="rounded border border-gray-600 bg-gray-800 px-1.5 py-0.5 text-[10px] text-gray-200">
            {key}
          </kbd>
          {label}
        </button>
      ))}
      <span className="ml-auto pr-2 font-mono text-[10px] text-gray-600">
        click the slide to advance
      </span>
    </div>
  );
}
