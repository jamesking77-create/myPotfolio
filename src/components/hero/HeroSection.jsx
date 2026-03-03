// src/components/hero/HeroSection.jsx
import { useState, useEffect, Suspense, useRef, lazy } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
const BadgeCanvas = lazy(() => import("./BadgeCanvas"));
gsap.registerPlugin(ScrollTrigger);

// ─── Shader ──────────────────────────────────────────────────────────────────

// ─── Menu Overlay ─────────────────────────────────────────────────────────────
function MenuOverlay({ open, onClose }) {
  const links = ["About", "Projects", "Stack", "Collabs", "Contact"];
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "#1c2410",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        transform: open ? "translateX(0)" : "translateX(-100%)",
        transition: "transform .7s cubic-bezier(.16,1,.3,1)",
        pointerEvents: open ? "auto" : "none",
      }}
    >
      <div
        style={{
          padding: "40px clamp(24px,5vw,48px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRight: "1px solid rgba(245,240,228,0.08)",
        }}
      >
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "'Space Mono',monospace",
            fontSize: 11,
            letterSpacing: "0.4em",
            color: "rgba(245,240,228,0.5)",
            textAlign: "left",
          }}
        >
          CLOSE
        </button>
        <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {links.map((l, i) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              onClick={onClose}
              style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: "clamp(2rem,5vw,4.5rem)",
                color: "rgba(245,240,228,0.25)",
                textDecoration: "none",
                lineHeight: 1.1,
                transition: "color .2s",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#f5f0e4")}
              onMouseLeave={(e) =>
                (e.target.style.color = "rgba(245,240,228,0.25)")
              }
            >
              {l}
            </a>
          ))}
        </nav>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span
            style={{
              fontFamily: "'Space Mono',monospace",
              fontSize: 10,
              color: "rgba(245,240,228,0.3)",
              letterSpacing: "0.3em",
            }}
          >
            JAMES THE BUILD
          </span>
          <a
            href="mailto:james@example.com"
            style={{
              fontFamily: "'Space Mono',monospace",
              fontSize: 10,
              color: "rgba(245,240,228,0.3)",
              letterSpacing: "0.2em",
              textDecoration: "none",
            }}
          >
            HELLO@JAMESASUELIMEN.COM
          </a>
        </div>
      </div>
      <div
        style={{
          background: "linear-gradient(135deg,#232e15,#141a0c)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(168,192,96,0.12) 0%,transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: "clamp(3rem,8vw,7rem)",
            color: "rgba(168,192,96,0.15)",
            lineHeight: 1,
            letterSpacing: "-0.04em",
            userSelect: "none",
          }}
        >
          {"{ }"}
        </div>
      </div>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
