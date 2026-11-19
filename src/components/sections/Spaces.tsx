import { useLayoutEffect, useRef, useState } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";
import { Link } from "react-router-dom";
import { SPACES, type Space } from "@/data/site";
import { useJsScroll } from "@/lib/scroll";

function ArchCard({ s, i, p, n }: { s: Space; i: number; p: MotionValue<number>; n: number }) {
  // each card's own moment in the scroll: it straightens and its photo slides as it passes the centre
  const c = (i + 1) / (n + 1);
  const rotate = useTransform(p, [c - 0.4, c, c + 0.4], [6, 0, -6]);
  const imgX = useTransform(p, [c - 0.5, c + 0.5], ["-14%", "14%"]);
  const lift = useTransform(p, [c - 0.25, c, c + 0.25], [24, 0, 24]);
  return (
    <motion.div style={{ rotate, y: lift }} className="shrink-0">
      <Link
        to={`/spaces/${s.slug}`}
        className="group relative flex h-[min(58svh,580px)] w-[min(380px,70vw)] flex-col justify-end overflow-hidden rounded-[999px_999px_16px_16px] p-8 text-center text-white"
      >
        <motion.div
          className="absolute inset-y-0 -inset-x-[16%] bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.06]"
          style={{ backgroundImage: `url(${s.img})`, x: imgX }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,.78),rgba(0,0,0,0)_58%)]" />
        <span className="absolute top-[18%] left-1/2 -translate-x-1/2 font-h text-[15px] tracking-[.3em] text-white/70">0{i + 1}</span>
        <div className="relative">
          <h3 className="mb-1 text-[clamp(26px,2.6vw,34px)]">
            {s.title} <em className="text-white">spaces</em>
          </h3>
          <p className="text-[15px] text-[#e6e0d4]">{s.text}</p>
          <span className="mt-4 inline-flex items-center gap-2 text-[13px] tracking-[.14em] uppercase opacity-0 transition-all duration-300 group-hover:opacity-100">
            View <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
          </span>
        </div>
        <span className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-white/0 transition-all duration-500 ring-inset group-hover:ring-pink" />
      </Link>
    </motion.div>
  );
}

/**
 * Our spaces: the page pins and scrolling down slides a row of arch doorways
 * sideways. Each arch opens its own space page.
 */
export function Spaces() {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  const { scrollYProgress: p } = useJsScroll({ target: ref, offset: ["start start", "end end"] });

  useLayoutEffect(() => {
    const el = track.current!;
    const measure = () => setDist(Math.max(0, el.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const x = useTransform(p, [0.05, 0.95], [0, -dist]);
  const bar = useTransform(p, [0.05, 0.95], [0, 1]);
  const idx = useTransform(p, (v) => String(Math.min(3, Math.max(1, Math.round(v * 3 + 0.5)))).padStart(2, "0"));

  return (
    <section id="spaces" ref={ref} className="relative" style={{ height: `calc(100vh + ${dist}px + 40vh)` }}>
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <motion.div ref={track} className="flex w-max items-center gap-[clamp(24px,4vw,64px)] px-[max(28px,calc(50vw-552px))]" style={{ x }}>
          <div className="w-[min(440px,80vw)] shrink-0 pr-6">
            <span className="tag">Our spaces</span>
            <h2 className="mt-[18px] text-[clamp(40px,5.4vw,76px)]">
              Three kinds of <em>space</em>, one way of building
            </h2>
            <p className="mt-6 max-w-[360px] text-mut">Keep scrolling to walk past each doorway. Step through any arch to see more.</p>
          </div>
          {SPACES.map((s, i) => (
            <ArchCard key={s.slug} s={s} i={i} p={p} n={SPACES.length} />
          ))}
          <div className="w-[10vw] shrink-0" />
        </motion.div>

        <div className="wrap absolute inset-x-0 bottom-[5vh] flex w-full items-center gap-5 text-sm text-mut">
          <motion.span className="font-h text-fg tabular-nums">{idx}</motion.span>
          <span className="relative h-px flex-1 bg-line">
            <motion.span className="absolute inset-0 origin-left bg-pink" style={{ scaleX: bar }} />
          </span>
          <span className="font-h tabular-nums">03</span>
        </div>
      </div>
    </section>
  );
}
