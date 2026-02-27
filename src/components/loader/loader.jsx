// src/components/loader/Loader.jsx
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Loader({ onComplete }) {
  const rootRef = useRef();
  const svgRef = useRef();
  const barFillRef = useRef();
  const counterRef = useRef();
  const labelRef = useRef();
  const panelTopRef = useRef();
  const panelBotRef = useRef();

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      /* ── master timeline ───────────────────────── */
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          document.body.style.overflow = "";
          onComplete?.();
        },
      });

      /* ── 1. SVG shapes entrance ─────────────────
         Each shape starts hidden and staggers in   */
      tl.fromTo(
        ".ld-shape",
        { scale: 0, opacity: 0, transformOrigin: "center center" },
        {
          scale: 1,
          opacity: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: "back.out(1.6)",
        },
        0,
      );

      /* ── 2. Label slides up ───────────────────── */
      tl.fromTo(
        labelRef.current,
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        0.3,
      );

      /* ── 3. Progress bar + counter (2 s) ─────── */
      tl.fromTo(
        barFillRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 2,
          ease: "power1.inOut",
          transformOrigin: "left center",
        },
        0.5,
      );

      const obj = { n: 0 };
      tl.to(
        obj,
        {
          n: 100,
          duration: 2,
          ease: "power1.inOut",
          onUpdate() {
            if (counterRef.current)
              counterRef.current.textContent = `${Math.round(obj.n)}`;
          },
        },
        0.5,
      );

      /* ── 4. Shapes idle spin / float while loading */
      gsap.to(".ld-orbit", {
        rotation: 360,
        duration: 8,
        ease: "none",
        repeat: -1,
        transformOrigin: "center center",
      });

      gsap.to(".ld-float", {
        y: -10,
        duration: 1.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.2,
      });

      /* ── 5. Exit sequence ─────────────────────── */
      // shapes scatter outward
      tl.to(
        ".ld-shape",
        {
          scale: 0,
          opacity: 0,
          stagger: 0.05,
          duration: 0.4,
          ease: "power2.in",
        },
        2.6,
      );

      // label + counter fade
      tl.to(
        [
          labelRef.current,
          counterRef.current,
          barFillRef.current?.closest?.(".ld-bar-track"),
        ],
        { opacity: 0, duration: 0.3 },
        2.65,
      );

      // curtains split
      tl.to(
        panelTopRef.current,
        { yPercent: -100, duration: 0.9, ease: "power4.inOut" },
        2.9,
      );
      tl.to(
        panelBotRef.current,
        { yPercent: 100, duration: 0.9, ease: "power4.inOut" },
        2.9, // same start = simultaneous
      );
    }, rootRef);

    return () => {
      ctx.revert();
      document.body.style.overflow = "";
    };
  }, []);

  /* ── colour palette (matches site) ── */
  const C = {
    cream: "#f5f0e4",
    olive: "#1c2410",
    green: "#a8c060",
    mid: "#4a6020",
    dim: "rgba(245,240,228,0.12)",
  };

  return (
    <div
      ref={rootRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: "all",
        fontFamily: "'Space Mono', monospace",
      }}
    >
      {/* ── TOP curtain ── */}
      <div
        ref={panelTopRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "50%",
          background: "#0a0f05",
          zIndex: 10,
        }}
      />

      {/* ── BOTTOM curtain ── */}
      <div
        ref={panelBotRef}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "50%",
          background: "#0a0f05",
          zIndex: 10,
        }}
      />

      {/* ── FULL background (behind curtains while open) ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#0a0f05",
          zIndex: 0,
        }}
      />

      {/* ── Ambient radial glow ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(168,192,96,0.07) 0%, transparent 70%)",
        }}
      />

      {/* ── Fine grid overlay ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          opacity: 0.35,
          backgroundImage: `linear-gradient(${C.dim} 1px, transparent 1px), linear-gradient(90deg, ${C.dim} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── MAIN content ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
        }}
      >
        {/* ─────────────────────────────────────────
            SVG SHAPE COMPOSITION
            A geometric abstract mark built from:
            • rotating outer ring of dots
            • diamond / rhombus frame
            • inner cross lines
            • floating accent triangles
            • central circle pulse
        ───────────────────────────────────────── */}
        <svg
          ref={svgRef}
          viewBox="0 0 240 240"
          width="clamp(160px, 22vw, 240px)"
          height="clamp(160px, 22vw, 240px)"
          style={{ overflow: "visible", marginBottom: 32 }}
        >
          {/* ── Outer orbit ring of 12 dots ── */}
          <g className="ld-shape ld-orbit">
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i / 12) * Math.PI * 2;
              const r = 112;
              const x = 120 + r * Math.cos(a);
              const y = 120 + r * Math.sin(a);
              const size = i % 3 === 0 ? 4 : 2.5;
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={size}
                  fill={i % 3 === 0 ? C.green : "rgba(168,192,96,0.3)"}
                />
              );
            })}
          </g>

          {/* ── Diamond frame (rotated square) ── */}
          <rect
            className="ld-shape"
            x="60"
            y="60"
            width="120"
            height="120"
            rx="4"
            fill="none"
            stroke={C.green}
            strokeWidth="1.5"
            strokeDasharray="6 4"
            transform="rotate(45 120 120)"
            style={{ transformOrigin: "120px 120px" }}
          />

          {/* ── Inner solid square ── */}
          <rect
            className="ld-shape"
            x="88"
            y="88"
            width="64"
            height="64"
            rx="3"
            fill="none"
            stroke="rgba(168,192,96,0.25)"
            strokeWidth="1"
            transform="rotate(45 120 120)"
            style={{ transformOrigin: "120px 120px" }}
          />

          {/* ── Cross lines ── */}
          <line
            className="ld-shape"
            x1="120"
            y1="40"
            x2="120"
            y2="200"
            stroke={C.dim}
            strokeWidth="1"
          />
          <line
            className="ld-shape"
            x1="40"
            y1="120"
            x2="200"
            y2="120"
            stroke={C.dim}
            strokeWidth="1"
          />
          {/* diagonal cross */}
          <line
            className="ld-shape"
            x1="60"
            y1="60"
            x2="180"
            y2="180"
            stroke={C.dim}
            strokeWidth="0.8"
          />
          <line
            className="ld-shape"
            x1="180"
            y1="60"
            x2="60"
            y2="180"
            stroke={C.dim}
            strokeWidth="0.8"
          />

          {/* ── Corner tick marks ── */}
          {[
            [120, 20, 110, 20, 120, 20, 120, 30], // top
            [220, 120, 220, 110, 220, 120, 210, 120], // right
            [120, 220, 110, 220, 120, 220, 120, 210], // bottom
            [20, 120, 20, 110, 20, 120, 30, 120], // left
          ].map(([x1, y1, x2, y2, x3, y3, x4, y4], i) => (
            <g key={i} className="ld-shape">
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={C.green}
                strokeWidth="2"
              />
              <line
                x1={x3}
                y1={y3}
                x2={x4}
                y2={y4}
                stroke={C.green}
                strokeWidth="2"
              />
            </g>
          ))}

          {/* ── Floating accent triangles ── */}
          <polygon
            className="ld-shape ld-float"
            points="120,76 108,96 132,96"
            fill="none"
            stroke={C.green}
            strokeWidth="1.5"
          />
          <polygon
            className="ld-shape ld-float"
            points="120,164 108,144 132,144"
            fill="none"
            stroke="rgba(168,192,96,0.4)"
            strokeWidth="1"
          />

          {/* ── Small accent diamonds at 45° corners ── */}
          {[
            [120, 56],
            [184, 120],
            [120, 184],
            [56, 120],
          ].map(([cx, cy], i) => (
            <rect
              key={i}
              className="ld-shape"
              x={cx - 5}
              y={cy - 5}
              width="10"
              height="10"
              fill={i === 0 ? C.green : "none"}
              stroke={C.green}
              strokeWidth="1.2"
              transform={`rotate(45 ${cx} ${cy})`}
            />
          ))}

          {/* ── Central circle (pulsing via CSS) ── */}
          <circle
            className="ld-shape"
            cx="120"
            cy="120"
            r="18"
            fill="none"
            stroke={C.green}
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          <circle className="ld-shape" cx="120" cy="120" r="7" fill={C.green} />
          {/* centre dot */}
          <circle cx="120" cy="120" r="2.5" fill={C.olive} />

          {/* ── Outer thin circle border ── */}
          <circle
            className="ld-shape"
            cx="120"
            cy="120"
            r="108"
            fill="none"
            stroke="rgba(168,192,96,0.08)"
            strokeWidth="1"
          />
        </svg>

        {/* ── Label ── */}
        <div
          ref={labelRef}
          style={{
            fontSize: "clamp(7px,0.85vw,9px)",
            letterSpacing: "0.45em",
            color: "rgba(245,240,228,0.3)",
            marginBottom: 28,
            opacity: 0,
          }}
        >
          INITIALISING
        </div>

        {/* ── Progress bar ── */}
        <div style={{ width: "clamp(160px,28vw,320px)" }}>
          <div
            className="ld-bar-track"
            style={{
              width: "100%",
              height: 1,
              background: "rgba(245,240,228,0.1)",
              position: "relative",
              overflow: "hidden",
              borderRadius: 1,
            }}
          >
            <div
              ref={barFillRef}
              style={{
                position: "absolute",
                inset: 0,
                transformOrigin: "left",
                transform: "scaleX(0)",
                background:
                  "linear-gradient(90deg, #4a6020 0%, #a8c060 60%, #d4e88a 100%)",
                borderRadius: 1,
              }}
            />
          </div>

          {/* counter row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 8,
            }}
          >
            <span
              style={{
                fontSize: 8,
                letterSpacing: "0.3em",
                color: "rgba(245,240,228,0.18)",
              }}
            >
              LOADING
            </span>
            <span
              ref={counterRef}
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(11px,1.4vw,14px)",
                color: C.green,
                letterSpacing: "0.1em",
              }}
            >
              0
            </span>
          </div>
        </div>
      </div>

      {/* ── Corner labels ── */}
      {[
        {
          text: "PORTFOLIO / 2026",
          style: { top: "clamp(20px,4vh,40px)", left: "clamp(20px,4vw,48px)" },
        },
        {
          text: "LAGOS / NG",
          style: { top: "clamp(20px,4vh,40px)", right: "clamp(20px,4vw,48px)" },
        },
      ].map(({ text, style }) => (
        <div
          key={text}
          style={{
            position: "absolute",
            zIndex: 6,
            fontSize: 8,
            letterSpacing: "0.35em",
            color: "rgba(245,240,228,0.15)",
            fontFamily: "'Space Mono', monospace",
            ...style,
          }}
        >
          {text}
        </div>
      ))}

      {/* inline keyframe for central circle subtle pulse */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono&display=swap');
        @keyframes ld-pulse {
          0%,100% { r: 18; opacity: 1; }
          50%      { r: 22; opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
