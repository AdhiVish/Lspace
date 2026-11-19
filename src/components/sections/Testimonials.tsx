import { useRef } from "react";
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity, wrap } from "motion/react";
import { RiseWords } from "@/components/ui/Words";
import { REVIEWS } from "@/data/site";

function Card({ text, who }: { text: string; who: string }) {
  return (
    <div className="w-[min(340px,78vw)] shrink-0 rounded-[18px] border border-line p-[30px] backdrop-blur-sm transition-colors duration-300 hover:border-pink" style={{ background: "color-mix(in srgb,var(--card) 60%,transparent)" }}>
      <p className="font-h text-[19px] leading-[1.45] text-fg italic">{text}</p>
      <span className="mt-[22px] flex items-center gap-2.5 text-sm text-mut">
        <span className="size-1.5 rounded-full bg-pink" />
        {who}
      </span>
    </div>
  );
}

/** A row that drifts on its own and speeds up (or reverses) with scroll velocity. Pauses on hover. */
function Row({ dir = 1 }: { dir?: 1 | -1 }) {
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const vel = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(vel, [-2500, 0, 2500], [-5, 0, 5], { clamp: false });
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`);
  const hovering = useRef(false);
  const still = typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

  useAnimationFrame((_, delta) => {
    if (still || hovering.current) return;
    let move = dir * -1.6 * (delta / 1000);
    move += dir * move * factor.get();
    base.set(base.get() + move);
  });

  const items = [...REVIEWS, ...REVIEWS];
  return (
    <div
      className="overflow-hidden [mask:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]"
      onMouseEnter={() => (hovering.current = true)}
      onMouseLeave={() => (hovering.current = false)}
    >
      <motion.div className="flex w-max gap-5 pr-5" style={{ x }}>
        {items.map((r, i) => (
          <div key={i} aria-hidden={i >= REVIEWS.length}>
            <Card {...r} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function Testimonials() {
  return (
    <section id="testimonials" className="relative overflow-hidden py-[clamp(84px,10vw,120px)]">
      <div className="wrap">
        <span className="tag">Testimonials</span>
        <RiseWords className="mt-[18px] max-w-[780px] text-[clamp(36px,5vw,66px)]" parts={["What clients", { em: "say" }]} />
      </div>
      <div className="mt-14 flex flex-col gap-5">
        <Row dir={1} />
        <Row dir={-1} />
      </div>
    </section>
  );
}
