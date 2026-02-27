// src/components/collabs/CollabSection.jsx
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const clients = [
  { name: "Aristack Solutions", initials: "AS", color: "#2a3018" },
  { name: "iBloom Decor", initials: "iB", color: "#3a4820" },
  { name: "Bime Brand", initials: "Bm", color: "#2a3018" },
  { name: "Client Four", initials: "C4", color: "#3a4820" },
  { name: "Client Five", initials: "C5", color: "#2a3018" },
];

function CollabTicker({ items, reverse = false }) {
  const [paused, setPaused] = useState(false);

  return (
    <div
      style={{ overflow: "hidden", padding: "6px 0" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        style={{
          display: "flex",
          width: "max-content",
          animation: `fmMarquee 28s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
          animationPlayState: paused ? "paused" : "running",
          transition: "animation-play-state 0.2s",
        }}
      >
        {[...items, ...items, ...items].map((c, i) => (
          <TickerItem key={i} client={c} />
        ))}
      </div>
    </div>
  );
}

function TickerItem({ client: c }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        padding: "12px 28px",
        marginRight: 12,
        border: hovered
          ? "1px solid rgba(42,48,24,0.3)"
          : "1px solid rgba(42,48,24,0.12)",
        borderRadius: 100,
        background: hovered ? "rgba(42,48,24,0.08)" : "rgba(42,48,24,0.04)",
        flexShrink: 0,
        transform: hovered
          ? "scale(1.05) translateY(-3px)"
          : "scale(1) translateY(0)",
        transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
        cursor: "default",
        boxShadow: hovered ? "0 8px 24px rgba(42,48,24,0.1)" : "none",
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: "50%",
          background: hovered ? "#4a6020" : c.color,
          color: "#f5f0e4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Cabinet Grotesk',sans-serif",
          fontWeight: 700,
          fontSize: 11,
          letterSpacing: "0.1em",
          transition: "background 0.3s, transform 0.3s",
          transform: hovered ? "rotate(10deg)" : "rotate(0deg)",
        }}
      >
        {c.initials}
      </div>
      <span
        style={{
          fontFamily: "'DM Sans',sans-serif",
          fontSize: 13,
          fontWeight: 500,
          color: hovered ? "rgba(42,48,24,0.9)" : "rgba(42,48,24,0.7)",
          whiteSpace: "nowrap",
          transition: "color 0.25s",
        }}
      >
        {c.name}
      </span>
    </div>
  );
}

function StatCell({ value, label, index }) {
  const ref = useRef();
  const inView = useInView(ref, { once: true });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      key={label}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        delay: index * 0.1,
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "48px 32px",
        borderRight: index < 3 ? "1px solid rgba(42,48,24,0.1)" : undefined,
        textAlign: "center",
        background: hovered ? "#1c2410" : "transparent",
        transition: "background 0.3s",
        cursor: "default",
      }}
    >
      <motion.div
        animate={inView ? { scale: [0.5, 1.1, 1] } : {}}
        transition={{
          delay: index * 0.1 + 0.1,
          duration: 0.7,
          ease: "backOut",
        }}
        style={{
          fontFamily: "'Cabinet Grotesk',sans-serif",
          fontSize: "clamp(2.5rem,4vw,3.5rem)",
          fontWeight: 900,
          color: hovered ? "#a8c060" : "#1c2410",
          letterSpacing: "-0.03em",
          marginBottom: 8,
          transition: "color 0.3s",
        }}
      >
        {value}
      </motion.div>
      <div
        style={{
          fontFamily: "'Space Mono',monospace",
          fontSize: 9,
          letterSpacing: "0.35em",
          color: hovered ? "rgba(245,240,228,0.4)" : "rgba(42,48,24,0.4)",
          textTransform: "uppercase",
          transition: "color 0.3s",
        }}
      >
        {label}
      </div>
    </motion.div>
  );
}

export function CollabSection() {
  const secRef = useRef();
  const headerRef = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Label
      gsap.fromTo(
        ".collab-label",
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // Main heading lines
      gsap.fromTo(
        ".collab-heading-line",
        { y: "110%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power4.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // Right paragraph
      gsap.fromTo(
        ".collab-desc",
        { opacity: 0, x: 30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.2,
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // Ticker rows fade in from sides
      gsap.fromTo(
        ".collab-ticker-1",
        { opacity: 0, x: -60 },
        {
          opacity: 1,
          x: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".collab-ticker-1",
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        },
      );
      gsap.fromTo(
        ".collab-ticker-2",
        { opacity: 0, x: 60 },
        {
          opacity: 1,
          x: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".collab-ticker-2",
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, secRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="collabs"
      ref={secRef}
      style={{
        background: "#f5f0e4",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: "rgba(42,48,24,0.1)",
        }}
      />

      {/* header */}
      <div
        ref={headerRef}
        style={{ padding: "clamp(80px,12vh,130px) clamp(24px,6vw,72px) 72px" }}
      >
        <div
          className="collab-label"
          style={{
            fontFamily: "'Space Mono',monospace",
            fontSize: 10,
            letterSpacing: "0.4em",
            color: "rgba(42,48,24,0.35)",
            marginBottom: 20,
          }}
        >
          04 / Collabs
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 40,
            alignItems: "end",
          }}
        >
          <h2
            style={{
              fontFamily: "'Cabinet Grotesk',sans-serif",
              fontSize: "clamp(2.5rem,5.5vw,5rem)",
              color: "#1c2410",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              overflow: "hidden",
            }}
          >
            <div
              className="collab-heading-line"
              style={{ display: "block", overflow: "hidden" }}
            >
              Built with &amp;
            </div>
            <div
              className="collab-heading-line"
              style={{ display: "block", overflow: "hidden" }}
            >
              <span style={{ color: "#4a6020", fontStyle: "italic" }}>
                built for.
              </span>
            </div>
          </h2>
          <p
            className="collab-desc"
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 16,
              color: "rgba(42,48,24,0.55)",
              lineHeight: 1.75,
              maxWidth: 380,
            }}
          >
            Clients who trusted me with real products. People I've built
            alongside. Real work, real results.
          </p>
        </div>
      </div>

      {/* tickers */}
      <div className="collab-ticker-1" style={{ marginBottom: 4 }}>
        <CollabTicker items={clients} />
      </div>
      <div className="collab-ticker-2" style={{ marginBottom: 72 }}>
        <CollabTicker items={clients} reverse />
      </div>

      {/* stats grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          borderTop: "1px solid rgba(42,48,24,0.1)",
        }}
      >
        {[
          ["4+", "Production Apps"],
          ["3+", "Clients Served"],
          ["2+", "Years Exp"],
          ["∞", "Lines of Code"],
        ].map(([v, l], i) => (
          <StatCell key={l} value={v} label={l} index={i} />
        ))}
      </div>

      <style>{`
        @keyframes fmMarquee {
          from { transform: translateX(0) }
          to   { transform: translateX(-33.333%) }
        }
      `}</style>
    </section>
  );
}
export default CollabSection;
