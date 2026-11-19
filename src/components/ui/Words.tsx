import { Fragment, useRef, type ReactNode } from "react";
import { motion, useInView, useTransform, type MotionValue } from "motion/react";
import { useJsScroll } from "@/lib/scroll";

/** One word or phrase in a heading; `em` renders it pink italic like the original. */
export type Part = string | { em: string };

function toWords(parts: Part[]) {
  const out: { w: string; em: boolean }[] = [];
  parts.forEach((p) => {
    const em = typeof p !== "string";
    (em ? p.em : p).split(" ").filter(Boolean).forEach((w) => out.push({ w, em }));
  });
  return out;
}

/** Heading whose words slide up out of a mask when it scrolls into view. */
export function RiseWords({ parts, className = "", delay = 0, as = "h2" }: { parts: Part[]; className?: string; delay?: number; as?: "h1" | "h2" | "h3" }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const Tag = motion[as];
  const words = toWords(parts);
  return (
    <Tag ref={ref} className={className}>
      {words.map(({ w, em }, i) => (
        <Fragment key={i}>
          <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            <motion.span
              className="inline-block"
              initial={{ y: "110%", rotate: 4 }}
              animate={inView ? { y: "0%", rotate: 0 } : undefined}
              transition={{ duration: 0.9, delay: delay + i * 0.06, ease: [0.2, 0.7, 0.2, 1] }}
            >
              {em ? <em>{w}</em> : w}
            </motion.span>
          </span>{" "}
        </Fragment>
      ))}
    </Tag>
  );
}

function ScrubWord({ children, p, range }: { children: ReactNode; p: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(p, range, [0.14, 1]);
  const y = useTransform(p, range, [14, 0]);
  return (
    <motion.span className="inline-block" style={{ opacity, y }}>
      {children}
    </motion.span>
  );
}

/** Paragraph that lights up word by word as you scroll through it. */
export function ScrubWords({ parts, className = "", progress }: { parts: Part[]; className?: string; progress?: MotionValue<number> }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useJsScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const p = progress ?? scrollYProgress;
  const words = toWords(parts);
  return (
    <p ref={ref} className={className}>
      {words.map(({ w, em }, i) => {
        const a = i / words.length;
        return (
          <Fragment key={i}>
            <ScrubWord p={p} range={[a, Math.min(1, a + 2.5 / words.length)]}>
              {em ? <em>{w}</em> : w}
            </ScrubWord>{" "}
          </Fragment>
        );
      })}
    </p>
  );
}
