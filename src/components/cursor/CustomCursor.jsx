// src/components/cursor/CustomCursor.jsx
import { useEffect, useRef, useState } from "react";

const isTouch =
  typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

export default function CustomCursor() {
  if (isTouch) return null;

  const dotRef = useRef();
  const ringRef = useRef();
  const rafRef = useRef();

  const pos = useRef({ x: -200, y: -200 });
  const ringPos = useRef({ x: -200, y: -200 });

  const [state, setState] = useState("default");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    document.documentElement.style.cursor = "none";

    const lerp = (a, b, t) => a + (b - a) * t;

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
    };

    const onOver = (e) => {
      const hoverable = e.target.closest(
        "a, button, [data-cursor-hover], input, textarea, select, label",
      );
      setState((s) => (s === "click" ? s : hoverable ? "hover" : "default"));
    };

    const onDown = () => setState("click");
    const onUp = () => {
      const el = document.elementFromPoint(pos.current.x, pos.current.y);
      const hoverable = el?.closest(
        "a, button, [data-cursor-hover], input, textarea, select, label",
      );
      setState(hoverable ? "hover" : "default");
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    const tick = () => {
      const dot = dotRef.current;
      const ring = ringRef.current;
      if (dot && ring) {
        dot.style.transform = `translate(${pos.current.x}px,${pos.current.y}px) translate(-50%,-50%)`;

        ringPos.current.x = lerp(ringPos.current.x, pos.current.x, 0.13);
        ringPos.current.y = lerp(ringPos.current.y, pos.current.y, 0.13);
        ring.style.transform = `translate(${ringPos.current.x}px,${ringPos.current.y}px) translate(-50%,-50%)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      document.documentElement.style.cursor = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const isHover = state === "hover";
  const isClick = state === "click";

  /*
    VISIBILITY TRICK — two techniques combined:

    1. mix-blend-mode: "difference"
       Inverts against whatever is underneath:
       - On dark bg  → cream appears bright
       - On light bg → cream flips to dark
       This alone handles 90% of cases.

    2. filter: drop-shadow
       A tight dark shadow behind the dot and a light
       shadow on the ring give contrast on mid-tone
       backgrounds where difference blending is ambiguous.
  */

  const ringSize = isHover ? 48 : 32;
  const ringScale = isClick ? "0.75" : "1";
  const ringOpacity = visible ? 1 : 0;
  const dotSize = isHover ? 0 : isClick ? 9 : 6;
  const dotOpacity = visible ? 1 : 0;

  return (
    <>
      {/*
        ── RING
        Uses mix-blend-mode difference so it inverts on light bg.
        A subtle box-shadow gives extra contrast on mid-tones.
      */}
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 99999,
          pointerEvents: "none",
          width: `${ringSize}px`,
          height: `${ringSize}px`,
          borderRadius: "50%",
          // White border — inverts via mix-blend-mode
          border: isHover ? "2px solid #ffffff" : "1.5px solid #ffffff",
          background: isHover ? "rgba(255,255,255,0.07)" : "transparent",
          opacity: ringOpacity,
          scale: ringScale,
          mixBlendMode: "difference",
          // Extra shadow for mid-tone visibility
          filter: "drop-shadow(0 0 3px rgba(0,0,0,0.6))",
          boxShadow: isHover ? "0 0 0 1px rgba(255,255,255,0.15)" : "none",
          transition: [
            "width       0.4s cubic-bezier(0.16,1,0.3,1)",
            "height      0.4s cubic-bezier(0.16,1,0.3,1)",
            "border      0.25s ease",
            "background  0.25s ease",
            "scale       0.2s cubic-bezier(0.16,1,0.3,1)",
            "opacity     0.25s ease",
            "box-shadow  0.3s ease",
          ].join(", "),
          willChange: "transform",
        }}
      />

      {/*
        ── DOT
        Solid white dot with mix-blend-mode difference.
        On dark bg  → shows as white.
        On light bg → inverts to near-black.
        drop-shadow adds a dark halo for mid-tone contrast.
      */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 99999,
          pointerEvents: "none",
          width: `${dotSize}px`,
          height: `${dotSize}px`,
          borderRadius: "50%",
          background: "#ffffff",
          opacity: dotOpacity,
          mixBlendMode: "difference",
          filter: "drop-shadow(0 0 2px rgba(0,0,0,0.8))",
          transition: [
            "width      0.3s cubic-bezier(0.16,1,0.3,1)",
            "height     0.3s cubic-bezier(0.16,1,0.3,1)",
            "opacity    0.25s ease",
          ].join(", "),
          willChange: "transform",
        }}
      />
    </>
  );
}
