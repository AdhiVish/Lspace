import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { scrollToTarget } from "@/lib/scroll";

const SECTIONS = [
  ["home", "Home"],
  ["about", "About"],
  ["spaces", "Spaces"],
  ["dental", "Dental"],
  ["services", "Floor plan"],
  ["gallery", "Work"],
  ["testimonials", "Words"],
  ["video-reviews", "Stories"],
  ["enquire", "Enquire"],
] as const;

/**
 * Desktop-only rail on the right edge: a thin line that fills as you scroll,
 * with a tick per section. The current section's name shows beside it; click to jump.
 */
export function ScrollRail() {
  const { scrollYProgress } = useScroll();
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const [active, setActive] = useState("home");

  useEffect(() => {
    const els = SECTIONS.map(([id]) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const pick = () => {
      const mid = window.innerHeight * 0.5;
      let cur = "home";
      for (const el of els) if (el.getBoundingClientRect().top <= mid) cur = el.id;
      setActive(cur);
    };
    pick();
    window.addEventListener("scroll", pick, { passive: true });
    return () => window.removeEventListener("scroll", pick);
  }, []);

  return (
    <nav aria-label="Sections" className="fixed top-1/2 right-5 z-40 hidden -translate-y-1/2 xl:block">
      <div className="relative flex flex-col gap-[18px]">
        <span aria-hidden className="absolute top-0 right-[3px] bottom-0 w-px bg-line">
          <motion.span className="absolute inset-0 origin-top bg-pink" style={{ scaleY: fill }} />
        </span>
        {SECTIONS.map(([id, label]) => {
          const on = id === active;
          return (
            <button
              key={id}
              type="button"
              onClick={() => (id === "home" ? scrollToTarget(0) : scrollToTarget(id))}
              className="group relative flex cursor-pointer items-center justify-end gap-3 border-0 bg-transparent p-0"
              aria-current={on ? "true" : undefined}
            >
              <span
                className={`text-[11px] tracking-[.18em] uppercase transition-all duration-300 ${
                  on ? "translate-x-0 text-fg opacity-100" : "translate-x-2 text-mut opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                }`}
              >
                {label}
              </span>
              <span
                className="relative block size-[7px] rounded-full border transition-all duration-300"
                style={{ borderColor: on ? "var(--pink)" : "var(--mut)", background: on ? "var(--pink)" : "var(--bg)", transform: on ? "scale(1.35)" : "none" }}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
