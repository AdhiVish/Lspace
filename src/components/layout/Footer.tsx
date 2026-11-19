import { useRef } from "react";
import { motion, useTransform } from "motion/react";
import { HashLink } from "@/components/routing/HashLink";
import { CONTACT } from "@/data/site";
import { useJsScroll } from "@/lib/scroll";

function Socials() {
  return (
    <div className="flex gap-[26px]">
      <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener" className="transition-colors hover:text-pink">
        WhatsApp
      </a>
      <a href={CONTACT.instagram} target="_blank" rel="noopener" className="transition-colors hover:text-pink">
        Instagram
      </a>
    </div>
  );
}

/** The giant LSPACE wordmark; a fill sweeps across it as you reach the bottom. */
export function GiantWord() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useJsScroll({ target: ref, offset: ["start end", "end end"] });
  const fill = useTransform(p, [0.1, 1], [100, 0]);
  const clip = useTransform(fill, (v) => `inset(0 ${v}% 0 0)`);
  const y = useTransform(p, [0, 1], [60, 0]);
  return (
    <motion.div ref={ref} aria-hidden className="relative mx-auto mb-11 aspect-[1252/249] w-[min(1104px,calc(100%-56px))]" style={{ y }}>
      <div
        className="word-mask absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg,color-mix(in srgb,var(--pink) 30%,var(--bg)) 0 13.5%,color-mix(in srgb,var(--fg) 8%,var(--bg)) 13.5% 100%)",
        }}
      />
      <motion.div
        className="word-mask absolute inset-0"
        style={{
          clipPath: clip,
          background: "linear-gradient(90deg,var(--pink) 0 13.5%,color-mix(in srgb,var(--fg) 22%,var(--bg)) 13.5% 100%)",
        }}
      />
    </motion.div>
  );
}

export function Footer() {
  return (
    <footer className="overflow-hidden border-t border-line pt-20 text-sm text-mut">
      <div className="wrap grid grid-cols-2 gap-10 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div className="col-span-2 md:col-span-1">
          <HashLink to="#home" aria-label="LSPACE Interior Design & Construction, home">
            <span className="logo-big" role="img" />
          </HashLink>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-normal text-mut">Pages</h4>
          {(
            [
              ["gallery", "Gallery"],
              ["services", "Services"],
              ["testimonials", "Testimonials"],
              ["enquire", "Enquire"],
            ] as const
          ).map(([id, l]) => (
            <HashLink key={id} to={`#${id}`} className="block py-[5px] text-base text-fg transition-colors hover:text-pink">
              {l}
            </HashLink>
          ))}
        </div>
        <div>
          <h4 className="mb-4 text-sm font-normal text-mut">Services</h4>
          {["Full home interiors", "Modular kitchen", "Wardrobe", "Commercial interiors"].map((l) => (
            <HashLink key={l} to="#services" className="block py-[5px] text-base text-fg transition-colors hover:text-pink">
              {l}
            </HashLink>
          ))}
        </div>
        <div>
          <h4 className="mb-4 text-sm font-normal text-mut">Contact</h4>
          <a href={CONTACT.tel} className="block py-[5px] text-base text-fg transition-colors hover:text-pink">
            {CONTACT.phone}
          </a>
          <a href={`mailto:${CONTACT.email}`} className="block py-[5px] text-base text-fg transition-colors hover:text-pink">
            {CONTACT.email}
          </a>
          <HashLink to="#enquire" className="block py-[5px] text-base text-fg transition-colors hover:text-pink">
            Get quote
          </HashLink>
        </div>
      </div>
      <div className="wrap mt-[90px] flex flex-wrap items-center justify-between gap-4 pb-[34px]">
        <span>&copy; LSPACE Interiors</span>
        <Socials />
      </div>
      <GiantWord />
    </footer>
  );
}

/** Short footer used on the inner pages. */
export function MiniFooter() {
  return (
    <footer className="overflow-hidden pt-[30px] text-sm text-mut">
      <div className="wrap flex flex-wrap items-center justify-between gap-4 pb-[34px]">
        <span>&copy; LSPACE Interiors</span>
        <Socials />
      </div>
      <GiantWord />
    </footer>
  );
}
