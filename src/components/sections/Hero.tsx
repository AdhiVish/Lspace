import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useTransform, type MotionValue } from "motion/react";
import { Lamp, LightCone } from "@/components/ui/Lamp";
import { HashLink } from "@/components/routing/HashLink";
import { media, STATS } from "@/data/site";
import { useLights } from "@/lib/lights";
import { useIntroGo } from "@/lib/intro";
import { useJsScroll } from "@/lib/scroll";

const HEAD = ["Switch", "on", "to", "a", "better", "space", "with", "us"];

// The house symbol from the logo, cut out at high resolution (public/media/house-*.png, 834 x 1068).
// house-mask.png is the filled house; the zoom is anchored in the middle of the box so at full
// zoom the room fills the screen.
const HOUSE_AR = 1068 / 834;
const ANCHOR = { x: 400 / 834, y: 710 / 1068 };
const REACH_X = 280 / 834; // box half-width, as a share of the house width
const REACH_Y = 210 / 834; // anchor to box top, as a share of the house width

/** Zoom progress 0..1 for a scroll progress. */
function zoomK(v: number) {
  const k = Math.min(1, Math.max(0, (v - 0.08) / 0.5));
  return 1 - Math.pow(1 - k, 3);
}

/** Where the house-shaped window sits for a scroll progress (px). */
function logoBox(v: number) {
  const e = zoomK(v);
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const phone = vw < 768;
  const H = Math.min(vh * (phone ? 0.42 : 0.52), phone ? 380 : 480); // final house height
  const W = H / HOUSE_AR;
  const S0 = Math.max((0.56 * vw) / (REACH_X * W), (0.56 * vh) / (REACH_Y * W)); // start: the box covers the screen
  const s = Math.pow(S0, 1 - e);
  const cx = vw / 2;
  const cy = vh / 2;
  const fy = vh * (phone ? 0.44 : 0.43);
  const ax = cx + (cx - W / 2 + ANCHOR.x * W - cx) * e;
  const ay = cy + (fy - H / 2 + ANCHOR.y * H - cy) * e;
  return { w: W * s, x: ax - ANCHOR.x * W * s, y: ay - ANCHOR.y * H * s, W, H, fy };
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
 * 2. Scrolling zooms the room out until it sits inside the LSPACE house symbol, then the symbol settles around it.
 * 3. The three key numbers count up under the logo.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { on } = useLights();
  const go = useIntroGo();
  const { scrollYProgress: p } = useJsScroll({ target: ref, offset: ["start start", "end end"] });

  // the room is seen through the house: a mask that starts enormous and shrinks to the symbol size
  const maskSize = useTransform(p, (v) => `${logoBox(v).w}px auto`);
  const maskPos = useTransform(p, (v) => {
    const b = logoBox(v);
    return `${b.x}px ${b.y}px`;
  });
  // once the room has settled in the house, the real (coloured) symbol fades in around it
  const logoOpacity = useTransform(p, [0.56, 0.7], [0, 1]);
  const [box, setBox] = useState(() => logoBox(1));
  useMotionValueEvent(p, "change", () => {
    const b = logoBox(1);
    if (b.W !== box.W || b.fy !== box.fy) setBox(b);
  });

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
        <motion.div
          className="absolute inset-0"
          style={{
            WebkitMaskImage: `url(${media("house-mask.png")})`,
            maskImage: `url(${media("house-mask.png")})`,
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskSize: maskSize,
            maskSize,
            WebkitMaskPosition: maskPos,
            maskPosition: maskPos,
          }}
        >
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

        {/* the house symbol itself, faded in around the room once it has landed */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-1/2 z-[4] -translate-x-1/2 bg-contain bg-center bg-no-repeat"
          style={{
            top: box.fy - box.H / 2,
            width: box.W,
            height: box.H,
            opacity: logoOpacity,
            backgroundImage: `url(${media(on ? "house-onlight.png" : "house-ondark.png")})`,
          }}
        />

        <motion.div className="absolute inset-0" style={{ y: lampY }}>
          <Lamp />
          <LightCone />
        </motion.div>

        {/* headline */}
        <motion.div
          className="pointer-events-none relative z-[5] flex h-full flex-col items-center justify-center px-6 pt-[30vh] text-center md:pt-[24vh]"
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

        {/* stats under the house */}
        <motion.div className="pointer-events-none absolute inset-0 z-[6]" style={{ opacity: statsOpacity, y: statsY }}>
          <motion.svg
            aria-hidden
            viewBox="0 0 100 100"
            className="absolute top-1/2 left-1/2 -mt-[60vh] -ml-[60vh] h-[120vh] w-[120vh] max-w-none text-mut opacity-40"
            style={{ rotate: ringRotate }}
          >
            <circle cx="50" cy="50" r="49" fill="none" stroke="currentColor" strokeWidth=".1" strokeDasharray=".5 1.5" />
          </motion.svg>
          {/* one row under the house */}
          <div className="absolute inset-x-4 bottom-[22vh] mx-auto grid max-w-[900px] md:bottom-[6vh] grid-cols-3 gap-2 text-center">
            {STATS.map((s, i) => (
              <Stat key={s.label} p={p} i={i} />
            ))}
          </div>
        </motion.div>

        {/* scroll cue */}
        <motion.div
          aria-hidden
          className="absolute bottom-5 left-1/2 z-[6] hidden -translate-x-1/2 md:flex flex-col items-center gap-2 text-[11px] tracking-[.3em] text-mut uppercase"
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
