import { useEffect, useRef, useState } from "react";
import { signalIntroGo } from "@/lib/intro";

/**
 * The original LSPACE loader, unchanged in look: white screen, the logo wipes
 * in left to right with a glowing edge, a progress line and a 000–100 counter.
 * The counter follows the page really loading (eases to 92%, then waits).
 * When it finishes, the white screen slides up to reveal the site in dark mode.
 * Shown once per session; Skip / Esc closes it.
 */
export function Preloader() {
  const root = document.documentElement;
  const [gone, setGone] = useState(
    () => root.classList.contains("no-intro") || matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [phase, setPhase] = useState<"run" | "done" | "go" | "out">("run");
  const elRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLParagraphElement>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    if (gone) return;
    const el = elRef.current!;
    const remember = () => {
      try {
        sessionStorage.setItem("lsp-intro", "1");
      } catch {
        /* ignore */
      }
    };
    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      remember();
      root.style.overflow = "";
      window.__lenis?.start();
      setGone(true);
    };
    const skip = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      remember();
      root.style.overflow = "";
      window.__lenis?.start();
      setPhase("out");
      signalIntroGo();
      window.setTimeout(() => setGone(true), 600);
    };

    root.style.overflow = "hidden";
    window.__lenis?.stop();
    let ready = document.readyState === "complete";
    const onLoad = () => (ready = true);
    window.addEventListener("load", onLoad);

    let p = 0;
    let finishing = false;
    const t0 = performance.now();
    let prev = t0;
    let raf = 0;
    const timers: number[] = [];
    const tick = (t: number) => {
      if (doneRef.current) return;
      const dt = t - prev;
      const elapsed = t - t0;
      prev = t;
      const base = 0.92 * (1 - Math.pow(1 - Math.min(elapsed / 3300, 1), 3));
      if (ready && elapsed >= 3300) p = Math.min(1, Math.max(p, base) + dt / 450);
      else p = Math.max(p, base);
      el.style.setProperty("--p", String(p));
      if (numRef.current) numRef.current.textContent = ("00" + Math.round(p * 100)).slice(-3);
      if (p >= 1 && !finishing) {
        finishing = true;
        setPhase("done");
        timers.push(
          window.setTimeout(() => {
            if (doneRef.current) return;
            setPhase("go");
            signalIntroGo();
            timers.push(window.setTimeout(finish, 1200));
          }, 500),
        );
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && skip();
    document.addEventListener("keydown", onKey);
    const btn = el.querySelector("button")!;
    btn.addEventListener("click", skip);
    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      window.removeEventListener("load", onLoad);
      document.removeEventListener("keydown", onKey);
      btn.removeEventListener("click", skip);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gone]);

  if (gone) return null;

  const go = phase === "go";
  const done = phase === "done" || go;
  return (
    <div
      ref={elRef}
      role="dialog"
      aria-label="Loading LSPACE"
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center overflow-hidden bg-white"
      style={{
        ["--p" as string]: 0,
        transform: go ? "translateY(-100%)" : undefined,
        transition: go ? "transform 1.1s cubic-bezier(.77,0,.18,1)" : phase === "out" ? "opacity .5s" : undefined,
        opacity: phase === "out" ? 0 : 1,
      }}
    >
      {/* glowing bottom edge while it slides away */}
      <div
        className="absolute inset-x-0 bottom-0 h-[3px] bg-[#161412] transition-opacity duration-300"
        style={{ boxShadow: "0 0 40px 10px rgba(232,51,127,.35)", opacity: go ? 1 : 0 }}
      />
      <div
        aria-hidden
        className="relative w-[min(62vw,620px)] transition-[filter] duration-500"
        style={{ aspectRatio: "1644/415", filter: done ? "drop-shadow(0 0 20px rgba(232,51,127,.35))" : undefined }}
      >
        <div
          className="absolute inset-0 bg-[url(/media/nlogo-onlight.png)] bg-contain bg-center bg-no-repeat"
          style={{ clipPath: "inset(0 calc((1 - var(--p)) * 100%) 0 0)" }}
        />
        <i
          className="absolute -top-[10%] -bottom-[10%] -ml-px w-[2px] bg-[#161412]"
          style={{
            left: "calc(var(--p) * 100%)",
            boxShadow: "0 0 18px 4px rgba(232,51,127,.45)",
            opacity: done ? 0 : 1,
            transition: "opacity .3s",
          }}
        />
      </div>
      <div aria-hidden className="mt-[34px] h-[2px] w-[min(62vw,620px)] bg-[#e4e0d8]">
        <div
          className="h-full origin-left transition-colors duration-300"
          style={{ transform: "scaleX(var(--p))", background: done ? "#e8337f" : "#161412" }}
        />
      </div>
      <p
        ref={numRef}
        aria-live="off"
        className="mt-[18px] pl-[.4em] text-[13px] font-semibold tracking-[.4em] text-[#6b655b] tabular-nums"
      >
        000
      </p>
      <button
        type="button"
        className="absolute top-6 right-6 z-[6] cursor-pointer border-0 bg-transparent text-sm font-medium text-[#6b655b] hover:text-[#161412]"
      >
        Skip
      </button>
    </div>
  );
}
