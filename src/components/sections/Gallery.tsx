import { useLayoutEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform, useVelocity } from "motion/react";
import { VideoTile } from "@/components/ui/VideoTile";
import { RiseWords } from "@/components/ui/Words";
import { REELS } from "@/data/site";
import { useJsScroll } from "@/lib/scroll";

/**
 * Recent work: the section pins and the reel of videos and arch photos slides
 * sideways as you scroll. The reel leans with scroll speed, like film running.
 */
export function Gallery() {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  const { scrollYProgress: p } = useJsScroll({ target: ref, offset: ["start start", "end end"] });
  const { scrollY } = useScroll();
  const vel = useSpring(useVelocity(scrollY), { stiffness: 120, damping: 30 });
  const skew = useTransform(vel, [-3000, 0, 3000], [4, 0, -4], { clamp: true });

  useLayoutEffect(() => {
    const el = track.current!;
    const measure = () => setDist(Math.max(0, el.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const x = useTransform(p, [0.04, 0.96], [0, -dist]);
  const bar = useTransform(p, [0.04, 0.96], [0, 1]);

  return (
    <section id="gallery" ref={ref} className="relative" style={{ height: `calc(100vh + ${dist}px + 30vh)` }}>
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <div className="wrap mb-[4vh] flex w-full items-end justify-between gap-6">
          <div>
            <span className="tag">Our work</span>
            <RiseWords className="mt-[18px] text-[clamp(36px,5vw,66px)]" parts={["Recent", { em: "work," }, "swipe through"]} />
          </div>
          <div className="mb-3 hidden w-[200px] items-center gap-3 text-xs text-mut md:flex">
            <span className="relative h-px flex-1 bg-line">
              <motion.span className="absolute inset-0 origin-left bg-pink" style={{ scaleX: bar }} />
            </span>
            {REELS.length} reels
          </div>
        </div>

        <motion.div ref={track} className="flex w-max items-center gap-[18px] px-[max(28px,calc(50vw-552px))]" style={{ x, skewX: skew }}>
          {REELS.map((r, i) => (
            <VideoTile
              key={i}
              src={r.src}
              poster={r.poster}
              label={`Recent work reel ${i + 1}`}
              className="aspect-[9/16] h-[min(60svh,590px)] shrink-0 rounded-[14px]"
            />
          ))}
          <div className="w-[8vw] shrink-0" />
        </motion.div>
      </div>
    </section>
  );
}
