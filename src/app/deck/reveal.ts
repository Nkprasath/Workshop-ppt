import { animate, svg, utils } from "animejs";

// Motion marks a change of state. Nothing here animates to introduce itself.
//
// There are exactly three things that move in this deck:
//   1. a lamp coming on, because a provision has just come into force
//   2. a tile losing or regaining attention, because the argument moved
//   3. a hand-drawn mark being drawn, because someone is pointing at something
//
// Anything else is rendered in its final state by React and left alone.

const REDUCED =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

function nodes(root: HTMLElement, selector: string): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(selector));
}

// Draws Rough.js geometry on. Groups are drawn in the order they appear so a wire and its
// arrowhead arrive as one gesture.
function drawGroup(root: HTMLElement, group: string, duration: number) {
  const targets = root.querySelectorAll(`[data-draw="${group}"]`);
  if (targets.length === 0) return;
  const drawable = svg.createDrawable(targets as never);
  if (REDUCED) {
    animate(drawable, { draw: "0 1", duration: 0 });
    return;
  }
  animate(drawable, {
    draw: ["0 0", "0 1"],
    duration,
    ease: "inOutQuad",
  });
}

export function revealSlide(
  root: HTMLElement,
  slideId: string,
  step: number,
  prevStep: number,
  sameSlide: boolean
) {
  const fresh = !sameSlide;

  // 1. Lamps. A lamp that has just come on pulses once, because a provision coming into
  //    force is the single most important state change in this deck. Lamps that were
  //    already on do nothing.
  for (const lamp of nodes(root, "[data-lamp]")) {
    const tile = lamp.closest("[data-tile]") as HTMLElement | null;
    const state = tile?.dataset.state;
    const wasLive = lamp.dataset.live === "1";
    const isLive = state === "live";
    lamp.dataset.live = isLive ? "1" : "0";

    if (isLive && !wasLive && !fresh && !REDUCED) {
      animate(lamp, {
        scale: [1, 2.1, 1],
        duration: 620,
        ease: "outQuad",
      });
    } else {
      utils.set(lamp, { scale: 1 });
    }
  }

  // 2. Attention. Tiles fade between full and recessed. React has already written the
  //    target opacity, so this only softens the jump.
  if (!fresh && !REDUCED) {
    for (const tile of nodes(root, "[data-tile]")) {
      const target = Number(tile.style.opacity || "1");
      const from = Number(tile.dataset.shown ?? target);
      if (from !== target) {
        animate(tile, { opacity: [from, target], duration: 340, ease: "outQuad" });
      }
      tile.dataset.shown = String(target);
    }
  } else {
    for (const tile of nodes(root, "[data-tile]")) {
      tile.dataset.shown = tile.style.opacity || "1";
    }
  }

  // 3. Marks. Only the ones that appeared on this step are drawn; anything already on
  //    screen is left finished, so stepping back does not replay the whole slide.
  const groups = new Set(
    Array.from(root.querySelectorAll("[data-draw]")).map(
      (el) => (el as HTMLElement).dataset.draw as string
    )
  );
  for (const group of groups) {
    const seen = root.dataset[`seen_${group}`] === slideId;
    if (seen) {
      const targets = root.querySelectorAll(`[data-draw="${group}"]`);
      animate(svg.createDrawable(targets as never), { draw: "0 1", duration: 0 });
      continue;
    }
    root.dataset[`seen_${group}`] = slideId;
    drawGroup(root, group, group.startsWith("wire") ? 620 : 880);
  }

  // Marks that are no longer rendered are forgotten, so revisiting the slide draws them
  // again rather than showing them already finished.
  for (const key of Object.keys(root.dataset)) {
    if (!key.startsWith("seen_")) continue;
    const group = key.slice(5);
    if (!groups.has(group)) delete root.dataset[key];
  }

  // 4. The address bar typing itself, so the room reads the domain before it fails.
  const url = root.querySelector<HTMLElement>("[data-anim='url']");
  if (url) {
    const full = url.dataset.url ?? "";
    if (step < 1) {
      url.textContent = "";
    } else if (!sameSlide || REDUCED) {
      url.textContent = full;
    } else if (url.textContent !== full) {
      const cursor = { n: 0 };
      animate(cursor, {
        n: full.length,
        duration: 900,
        ease: "linear",
        onUpdate: () => {
          url.textContent = full.slice(0, Math.round(cursor.n));
        },
      });
    }
  }

  void prevStep;
}
