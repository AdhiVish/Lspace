import { useRef, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { VideoTile } from "@/components/ui/VideoTile";
import { RiseWords } from "@/components/ui/Words";
import { VIDEO_REVIEWS } from "@/data/site";

/** Card that tilts toward the pointer in 3D. */
function TiltCard({ i, children }: { i: number; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const move = (e: MouseEvent) => {
    const b = ref.current!.getBoundingClientRect();
    ry.set(((e.clientX - b.left) / b.width - 0.5) * 12);
    rx.set(-((e.clientY - b.top) / b.height - 0.5) * 12);
  };
  const leave = () => {
    rx.set(0);
    ry.set(0);
  };
  return (
    <motion.figure
      ref={ref}
      onMouseMove={move}
      onMouseLeave={leave}
      initial={{ opacity: 0, y: 80, rotate: i % 2 ? 3 : -3 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, delay: i * 0.1, ease: [0.2, 0.7, 0.2, 1] }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className="m-0 w-[min(280px,72vw)] shrink-0 snap-start lg:w-auto"
    >
      {children}
    </motion.figure>
  );
}

export function VideoReviews() {
  return (
    <section id="video-reviews" className="relative py-[clamp(84px,10vw,120px)]">
      <div className="wrap">
        <span className="tag">Client stories</span>
        <RiseWords className="mt-[18px] max-w-[780px] text-[clamp(36px,5vw,66px)]" parts={["Hear it from", { em: "our clients" }]} />
        <div className="no-scrollbar -mx-7 mt-[60px] flex snap-x snap-mandatory gap-4 overflow-x-auto px-7 pb-2.5 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-[22px] lg:overflow-visible lg:px-0">
          {VIDEO_REVIEWS.map((v, i) => (
            <TiltCard key={i} i={i}>
              <VideoTile
                src={v.src}
                poster={v.poster}
                dur={v.dur}
                label={`Client video review ${i + 1}`}
                className="aspect-[9/16] rounded-[14px] border border-line transition-colors duration-300 hover:border-pink"
              />
              <figcaption className="mt-3.5 text-sm leading-snug text-mut">
                <b className="block font-h text-[19px] font-medium tracking-[-.01em] text-fg">Client name</b>
                City, project type
              </figcaption>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
