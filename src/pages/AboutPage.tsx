import { BackBar } from "@/components/layout/BackBar";
import { MiniFooter } from "@/components/layout/Footer";
import { About } from "@/components/sections/About";
import { Door } from "@/components/ui/Door";

/** About us: the home page's about section as its own page, opened from the navbar. */
export default function AboutPage() {
  return (
    <>
      <BackBar to="/" label="Back home" />
      <div className="pt-16">
        <About />
      </div>
      <Door tag="Your space">
        Let's <em>design</em> how you live
      </Door>
      <MiniFooter />
    </>
  );
}
