"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as store from "@/lib/comments";
import type { Comment, Sync } from "@/lib/comments";

// The reviewer's comment panel, shared by the deck and the workbook.
//
// It sits outside the slide canvas on purpose: a comment must never appear in a
// screenshot of a slide, and opening it must not move the thing being reviewed.

const STATUS: Record<Sync, { label: string; tone: string }> = {
  local: { label: "Saved on this device", tone: "text-[#8a857a]" },
  syncing: { label: "Saving", tone: "text-[#b45309]" },
  synced: { label: "Saved and shared", tone: "text-[#15803d]" },
  offline: { label: "Saved here, will retry", tone: "text-[#b45309]" },
};

export function CommentPanel({
  target,
  targetLabel,
  open,
  onClose,
}: {
  target: string;
  targetLabel: string;
  open: boolean;
  onClose: () => void;
}) {
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [list, setList] = useState<Comment[]>([]);
  const [total, setTotal] = useState(0);
  const [sync, setSync] = useState<Sync>("local");
  const [note, setNote] = useState<string | null>(null);
  const box = useRef<HTMLTextAreaElement>(null);

  const refresh = useCallback(() => {
    setList(store.forTarget(target));
    setTotal(store.count());
  }, [target]);

  useEffect(() => {
    setAuthor(store.getAuthor());
    refresh();
  }, [refresh, open]);

  // Pull anything written elsewhere whenever the panel opens, so two reviewers on two
  // machines see each other rather than silently diverging.
  useEffect(() => {
    if (!open || !store.isRemote()) return;
    setSync("syncing");
    void store.sync().then((s) => {
      setSync(s);
      refresh();
    });
  }, [open, refresh]);

  if (!open) return null;

  async function submit() {
    const value = text.trim();
    if (!value) return;
    if (author.trim()) store.setAuthor(author.trim());
    setSync("syncing");
    setText("");
    const result = await store.add(target, targetLabel, value);
    setSync(result.sync);
    refresh();
  }

  return (
    <aside className="fixed right-0 top-0 z-50 flex h-screen w-[380px] flex-col border-l-2 border-[#c5c0b5] bg-white shadow-[-8px_0_30px_rgba(0,0,0,0.12)]">
      <header className="border-b border-[#ddd8ce] px-5 py-4">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-[15px] font-bold text-[#141412]">Comments</h2>
          <button
            type="button"
            onClick={onClose}
            className="font-mono text-[11px] uppercase tracking-wider text-[#8a857a] hover:text-[#141412]"
          >
            Close
          </button>
        </div>
        <p className="mt-1 text-[13px] leading-snug text-[#6b6659]">{targetLabel}</p>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {list.length === 0 ? (
          <p className="text-[13px] leading-relaxed text-[#8a857a]">
            Nothing on this one yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {list.map((c) => (
              <li
                key={c.id}
                className="rounded-[3px] border border-[#ddd8ce] bg-[#faf8f4] px-3.5 py-3"
              >
                <p className="text-[14px] leading-snug text-[#141412]">{c.text}</p>
                <div className="mt-2 flex items-baseline justify-between gap-2">
                  <span className="font-mono text-[11px] text-[#8a857a]">
                    {c.author} · {c.at.slice(0, 10)}
                  </span>
                  <button
                    type="button"
                    onClick={async () => {
                      await store.remove(target, c.id);
                      refresh();
                    }}
                    className="font-mono text-[11px] text-[#b8b3a8] hover:text-[#c0392b]"
                  >
                    delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t border-[#ddd8ce] px-5 py-4">
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          onKeyDown={(e) => e.stopPropagation()}
          placeholder="Your name"
          className="mb-2 w-full rounded-[3px] border border-[#ddd8ce] px-3 py-1.5 text-[13px]"
        />
        <textarea
          ref={box}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            // The deck listens for single keys, so typing here must not drive the slides.
            e.stopPropagation();
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") void submit();
          }}
          rows={3}
          placeholder="What is wrong, or what needs checking"
          className="w-full rounded-[3px] border border-[#ddd8ce] px-3 py-2 text-[14px]"
        />
        <button
          type="button"
          onClick={() => void submit()}
          disabled={!text.trim()}
          className="mt-2 w-full rounded-[3px] bg-[#1d4ed8] py-2 text-[14px] font-bold text-white disabled:opacity-40"
        >
          Add comment
        </button>
      </div>

      <footer className="border-t-2 border-[#141412] bg-[#faf8f4] px-5 py-3">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-[12px] font-bold text-[#141412]">
            {total} in total
          </span>
          <span className={`font-mono text-[11px] ${STATUS[sync].tone}`}>
            {store.isRemote() ? STATUS[sync].label : STATUS.local.label}
          </span>
        </div>
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => store.downloadJson()}
            className="flex-1 rounded-[3px] border border-[#c5c0b5] py-1.5 text-[12px] font-semibold text-[#4a463e]"
          >
            Download
          </button>
          <button
            type="button"
            onClick={() => {
              void navigator.clipboard?.writeText(store.toMarkdown());
              setNote("Copied");
              setTimeout(() => setNote(null), 1600);
            }}
            className="flex-1 rounded-[3px] border border-[#c5c0b5] py-1.5 text-[12px] font-semibold text-[#4a463e]"
          >
            {note ?? "Copy all"}
          </button>
        </div>
      </footer>
    </aside>
  );
}

// The marker that says a slide or section already carries comments.
export function CommentBadge({
  target,
  onClick,
  tick,
}: {
  target: string;
  onClick: () => void;
  tick?: number;
}) {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(store.forTarget(target).length);
  }, [target, tick]);

  return (
    <button
      type="button"
      onClick={onClick}
      title="Comment on this slide (C)"
      className={`rounded-full px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors ${
        n > 0
          ? "bg-[#1d4ed8] text-white"
          : "border border-gray-600 text-gray-400 hover:border-gray-300 hover:text-white"
      }`}
    >
      {n > 0 ? `${n} comment${n === 1 ? "" : "s"}` : "Comment · C"}
    </button>
  );
}
