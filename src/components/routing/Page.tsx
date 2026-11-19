import { motion } from "motion/react";
import type { ReactNode } from "react";
import { clickOrigin } from "@/lib/scroll";

const EASE = [0.65, 0, 0.2, 1] as const;

/**
 * Route wrapper.
 * Entering: the page opens through an arch doorway that grows out of wherever you clicked.
 * Leaving an inner page: a doorway closes over it (an arch rising from the bottom, with a pink
 * edge), then the next page opens. Leaving the home page it simply dims away quickly.
 */
export function Page({ children, inner }: { children: ReactNode; inner: boolean }) {
  const x = clickOrigin.set ? clickOrigin.x : window.innerWidth / 2;
  const y = clickOrigin.set ? clickOrigin.y : window.innerHeight / 2;
  const w = window.innerWidth;
  const h = window.innerHeight;
  const aw = Math.max(100, Math.min(150, w * 0.34));
  const ah = aw * 1.4;
  const start = `inset(${y - ah / 2}px ${w - x - aw / 2}px ${h - y - ah / 2}px ${x - aw / 2}px round ${aw / 2}px ${aw / 2}px 14px 14px)`;
  const end = `inset(0px 0px 0px 0px round 0px 0px 0px 0px)`;
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const r = w / 2;

  return (
    <motion.div
      className="relative bg-bg"
      initial={still ? { opacity: 0 } : { clipPath: start }}
      animate={still ? { opacity: 1 } : { clipPath: end, transitionEnd: { clipPath: "none" } }}
      exit={
        inner && !still
          ? { opacity: 1, transition: { duration: 0.75 } }
          : { opacity: 0, scale: 0.98, transition: { duration: 0.3, ease: "easeIn" } }
      }
      transition={{ duration: 0.85, ease: EASE }}
    >
      {children}

      {/* exit doorway: waits below the screen, closes over the page as it leaves */}
      {inner && !still && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[90] bg-bg"
          initial={{ clipPath: `inset(100% 0% 0% 0% round ${r}px ${r}px 0px 0px)` }}
          animate={{ clipPath: `inset(100% 0% 0% 0% round ${r}px ${r}px 0px 0px)` }}
          exit={{ clipPath: `inset(0% 0% 0% 0% round 0px 0px 0px 0px)` }}
          transition={{ duration: 0.75, ease: EASE }}
        >
          <motion.div
            className="absolute inset-0 border-t-2 border-pink"
            style={{ borderRadius: `${r}px ${r}px 0 0` }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75, ease: "easeIn" }}
          />
          <div className="absolute inset-0 grid place-items-center">
            <motion.span
              className="logo-big opacity-60"
              initial={{ y: 40, opacity: 0 }}
              exit={{ y: 0, opacity: 0.6 }}
              transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
            />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
