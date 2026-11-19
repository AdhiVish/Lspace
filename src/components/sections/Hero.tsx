import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useTransform, type MotionValue } from "motion/react";
import { Lamp, LightCone } from "@/components/ui/Lamp";
import { HashLink } from "@/components/routing/HashLink";
import { media, STATS } from "@/data/site";
import { useLights } from "@/lib/lights";
import { useIntroGo } from "@/lib/intro";
import { useJsScroll } from "@/lib/scroll";

const HEAD = ["Switch", "on", "to", "a", "better", "space", "with", "us"];

/** Arch window geometry for a given scroll progress (insets in %, radius in px). */
function arch(v: number) {
  const k = Math.min(1, Math.max(0, (v - 0.08) / 0.5));
  const e = 1 - Math.pow(1 - k, 3);
  const w = window.innerWidth;
  const phone = w < 768;
  const side = (phone ? 16 : 34) * e;
  const top = 14 * e;
  const bottom = (phone ? 24 : 17) * e;
  const r = ((w * (100 - side * 2)) / 100 / 2) * e;
  return { e, side, top, bottom, r, br: 16 * e };
}

/** Number that counts up as the scroll progress moves through `range`. */
function ScrollCount({ p, range, to }: { p: MotionValue<number>; range: [number, number]; to: number }) {
  const v = useTransform(p, range, [0, to], { clamp: true });
  const [n, setN] = useState(0);
  useMotionValueEvent(v, "change", (x) => setN(Math.round(x)));
  return <>{n.toLocaleString("en-IN")}+</>;
}

function Stat({ p, i, className = "" }: { p: MotionValue<number>; i: number; className?: string }) {
  const s = STATS[i];
  return (
    <div className={className}>
      <strong className="block font-h text-[clamp(28px,5vw,64px)] leading-[1.1] font-medium">
        <ScrollCount p={p} range={[0.5 + i * 0.07, 0.76 + i * 0.07]} to={s.n} />
      </strong>
      <span className="text-[13px] text-mut md:text-sm">{s.label}</span>
    </div>
  );
}

