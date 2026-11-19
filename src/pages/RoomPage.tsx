import { motion } from "motion/react";
import { Link, Navigate, useParams } from "react-router-dom";
import { BackBar } from "@/components/layout/BackBar";
import { MiniFooter } from "@/components/layout/Footer";
import { Door } from "@/components/ui/Door";
import { DENTAL, LIGHTS_GLOW, PROJECTS, ROOMS } from "@/data/site";

const TILES = 6;

/** Projects for one room of the floor plan. Real photos go in PROJECTS (src/data/site.ts). */
export default function RoomPage() {
  const { id } = useParams();
  const i = ROOMS.findIndex((r) => r.id === id);
  if (i < 0) return <Navigate to="/#services" replace />;
  const r = ROOMS[i];
  const prev = ROOMS[(i + ROOMS.length - 1) % ROOMS.length];
  const next = ROOMS[(i + 1) % ROOMS.length];
  const list = PROJECTS[r.id] ?? [];

  const tiles = Array.from({ length: TILES }, (_, k) => {
    const p = list[k];
    if (p) return { bg: `url(${p.img})`, label: p.t + (p.c ? `, ${p.c}` : "") };
    if (r.id === "06" && DENTAL[k]) return { bg: `url(${DENTAL[k].img})`, label: DENTAL[k].label };
    if (k === 0) return { bg: r.img ? `url(${r.img})` : LIGHTS_GLOW, label: r.name };
    return { bg: "", label: "Project name, City" };
  });

  return (
    <>
      <BackBar to="/#services" label="Back to floor plan" />
      <header className="flex flex-col items-center px-7 pt-[140px] pb-14 text-center lg:pt-[170px]">
        <motion.span className="tag" initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.6 }}>
          Room {r.id}
        </motion.span>
        <motion.h1
          className="mt-[22px] mb-5 max-w-[900px] text-[clamp(40px,6.5vw,84px)]"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {r.name} <em>projects</em>
        </motion.h1>
        <motion.p className="max-w-[520px] text-lg text-mut" initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.6 }}>
          {r.desc}
        </motion.p>
        {r.id === "06" && (
          <Link to="/works" className="link mt-[26px]">
            See all our clinic work
          </Link>
        )}
      </header>

      <section className="pb-[110px]">
        <div className="wrap grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tiles.map((t, k) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -8% 0px" }}
              transition={{ duration: 0.8, delay: (k % 3) * 0.1, ease: [0.2, 0.7, 0.2, 1] }}
              className={`group relative isolate min-h-[280px] overflow-hidden rounded-2xl outline outline-1 outline-transparent transition-[outline-color,outline-offset] duration-300 hover:outline-offset-[6px] hover:outline-pink sm:min-h-[340px] ${
                k % 3 === 1 ? "lg:rounded-[999px_999px_16px_16px]" : ""
              }`}
              style={{ background: k % 2 ? "linear-gradient(135deg,#34302b,#575146)" : "linear-gradient(135deg,#2b2926,#4a463f)" }}
            >
              {t.bg && (
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.2s] group-hover:scale-110"
                  style={{ background: t.bg.startsWith("url") ? `${t.bg} center/cover` : t.bg }}
                />
              )}
              <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,.5),rgba(0,0,0,0)_40%)]" />
              <span
                className={`absolute bottom-4 z-[1] rounded-full bg-black/45 px-4 py-2 text-[13px] whitespace-nowrap text-white backdrop-blur-md ${
                  k % 3 === 1 ? "left-4 lg:left-1/2 lg:-translate-x-1/2" : "left-4"
                }`}
              >
                {t.label}
              </span>
            </motion.div>
          ))}
        </div>
        <div className="wrap mt-14 flex justify-between gap-4 text-[15px]">
          <Link to={`/rooms/${prev.id}`} className="link">
            &larr; {prev.name}
          </Link>
          <Link to={`/rooms/${next.id}`} className="link text-right">
            {next.name} &rarr;
          </Link>
        </div>
      </section>

      <Door tag="Your space">
        Like what you see? Let's <em>design</em> yours
      </Door>
      <MiniFooter />
    </>
  );
}
