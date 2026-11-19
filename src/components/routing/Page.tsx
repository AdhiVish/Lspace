import { motion } from "motion/react";
import type { ReactNode } from "react";
import { clickOrigin } from "@/lib/scroll";

/**
 * Route wrapper. A new page opens through an arch doorway that grows out of
 * wherever you clicked (like the original works page); the old page dims away.
 */
export function Page({ children }: { children: ReactNode }) {
  const x = clickOrigin.set ? clickOrigin.x : window.innerWidth / 2;
  const y = clickOrigin.set ? clickOrigin.y : window.innerHeight / 2;
  const w = window.innerWidth;
  const h = window.innerHeight;
  const aw = Math.max(100, Math.min(150, w * 0.34));
  const ah = aw * 1.4;
  const start = `inset(${y - ah / 2}px ${w - x - aw / 2}px ${h - y - ah / 2}px ${x - aw / 2}px round ${aw / 2}px ${aw / 2}px 14px 14px)`;
  const end = `inset(0px 0px 0px 0px round 0px 0px 0px 0px)`;
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <motion.div
      className="relative bg-bg"
      initial={still ? { opacity: 0 } : { clipPath: start }}
      animate={still ? { opacity: 1 } : { clipPath: end, transitionEnd: { clipPath: "none" } }}
      exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.3, ease: "easeIn" } }}
      transition={{ duration: 0.85, ease: [0.65, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
