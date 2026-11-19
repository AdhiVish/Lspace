import { useEffect, useState } from "react";

/** Reactive media query (e.g. "(min-width: 1024px)"). */
export function useMedia(q: string) {
  const [m, setM] = useState(() => window.matchMedia(q).matches);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const on = () => setM(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [q]);
  return m;
}

export const useDesktop = () => useMedia("(min-width: 1024px)");
