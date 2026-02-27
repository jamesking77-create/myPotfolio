// src/components/about/AboutSection.jsx
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

const FONT = `@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&family=Space+Mono&display=swap');`;

const stats = [
  { value: "4+", label: "Years of production experience" },
  { value: "15+", label: "Projects shipped" },
  { value: "100%", label: "Remote-ready, globally" },
  { value: "∞", label: "Lines of code written" },
];

const dataRows = [
  { key: "STATUS", val: "Available for work", green: true },
  { key: "SPECIALTY", val: "Full Stack Engineering", green: false },
  { key: "STACK", val: "React · Node · Three.js", green: false },
  { key: "BASE", val: "Lagos, Nigeria", green: false },
];

export default function AboutSection() {
  const secRef = useRef();
  const imgRef = useRef();
  const rightRef = useRef();
  const headingRef = useRef();
  const labelRef = useRef();
  const paraRef = useRef();
  const quoteRef = useRef();
  const [hoveredStat, setHoveredStat] = useState(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 200, damping: 20 });
  const springY = useSpring(my, { stiffness: 200, damping: 20 });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        labelRef.current,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: secRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.to(imgRef.current, {
        yPercent: -15,
        ease: "none",
        scrollTrigger: {
          trigger: secRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      gsap.fromTo(
        ".about-img-wrap",
        { clipPath: "inset(100% 0 0 0)" },
        {
          clipPath: "inset(0% 0 0 0)",
          duration: 1.2,
          ease: "power4.inOut",
          scrollTrigger: {
            trigger: secRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        },
      );

      gsap.fromTo(
        ".about-name-overlay",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          delay: 0.4,
          scrollTrigger: {
            trigger: secRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        },
      );

      const heading = headingRef.current;
      if (heading) {
        const split = new SplitType(heading, { types: "lines" });
        gsap.fromTo(
          split.lines,
          { y: "110%", opacity: 0 },
          {
            y: "0%",
            opacity: 1,
            duration: 0.9,
            stagger: 0.12,
            ease: "power4.out",
            scrollTrigger: {
              trigger: heading,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      gsap.fromTo(
        paraRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: paraRef.current,
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        ".about-row",
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.55,
          stagger: 0.09,
          ease: "power3.out",
          scrollTrigger: {
            trigger: rightRef.current,
            start: "top 72%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        ".about-row-border",
        { scaleX: 0, transformOrigin: "left" },
        {
          scaleX: 1,
          duration: 0.6,
          stagger: 0.09,
          ease: "power2.out",
          scrollTrigger: {
            trigger: rightRef.current,
            start: "top 72%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        ".about-stat",
        { opacity: 0, y: 36, scale: 0.92 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: ".about-stats-grid",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        ".about-stat-value",
        { scale: 1.3, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".about-stats-grid",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        quoteRef.current,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: quoteRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        ".quote-scanline",
        { scaleX: 0, transformOrigin: "left" },
        {
          scaleX: 1,
          duration: 1.2,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: quoteRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, secRef);

    return () => ctx.revert();
  }, []);

  const handleMagnet = (e, strength = 0.4) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    mx.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    my.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };
  const resetMagnet = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <>
      <style>{`
        ${FONT}
        .bebas { font-family: 'Bebas Neue', sans-serif; }
        .dm    { font-family: 'DM Sans', sans-serif; }
        .mono  { font-family: 'Space Mono', monospace; }

        /* ── Row hover ── */
        .about-row { transition: background 0.25s, padding-left 0.25s; }
        .about-row:hover { background: rgba(42,48,24,0.04); padding-left: 10px; }
        .about-row:hover .about-row-val { color: #4a6020 !important; }

        /* ── Stat hover ── */
        .about-stat { transition: background 0.3s; cursor: default; }
        .about-stat:hover { background: rgba(42,48,24,0.04); }
        .about-stat:hover .about-stat-value {
          color: #4a6020 !important;
          transform: scale(1.06);
          transition: color 0.25s, transform 0.25s;
        }

        /* ── CTA shimmer ── */
        .about-cta { position: relative; overflow: hidden; }
        .about-cta::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
          transition: left 0.5s ease;
        }
        .about-cta:hover::after { left: 150%; }

        .heading-overflow { overflow: hidden; }

        /* ────────────────────────────
           TABLET  ≤ 900px
        ──────────────────────────── */
        @media (max-width: 900px) {
          .about-split-grid {
            grid-template-columns: 1fr !important;
            min-height: unset !important;
          }
          .about-img-col {
            height: 65vw !important;
            min-height: 280px !important;
          }
          .about-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .about-stats-grid > div:nth-child(2) {
            border-right: none !important;
          }
          .about-stats-grid > div:nth-child(1),
          .about-stats-grid > div:nth-child(2) {
            border-bottom: 1px solid rgba(42,48,24,0.1) !important;
          }
          .about-quote-strip {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 24px !important;
          }
        }

        /* ────────────────────────────
           MOBILE  ≤ 520px
        ──────────────────────────── */
        @media (max-width: 520px) {
          .about-img-col {
            height: 80vw !important;
            min-height: 260px !important;
          }
          .about-stats-grid > div {
            padding: 28px 20px !important;
          }
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(1.5); }
        }
      `}</style>

      <section
        id="about"
        ref={secRef}
        style={{ background: "#f5f0e4", position: "relative" }}
      >
        {/* top hairline */}
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

        {/* ── SECTION LABEL ── */}
        <div style={{ padding: "10px clamp(20px,6vw,72px) 0" }}>
          <span
            ref={labelRef}
            className="mono"
            style={{
              fontSize: 20,
              letterSpacing: "0.1em",
              color: "rgba(42,48,24,0.35)",
              display: "inline-block",
              marginBottom:"0.5 rem"
             
            }}
          >
            01 / About
          </span>
        </div>

        {/* ── HERO SPLIT ── */}
        <div
          className="about-split-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            minHeight: "80vh",
            borderBottom: "1px solid rgba(42,48,24,0.1)",
          }}
        >
          {/* LEFT — video panel */}
          <div
            className="about-img-wrap about-img-col"
            style={{
              position: "relative",
              overflow: "hidden",
              background: "#2a3018",
              minHeight: "clamp(280px,60vh,100%)",
            }}
          >
            <div
              ref={imgRef}
              style={{
                position: "absolute",
                inset: "-15% 0",
                willChange: "transform",
              }}
            >
              {/* Real photo (shown if file exists) */}
              <img
                src="/james.jpg"
                alt="James Asuelimen"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center top",
                  display: "block",
                }}
              />

              {/* Video + colour grade */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(145deg,#2a3818 0%,#1c2410 60%,#141a0c 100%)",
                }}
              >
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  src="/vid.mp4"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    mixBlendMode: "luminosity",
                    opacity: 0.9,
                  }}
                />
                {/* olive-green colour-grade overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(145deg,rgba(42,56,24,0.5) 0%,rgba(28,36,16,0.65) 100%)",
                  }}
                />
              </div>
            </div>

            {/* Grain */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 1,
                pointerEvents: "none",
                background:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
              }}
            />

            {/* Name overlay */}
            <div
              className="about-name-overlay"
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 2,
                padding: "clamp(20px,4vw,48px)",
                background:
                  "linear-gradient(0deg,rgba(20,26,12,0.9) 0%,transparent 100%)",
              }}
            >
              <div
                className="bebas"
                style={{
                  fontSize: "clamp(1.8rem,5vw,4.5rem)",
                  color: "#f5f0e4",
                  lineHeight: 0.95,
                  letterSpacing: "0.02em",
                }}
              >
                James
                <br />
                Oluwaleke
              </div>
              <div
                className="mono"
                style={{
                  fontSize: 9,
                  letterSpacing: "0.3em",
                  color: "rgba(245,240,228,0.4)",
                  marginTop: 8,
                }}
              >
                SOFTWARE ENGINEER
              </div>
            </div>
          </div>

          {/* RIGHT — intro + data rows */}
          <div
            ref={rightRef}
            style={{
              padding: "clamp(32px,6vw,80px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 32,
              background: "#f5f0e4",
            }}
          >
            <div>
              <div className="heading-overflow">
                <h2
                  ref={headingRef}
                  className="bebas"
                  style={{
                    fontSize: "clamp(1.8rem,5.5vw,5.5rem)",
                    color: "#1c2410",
                    lineHeight: 0.95,
                    letterSpacing: "0.02em",
                    marginBottom: 24,
                  }}
                >
                  I DON'T JUST WRITE CODE —<br />
                  <span style={{ color: "#4a6020" }}>
                    I ENGINEER EXPERIENCES.
                  </span>
                </h2>
              </div>
              <p
                ref={paraRef}
                className="dm"
                style={{
                  fontSize: "clamp(13px,1.4vw,15px)",
                  color: "rgba(42,48,24,0.6)",
                  lineHeight: 1.8,
                  maxWidth: 460,
                }}
              >
                From real-time trading platforms to e-commerce ecosystems, I
                build software that works at the speed of business. Based in
                Lagos, Nigeria — working globally.
              </p>
            </div>

            {/* data rows */}
            <div>
              {dataRows.map((r) => (
                <div
                  key={r.key}
                  className="about-row"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "14px 0",
                    position: "relative",
                    opacity: 0,
                    borderRadius: 4,
                    gap: 12,
                  }}
                >
                  <div
                    className="about-row-border"
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 1,
                      background: "rgba(42,48,24,0.1)",
                      transformOrigin: "left",
                    }}
                  />
                  <span
                    className="mono"
                    style={{
                      fontSize: "clamp(10px,1vw,20px)",
                      letterSpacing: "0.3em",
                      color: "rgba(42,48,24,0.4)",
                      flexShrink: 0,
                    }}
                  >
                    {r.key}
                  </span>
                  <span
                    className="dm about-row-val"
                    style={{
                      fontSize: "clamp(11px,1.2vw,13px)",
                      fontWeight: 500,
                      color: r.green ? "#4a6020" : "#1c2410",
                      letterSpacing: r.green ? "0.08em" : 0,
                      transition: "color 0.25s",
                      textAlign: "right",
                    }}
                  >
                    {r.green && (
                      <span
                        style={{
                          display: "inline-block",
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: "#4a6020",
                          marginRight: 8,
                          animation: "pulse-dot 2s infinite",
                        }}
                      />
                    )}
                    {r.val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── STATS GRID ── */}
        <div
          className="about-stats-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            borderBottom: "1px solid rgba(42,48,24,0.1)",
          }}
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="about-stat"
              onMouseEnter={() => setHoveredStat(i)}
              onMouseLeave={() => setHoveredStat(null)}
              style={{
                padding: "clamp(24px,5vw,64px) clamp(14px,4vw,48px)",
                borderRight:
                  i < stats.length - 1
                    ? "1px solid rgba(42,48,24,0.1)"
                    : undefined,
                opacity: 0,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "#1c2410",
                  transform: hoveredStat === i ? "scaleY(1)" : "scaleY(0)",
                  transformOrigin: "bottom",
                  transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
                  zIndex: 0,
                }}
              />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div
                  className="bebas about-stat-value"
                  style={{
                    fontSize: "clamp(1.8rem,6vw,6rem)",
                    color: hoveredStat === i ? "#a8c060" : "#2a3818",
                    lineHeight: 0.9,
                    letterSpacing: "0.02em",
                    marginBottom: 10,
                    transition: "color 0.3s",
                  }}
                >
                  {s.value}
                </div>
                <div
                  className="mono"
                  style={{
                    fontSize: "clamp(7px,0.75vw,9px)",
                    letterSpacing: "0.2em",
                    color:
                      hoveredStat === i
                        ? "rgba(245,240,228,0.5)"
                        : "rgba(42,48,24,0.4)",
                    textTransform: "uppercase",
                    lineHeight: 1.6,
                    transition: "color 0.3s",
                  }}
                >
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── QUOTE STRIP ── */}
        <div
          className="about-quote-strip"
          style={{
            background: "#1c2410",
            padding: "clamp(32px,6vw,80px) clamp(20px,6vw,72px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 28,
            flexWrap: "wrap",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            className="quote-scanline"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 1,
              background:
                "linear-gradient(90deg,transparent,rgba(168,192,96,0.4),transparent)",
            }}
          />

          <p
            ref={quoteRef}
            className="bebas"
            style={{
              fontSize: "clamp(1.2rem,3.5vw,3rem)",
              color: "#f5f0e4",
              letterSpacing: "0.04em",
              maxWidth: 700,
              lineHeight: 1.15,
            }}
          >
            AVAILABLE FOR FULL-TIME ROLES, FREELANCE & COLLABS.
          </p>

          <motion.a
            href="#contact"
            className="about-cta"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 28px",
              borderRadius: 100,
              background: "#a8c060",
              border: "1px solid #a8c060",
              color: "#1c2410",
              fontFamily: "'DM Sans',sans-serif",
              fontSize: "clamp(11px,1.2vw,13px)",
              fontWeight: 700,
              letterSpacing: ".04em",
              textDecoration: "none",
              flexShrink: 0,
              x: springX,
              y: springY,
            }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.97 }}
            onMouseMove={(e) => handleMagnet(e)}
            onMouseLeave={resetMagnet}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#1c2410",
              }}
            />
            Get in touch
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#1c2410",
              }}
            />
          </motion.a>
        </div>
      </section>
    </>
  );
}
