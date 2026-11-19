import { useEffect, useRef, useState } from "react";
import { animate, AnimatePresence, motion, useInView, useMotionValue } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { LIGHTS_GLOW, ROOMS, type Room } from "@/data/site";
import { useDesktop } from "@/lib/media";

const N = ROOMS.length;

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
                {r ? r.desc : "Watch the rooms light up, or hover over any room to see what we build there."}
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

/** How long each room stays lit while the plan cycles through them. */
const ROOM_MS = 2300;

/**
 * Services as the original's floor plan: ten rooms, one team. No scroll
 * journey: when the plan comes into view it tilts up off the table and the
 * rooms light up one after another on their own; scroll away (up or down) and
 * it plays back the same way, ready to run again. Hover or tap a room to look
 * at it; click a room on desktop to zoom in and open its projects page.
 */
export function FloorPlan() {
  const desktop = useDesktop();
  const navigate = useNavigate();
  const planRef = useRef<HTMLDivElement>(null);
  const inView = useInView(planRef, { amount: 0.45 });
  const still = typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [hover, setHover] = useState<number | null>(null);
  const [pinned, setPinned] = useState(-1);
  const [cycle, setCycle] = useState(-1);
  const [touched, setTouched] = useState(false);
  // bumping this restarts the cycle timer (after a dot/room is picked)
  const [tick, setTick] = useState(0);

  // in view: wait for the tilt-up, then light rooms in turn. Out of view: rooms go dark again.
  useEffect(() => {
    if (!inView) {
      setCycle(-1);
      setHover(null);
      return;
    }
    if (still || (touched && !desktop)) return;
    let t: number;
    const start = window.setTimeout(
      () => {
        setCycle((c) => (c < 0 ? 0 : c));
        t = window.setInterval(() => setCycle((c) => (c + 1) % N), ROOM_MS);
      },
      tick ? ROOM_MS : 1100,
    );
    return () => {
      clearTimeout(start);
      clearInterval(t);
    };
  }, [inView, still, touched, desktop, tick]);

  const active = hover ?? (pinned >= 0 ? pinned : cycle);
  const jumpTo = (i: number) => {
    setCycle(i);
    setTick((v) => v + 1);
  };

  // click-to-zoom into the room, then open its page
  const zoom = useMotionValue(1);
  const zx = useMotionValue(0);
  const zy = useMotionValue(0);
  const [origin, setOrigin] = useState("50% 50%");
  const pick = (i: number) => {
    const room = ROOMS[i];
    if (still || !planRef.current) {
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
    animate(zoom, 5, { duration: 0.7, ease }).then(() => navigate(`/rooms/${room.id}`));
  };

  const heading = (
    <div className="wrap">
      <span className="tag">Services</span>
      <h2 className="mt-[18px] max-w-[780px] text-[clamp(36px,5vw,66px)]">
        Our floor plan: ten rooms, <em>one</em> team
      </h2>
    </div>
  );

  // the table-top tilt, played forward on entering and backward on leaving
  const tiltState = inView || still ? { rotateX: 0, scale: 1, y: "0vh", opacity: 1 } : { rotateX: 58, scale: 0.8, y: "6vh", opacity: 0.35 };

  if (!desktop) {
    return (
      <section id="services" className="py-[84px]">
        {heading}
        <div className="mx-auto mt-11 w-[calc(100%-24px)]" style={{ perspective: 1200 }}>
          <motion.div ref={planRef} animate={tiltState} transition={{ duration: 1.1, ease: [0.2, 0.7, 0.2, 1] }}>
            <Plan
              compact
              active={active}
              onHover={() => {}}
              onPick={(i) => {
                setTouched(true);
                setCycle(i);
              }}
            />
          </motion.div>
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
    <section id="services" className="relative overflow-hidden py-[clamp(70px,7vw,100px)]">
      {heading}
      <div className="mt-8 flex flex-col items-center" style={{ perspective: "1600px" }}>
        <motion.div
          ref={planRef}
          className="relative z-10 w-[min(1060px,calc(100%-40px),calc((100svh-330px)*1.832))]"
          animate={tiltState}
          transition={{ duration: 1.1, ease: [0.2, 0.7, 0.2, 1] }}
          style={{ transformStyle: "preserve-3d", transformOrigin: "50% 100%" }}
        >
          <motion.div style={{ scale: zoom, x: zx, y: zy, transformOrigin: origin }}>
            <Plan active={active} onHover={(i) => setHover(i)} onPick={pick} compact={false} />
          </motion.div>
        </motion.div>

        {/* room meter: jump straight to any room */}
        <div className="mt-8 flex items-center gap-4">
          <div className="flex gap-1.5">
            {ROOMS.map((r, i) => (
              <button
                key={r.id}
                type="button"
                aria-label={`Show room ${r.id}: ${r.name}`}
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
      </div>
    </section>
  );
}
