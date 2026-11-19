import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useTransform, type MotionValue } from "motion/react";
import { Link } from "react-router-dom";
import { HashLink } from "@/components/routing/HashLink";
import { DENTAL, media } from "@/data/site";
import { scrollToTarget, useJsScroll } from "@/lib/scroll";
import { useDesktop } from "@/lib/media";

const N = DENTAL.length;

function TabBar({ p, i }: { p: MotionValue<number>; i: number }) {
  const scaleY = useTransform(p, [i / N, (i + 1) / N], [0, 1], { clamp: true });
  return (
    <span className="absolute top-0 bottom-0 left-0 w-px bg-line">
      <motion.span className="absolute inset-0 origin-top bg-pink" style={{ scaleY }} />
    </span>
  );
}

/** The photo frame: the next room wipes up over the last one like a blind. */
function Frame({ cur }: { cur: number }) {
  const d = DENTAL[cur];
  return (
    <div className="relative">
      <div aria-hidden className="absolute inset-[18px_-18px_-18px_18px] rounded-[20px] border border-pink opacity-55" />
      <div className="relative aspect-[6/5] overflow-hidden rounded-[20px] bg-[#2b2926]">
        <AnimatePresence initial={false}>
          <motion.div
            key={cur}
            className="absolute inset-0 bg-cover"
            style={{ backgroundImage: `url(${d.img})`, backgroundPosition: d.pos }}
            initial={{ clipPath: "inset(100% 0 0 0)", scale: 1.15 }}
            animate={{ clipPath: "inset(0% 0 0 0)", scale: 1 }}
            exit={{ opacity: 1, transition: { duration: 1.05 } }}
            transition={{ duration: 1.05, ease: [0.7, 0, 0.2, 1] }}
          />
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.span
            key={cur}
            className="absolute bottom-4 left-4 rounded-full bg-black/45 px-4 py-2 text-[13px] text-white backdrop-blur-md"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
          >
            {d.label}
          </motion.span>
        </AnimatePresence>
        <span className="absolute top-4 right-4 font-h text-sm text-white/80 tabular-nums">
          0{cur + 1} / 0{N}
        </span>
      </div>
    </div>
  );
}

function Copy({ cur, onPick, p }: { cur: number; onPick: (i: number) => void; p?: MotionValue<number> }) {
  return (
    <div>
      <span className="tag">Dental interiors</span>
      <h2 className="mt-[18px] mb-[22px] text-[clamp(36px,4.6vw,60px)]">
        Clinics that put patients at <em>ease</em>
      </h2>
      <p className="mb-[34px] max-w-[460px] text-mut">
        Dental clinics are a major focus for us. We design and build spaces that feel calm and clean, from the first step into
        reception to the treatment chair.
      </p>
      <ul className="mb-[38px] list-none border-b border-line">
        {DENTAL.map((d, i) => (
          <li key={d.label} className="relative">
            {p && <TabBar p={p} i={i} />}
            <button
              type="button"
              aria-pressed={i === cur}
              onClick={() => onPick(i)}
              className={`grid w-full cursor-pointer grid-cols-[44px_1fr] gap-2.5 border-0 border-t border-line bg-transparent py-5 pl-4 text-left text-fg transition-opacity duration-300 hover:opacity-100 ${
                i === cur ? "opacity-100" : "opacity-45"
              }`}
            >
              <small className="pt-1.5 text-[13px] text-pink">0{i + 1}</small>
              <span>
                <span className="mb-1 block font-h text-[21px] leading-[1.2] font-medium tracking-[-.02em]">{d.title}</span>
                <span className="block text-[15px] text-mut">{d.text}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center gap-3.5">
        <HashLink to="#enquire" className="btn">
          Plan your clinic
        </HashLink>
        <Link to="/works" className="btn btn-ghost">
          Our Other Works
        </Link>
      </div>
    </div>
  );
}

/**
 * Dental interiors. On desktop the section pins and scrolling walks through
 * reception, procedure room and waiting area; on phones the tabs rotate on their own.
 */
export function Dental() {
  const desktop = useDesktop();
  const ref = useRef<HTMLElement>(null);
  const [cur, setCur] = useState(0);
  const { scrollYProgress: p } = useJsScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(p, "change", (v) => desktop && setCur(Math.min(N - 1, Math.floor(v * N))));

  // phones: rotate every 5s until someone taps a tab
  const [touched, setTouched] = useState(false);
  useEffect(() => {
    if (desktop || touched || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setCur((c) => (c + 1) % N), 5000);
    return () => window.clearInterval(t);
  }, [desktop, touched]);

  const pick = (i: number) => {
    if (!desktop) {
      setTouched(true);
      setCur(i);
      return;
    }
    const el = ref.current!;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    scrollToTarget(top + span * ((i + 0.5) / N));
  };

  const bgY = useTransform(p, [0, 1], ["-6%", "6%"]);

  return (
    <section id="dental" ref={ref} className="relative isolate" style={{ height: desktop ? "320vh" : "auto" }}>
      <div className={desktop ? "sticky top-0 flex h-svh items-center overflow-hidden" : "py-[84px]"}>
        <motion.div
          aria-hidden
          className="absolute inset-[-8%_0] -z-10 bg-cover bg-center opacity-[.14] lit:opacity-0"
          style={{ backgroundImage: `url(${media("bg-dental.jpg")})`, y: bgY }}
        />
        <div className="wrap grid w-full items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <Copy cur={cur} onPick={pick} p={desktop ? p : undefined} />
          <Frame cur={cur} />
        </div>
      </div>
    </section>
  );
}
