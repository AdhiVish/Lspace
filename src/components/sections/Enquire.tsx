import { useRef, useState, type FormEvent } from "react";
import { motion, useTransform } from "motion/react";
import { CONTACT, media } from "@/data/site";
import { useJsScroll } from "@/lib/scroll";

function Field({ id, label, type = "text", required, area }: { id: string; label: string; type?: string; required?: boolean; area?: boolean }) {
  const cls =
    "peer w-full border-0 border-b border-mut bg-transparent px-0.5 pt-6 pb-3 text-fg placeholder-transparent transition-colors focus:border-pink focus:outline-0";
  return (
    <label className="relative block">
      {area ? (
        <textarea id={id} name={id} placeholder={label} className={`${cls} min-h-[110px] resize-y`} />
      ) : (
        <input id={id} name={id} type={type} placeholder={label} required={required} className={cls} />
      )}
      <span className="pointer-events-none absolute top-6 left-0.5 origin-left text-mut transition-all duration-300 peer-focus:-translate-y-5 peer-focus:scale-[.8] peer-focus:text-pink peer-[:not(:placeholder-shown)]:-translate-y-5 peer-[:not(:placeholder-shown)]:scale-[.8]">
        {label}
      </span>
    </label>
  );
}

/**
 * Enquire: an arch doorway grows open as the section scrolls in, revealing the
 * brief form. Sending opens WhatsApp with the message filled in (same as the original).
 */
export function Enquire() {
  const ref = useRef<HTMLElement>(null);
  const [sent, setSent] = useState(false);
  const { scrollYProgress: p } = useJsScroll({ target: ref, offset: ["start end", "start start"] });
  const clip = useTransform(p, (v) => {
    const e = 1 - Math.pow(1 - Math.min(1, v * 1.15), 3);
    const side = 38 * (1 - e);
    const top = 30 * (1 - e);
    const r = ((window.innerWidth * (100 - side * 2)) / 200) * (1 - e * 0.94);
    return `inset(${top}% ${side}% 0% ${side}% round ${r}px ${r}px 0px 0px)`;
  });
  const photoScale = useTransform(p, [0, 1], [1.3, 1]);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const t = `Hi LSPACE, I am ${f.get("n")} (${f.get("p")}). ${f.get("m") ?? ""}`;
    window.open(`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(t)}`, "_blank");
    setSent(true);
  };

  return (
    <section id="enquire" ref={ref} className="relative isolate border-t border-line">
      <motion.div className="absolute inset-0 -z-10 overflow-hidden" style={{ clipPath: clip }}>
        <motion.div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${media("bg-a.jpg")})`, scale: photoScale }} />
        <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--bg)_86%,transparent)] lit:bg-[color-mix(in_srgb,var(--bg)_93%,transparent)]" />
      </motion.div>

      <div id="contact" className="wrap grid min-h-svh items-center gap-10 py-[clamp(84px,10vw,140px)] lg:grid-cols-2 lg:gap-20">
        <div>
          <span className="tag">Enquire</span>
          <h2 className="mt-[18px] text-[clamp(44px,6.4vw,96px)]">
            Sketch us your <em>brief</em>
          </h2>
          <div className="mt-8 space-y-4 text-mut">
            <p>
              Phone:{" "}
              <a href={CONTACT.tel} className="border-b border-pink text-fg">
                {CONTACT.phone}
              </a>
            </p>
            <p>
              Email:{" "}
              <a href={`mailto:${CONTACT.email}`} className="border-b border-pink text-fg">
                {CONTACT.email}
              </a>
            </p>
          </div>
        </div>
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
          className="grid content-start gap-3.5"
        >
          <Field id="n" label="Your name" required />
          <Field id="p" label="Phone number" type="tel" required />
          <Field id="m" label="What are you planning? Home, kitchen, office..." area />
          <div className="mt-3.5 flex flex-wrap items-center gap-4">
            <button type="submit" className="btn">
              Send on WhatsApp
              <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
                <path d="M4 12h13.2l-5.6-5.6L13 5l8 7-8 7-1.4-1.4 5.6-5.6H4z" />
              </svg>
            </button>
            {sent && <span className="text-sm text-mut">WhatsApp opened in a new tab.</span>}
          </div>
        </motion.form>
      </div>
    </section>
  );
}
