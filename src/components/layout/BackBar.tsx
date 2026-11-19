import { Link } from "react-router-dom";
import { HashLink } from "@/components/routing/HashLink";
import { LightsButton } from "@/components/layout/Navbar";

/** Floating pill bar for the inner pages: back link, centred logo, lights + quote. */
export function BackBar({ to, label }: { to: string; label: string }) {
  return (
    <div
      className="fixed top-4 left-1/2 z-50 flex w-[min(1100px,calc(100%-28px))] -translate-x-1/2 items-center justify-between rounded-full border border-line py-[9px] pr-[10px] pl-6 backdrop-blur-[14px] transition-[background-color,border-color] duration-900"
      style={{ background: "color-mix(in srgb, var(--bg) 80%, transparent)" }}
    >
      <Link to={to} className="inline-flex gap-2 text-[15px] text-mut transition-colors hover:text-fg">
        &larr; <span className="hidden sm:inline">{label}</span>
        <span className="sm:hidden">Back</span>
      </Link>
      <HashLink to="#home" aria-label="LSPACE Interior Design & Construction, home" className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block">
        <span className="logo-nav" role="img" />
      </HashLink>
      <div className="flex items-center gap-2.5">
        <LightsButton className="hidden sm:flex" />
        <HashLink to="#enquire" className="btn">
          Get quote
        </HashLink>
      </div>
    </div>
  );
}
