import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";
import { scrollToTarget } from "@/lib/scroll";

/**
 * Lenis smooth scrolling for the whole site, plus route scroll handling:
 * a new page starts at the top, and /#section links scroll to that section
 * once the home page has rendered.
 */
export function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1, autoRaf: true });
    window.__lenis = lenis;
    return () => {
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  useLayoutEffect(() => {
    if (!hash) {
      scrollToTarget(0, 0, true);
      return;
    }
    // the page may still be transitioning in: wait (up to ~2s) for the section to exist, then jump to it
    const id = hash.slice(1);
    let raf = 0;
    const t0 = performance.now();
    const timers: number[] = [];
    // pinned sections measure themselves after mounting and Lenis caches the page height,
    // so re-measure and re-jump a few times until the layout has settled
    const jump = () => {
      const el = document.getElementById(id);
      if (!el) return;
      window.__lenis?.resize();
      scrollToTarget(el, 0, true);
    };
    const look = () => {
      if (document.getElementById(id)) {
        raf = requestAnimationFrame(jump);
        timers.push(window.setTimeout(jump, 150), window.setTimeout(jump, 450));
        return;
      }
      if (performance.now() - t0 < 2500) raf = requestAnimationFrame(look);
    };
    look();
    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
    };
  }, [pathname, hash]);

  return null;
}
