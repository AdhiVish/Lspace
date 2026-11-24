import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useTransform, type MotionValue } from "motion/react";
import { Lamp, LightCone } from "@/components/ui/Lamp";
import { HashLink } from "@/components/routing/HashLink";
import { media, STATS } from "@/data/site";
import { useLights } from "@/lib/lights";
import { useIntroGo } from "@/lib/intro";
import { useJsScroll } from "@/lib/scroll";

const HEAD = ["Switch", "on", "to", "a", "better", "space", "with", "us"];

// The logo artwork (public/media/nlogo-*.png) is 640 x 162. The zoom is anchored on the
// middle of the pink "L" stem, the thickest solid stroke, so at full zoom the room fills the screen.
const LOGO_AR = 162 / 640;
const ANCHOR = { x: 161 / 640, y: 115 / 162 };
const STEM_W = 12 / 640; // stem width as a share of the logo width

/** Zoom progress 0..1 for a scroll progress. */
function zoomK(v: number) {
  const k = Math.min(1, Math.max(0, (v - 0.08) / 0.5));
  return 1 - Math.pow(1 - k, 3);
}

/** Where the logo-shaped window sits for a scroll progress (px). */
function logoBox(v: number) {
  const e = zoomK(v);
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const phone = vw < 768;
  const W = Math.min(vw * (phone ? 0.86 : 0.7), 1000); // final logo width
  const H = W * LOGO_AR;
  const S0 = (1.2 * vw) / (STEM_W * W); // start: the stem alone is wider than the screen
  const s = Math.pow(S0, 1 - e);
  // the anchor travels from the screen centre to its place in the final, centred logo
  const cx = vw / 2;
  const cy = vh / 2;
  const fy = vh * (phone ? 0.46 : 0.44);
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
 * 2. Scrolling zooms the room out until it sits inside the LSPACE lettering (the room stays visible in the letters).
 * 3. The three key numbers count up under the logo.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { on } = useLights();
  const go = useIntroGo();
  const { scrollYProgress: p } = useJsScroll({ target: ref, offset: ["start start", "end end"] });

  // the room is seen through the logo: a mask that starts enormous and shrinks to the logo size
  const maskSize = useTransform(p, (v) => `${logoBox(v).w}px auto`);
  const maskPos = useTransform(p, (v) => {
    const b = logoBox(v);
    return `${b.x}px ${b.y}px`;
  });
  // The lamp hangs from the top; its wire shortens on shorter screens so the shade and
  // pull-cord never sit on the headline, which is laid out from the bottom of the screen.
  const contentRef = useRef<HTMLDivElement>(null);
  const [wire, setWire] = useState(180);
  const [lampScale, setLampScale] = useState(1);
  useEffect(() => {
    const fit = () => {
      const el = contentRef.current;
      if (!el) return;
      const top = el.offsetTop; // unaffected by the scroll transforms
      // the shade must start below the floating navbar, so the whole lamp is always visible
      const navEl = document.querySelector<HTMLElement>("[data-topnav]");
      const nav = navEl ? navEl.offsetTop + navEl.offsetHeight : 72; // ignores the hide-on-scroll slide
      const minWire = Math.round(nav + 10);
      const room = top - 12; // the lamp (wire + 190px of shade and cord) must end above this
      const w = Math.round(Math.min(180, Math.max(minWire, room - 190)));
      setWire(w);
      // only if the text still doesn't leave room, the lamp shrinks a little (from the shade down)
      setLampScale(Math.max(0.7, Math.min(1, (room - w) / 190)));
    };
    fit();
    const ro = new ResizeObserver(fit);
    if (contentRef.current) ro.observe(contentRef.current);
    window.addEventListener("resize", fit);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, []);

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
            WebkitMaskImage: `url(${media("nlogo-ondark.png")})`,
            maskImage: `url(${media("nlogo-ondark.png")})`,
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

        <motion.div className="absolute inset-0" style={{ y: lampY }}>
          <div
            className="absolute inset-0"
            style={{ transform: lampScale < 1 ? `scale(${lampScale})` : undefined, transformOrigin: `50% ${wire}px` }}
          >
            <Lamp wire={wire} />
            <LightCone top={wire + 70} />
          </div>
        </motion.div>

        {/* headline */}
        <motion.div
          className="pointer-events-none relative z-[5] flex h-full flex-col items-center justify-end px-6 pb-4 text-center"
          style={{ y: headY, opacity: headOpacity, filter: headBlur }}
        >
          <div ref={contentRef} className="flex flex-col items-center">
          <motion.p
            className="mb-[clamp(10px,2vh,22px)] text-sm text-mut"
            initial={{ opacity: 0 }}
            animate={go ? { opacity: 1 } : undefined}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            {on ? "Nicely lit. Pull again to switch off" : "Pull the cord to switch on the lights"}
          </motion.p>
          <h1 className="mb-[clamp(14px,2.6vh,26px)] max-w-[960px] text-[clamp(34px,min(8vw,10vh),112px)]">
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
            className="max-w-[500px] text-base text-mut md:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={go ? { opacity: 1, y: 0 } : undefined}
            transition={{ delay: 0.8, duration: 0.9 }}
          >
            LSPACE Interiors designs and builds homes, kitchens and commercial spaces, from first sketch to handover.
          </motion.p>
          <motion.div
            className="pointer-events-auto mt-[clamp(18px,3.6vh,34px)] flex flex-wrap items-center justify-center gap-[30px]"
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
          </div>

          {/* scroll cue, in the flow under the buttons so it can never cover them */}
          <motion.div
            aria-hidden
            className="mt-[clamp(14px,3vh,36px)] flex flex-col items-center gap-2 text-[11px] tracking-[.3em] text-mut uppercase"
            style={{ opacity: cue }}
          >
            Scroll
            <span className="relative h-8 w-px overflow-hidden bg-line md:h-10">
              <motion.span
                className="absolute inset-x-0 top-0 h-1/2 bg-pink"
                animate={{ y: ["-100%", "200%"] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              />
            </span>
          </motion.div>
        </motion.div>

        {/* stats under the logo */}
        <motion.div className="pointer-events-none absolute inset-0 z-[6]" style={{ opacity: statsOpacity, y: statsY }}>
          <motion.svg
            aria-hidden
            viewBox="0 0 100 100"
            className="absolute top-1/2 left-1/2 -mt-[60vh] -ml-[60vh] h-[120vh] w-[120vh] max-w-none text-mut opacity-40"
            style={{ rotate: ringRotate }}
          >
            <circle cx="50" cy="50" r="49" fill="none" stroke="currentColor" strokeWidth=".1" strokeDasharray=".5 1.5" />
          </motion.svg>
          {/* one row under the logo */}
          <div className="absolute inset-x-4 bottom-[22vh] mx-auto grid max-w-[900px] md:bottom-[6vh] grid-cols-3 gap-2 text-center">
            {STATS.map((s, i) => (
              <Stat key={s.label} p={p} i={i} />
            ))}
          </div>
        </motion.div>

      </div>
    </header>
  );
}