export default function HeroSection() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef();

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Scroll-out animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(sectionRef.current, {
        scale: 1.06,
        opacity: 0,
        filter: "blur(10px)",
        ease: "power2.in",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "bottom 80%",
          end: "bottom 20%",
          scrub: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&family=Space+Mono&display=swap');

        @keyframes fmFadeUp { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fmFade   { from{opacity:0} to{opacity:1} }
        .fm-up { animation: fmFadeUp .9s cubic-bezier(.16,1,.3,1) forwards; opacity:0; }
        .fm-in { animation: fmFade .7s cubic-bezier(.16,1,.3,1) forwards; opacity:0; }

        .fm-pill {
          display:inline-flex; align-items:center; gap:10px;
          padding:13px 26px; border-radius:100px;
          border:1px solid rgba(245,240,228,0.25);
          background:transparent; color:#f5f0e4;
          font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500;
          letter-spacing:.04em; cursor:pointer; text-decoration:none;
          transition:background .3s,border-color .3s,transform .3s;
          white-space: nowrap;
        }
        .fm-pill:hover { background:rgba(245,240,228,0.08); border-color:rgba(245,240,228,0.45); transform:translateY(-2px); }
        .fm-pill-accent { background:#a8c060; border-color:#a8c060; color:#1c2410; font-weight:700; }
        .fm-pill-accent:hover { background:#bcd470; border-color:#bcd470; transform:translateY(-2px); }
        .fm-dot { width:6px; height:6px; border-radius:50%; background:#a8c060; flex-shrink:0; }
        .fm-pill-accent .fm-dot { background:#1c2410; }

        /* ─── MOBILE LAYOUT ───────────────────────────────
           On mobile the hero splits into two rows:
           TOP ROW:  Badge canvas (takes ~55% of screen height)
           BOT ROW:  Text content + buttons (takes ~45%)
           
           Nav stays at top (absolute).
           Bottom bar is hidden on very small screens to
           avoid clashing with the content.
        ─────────────────────────────────────────────────── */

        .hero-layout {
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        /* Nav — always at top */
        .hero-nav {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 28px 48px 0;
          position: relative;
          z-index: 2;
        }

        /* On desktop: canvas fills full screen, text overlays it */
        .hero-canvas-wrap {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        /* Content sits in the lower left over the canvas */
        .hero-content-wrap {
          flex: 1;
          display: flex;
          align-items: center;
          padding: 0 48px;
          position: relative;
          z-index: 1;
          pointer-events: none;
        }

        .hero-content-wrap > * { pointer-events: auto; }

        /* Bottom bar */
        .hero-bottom {
          position: absolute;
          bottom: 28px;
          left: 48px;
          right: 48px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 2;
        }

        /* Drag hint */
        .hero-drag-hint {
          position: absolute;
          top: 28px;
          right: 160px;
          z-index: 2;
          pointer-events: none;
        }

        /* ── TABLET (≤ 900px) ── */
        @media (max-width: 900px) {
          .hero-nav { padding: 20px 24px 0; }
          .hero-content-wrap { padding: 0 24px; }
          .hero-bottom { left: 24px; right: 24px; }
          .hero-drag-hint { display: none; }
          /* Hide contact pill in nav — too cramped */
          .hero-nav-contact { display: none; }
        }

        /* ── MOBILE (≤ 640px) ── */
        @media (max-width: 640px) {
          /* Stack: canvas top half, content bottom half */
          .hero-layout { flex-direction: column; }

          .hero-canvas-wrap {
            position: relative !important;
            inset: unset !important;
            height: 52vh;
            flex-shrink: 0;
          }

          .hero-content-wrap {
            position: relative !important;
            flex: 1;
            align-items: flex-start;
            padding: 20px 20px 0;
            background: transparent;
          }

          .hero-nav {
            position: absolute;
            top: 0; left: 0; right: 0;
            padding: 18px 20px 0;
            z-index: 10;
          }

          .hero-bottom {
            position: relative !important;
            bottom: unset !important;
            left: unset !important; right: unset !important;
            padding: 16px 20px 20px;
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          /* Hide social links on very small screens, keep copyright */
          .hero-bottom-socials { display: none; }

          .hero-drag-hint { display: none; }
          .hero-nav-contact { display: none; }

          /* Tighter heading on mobile */
          .hero-h1 { font-size: clamp(2.2rem, 9vw, 3.2rem) !important; }

          /* Shorter para on mobile */
          .hero-para { font-size: 14px !important; }

          /* Smaller pills */
          .fm-pill { padding: 11px 20px !important; font-size: 12px !important; }
        }

        /* ── VERY SMALL (≤ 380px) ── */
        @media (max-width: 380px) {
          .hero-canvas-wrap { height: 45vh; }
          .hero-h1 { font-size: 2rem !important; }
          .hero-content-wrap { padding: 14px 16px 0; }
          .hero-bottom { padding: 12px 16px 16px; }
        }
      `}</style>

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />

      <section
        ref={sectionRef}
        style={{
          height: "100svh",
          width: "100%",
          position: "relative",
          overflow: "hidden",
          willChange: "transform",
        }}
      >
        <div className="hero-layout">
          {/* ── NAV ── */}
          <div
            className="hero-nav pointer-events-auto fm-in"
            style={{ animationDelay: "0.1s" }}
          >
            <button
              className="fm-in"
              style={{
                animationDelay: "0.1s",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "'Space Mono',monospace",
                fontSize: 11,
                letterSpacing: "0.4em",
                color: "rgba(245,240,228,0.55)",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: 0,
              }}
              onClick={() => setMenuOpen(true)}
            >
              <span style={{ fontSize: 14 }}>✕</span> MENU
            </button>

            <div
              className="fm-in"
              style={{
                animationDelay: "0.15s",
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: 16,
                color: "#f5f0e4",
                letterSpacing: "0.03em",
              }}
            >
              James Oluwaleke
            </div>

            <a
              href="#contact"
              className="fm-pill fm-in hero-nav-contact"
              style={{
                animationDelay: "0.2s",
                padding: "9px 20px",
                fontSize: 12,
              }}
            >
              Contact Us
            </a>
          </div>

          {/* ── DRAG HINT (desktop only) ── */}
          <div
            className="hero-drag-hint fm-in"
            style={{ animationDelay: "0.3s" }}
          >
            <span
              style={{
                fontFamily: "'Space Mono',monospace",
                fontSize: 10,
                color: "rgba(245,240,228,0.2)",
                letterSpacing: "0.3em",
              }}
            >
              DRAG BADGE TO SWING
            </span>
          </div>

          {/* ── 3D CANVAS ── */}
          <div className="hero-canvas-wrap">
            {/* Ambient glow */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  width: 500,
                  height: 500,
                  opacity: 0.12,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle,rgba(168,192,96,0.7) 0%,transparent 70%)",
                  filter: "blur(70px)",
                }}
              />
            </div>
            <Suspense fallback={null}>
              <BadgeCanvas isMobile={isMobile} />
            </Suspense>
          </div>

          {/* ── MAIN TEXT CONTENT ── */}
          <div className="hero-content-wrap">
            <div style={{ maxWidth: 560 }}>
              {/* Label */}
              <div
                className="fm-up"
                style={{
                  animationDelay: "0.3s",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 1,
                    background: "#a8c060",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontSize: 10,
                    letterSpacing: "0.4em",
                    color: "rgba(245,240,228,0.5)",
                  }}
                >
                  FULL STACK ENGINEER
                </span>
              </div>

              {/* Heading */}
              <div
                className="fm-up"
                style={{ animationDelay: "0.4s", marginBottom: 16 }}
              >
                <h1
                  className="hero-h1"
                  style={{
                    fontFamily: "'Bebas Neue',sans-serif",
                    fontSize: "clamp(2.8rem,6.5vw,6rem)",
                    color: "#f5f0e4",
                    lineHeight: 1.0,
                    letterSpacing: "-0.03em",
                    margin: 0,
                  }}
                >
                  Building the
                  <br />
                  <span style={{ color: "#a8c060" }}>digital</span> future.
                </h1>
              </div>

              {/* Para */}
              <div
                className="fm-up"
                style={{ animationDelay: "0.55s", marginBottom: 28 }}
              >
                <p
                  className="hero-para"
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 15,
                    color: "rgba(245,240,228,0.55)",
                    lineHeight: 1.75,
                    maxWidth: 440,
                    margin: 0,
                  }}
                >
                  Creative software engineer crafting experiences with precision
                  and passion — specialising in modern web, mobile and
                  interactive design.
                </p>
              </div>

              {/* Buttons */}
              <div
                className="fm-up"
                style={{
                  animationDelay: "0.7s",
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <a href="#about" className="fm-pill fm-pill-accent">
                  <span className="fm-dot" />
                  Explore my work
                  <span className="fm-dot" />
                </a>
                <a href="#projects" className="fm-pill">
                  View projects ↗
                </a>
              </div>
            </div>
          </div>

          {/* ── BOTTOM BAR ── */}
          <div className="hero-bottom fm-in" style={{ animationDelay: "1s" }}>
            <span
              style={{
                fontFamily: "'Space Mono',monospace",
                fontSize: 10,
                color: "rgba(245,240,228,0.2)",
                letterSpacing: "0.3em",
              }}
            >
              © 2026 JAMES OLUWALEKE
            </span>
            <div
              className="hero-bottom-socials"
              style={{ display: "flex", gap: 28 }}
            >
              {[
                ["↗ GITHUB", "https://github.com/jamesking77-create/"],
                ["↗ LINKEDIN", "https://www.linkedin.com/in/jamesasuelimen77/"],
              ].map(([l, h]) => (
                <a
                  key={l}
                  href={h}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontSize: 10,
                    color: "rgba(245,240,228,0.2)",
                    letterSpacing: "0.3em",
                    textDecoration: "none",
                    transition: "color .2s",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#a8c060")}
                  onMouseLeave={(e) =>
                    (e.target.style.color = "rgba(245,240,228,0.2)")
                  }
                >
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
