import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

type Lights = { on: boolean; toggle: () => void; set: (v: boolean) => void };
const Ctx = createContext<Lights>({ on: false, toggle: () => {}, set: () => {} });

/**
 * "Lights on" is the light theme, set on <html class="on">.
 * The site always starts with the lights off (dark mode); the choice is not remembered between visits.
 */
export function LightsProvider({ children }: { children: ReactNode }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle("on", on);
  }, [on]);
  const toggle = useCallback(() => setOn((v) => !v), []);
  return <Ctx.Provider value={{ on, toggle, set: setOn }}>{children}</Ctx.Provider>;
}

export const useLights = () => useContext(Ctx);
