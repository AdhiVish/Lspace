import { useEffect, useRef, useState } from "react";
import { animate, AnimatePresence, motion, useInView, useMotionValue, useMotionValueEvent, useTransform } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { LIGHTS_GLOW, ROOMS, type Room } from "@/data/site";
import { scrollToTarget, useJsScroll } from "@/lib/scroll";
import { useDesktop } from "@/lib/media";

const N = ROOMS.length;
/** pinned scroll: 0–0.16 the plan rises flat, 0.16–0.96 walks through the rooms */
const START = 0.16;
const END = 0.96;

const roomBg = (r: Room) =>
  r.img
    ? `linear-gradient(0deg,rgba(0,0,0,.58),rgba(0,0,0,.22)), url(${r.img}) center/cover`
    : `linear-gradient(0deg,rgba(0,0,0,.4),rgba(0,0,0,.1)), ${LIGHTS_GLOW}`;

/** Centre of a room outline (average of its points), in % of the plan. */
function centre(r: Room) {
  const pts = r.poly.split(",").map((q) => q.trim().split(/\s+/).map(parseFloat));
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  return { x: (Math.min(...xs) + Math.max(...xs)) / 2, y: (Math.min(...ys) + Math.max(...ys)) / 2 };
}

function Plan({ active, onHover, onPick, compact }: { active: number; onHover: (i: number | null) => void; onPick: (i: number) => void; compact: boolean }) {
  const r = active >= 0 ? ROOMS[active] : null;
  return (
    <div className="relative aspect-[4768/2602] [container-type:inline-size]" onMouseLeave={() => onHover(null)}>
      {/* room photos, each clipped to its outline */}
      {ROOMS.map((room, i) => (
        <button
          key={room.id}
          type="button"
          aria-label={`Room ${room.id}: ${room.name}`}
          onMouseEnter={() => onHover(i)}
          onMouseLeave={() => onHover(null)}
          onFocus={() => onHover(i)}
          onBlur={() => onHover(null)}
          onClick={() => onPick(i)}
          className="absolute inset-0 cursor-pointer border-0 p-0 transition-opacity duration-500 [-webkit-tap-highlight-color:transparent] focus:outline-0"
          style={{ clipPath: `polygon(${room.poly})`, background: roomBg(room), opacity: i === active ? 1 : 0 }}
        />
      ))}
      {/* wall lines */}
      <div className="plan-mask pointer-events-none absolute inset-0 bg-fg opacity-[.72] transition-colors duration-900" />
      {/* the active room's walls glow white */}
      <div
        className="plan-mask pointer-events-none absolute inset-0 bg-white opacity-95"
        style={{ clipPath: r ? `polygon(${r.poly})` : "polygon(0 0,0 0,0 0)" }}
      />
      {/* labels */}
      {ROOMS.map((room, i) => (
        <div
          key={room.id}
          aria-hidden
          className="pointer-events-none absolute w-max -translate-x-1/2 -translate-y-1/2 text-center transition-colors duration-300"
          style={{
            left: `${room.lx}%`,
            top: `${room.ly}%`,
            color: i === active ? "#fff" : "var(--fg)",
            textShadow: i === active ? "0 1px 14px rgba(0,0,0,.5)" : undefined,
          }}
        >
          <small
            className="mb-[.35em] block text-[max(11px,.95cqw)] font-medium tracking-[.1em] transition-colors duration-300 max-lg:m-0 max-lg:text-[max(12px,3.3cqw)]"
            style={{ color: i === active ? "rgba(255,255,255,.8)" : "var(--pink)" }}
          >
            {room.id}
          </small>
          {!compact && (
            <h3 className="text-[max(13px,1.55cqw)] leading-[1.12] font-medium">
              {room.short.map((s, k) => (
                <span key={k} className="block">
                  {s}
                </span>
              ))}
            </h3>
          )}
        </div>
      ))}
      {/* hallway card in the middle of the plan */}
      {!compact && (
        <div className="absolute top-[35.66%] left-[34.06%] h-[28.29%] w-[32.55%]" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={r ? r.id : "idle"}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center"
            >
              <span className="mb-[.8em] text-[max(11px,.95cqw)] font-medium tracking-[.1em] text-pink uppercase">
                {r ? `Room ${r.id}` : "The hallway"}
              </span>
              <h3 className="text-[max(20px,2.3cqw)]">
                {r ? (
                  r.name
                ) : (
                  <>
                    Walk in, pick a <em>room</em>
                  </>
                )}
              </h3>
              <p className="mt-[.7em] mb-[1.2em] max-w-[25em] text-[max(13px,1.08cqw)] text-mut">
                {r ? r.desc : "Scroll to walk through, or hover over any room to see what we build there."}
              </p>
              {r && (
                <Link to={`/rooms/${r.id}`} className="link">
                  View projects
                </Link>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

/**
 * Services as the original's floor plan: ten rooms, one team.
 * Desktop: the section pins, the plan tilts up from the table, then scrolling
 * lights each room in turn. Hover or click overrides; clicking zooms into the
 * room and opens its project page.
 */
export function FloorPlan() {
  const desktop = useDesktop();
  const navigate = useNavigate();
  const ref = useRef<HTMLElement>(null);
  const planRef = useRef<HTMLDivElement>(null);
  const [scrollRoom, setScrollRoom] = useState(-1);
  const [hover, setHover] = useState<number | null>(null);
  const [pinned, setPinned] = useState(-1);
  const { scrollYProgress: p } = useJsScroll({ target: ref, offset: ["start start", "end end"] });

  useMotionValueEvent(p, "change", (v) => {
    if (!desktop) return;
    const next = v < START ? -1 : Math.min(N - 1, Math.floor(((v - START) / (END - START)) * N));
    // scrolling to a new room takes over from a hover left behind under a still cursor
    if (next !== scrollRoom) setHover(null);
    setScrollRoom(next);
  });

  const tilt = useTransform(p, [0, START], [58, 0]);
  const planScale = useTransform(p, [0, START], [0.78, 1]);
  const planY = useTransform(p, [0, START], ["8vh", "0vh"]);
  const headOpacity = useTransform(p, [0, START * 0.8], [1, 0.0]);
  const headY = useTransform(p, [0, START], [0, -40]);
  const meter = useTransform(p, [START, END], [0, 1]);

  // click-to-zoom into the room, then open its page
  const zoom = useMotionValue(1);
  const zx = useMotionValue(0);
  const zy = useMotionValue(0);
  const [origin, setOrigin] = useState("50% 50%");
  const pick = (i: number) => {
    const room = ROOMS[i];
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !planRef.current) {
      navigate(`/rooms/${room.id}`);
      return;
    }
    setPinned(i);
    const c = centre(room);
    setOrigin(`${c.x}% ${c.y}%`);
    const b = planRef.current.getBoundingClientRect();
    const tx = window.innerWidth / 2 - (b.left + (b.width * c.x) / 100);
    const ty = window.innerHeight / 2 - (b.top + (b.height * c.y) / 100);
    const ease = [0.6, 0, 0.3, 1] as const;
    animate(zx, tx, { duration: 0.7, ease });
    animate(zy, ty, { duration: 0.7, ease });
    animate(zoom, 5, { duration: 0.7, ease }).then(() => {
      navigate(`/rooms/${room.id}`);
    });
  };

  // phones: cycle through the rooms while the plan is on screen, until touched
  const inView = useInView(planRef, { amount: 0.45 });
  const [touched, setTouched] = useState(false);
  const [cycle, setCycle] = useState(-1);
  useEffect(() => {
    if (desktop || touched || !inView || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setCycle(0);
    const t = window.setInterval(() => setCycle((c) => (c + 1) % N), 3200);
    return () => window.clearInterval(t);
  }, [desktop, touched, inView]);

  const active = hover ?? (pinned >= 0 ? pinned : desktop ? scrollRoom : cycle);

  const jumpTo = (i: number) => {
    const el = ref.current!;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    scrollToTarget(top + span * (START + ((i + 0.5) / N) * (END - START)));
  };

  if (!desktop) {
    return (
      <section id="services" ref={ref} className="py-[84px]">
        <div className="wrap">
          <span className="tag">Services</span>
          <h2 className="mt-[18px] max-w-[780px] text-[clamp(36px,5vw,66px)]">
            Our floor plan: ten rooms, <em>one</em> team
          </h2>
        </div>
        <div ref={planRef} className="mx-auto mt-11 w-[calc(100%-24px)]">
          <Plan
            compact
            active={active}
            onHover={() => {}}
            onPick={(i) => {
              setTouched(true);
              setCycle(i);
            }}
          />
        </div>
        <ol className="wrap mt-9 grid list-none gap-x-7 sm:grid-cols-2">
          {ROOMS.map((r, i) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => {
                  setTouched(true);
                  setCycle(i);
                }}
                className={`grid w-full cursor-pointer grid-cols-[44px_1fr] gap-2.5 border-0 border-t border-line bg-transparent py-4 text-left text-fg transition-opacity ${
                  active === i ? "opacity-100" : "opacity-50"
                }`}
              >
                <small className="pt-1 text-[13px] text-pink">{r.id}</small>
                <span>
                  <b className="block font-h text-[19px] leading-[1.2] font-medium tracking-[-.02em]">{r.name}</b>
                  <i className="mt-[3px] block text-sm text-mut not-italic">{r.desc}</i>
                </span>
              </button>
              {active === i && (
                <Link to={`/rooms/${r.id}`} className="link mb-4 ml-[54px] inline-block">
                  View projects
                </Link>
              )}
            </li>
          ))}
        </ol>
      </section>
    );
  }

  return (
    <section id="services" ref={ref} className="relative h-[520vh]">
      <div className="sticky top-0 flex h-svh flex-col items-center justify-center overflow-hidden" style={{ perspective: "1600px" }}>
        <motion.div className="wrap absolute top-[13vh] w-full" style={{ opacity: headOpacity, y: headY }}>
          <span className="tag">Services</span>
          <h2 className="mt-[18px] max-w-[780px] text-[clamp(36px,5vw,66px)]">
            Our floor plan: ten rooms, <em>one</em> team
          </h2>
        </motion.div>

        <motion.div
          ref={planRef}
          className="relative z-10 w-[min(1060px,calc(100%-40px),calc((100svh-150px)*1.832))]"
          style={{ rotateX: tilt, scale: planScale, y: planY, transformStyle: "preserve-3d" }}
        >
          <motion.div style={{ scale: zoom, x: zx, y: zy, transformOrigin: origin }}>
            <Plan active={active} onHover={(i) => setHover(i)} onPick={pick} compact={false} />
          </motion.div>
        </motion.div>

        {/* room meter: jump straight to any room */}
        <div className="absolute bottom-[4vh] flex items-center gap-4">
          <div className="flex gap-1.5">
            {ROOMS.map((r, i) => (
              <button
                key={r.id}
                type="button"
                aria-label={`Go to room ${r.id}: ${r.name}`}
                onClick={() => jumpTo(i)}
                className="group grid h-6 cursor-pointer place-items-center border-0 bg-transparent px-0.5"
              >
                <span
                  className="block h-[3px] rounded-full transition-all duration-300 group-hover:bg-fg"
                  style={{ width: i === active ? 34 : 14, background: i === active ? "var(--pink)" : "var(--line)" }}
                />
              </button>
            ))}
          </div>
          <span className="font-h text-sm text-mut tabular-nums">
            {active >= 0 ? ROOMS[active].id : "00"} / {N}
          </span>
        </div>
        <motion.span aria-hidden className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-pink/60" style={{ scaleX: meter }} />
      </div>
    </section>
  );
}
