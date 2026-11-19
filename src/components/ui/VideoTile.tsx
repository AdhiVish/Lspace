import { useEffect, useRef, useState } from "react";

/** Only one video on the page plays at a time. */
let current: HTMLVideoElement | null = null;

export function VideoTile({ src, poster, label, dur, className = "" }: { src: string; poster: string; label: string; dur?: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const v = ref.current!;
    const sync = () => setPlaying(!v.paused && !v.ended);
    const onPlay = () => {
      if (current && current !== v) current.pause();
      current = v;
      sync();
    };
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", sync);
    v.addEventListener("ended", sync);
    // save battery: pause once it scrolls out of view or the tab is hidden
    const io = new IntersectionObserver(([e]) => !e.isIntersecting && !v.paused && v.pause(), { threshold: 0.2 });
    io.observe(v);
    const vis = () => document.hidden && v.pause();
    document.addEventListener("visibilitychange", vis);
    return () => {
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", sync);
      v.removeEventListener("ended", sync);
      io.disconnect();
      document.removeEventListener("visibilitychange", vis);
      if (current === v) current = null;
    };
  }, []);

  const toggle = () => {
    const v = ref.current!;
    if (v.paused) v.play().catch(() => setPlaying(false));
    else v.pause();
  };

  return (
    <div className={`group relative overflow-hidden bg-black ${className}`}>
      <video
        ref={ref}
        preload="none"
        playsInline
        poster={poster}
        src={src}
        aria-label={label}
        onError={() => setFailed(true)}
        onClick={toggle}
        className="absolute inset-0 block h-full w-full cursor-pointer bg-black object-contain"
      />
      {dur && (
        <span
          className="absolute top-3.5 left-3.5 rounded-full bg-[rgba(20,18,15,.55)] px-[11px] py-1 text-xs tracking-[.03em] text-white backdrop-blur-md transition-opacity duration-300"
          style={{ opacity: playing ? 0 : 1 }}
        >
          {dur}
        </span>
      )}
      {failed && (
        <div className="absolute inset-x-3 bottom-[92px] rounded-[10px] bg-[rgba(20,18,15,.78)] px-3 py-2.5 text-center text-[12.5px] leading-snug text-white">
          This video could not be loaded.
        </div>
      )}
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause video" : "Play video"}
        className={`absolute bottom-6 left-1/2 grid size-[58px] -translate-x-1/2 cursor-pointer place-items-center rounded-full border-[1.5px] border-white/70 bg-[rgba(20,18,15,.5)] p-0 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-[rgba(20,18,15,.72)] ${
          playing ? "opacity-50 group-hover:opacity-100" : ""
        }`}
      >
        {playing ? (
          <svg viewBox="0 0 24 24" aria-hidden className="size-6 fill-white">
            <rect x="6" y="5" width="4.2" height="14" rx="1.2" />
            <rect x="13.8" y="5" width="4.2" height="14" rx="1.2" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden className="size-6 fill-white">
            <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" />
          </svg>
        )}
      </button>
    </div>
  );
}
