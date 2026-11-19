import { useEffect, useState } from "react";

declare global {
  interface Window {
    __lspIntroGo?: boolean;
  }
}

/** Called by the preloader the moment it starts sliding away (or when it is skipped / not shown). */
export function signalIntroGo() {
  if (window.__lspIntroGo) return;
  window.__lspIntroGo = true;
  window.dispatchEvent(new Event("lsp-intro-go"));
}

/** True once the loader is out of the way, so the hero can play its entrance. */
export function useIntroGo() {
  const [go, setGo] = useState(
    () =>
      !!window.__lspIntroGo ||
      document.documentElement.classList.contains("no-intro") ||
      matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    if (go) return;
    const on = () => setGo(true);
    window.addEventListener("lsp-intro-go", on);
    return () => window.removeEventListener("lsp-intro-go", on);
  }, [go]);
  return go;
}
