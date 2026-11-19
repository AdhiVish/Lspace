import { motion, type MotionValue } from "motion/react";
import { media } from "@/data/site";
import { useLights } from "@/lib/lights";

/**
 * The pendant lamp from the original hero. Clicking it pulls the cord and
 * switches the lights. `drop` lengthens the wire (driven by scroll in the hero).
 */
export function Lamp({ wire = 180, drop, className = "" }: { wire?: number; drop?: MotionValue<number>; className?: string }) {
  const { on, toggle } = useLights();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch the lights on or off"
      aria-pressed={on}
      className={`lamp-sway group absolute top-0 left-[calc(50%-58px)] z-10 w-[116px] cursor-pointer border-0 bg-transparent p-0 ${className}`}
    >
      <motion.span
        className="mx-auto block w-[2px] bg-fg opacity-75 transition-[height] duration-200 group-active:translate-y-0"
        style={{ height: drop ?? wire }}
      />
      <span className="relative block h-[190px] w-[116px] transition-transform duration-200 group-active:translate-y-2">
        <img src={media("lamp-off.png")} alt="" width={116} height={190} className="lamp-img absolute inset-0 transition-opacity duration-500" style={{ opacity: on ? 0 : 1 }} />
        <img src={media("lamp-on.png")} alt="" width={116} height={190} className="lamp-img absolute inset-0 transition-opacity duration-500" style={{ opacity: on ? 1 : 0 }} />
      </span>
    </button>
  );
}

/** The warm cone of light under the lamp. */
export function LightCone({ top = 250, className = "", strength = 0.8 }: { top?: number; className?: string; strength?: number }) {
  const { on } = useLights();
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute left-1/2 h-[72vh] w-[min(1000px,130vw)] -translate-x-1/2 transition-opacity duration-1000 ${className}`}
      style={{
        top,
        clipPath: "polygon(47% 0,53% 0,100% 100%,0 100%)",
        background: "linear-gradient(180deg,rgba(255,196,110,.5),rgba(255,196,110,0))",
        opacity: on ? strength : 0,
      }}
    />
  );
}
