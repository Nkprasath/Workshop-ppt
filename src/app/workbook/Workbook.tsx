"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SECTIONS } from "@/lib/content/sections";
import { SHARING_OPT_IN_LABEL, RETENTION_DAYS } from "@/lib/content/notice";
import { countAll, progress as computeProgress } from "@/lib/progress";
import type { Progress, Workbook } from "@/lib/progress";
import { PartView } from "./Parts";
import { downloadCsv } from "@/lib/client-export";
import { Header, Banner } from "../Brand";

const PREVIEW_STORAGE_KEY = "dpdp-workbook-preview";
const SAVE_DEBOUNCE_MS = 900;

export default function WorkbookView({
  initialWorkbook,
  initialProgress,
  settings,
  preview = false,
}: {
  initialWorkbook: Workbook;
  initialProgress: Progress;
  settings: { email: string; shareWithFacilitators: boolean; purgeAfter: string };
  // Preview mode runs the whole interface with no database and no account. Answers live
  // in this browser only. It exists so the day can be rehearsed, and so the interface can
  // be looked at before any infrastructure exists.
  preview?: boolean;
}) {
  const [workbook, setWorkbook] = useState<Workbook>(initialWorkbook);
  const [progress, setProgress] = useState<Progress>(initialProgress);
  const [active, setActive] = useState(SECTIONS[0].id);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );
  const [sharing, setSharing] = useState(settings.shareWithFacilitators);
  const [showSettings, setShowSettings] = useState(false);
  const [deleted, setDeleted] = useState<string | null>(null);
  const [navOpen, setNavOpen] = useState(false);

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef<Workbook | null>(null);

  const flush = useCallback(async () => {
    const payload = pending.current;
    if (!payload) return;
    pending.current = null;
    setSaveState("saving");

    if (preview) {
      try {
        window.localStorage.setItem(PREVIEW_STORAGE_KEY, JSON.stringify(payload));
      } catch {
        // Private browsing, or storage full. The interface keeps working either way.
      }
      setProgress(computeProgress(countAll(payload)));
      setSaveState("saved");
      return;
    }

    try {
      const response = await fetch("/api/workbook", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workbook: payload }),
      });
      if (!response.ok) {
        setSaveState("error");
        return;
      }
      const data = await response.json();
      setProgress(data.progress);
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }, [preview]);

  // Autosave on a debounce, and again on the way out. beforeunload uses sendBeacon
  // because a normal fetch is not guaranteed to survive the page going away, and people
  // will close laptops mid sentence at lunch.
  useEffect(() => {
    function onLeave() {
      if (preview || !pending.current) return;
      const blob = new Blob([JSON.stringify({ workbook: pending.current })], {
        type: "application/json",
      });
      navigator.sendBeacon?.("/api/workbook/beacon", blob);
    }
    window.addEventListener("beforeunload", onLeave);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") void flush();
    });
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [flush, preview]);

  useEffect(() => {
    if (!preview) return;
    try {
      const saved = window.localStorage.getItem(PREVIEW_STORAGE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved) as Workbook;
      setWorkbook(parsed);
      setProgress(computeProgress(countAll(parsed)));
    } catch {
      // Ignore anything unreadable and start from blank.
    }
  }, [preview]);

  function update(sectionId: string, partId: string, next: unknown) {
    setWorkbook((current) => {
      const updated: Workbook = {
        ...current,
        [sectionId]: { ...(current[sectionId] ?? {}), [partId]: next },
      };
      pending.current = updated;
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => void flush(), SAVE_DEBOUNCE_MS);
      setSaveState("saving");
      return updated;
    });
  }

  async function toggleSharing(next: boolean) {
    setSharing(next);
    if (preview) return;
    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shareWithFacilitators: next }),
    });
  }

  async function deleteEverything() {
    const confirmed = window.confirm(
      "This deletes your email address, everything you have typed today, and your progress counts. It happens now and it cannot be undone. Download your workbook first if you want a copy.\n\nDelete everything?"
    );
    if (!confirmed) return;
    if (preview) {
      try {
        window.localStorage.removeItem(PREVIEW_STORAGE_KEY);
      } catch {
        // Nothing to do; the message below is still accurate for this browser.
      }
      setDeleted(
        "Cleared. Everything you had typed is gone from this browser. There was never a copy anywhere else, so that is the whole of it."
      );
      return;
    }
    const response = await fetch("/api/delete", { method: "POST" });
    const data = await response.json();
    if (data.ok) setDeleted(data.message);
  }

  if (deleted) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20">
        <Banner tone="good">{deleted}</Banner>
        <p className="mt-5 text-[15px] leading-relaxed text-gray-600">
          You can still take part in the rest of the day. Reload the page to
          start again with a blank workbook.
        </p>
        {!preview && (
          <a className="btn btn-outline mt-4" href="/api/download?format=xlsx">
            Download the blank workbook
          </a>
        )}
      </div>
    );
  }

  const section = SECTIONS.find((s) => s.id === active) ?? SECTIONS[0];
  const index = SECTIONS.findIndex((s) => s.id === active);
  const percentFor = (id: string) =>
    progress.sections.find((s) => s.id === id)?.percent ?? 0;

  function go(to: number) {
    setActive(SECTIONS[to].id);
    setNavOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const saveLabel = {
    idle: "Saves automatically",
    saving: "Saving",
    saved: "Saved",
    error: "Not saved, will retry",
  }[saveState];

  return (
    <>
      <Header
        title="Your workbook"
        sub={preview ? "26 September 2026 · saved in this browser" : `26 September 2026 · ${settings.email}`}
        right={
          <>
            <span
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs transition-colors ${
                saveState === "error"
                  ? "bg-red-50 text-red-700"
                  : saveState === "saved"
                    ? "bg-green-50 text-green-700"
                    : "text-gray-500"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  saveState === "saving"
                    ? "animate-pulse bg-amber-400"
                    : saveState === "error"
                      ? "bg-red-500"
                      : saveState === "saved"
                        ? "bg-green-500"
                        : "bg-gray-300"
                }`}
              />
              {saveLabel}
            </span>
            {preview ? (
              <>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => downloadCsv(workbook)}
                >
                  Download .csv
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => window.print()}
                  title="Choose Save as PDF in the print dialogue"
                >
                  Print / PDF
                </button>
              </>
            ) : (
              <>
                <a className="btn btn-outline btn-sm" href="/api/download?format=xlsx">
                  .xlsx
                </a>
                <a className="btn btn-outline btn-sm" href="/api/download?format=pdf">
                  PDF
                </a>
              </>
            )}
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setShowSettings((v) => !v)}
              type="button"
            >
              Settings
            </button>
          </>
        }
      />

      <div className="mx-auto max-w-6xl px-6 py-6">
        {preview && (
          <div className="mb-5">
            <Banner tone="good">
              <span className="font-medium">
                Nothing you type here leaves your browser.
              </span>{" "}
              No account, no server. Your answers are saved on this device and
              survive a refresh. The download is built in your browser from what
              is already on it.
            </Banner>
          </div>
        )}

        {showSettings && (
          <div className="card mb-6 animate-slide-up p-5">
            <h3 className="mb-4 text-sm font-bold text-gray-900">Settings</h3>
            {preview ? (
              <p className="text-[13px] leading-relaxed text-gray-600">
                Nothing you type reaches the facilitators, so there is no sharing
                option. Your answers are saved in this browser only. Download
                before you clear them, and download before you finish if this is
                not your own machine.
              </p>
            ) : (
            <>
            <div className="flex items-start gap-2.5">
              <input
                id="sharing"
                type="checkbox"
                className="mt-0.5"
                checked={sharing}
                onChange={(e) => void toggleSharing(e.target.checked)}
              />
              <label
                htmlFor="sharing"
                className="cursor-pointer text-[13px] leading-relaxed text-gray-700"
              >
                {SHARING_OPT_IN_LABEL}
              </label>
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-gray-500">
              Whatever this is set to, the facilitators can see how many fields
              you have filled, because that is how we decide when to move on.
              They cannot see what you wrote unless this is on.
            </p>
            </>
            )}
            {!preview && (
            <p className="mt-2 text-[13px] leading-relaxed text-gray-500">
              Everything here is deleted {RETENTION_DAYS} days after the
              workshop, on{" "}
              <strong className="font-semibold text-gray-700">
                {new Date(settings.purgeAfter).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </strong>
              , by a job that runs whether or not anyone remembers.
            </p>
            )}
            <button
              className="btn btn-danger btn-sm mt-4"
              type="button"
              onClick={deleteEverything}
            >
              {preview ? "Clear everything from this browser" : "Delete everything now"}
            </button>
          </div>
        )}

        {/* Mobile section switcher. The desktop rail is too tall for a phone, and some
            of the room will be on phones. */}
        <button
          type="button"
          className="card mb-4 flex w-full items-center justify-between p-3 text-left lg:hidden"
          onClick={() => setNavOpen((v) => !v)}
        >
          <span className="text-sm font-semibold text-gray-900">
            {index + 1}. {section.title}
          </span>
          <span className="text-xs text-gray-500">
            {navOpen ? "Close" : "All sections"}
          </span>
        </button>

        <div className="gap-8 lg:grid lg:grid-cols-[240px_1fr]">
          <nav
            className={`${navOpen ? "block" : "hidden"} mb-4 lg:mb-0 lg:block`}
            aria-label="Workbook sections"
          >
            <div className="lg:sticky lg:top-[76px]">
              <ol className="card overflow-hidden">
                {SECTIONS.map((s, i) => {
                  const pct = percentFor(s.id);
                  const on = s.id === active;
                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => go(i)}
                        className={`flex w-full items-center gap-3 border-l-2 px-3 py-2.5 text-left text-[13px] transition-colors ${
                          on
                            ? "border-blue-600 bg-blue-50 font-semibold text-blue-900"
                            : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                            pct >= 60
                              ? "bg-green-100 text-green-700"
                              : pct > 0
                                ? "bg-amber-100 text-amber-700"
                                : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {i + 1}
                        </span>
                        <span className="flex-1 leading-tight">{s.title}</span>
                        <span className="font-mono text-[11px] text-gray-400">
                          {pct}%
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>

              <div className="mt-4 px-1">
                <div className="mb-1.5 flex items-baseline justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    Overall
                  </span>
                  <span className="font-mono text-xs text-gray-600">
                    {progress.overall}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-500"
                    style={{ width: `${progress.overall}%` }}
                  />
                </div>
              </div>
            </div>
          </nav>

          <div className="min-w-0">
            <div className="mb-6">
              <div className="cite mb-1">{section.block}</div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                {section.title}
              </h2>
              <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-gray-600">
                {section.intro}
              </p>
            </div>

            <div key={section.id} className="animate-fade-in space-y-6">
              {section.parts.map((part) => (
                <PartView
                  key={part.id}
                  part={part}
                  value={workbook[section.id]?.[part.id]}
                  onChange={(next) => update(section.id, part.id, next)}
                />
              ))}
            </div>

            <div className="mt-10 flex items-center justify-between border-t border-gray-200 pt-5">
              <button
                type="button"
                className="btn btn-outline"
                disabled={index === 0}
                onClick={() => go(index - 1)}
              >
                Previous
              </button>
              <span className="text-xs text-gray-400">
                {index + 1} of {SECTIONS.length}
              </span>
              <button
                type="button"
                className="btn btn-primary"
                disabled={index === SECTIONS.length - 1}
                onClick={() => go(index + 1)}
              >
                Next section
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
