import { Link } from "react-router-dom";
import { Lamp, LightCone } from "@/components/ui/Lamp";

export default function NotFound() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 pt-[300px] pb-20 text-center">
      <Lamp wire={120} />
      <LightCone top={190} />
      <span className="tag relative">Lost in the hallway</span>
      <h1 className="relative mt-5 mb-6 text-[clamp(44px,7vw,96px)]">
        This room doesn't <em>exist</em>
      </h1>
      <Link to="/" className="btn relative">
        Back home
      </Link>
    </div>
  );
}
