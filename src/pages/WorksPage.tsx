import { motion } from "motion/react";
import { BackBar } from "@/components/layout/BackBar";
import { MiniFooter } from "@/components/layout/Footer";
import { Door } from "@/components/ui/Door";
import { Lamp, LightCone } from "@/components/ui/Lamp";
import { CLINICS } from "@/data/site";

const SIZE: Record<string, string> = {
  w2: "col-span-2",
  h2: "row-span-2",
  h3: "row-span-2 lg:row-span-3",
  last: "max-lg:col-span-2",
};

/** Our other works: the clinics gallery, with the pendant lamp dropping in over the headline. */
export default function WorksPage() {
  return (
    <>
      <BackBar to="/#dental" label="Back to dental interiors" />
      <header className="relative overflow-hidden pt-[318px] pb-20 text-center lg:pt-[350px]">
        <motion.div
          className="absolute inset-0"
          initial={{ y: "-105%" }}
          animate={{ y: "0%" }}
          transition={{ delay: 0.35, duration: 1.2, ease: [0.3, 0.7, 0.2, 1] }}
        >
          <Lamp wire={110} />
          <LightCone top={190} />
        </motion.div>
        <div className="wrap relative flex flex-col items-center">
          <span className="tag">Our other works</span>
          <h1 className="mt-[22px] mb-5 max-w-[860px] text-[clamp(40px,6.5vw,84px)]">
            Clinics we've <em>designed</em> and built
          </h1>
          <p className="max-w-[520px] text-lg text-mut">A look at some of the dental clinics we've worked on, from reception desks to procedure rooms.</p>
        </div>
      </header>
      <section className="pb-[84px] lg:pb-[110px]">
        <div className="wrap grid grid-flow-dense auto-rows-[150px] grid-cols-2 gap-4 lg:auto-rows-[190px] lg:grid-cols-4">
          {CLINICS.map((c, i) => {
            const cls = c.size
              .split(" ")
              .filter(Boolean)
              .map((s) => SIZE[s])
              .join(" ");
            const tall = c.size.includes("h3") || (c.size.includes("h2") && !c.size.includes("w2"));
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                transition={{ duration: 0.8, delay: (i % 4) * 0.08, ease: [0.2, 0.7, 0.2, 1] }}
                className={`group relative isolate overflow-hidden outline outline-1 outline-transparent transition-[outline-color,outline-offset] duration-300 hover:outline-offset-[6px] hover:outline-pink ${cls} ${
                  tall ? "rounded-[999px_999px_16px_16px]" : "rounded-2xl"
                }`}
                style={{ background: i % 2 ? "linear-gradient(135deg,#34302b,#575146)" : "linear-gradient(135deg,#2b2926,#4a463f)" }}
              >
                {c.img && (
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.2s] group-hover:scale-110" style={{ backgroundImage: `url(${c.img})` }} />
                )}
                <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,.5),rgba(0,0,0,0)_38%)]" />
                {c.label && (
                  <span
                    className={`absolute bottom-4 z-[1] rounded-full bg-black/45 px-4 py-2 text-[13px] whitespace-nowrap text-white backdrop-blur-md ${
                      tall ? "left-1/2 -translate-x-1/2" : "left-4"
                    }`}
                  >
                    {c.label}
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>
      <Door tag="Your clinic">
        Planning a clinic? Let's <em>design</em> yours
      </Door>
      <MiniFooter />
    </>
  );
}
