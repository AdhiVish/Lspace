import { Hero } from "@/components/sections/Hero";
import { Spaces } from "@/components/sections/Spaces";
import { Dental } from "@/components/sections/Dental";
import { FloorPlan } from "@/components/sections/FloorPlan";
import { Gallery } from "@/components/sections/Gallery";
import { Testimonials } from "@/components/sections/Testimonials";
import { VideoReviews } from "@/components/sections/VideoReviews";
import { Enquire } from "@/components/sections/Enquire";
import { Footer } from "@/components/layout/Footer";
import { ScrollRail } from "@/components/layout/ScrollRail";

export default function Home() {
  return (
    <>
      <ScrollRail />
      <main>
        <Hero />
        <Spaces />
        <Dental />
        <FloorPlan />
        <Gallery />
        <Testimonials />
        <VideoReviews />
        <Enquire />
      </main>
      <Footer />
    </>
  );
}
