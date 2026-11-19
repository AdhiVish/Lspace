import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { HashLink } from "@/components/routing/HashLink";
import { useLights } from "@/lib/lights";

const LINKS = [
  ["testimonials", "Testimonials"],
  ["about", "About us"],
  ["services", "Services"],
  ["gallery", "Our work"],
  ["enquire", "Contact us"],
] as const;

export function LightsButton({ className = "" }: { className?: string }) {
  const { on, toggle } = useLights();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      className={`group relative flex cursor-pointer items-center gap-2 rounded-full border border-line bg-transparent px-[18px] py-[11px] text-sm font-medium text-mut transition-colors hover:border-fg hover:text-fg ${className}`}
    >
      <span
        aria-hidden
        className="size-2 rounded-full transition-all duration-500"
        style={{ background: on ? "#ffc46e" : "var(--mut)", boxShadow: on ? "0 0 10px 2px rgba(255,196,110,.8)" : "none" }}
      />
      {on ? "Lights off" : "Lights on"}
    </button>
  );
}

export function Navbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    if (y < 240 || y < prev - 2) setHidden(false);
    else if (y > prev + 2) setHidden(true);
  });

  return (
    <>
      <motion.nav
        animate={{ y: hidden && !open ? -110 : 0 }}
        transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
        className="fixed top-4 left-1/2 z-50 flex w-[min(1100px,calc(100%-28px))] items-center justify-between rounded-full border border-line py-[9px] pr-[10px] pl-6 backdrop-blur-[14px] transition-[background-color,border-color] duration-900"
        style={{ background: "color-mix(in srgb, var(--bg) 80%, transparent)", x: "-50%" }}
      >
        <HashLink to="#home" aria-label="LSPACE Interior Design & Construction, home" onClick={() => setOpen(false)}>
          <span className="logo-nav" role="img" />
        </HashLink>
        <div className="hidden gap-[30px] text-[15px] text-mut lg:flex">
          {LINKS.map(([id, label]) => (
            <HashLink key={id} to={`#${id}`} className="group relative transition-colors hover:text-fg">
              {label}
              <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-pink transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100" />
            </HashLink>
          ))}
        </div>
        <div className="flex items-center gap-[10px]">
          <LightsButton className="hidden sm:flex" />
          <HashLink to="#enquire" className="btn hidden sm:inline-flex">
            Get quote
          </HashLink>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="relative grid size-11 cursor-pointer place-items-center rounded-full border border-line bg-transparent lg:hidden"
          >
            <span className={`absolute h-px w-4 bg-fg transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-[4px]"}`} />
            <span className={`absolute h-px w-4 bg-fg transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-[4px]"}`} />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            initial={{ clipPath: "circle(0% at calc(100% - 50px) 40px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 50px) 40px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 50px) 40px)" }}
            transition={{ duration: 0.7, ease: [0.7, 0, 0.2, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-bg px-8 lg:hidden"
            data-lenis-prevent
          >
            {LINKS.map(([id, label], i) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.06, duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
              >
                <HashLink
                  to={`#${id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-4 border-b border-line py-4 font-h text-[clamp(34px,9vw,56px)] leading-none"
                >
                  <small className="font-b text-[13px] text-pink">0{i + 1}</small>
                  {label}
                </HashLink>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-10 flex flex-wrap gap-3"
            >
              <LightsButton />
              <HashLink to="#enquire" className="btn" onClick={() => setOpen(false)}>
                Get quote
              </HashLink>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
