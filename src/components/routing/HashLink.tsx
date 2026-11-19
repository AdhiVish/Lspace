import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { scrollToTarget } from "@/lib/scroll";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string; children: ReactNode };

/**
 * Link to a section of the home page ("#enquire"). On the home page it glides
 * there; from any other page it goes home first and lands on the section.
 */
export function HashLink({ to, children, onClick, ...rest }: Props) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const id = to.replace(/^\/?#/, "");
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    if (pathname === "/") {
      if (id === "home") scrollToTarget(0);
      else scrollToTarget(id);
      history.replaceState(null, "", id === "home" ? "/" : `#${id}`);
    } else {
      navigate(id === "home" ? "/" : `/#${id}`);
    }
  };
  return (
    <a href={`/#${id}`} onClick={handle} {...rest}>
      {children}
    </a>
  );
}
