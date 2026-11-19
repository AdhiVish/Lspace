import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { Link } from "react-router-dom";
import { HashLink } from "@/components/routing/HashLink";
import { DENTAL, media } from "@/data/site";

const N = DENTAL.length;
/** How long each room stays up before the slideshow moves on. */
const SLIDE_MS = 5000;

/** The photo frame: the next room wipes up over the last one like a blind. */
function Frame({ cur, onHover }: { cur: number; onHover: (v: boolean) => void }) {
  const d = DENTAL[cur];
  return (
    <div className="relative" onMouseEnter={() => onHover(true)} onMouseLeave={() => onHover(false)}>
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

/**
 * Dental interiors: one screen, no scroll-pinning. Reception, procedure room
 * and waiting area play as a slideshow on their own; click any room to jump to
 * it (the slideshow carries on from there). The active room's line fills up as
 * a timer. Pauses while the photo is hovered or the section is off screen.
 */
export function Dental() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const [cur, setCur] = useState(0);
  const [hovered, setHovered] = useState(false);
  const still = typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const running = inView && !hovered && !still;

  // time left on the current room survives a pause, so it stays in step with the filling line
  const left = useRef(SLIDE_MS);
  useEffect(() => {
    left.current = SLIDE_MS;
  }, [cur]);
  useEffect(() => {
    if (!running) return;
    const started = performance.now();
    const t = window.setTimeout(() => setCur((c) => (c + 1) % N), left.current);
    return () => {
      clearTimeout(t);
      left.current = Math.max(0, left.current - (performance.now() - started));
    };
  }, [cur, running]);

  return (
    <section id="dental" ref={ref} className="relative isolate overflow-hidden py-[clamp(84px,10vw,130px)]">
      <div aria-hidden className="absolute inset-0 -z-10 bg-cover bg-center opacity-[.12] lit:opacity-0" style={{ backgroundImage: `url(${media("bg-dental.jpg")})` }} />
      <div className="wrap grid w-full items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}>
          <span className="tag">Dental interiors</span>
          <h2 className="mt-[18px] mb-[22px] text-[clamp(36px,4.6vw,60px)]">
            Clinics that put patients at <em>ease</em>
          </h2>
          <p className="mb-[34px] max-w-[460px] text-mut">
            Dental clinics are a major focus for us. We design and build spaces that feel calm and clean, from the first step into reception to the treatment chair.
          </p>
          <ul className="mb-[38px] list-none border-b border-line">
            {DENTAL.map((d, i) => (
              <li key={d.label} className="relative">
                {/* timer line: fills while this room is showing */}
                <span className="absolute top-0 bottom-0 left-0 w-[2px] bg-line">
                  {i === cur && (
                    <span
                      key={cur}
                      className="absolute inset-0 origin-top bg-pink"
                      style={{
                        animation: still ? undefined : `dental-fill ${SLIDE_MS}ms linear forwards`,
                        animationPlayState: running ? "running" : "paused",
                      }}
                    />
                  )}
                </span>
                <button
                  type="button"
                  aria-pressed={i === cur}
                  onClick={() => setCur(i)}
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
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 60, rotate: 2 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 1, delay: 0.15, ease: [0.2, 0.7, 0.2, 1] }}>
          <Frame cur={cur} onHover={setHovered} />
        </motion.div>
      </div>
    </section>
  );
}
