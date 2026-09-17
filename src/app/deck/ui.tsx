"use client";

// Shared slide furniture. Every slide has the same head and the same place for its
// conclusion, so the deck reads as one object rather than a set of layouts.

export function Head({ block, title }: { block: string; title: string }) {
  return (
    <header className="mb-6">
      <div className="font-mono text-[12px] font-bold uppercase tracking-[0.2em] text-[#6b6659]">
        {block}
      </div>
      <h2 className="mt-1.5 text-[34px] font-black leading-none tracking-tight text-[#141412]">
        {title}
      </h2>
    </header>
  );
}

export function Fact({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[11px] tracking-wide text-[#9c978c]">
      {children}
    </span>
  );
}

// The conclusion, always in the same place at the foot of the slide, always the same
// shape. Red only where the point is that something published is false.
export function Verdict({
  children,
  fact,
  tone = "ink",
  top,
}: {
  children: React.ReactNode;
  fact?: string;
  tone?: "ink" | "false";
  top?: number;
}) {
  return (
    <div
      className={`absolute left-16 right-16 border-l-[3px] pl-5 ${
        tone === "false" ? "border-[#c0392b]" : "border-[#1d4ed8]"
      }`}
      style={top !== undefined ? { top } : { bottom: 34 }}
    >
      <p className="text-[19px] font-semibold leading-snug text-[#141412]">
        {children}
      </p>
      {fact && (
        <div className="mt-1.5">
          <Fact>{fact}</Fact>
        </div>
      )}
    </div>
  );
}

export const SHELL = "relative h-full bg-[#fbfaf7] px-16 py-10";