/**
 * Pinned opening scene.
 * 1. The room photo fills the screen; the lamp hangs over the headline (click it to switch the lights).
 * 2. Scrolling shrinks the room into an arch window ("every room is a window") while the lamp rises away.
 * 3. The three key numbers count up around the arch.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { on } = useLights();
  const go = useIntroGo();
  const { scrollYProgress: p } = useJsScroll({ target: ref, offset: ["start start", "end end"] });

  const clip = useTransform(p, (v) => {
    const a = arch(v);
    return `inset(${a.top}% ${a.side}% ${a.bottom}% ${a.side}% round ${a.r}px ${a.r}px ${a.br}px ${a.br}px)`;
  });
  // the pink outline is a real box with the same insets and radius, offset like the original's arch frames
  const oTop = useTransform(p, (v) => `calc(${arch(v).top}% + 14px)`);
  const oSide = useTransform(p, (v) => `calc(${arch(v).side}% - 14px)`);
  const oRight = useTransform(p, (v) => `calc(${arch(v).side}% + 14px)`);
  const oBottom = useTransform(p, (v) => `calc(${arch(v).bottom}% - 14px)`);
  const oRadius = useTransform(p, (v) => {
    const a = arch(v);
    return `${a.r}px ${a.r}px ${a.br}px ${a.br}px`;
  });
  const outline = useTransform(p, [0.45, 0.62], [0, 0.6]);

  const photoScale = useTransform(p, [0, 0.6], [1.18, 1]);
  const veil = useTransform(p, [0, 0.45], [1, 0.2]);
  const headY = useTransform(p, [0, 0.35], ["0vh", "-18vh"]);
  const headOpacity = useTransform(p, [0, 0.28], [1, 0]);
  const headBlur = useTransform(p, [0, 0.3], ["blur(0px)", "blur(10px)"]);
  const lampY = useTransform(p, [0, 0.4], ["0vh", "-45vh"]);
  const statsOpacity = useTransform(p, [0.48, 0.62], [0, 1]);
  const statsY = useTransform(p, [0.48, 0.68], [60, 0]);
  const ringRotate = useTransform(p, [0, 1], [0, 90]);
  const cue = useTransform(p, [0, 0.06], [1, 0]);

  return (
    <header id="home" ref={ref} className="relative h-[260vh]">
      <div className="grain sticky top-0 h-svh overflow-hidden">
        {/* the room */}
        <motion.div className="absolute inset-0 will-change-[clip-path]" style={{ clipPath: clip }}>
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${media("bg-hero.jpg")})`, scale: photoScale }}
          />
          <motion.div
            className="absolute inset-0"
            style={{
              opacity: veil,
              background: on
                ? "linear-gradient(180deg, color-mix(in srgb,var(--bg) 84%,transparent), color-mix(in srgb,var(--bg) 76%,transparent) 45%, var(--bg))"
                : "linear-gradient(180deg, color-mix(in srgb,var(--bg) 68%,transparent), color-mix(in srgb,var(--bg) 60%,transparent) 45%, var(--bg))",
            }}
          />
        </motion.div>

        <motion.div
          aria-hidden
          className="pointer-events-none absolute border border-pink"
          style={{ top: oTop, left: oRight, right: oSide, bottom: oBottom, borderRadius: oRadius, opacity: outline }}
        />

        <motion.div className="absolute inset-0" style={{ y: lampY }}>
          <Lamp />
          <LightCone />
        </motion.div>

        {/* headline */}
        <motion.div
          className="pointer-events-none relative z-[5] flex h-full flex-col items-center justify-center px-6 pt-[30vh] text-center"
          style={{ y: headY, opacity: headOpacity, filter: headBlur }}
        >
          <motion.p
            className="mb-[22px] text-sm text-mut"
            initial={{ opacity: 0 }}
            animate={go ? { opacity: 1 } : undefined}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            {on ? "Nicely lit. Pull again to switch off" : "Pull the cord to switch on the lights"}
          </motion.p>
          <h1 className="mb-[26px] max-w-[960px] text-[clamp(46px,8vw,112px)]">
            {HEAD.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.1em] align-bottom">
                <motion.span
                  className="inline-block"
                  initial={{ y: "115%" }}
                  animate={go ? { y: "0%" } : undefined}
                  transition={{ delay: 0.15 + i * 0.07, duration: 1, ease: [0.2, 0.7, 0.2, 1] }}
                >
                  {w === "better" ? <em>{w}</em> : w}
                </motion.span>
                {i < HEAD.length - 1 && " "}
              </span>
            ))}
          </h1>
          <motion.p
            className="max-w-[500px] text-lg text-mut"
            initial={{ opacity: 0, y: 20 }}
            animate={go ? { opacity: 1, y: 0 } : undefined}
            transition={{ delay: 0.8, duration: 0.9 }}
          >
            LSPACE Interiors designs and builds homes, kitchens and commercial spaces, from first sketch to handover.
          </motion.p>
          <motion.div
            className="pointer-events-auto mt-[34px] flex flex-wrap items-center justify-center gap-[30px]"
            initial={{ opacity: 0, y: 20 }}
            animate={go ? { opacity: 1, y: 0 } : undefined}
            transition={{ delay: 1, duration: 0.9 }}
          >
            <HashLink to="#enquire" className="btn">
              Get quote
            </HashLink>
            <HashLink to="#gallery" className="link">
              View our work
            </HashLink>
          </motion.div>
        </motion.div>

        {/* stats around the arch */}
        <motion.div className="pointer-events-none absolute inset-0 z-[6]" style={{ opacity: statsOpacity, y: statsY }}>
          <motion.svg
            aria-hidden
            viewBox="0 0 100 100"
            className="absolute top-1/2 left-1/2 -mt-[60vh] -ml-[60vh] h-[120vh] w-[120vh] max-w-none text-mut opacity-40"
            style={{ rotate: ringRotate }}
          >
            <circle cx="50" cy="50" r="49" fill="none" stroke="currentColor" strokeWidth=".1" strokeDasharray=".5 1.5" />
          </motion.svg>
          {/* desktop: left, right and bottom of the arch */}
          <Stat p={p} i={0} className="absolute top-1/2 left-[max(28px,calc(50%-560px))] hidden -translate-y-1/2 md:block" />
          <Stat p={p} i={1} className="absolute top-1/2 right-[max(28px,calc(50%-560px))] hidden -translate-y-1/2 text-right md:block" />
          <Stat p={p} i={2} className="absolute bottom-[2.5vh] left-1/2 hidden -translate-x-1/2 text-center md:block" />
          {/* phone: one row under the arch */}
          <div className="absolute inset-x-4 bottom-[5vh] grid grid-cols-3 gap-2 text-center md:hidden">
            {STATS.map((s, i) => (
              <Stat key={s.label} p={p} i={i} />
            ))}
          </div>
        </motion.div>

        {/* scroll cue */}
        <motion.div
          aria-hidden
          className="absolute bottom-6 left-1/2 z-[6] flex -translate-x-1/2 flex-col items-center gap-2 text-[11px] tracking-[.3em] text-mut uppercase"
          style={{ opacity: cue }}
        >
          Scroll
          <span className="relative h-10 w-px overflow-hidden bg-line">
            <motion.span
              className="absolute inset-x-0 top-0 h-1/2 bg-pink"
              animate={{ y: ["-100%", "200%"] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </motion.div>
      </div>
    </header>
  );
}
