import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { VideoTile } from "@/components/ui/VideoTile";
import { RiseWords } from "@/components/ui/Words";
import { REELS } from "@/data/site";

/**
 * Recent work: the four reels side by side on one screen, no scroll journey.
 * They rise and fan into place as the section comes into view, then sit
 * straight; on phones they're a swipeable row.
 */
export function Gallery() {
  const ref = useRef<HTMLElement>(null);
  const show = useInView(ref, { once: true, amount: 0.3 });
  const n = REELS.length;

  return (
    <section id="gallery" ref={ref} className="relative overflow-hidden py-[clamp(84px,10vw,130px)]">
      <div className="wrap mb-12 flex flex-wrap items-end justify-between gap-6">
        <div>
          <span className="tag">Our work</span>
          <RiseWords className="mt-[18px] text-[clamp(36px,5vw,66px)]" parts={["Recent", { em: "work,"}, "press play"]} />
        </div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={show ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-[300px] text-mut"
        >
          {n} short reels from sites we've finished. One plays at a time.
        </motion.p>
      </div>
      <div className="no-scrollbar flex snap-x snap-mandatory gap-[18px] overflow-x-auto px-7 pb-4 md:mx-auto md:grid md:max-w-[1160px] md:grid-cols-4 md:overflow-visible">
        {REELS.map((r, i) => {
          const k = i - (n - 1) / 2;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 120, rotate: k * 9, x: `${-k * 40}%` }}
              animate={show ? { opacity: 1, y: 0, rotate: 0, x: "0%" } : undefined}
              transition={{ type: "spring", stiffness: 70, damping: 14, delay: 0.2 + i * 0.1 }}
              className="w-[min(260px,66vw)] shrink-0 snap-center md:w-auto"
            >
              <VideoTile
                src={r.src}
                poster={r.poster}
                label={`Recent work reel ${i + 1}`}
                className="aspect-[9/16] w-full rounded-[14px] ring-1 ring-line transition-shadow duration-500 hover:ring-pink"
              />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
