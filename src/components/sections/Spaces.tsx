import { useRef, useState, type MouseEvent } from "react";
import { motion, useInView, useMotionValue, useSpring } from "motion/react";
import { Link } from "react-router-dom";
import { RiseWords } from "@/components/ui/Words";
import { SPACES, type Space } from "@/data/site";

const EASE = [0.2, 0.7, 0.2, 1] as const;

function ArchCard({ s, i, show, dim, onHover }: { s: Space; i: number; show: boolean; dim: boolean; onHover: (v: boolean) => void }) {
  const ref = useRef<HTMLAnchorElement>(null);
  // the photo drifts toward the cursor, the card tilts a little
  const px = useSpring(useMotionValue(0), { stiffness: 120, damping: 20 });
  const py = useSpring(useMotionValue(0), { stiffness: 120, damping: 20 });
  const rx = useSpring(useMotionValue(0), { stiffness: 180, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 180, damping: 20 });
  const move = (e: MouseEvent) => {
    const b = ref.current!.getBoundingClientRect();
    const x = (e.clientX - b.left) / b.width - 0.5;
    const y = (e.clientY - b.top) / b.height - 0.5;
    px.set(x * -24);
    py.set(y * -24);
    ry.set(x * 8);
    rx.set(-y * 6);
  };
  const leave = () => {
    px.set(0);
    py.set(0);
    rx.set(0);
    ry.set(0);
    onHover(false);
  };

  return (
    <motion.div
      // the doorway rises and opens from the bottom, one after another
      initial={{ y: 90, opacity: 0, clipPath: "inset(100% 0% 0% 0% round 999px 999px 16px 16px)" }}
      animate={show ? { y: 0, opacity: 1, clipPath: "inset(0% 0% 0% 0% round 999px 999px 16px 16px)" } : undefined}
      transition={{ duration: 1.1, delay: 0.25 + i * 0.15, ease: EASE }}
      className="w-[min(230px,56vw)] shrink-0 snap-center md:w-auto"
      style={{ perspective: 900 }}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 }}
        style={{ rotateX: rx, rotateY: ry }}
        className={`transition-[filter] duration-500 ${dim ? "brightness-[.55] saturate-[.7]" : ""}`}
      >
        <Link
          ref={ref}
          to={`/spaces/${s.slug}`}
          onMouseMove={move}
          onMouseEnter={() => onHover(true)}
          onMouseLeave={leave}
          className="group relative flex aspect-[3/4.4] w-full flex-col justify-end overflow-hidden rounded-[999px_999px_16px_16px] p-4 text-center text-white md:p-7"
        >
          <motion.div
            className="absolute -inset-[8%] bg-cover bg-center transition-transform duration-[1.2s] ease-out group-hover:scale-110"
            style={{ backgroundImage: `url(${s.img})`, x: px, y: py }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,.8),rgba(0,0,0,0)_60%)] transition-opacity duration-500 group-hover:opacity-80" />
          <span className="absolute top-[16%] left-1/2 -translate-x-1/2 font-h text-[15px] tracking-[.3em] text-white/70">0{i + 1}</span>
          <div className="relative transition-transform duration-500 group-hover:-translate-y-2">
            <h3 className="mb-1 text-[clamp(20px,2.3vw,32px)]">
              {s.title} <em className="text-white">spaces</em>
            </h3>
            <p className="hidden text-[15px] text-[#e6e0d4] md:block">{s.text}</p>
            <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/40 px-4 py-2 text-[12px] tracking-[.14em] uppercase opacity-0 transition-all duration-300 group-hover:opacity-100">
              Step inside <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
            </span>
          </div>
          {/* a pink arch frame traces itself on hover */}
          <span className="pointer-events-none absolute inset-2 rounded-[999px_999px_12px_12px] border border-pink opacity-0 transition-all duration-500 group-hover:inset-3 group-hover:opacity-100" />
        </Link>
      </motion.div>
    </motion.div>
  );
}

/**
 * Our spaces: three arch doorways on one screen, no scroll journey. They rise
 * open as the section comes into view, float gently, tilt toward the cursor,
 * and each one opens its own space page through an arch transition.
 */
export function Spaces() {
  const ref = useRef<HTMLElement>(null);
  const show = useInView(ref, { once: true, amount: 0.3 });
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="spaces" ref={ref} className="relative overflow-hidden py-[clamp(70px,7vw,100px)]">
      <div className="wrap mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <span className="tag">Our spaces</span>
          <RiseWords className="mt-[18px] max-w-[640px] text-[clamp(38px,5vw,68px)]" parts={["Three kinds of", { em: "space," }, "one way of building"]} />
        </div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={show ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-[300px] text-mut"
        >
          Step through any arch to see what we build there.
        </motion.p>
      </div>
      <div className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-7 pb-4 md:mx-auto md:grid md:max-w-[min(1160px,calc((100svh-370px)*2.3))] md:grid-cols-3 md:gap-[clamp(20px,3vw,40px)] md:overflow-visible">
        {SPACES.map((s, i) => (
          <ArchCard key={s.slug} s={s} i={i} show={show} dim={hovered !== null && hovered !== i} onHover={(v) => setHovered(v ? i : null)} />
        ))}
      </div>
    </section>
  );
}
