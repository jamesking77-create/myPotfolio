// src/App.jsx
import { useEffect, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

import Loader from "./components/loader/loader";
import CustomCursor from "./components/cursor/CustomCursor";
import HeroSection from "./components/hero/HeroSection";
import AboutSection from "./components/about/AboutSection";
import ProjectsSection from "./components/projects/ProjectsSection";
import StackSection from "./components/stack/StackSection";
import CollabSection from "./components/collabs/CollabSection";
import ContactSection from "./components/contact/ContactSection";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      // One frame after loader exits — recalculate all scroll positions
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [loading]);

  return (
    <>
      {loading && <Loader onComplete={() => setLoading(false)} />}

      <main
        className="bg-[#050a05] text-white overflow-x-hidden"
        style={{
          // Site is rendered in background while loader runs (so assets preload)
          // then smoothly fades in once loader exits
          opacity: loading ? 0 : 1,
          transition: "opacity 0.5s ease 0.1s",
          pointerEvents: loading ? "none" : "all",
        }}
      >
        <CustomCursor />
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <StackSection />
        <CollabSection />
        <ContactSection />
      </main>
    </>
  );
}
