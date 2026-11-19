import { useScroll, useTransform } from "motion/react";
import type Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * motion's useScroll, with the progress forced through JS. Motion can hand
 * scroll-linked clip-path/filter animations to the browser's ViewTimeline,
 * which comes out wrong inside sticky (pinned) scenes in Chromium.
 */
export function useJsScroll(options?: Parameters<typeof useScroll>[0]) {
  const s = useScroll(options);
  const scrollYProgress = useTransform(s.scrollYProgress, (v) => v);
  return { ...s, scrollYProgress };
}

/** Smooth-scroll to an element or a y position (uses Lenis when it is running). */
export function scrollToTarget(target: string | number | HTMLElement, offset = 0, immediate = false) {
  const el = typeof target === "string" ? document.getElementById(target.replace(/^#/, "")) : target;
  if (el === null) return;
  if (window.__lenis) {
    window.__lenis.scrollTo(el as HTMLElement | number, { offset, immediate, duration: immediate ? 0 : 1.4 });
  } else {
    const y = typeof el === "number" ? el : el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top: y, behavior: immediate ? "instant" : "smooth" });
  }
}

/** Where the last click happened, so page transitions can open from that point. */
export const clickOrigin = { x: 0, y: 0, set: false };
if (typeof window !== "undefined") {
  window.addEventListener(
    "pointerdown",
    (e) => {
      clickOrigin.x = e.clientX;
      clickOrigin.y = e.clientY;
      clickOrigin.set = true;
    },
    true,
  );
}
