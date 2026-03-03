// src/App.jsx
import { useEffect, useState, useRef } from "react";
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

// ─── Asset preloading helpers ────────────────────────────────────────────────

/** Resolves when an <img> src is decoded and ready to paint */
function preloadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = resolve; // resolve anyway — don't block on broken assets
    img.src = src;
  });
}

/**
 * Resolves once a video has buffered enough to start playing.
 * Uses `canplaythrough` with a 4-second timeout fallback so slow
 * connections never block the loader indefinitely.
 */
function preloadVideo(src, timeoutMs = 4000) {
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, timeoutMs);
    const vid = document.createElement("video");
    vid.muted = true;
    vid.preload = "auto";
    vid.oncanplaythrough = () => {
      clearTimeout(timer);
      resolve();
    };
    vid.onerror = () => {
      clearTimeout(timer);
      resolve();
    };
    vid.src = src;
    vid.load();
  });
}

// ─── Optimised Cloudinary URL ─────────────────────────────────────────────────
// Transformations applied:
//   q_auto   → auto quality
//   f_auto   → WebM for Chrome/Firefox, MP4 for Safari
//   w_1280   → downscale (background video, 4K is wasted)
//   br_800k  → cap bitrate at 800 kbps  (~23 MB → ~2–4 MB)
export const BG_VIDEO_SRC = "/bg-video.mp4";

// ─── Minimum loader display time (ms) ────────────────────────────────────────
// The loader animation is ~3.8 s; keep this slightly shorter so assets
// finishing early don't leave the loader hanging too long.
const MIN_LOADER_MS = 3200;

// ─────────────────────────────────────────────────────────────────────────────

export default function App() {
  const [loaderDone, setLoaderDone] = useState(false); // loader anim finished
  const [assetsReady, setAssetsReady] = useState(false); // heavy assets loaded
  const loaderDoneRef = useRef(false);

  // 1. Kick off asset preloading immediately on mount
  useEffect(() => {
    const start = Date.now();

    Promise.all([
      preloadImage("/james.jpg"),
      preloadVideo(BG_VIDEO_SRC, 5000),
    ]).then(() => {
      // Ensure we've spent at least MIN_LOADER_MS so the animation completes
      const elapsed = Date.now() - start;
      const wait = Math.max(0, MIN_LOADER_MS - elapsed);
      setTimeout(() => setAssetsReady(true), wait);
    });
  }, []);

  // 2. Gate: only hide the loader when BOTH the animation AND assets are ready
  const shouldHideLoader = loaderDone && assetsReady;

  useEffect(() => {
    if (shouldHideLoader) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => ScrollTrigger.refresh());
      });
    }
  }, [shouldHideLoader]);

  useEffect(() => {
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <>
      {!shouldHideLoader && <Loader onComplete={() => setLoaderDone(true)} />}

      <main
        className="bg-[#050a05] text-white overflow-x-hidden"
        style={{
          opacity: shouldHideLoader ? 1 : 0,
          transition: "opacity 0.5s ease 0.1s",
          pointerEvents: shouldHideLoader ? "all" : "none",
          // Keep it in the DOM so Three.js / Rapier can initialise while
          // the loader is still showing — they just won't be visible yet.
        }}
      >
        <CustomCursor />
        <HeroSection />
        <AboutSection videeSrc={BG_VIDEO_SRC} />
        <ProjectsSection />
        <StackSection />
        <CollabSection />
        <ContactSection />
      </main>
    </>
  );
}
