import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Link, Navigate, useParams } from "react-router-dom";
import { BackBar } from "@/components/layout/BackBar";
import { MiniFooter } from "@/components/layout/Footer";
import { Door } from "@/components/ui/Door";
import { SPACES } from "@/data/site";

/** One of the three spaces: big headline beside a tall arch photo that zooms as you scroll. */
export default function SpacePage() {
  const { slug } = useParams();
  const i = SPACES.findIndex((s) => s.slug === slug);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(p, [0, 1], [1, 1.25]);
  const y = useTransform(p, [0, 1], ["0%", "18%"]);
  if (i < 0) return <Navigate to="/" replace />;
  const s = SPACES[i];
  const next = SPACES[(i + 1) % SPACES.length];
  const rise = (d: number) => ({
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay: 0.35 + d, ease: [0.2, 0.7, 0.2, 1] as const },
  });

  return (
    <>
      <BackBar to="/#spaces" label="Back to our spaces" />
      <div ref={ref} className="wrap grid min-h-svh items-center gap-[34px] pt-[120px] pb-[100px] lg:grid-cols-[1.1fr_.9fr] lg:gap-[70px]">
        <div>
          <motion.span className="tag" {...rise(0)}>
            Our spaces
          </motion.span>
          <motion.h1 className="mt-[18px] mb-6 text-[clamp(44px,7.5vw,112px)] leading-[.95]" {...rise(0.08)}>
            {s.title} <em>spaces</em>
          </motion.h1>
          <motion.p className="mb-[34px] max-w-[480px] text-lg text-mut" {...rise(0.16)}>
            {s.text}
          </motion.p>
          <motion.div {...rise(0.24)}>
            <Link to={`/spaces/${next.slug}`} className="link">
              Next: {next.title} spaces &rarr;
            </Link>
          </motion.div>
        </div>
        <motion.div
          className="relative aspect-[3/4] w-full max-w-[470px] justify-self-center overflow-hidden rounded-[999px_999px_24px_24px] bg-[#3a3630] lg:justify-self-end"
          initial={{ opacity: 0, y: 40, clipPath: "inset(30% 0 0 0 round 999px 999px 24px 24px)" }}
          animate={{ opacity: 1, y: 0, clipPath: "inset(0% 0 0 0 round 999px 999px 24px 24px)" }}
          transition={{ duration: 1.1, delay: 0.5, ease: [0.7, 0, 0.2, 1] }}
          role="img"
          aria-label={`${s.title} spaces`}
        >
          <motion.div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${s.img})`, scale, y }} />
        </motion.div>
      </div>
      <Door tag="Your space">
        Like what you see? Let's <em>design</em> yours
      </Door>
      <MiniFooter />
    </>
  );
}
