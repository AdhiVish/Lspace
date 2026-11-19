import { AnimatePresence } from "motion/react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Preloader } from "@/components/layout/Preloader";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollManager } from "@/components/routing/ScrollManager";
import { Page } from "@/components/routing/Page";
import { scrollToTarget } from "@/lib/scroll";
import AboutPage from "@/pages/AboutPage";
import Home from "@/pages/Home";
import SpacePage from "@/pages/SpacePage";
import RoomPage from "@/pages/RoomPage";
import WorksPage from "@/pages/WorksPage";
import NotFound from "@/pages/NotFound";

export default function App() {
  const location = useLocation();
  const home = location.pathname === "/";
  return (
    <>
      <ScrollManager />
      <Preloader />
      {home && <Navbar />}
      <AnimatePresence mode="wait" onExitComplete={() => !window.location.hash && scrollToTarget(0, 0, true)}>
        <Page key={location.pathname} inner={!home}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/spaces/:slug" element={<SpacePage />} />
            <Route path="/rooms/:id" element={<RoomPage />} />
            <Route path="/works" element={<WorksPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Page>
      </AnimatePresence>
    </>
  );
}
