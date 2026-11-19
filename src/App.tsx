import { AnimatePresence } from "motion/react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Preloader } from "@/components/layout/Preloader";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollManager } from "@/components/routing/ScrollManager";
import { Page } from "@/components/routing/Page";
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
      <AnimatePresence mode="wait" initial={false}>
        <Page key={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
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
