import { motion } from "motion/react";
import { HashLink } from "@/components/routing/HashLink";

/** Closing call to action framed as an arch doorway (from the original inner pages). */
export function Door({ tag, children }: { tag: string; children: React.ReactNode }) {
  return (
    <div className="wrap text-center">
      <motion.div
        initial={{ clipPath: "inset(40% 30% 0% 30% round 999px 999px 0 0)", opacity: 0 }}
        whileInView={{ clipPath: "inset(0% 0% 0% 0% round 999px 999px 0 0)", opacity: 1 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 1.1, ease: [0.7, 0, 0.2, 1] }}
        className="relative mx-auto max-w-[620px] rounded-[999px_999px_0_0] border border-b-0 border-line px-6 pt-[130px] pb-[60px] md:px-9 md:pt-[150px] md:pb-[72px]"
        style={{ background: "linear-gradient(180deg,color-mix(in srgb,var(--card) 75%,transparent),transparent)" }}
      >
        <span aria-hidden className="pointer-events-none absolute inset-[16px_-16px_0_16px] rounded-[999px_999px_0_0] border border-b-0 border-pink opacity-55" />
        <span className="tag">{tag}</span>
        <h2 className="mt-[18px] mb-[30px] text-[clamp(34px,4.6vw,58px)]">{children}</h2>
        <HashLink to="#enquire" className="btn">
          Get quote
        </HashLink>
      </motion.div>
    </div>
  );
}
