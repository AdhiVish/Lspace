import { useRef } from "react";
import { motion, useTransform } from "motion/react";
import { RiseWords, ScrubWords } from "@/components/ui/Words";
import { media } from "@/data/site";
import { useJsScroll } from "@/lib/scroll";

/** About us: the headline rises in, then the paragraph lights up word by word as you read down. */
export function About() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useJsScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(p, [0, 1], ["-12%", "12%"]);
  const giantX = useTransform(p, [0, 1], ["10%", "-35%"]);

  return (
    <section id="about" ref={ref} className="relative isolate overflow-hidden py-[clamp(90px,14vw,170px)]">
      <motion.div
        aria-hidden
        className="absolute inset-[-12%_0] -z-10 bg-cover bg-center opacity-[.16] lit:opacity-0"
        style={{ backgroundImage: `url(${media("bg-about.jpg")})`, y: bgY }}
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,var(--bg),transparent_25%,transparent_75%,var(--bg))]" />

      {/* giant outlined word drifting behind */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-[8%] left-0 -z-10 font-h text-[28vw] leading-none whitespace-nowrap text-transparent select-none"
        style={{ x: giantX, WebkitTextStroke: "1px var(--line)" }}
      >
        windows &amp; rooms
      </motion.div>

      <div className="wrap">
        <span className="tag">About us</span>
        <RiseWords
          className="mt-[18px] max-w-[900px] text-[clamp(40px,6.4vw,92px)]"
          parts={["Every room is a", { em: "window" }, "into how you live"]}
        />
        <ScrubWords
          className="mt-14 max-w-[980px] font-h text-[clamp(24px,3.1vw,42px)] leading-[1.25] tracking-[-.01em]"
          parts={[
            "LSPACE Interiors is an interior design and construction company. We design and build homes, modular kitchens, wardrobes, false ceilings, lighting and commercial spaces, with a special focus on",
            { em: "dental clinics." },
            "One team looks after everything, from the first sketch to handover.",
          ]}
        />
      </div>
    </section>
  );
}
