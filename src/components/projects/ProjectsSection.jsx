// src/components/projects/ProjectsSection.jsx
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import HoverEffect from "hover-effect";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { projects } from "../../data/projects";

gsap.registerPlugin(ScrollTrigger);

const ACCENTS = {
  1: "#10b981",
  2: "#7c3aed",
  3: "#a855f7",
  4: "#3b82f6",
};

// ── single project card ──────────────────────────────────────────────────────
function ProjectCard({ project, index }) {
  const wrapRef = useRef();
  const imgRef = useRef();
  const imgParaRef = useRef();
  const titleRef = useRef();
  const scanRef = useRef();
  const infoRef = useRef();
  const hoverEffectRef = useRef(null); // ← store HoverEffect instance
  const [hovered, setHovered] = useState(false);
  const accent = ACCENTS[project.id] || "#a8c060";
  const hasHover =
    project.image && project.logoImage && project.displacementImage;
  const isEven = index % 2 === 0;

  // ── HoverEffect (web + mobile via touch) ────────────────────────────────
  useEffect(() => {
    const el = imgRef.current;
    if (!el || !hasHover) return;

    const fx = new HoverEffect({
      parent: el,
      intensity: 0.3,
      image1: project.image,
      image2: project.logoImage,
      displacementImage: project.displacementImage,
      imagesRatio: 1,
      ease: "power2.out",
      speed: 1.6,
    });
    hoverEffectRef.current = fx;

    // ── Touch support: tap toggles the morph ──────────────────────────────
    let morphed = false;
    const onTouch = () => {
      if (!morphed) {
        fx.next(); // morph to logo image
      } else {
        fx.previous(); // morph back to hero
      }
      morphed = !morphed;
    };
    el.addEventListener("touchstart", onTouch, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onTouch);
      if (el) el.innerHTML = "";
      hoverEffectRef.current = null;
    };
  }, [project]);

  // ── GSAP scroll reveal ───────────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      tl.fromTo(
        wrapRef.current,
        { clipPath: "inset(100% 0 0 0)" },
        { clipPath: "inset(0% 0 0 0)", duration: 1.1, ease: "power4.inOut" },
        0,
      );
      tl.fromTo(
        scanRef.current,
        { scaleX: 0, transformOrigin: "left" },
        { scaleX: 1, duration: 0.9, ease: "power3.inOut" },
        0.3,
      );
      tl.fromTo(
        imgParaRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
        0.25,
      );
      tl.fromTo(
        infoRef.current,
        { y: 36, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85, ease: "power3.out" },
        0.4,
      );
      if (titleRef.current) {
        const split = new SplitType(titleRef.current, { types: "lines" });
        tl.fromTo(
          split.lines,
          { y: "110%", opacity: 0 },
          {
            y: "0%",
            opacity: 1,
            duration: 0.75,
            stagger: 0.1,
            ease: "power4.out",
          },
          0.5,
        );
      }
      tl.fromTo(
        `.ptag-${project.id}`,
        { opacity: 0, y: 10, scale: 0.88 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          stagger: 0.07,
          ease: "back.out(1.4)",
        },
        0.72,
      );
    }, wrapRef);
    return () => ctx.revert();
  }, [project.id]);

  // ── scroll parallax on image ─────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(imgParaRef.current, {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });
    }, wrapRef);
    return () => ctx.revert();
  }, []);

  const rows = [
    { key: "CLIENT", val: project.client || "—" },
    { key: "ROLE", val: project.role || "—" },
    { key: "YEAR", val: project.year || "—" },
    { key: "STATUS", val: project.url ? "Live ↗" : "In Development" },
  ];

  return (
    <div
      ref={wrapRef}
      style={{ marginBottom: 0, borderBottom: "1px solid rgba(42,48,24,0.1)" }}
    >
      {/* ── thin top label bar ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px clamp(20px,4vw,56px)",
          borderBottom: "1px solid rgba(42,48,24,0.08)",
          background: "#eee9d8",
        }}
      >
        <span
          style={{
            fontFamily: "'Space Mono',monospace",
            fontSize: 9,
            letterSpacing: "0.4em",
            color: "rgba(42,48,24,0.35)",
          }}
        >
          {String(index + 1).padStart(2, "0")} / PROJECT
        </span>
        <span
          style={{
            fontFamily: "'Space Mono',monospace",
            fontSize: 9,
            letterSpacing: "0.3em",
            color: accent,
            opacity: 0.85,
          }}
        >
          {project.stack}
        </span>
      </div>

      {/* scan-line */}
      <div
        ref={scanRef}
        style={{
          height: 2,
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          transformOrigin: "left",
        }}
      />

      {/* ── MAIN CARD GRID ── */}
      <div
        className="pcard-grid"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          minHeight: "clamp(380px,45vw,520px)",
          background: "#f5f0e4",
        }}
      >
        {/* ── IMAGE PANEL ── */}
        <div
          className="pcard-img-col"
          style={{
            order: isEven ? 0 : 1,
            position: "relative",
            overflow: "hidden",
            background: project.color || "#1c2410",
          }}
        >
          {/*
           * imgParaRef wraps the image and provides parallax.
           * inset: 0 keeps it flush — no extra "-10%" top overflow.
           * The parallax yPercent: -10 supplies subtle movement without
           * the image ever showing gaps.
           */}
          <div
            ref={imgParaRef}
            style={{
              position: "absolute",
              // ← oversized so parallax travel never exposes a gap
              top: "-10%",
              left: 0,
              right: 0,
              bottom: "-10%",
              willChange: "transform",
            }}
          >
            {hasHover ? (
              /*
               * HoverEffect renders its own <canvas> here.
               * width/height 100% + display:block makes the canvas
               * fill the parent and removes the inline-block gap.
               * object-fit is applied via the canvas style override below.
               */
              <div
                ref={imgRef}
                className="pcard-hover-canvas"
                style={{ width: "100%", height: "100%", cursor: "crosshair" }}
              />
            ) : project.image ? (
              <img
                src={project.image}
                alt={project.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover", // ← fills box, no stretch
                  objectPosition: "center",
                  display: "block",
                  transition: "transform 0.7s cubic-bezier(0.16,1,0.3,1)",
                  transform: hovered ? "scale(1.05)" : "scale(1)",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: `linear-gradient(145deg,${project.color || "#1c2410"},#0a0f05)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontSize: 10,
                    color: "rgba(245,240,228,0.1)",
                    letterSpacing: "0.3em",
                  }}
                >
                  NO IMAGE
                </span>
              </div>
            )}
          </div>

          {/* overlay tint — slightly stronger for better contrast */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(145deg, ${project.color}bb, #0a0f05bb)`,
              opacity: 0.55,
              pointerEvents: "none",
            }}
          />

          {/* ghost index number — much more visible */}
          <div
            style={{
              position: "absolute",
              bottom: -16,
              left: 16,
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: "clamp(6rem,12vw,10rem)",
              // ↓ Brighter base + vivid accent on hover
              color: hovered ? `${accent}55` : "rgba(245,240,228,0.18)",
              lineHeight: 1,
              userSelect: "none",
              transition: "color 0.4s",
              // text-shadow adds readable contrast against any bg
              textShadow: "0 2px 24px rgba(0,0,0,0.55)",
              zIndex: 2,
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </div>

          {/* hover bottom bar */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 3,
              background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.4s",
            }}
          />
        </div>

        {/* ── INFO PANEL ── */}
        <div
          ref={infoRef}
          className="pcard-info-col"
          style={{
            order: isEven ? 1 : 0,
            padding: "clamp(32px,4vw,60px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            borderLeft: isEven ? "1px solid rgba(42,48,24,0.1)" : "none",
            borderRight: isEven ? "none" : "1px solid rgba(42,48,24,0.1)",
            background: "#f5f0e4",
          }}
        >
          <div>
            {/* accent dot + label */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 20,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: accent,
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: "'Space Mono',monospace",
                  fontSize: 9,
                  letterSpacing: "0.35em",
                  color: "rgba(42,48,24,0.55)",
                }}
              >
                {project.role?.toUpperCase() || "ENGINEER"}
              </span>
            </div>

            {/* title */}
            <div style={{ overflow: "hidden", marginBottom: 10 }}>
              <h3
                ref={titleRef}
                style={{
                  fontFamily: "'Bebas Neue',sans-serif",
                  fontSize: "clamp(2.2rem,4.5vw,4.5rem)",
                  // ↓ full opacity — was #1c2410 before, kept same
                  color: "#1c2410",
                  lineHeight: 0.95,
                  letterSpacing: "0.02em",
                  margin: 0,
                }}
              >
                {project.title}
              </h3>
            </div>

            {/* accent line */}
            <div
              style={{
                width: 40,
                height: 2,
                background: accent,
                marginBottom: 20,
              }}
            />

            {/* description — higher contrast */}
            <p
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: "clamp(13px,1.3vw,15px)",
                // ↓ 0.75 instead of 0.6 — noticeably more legible
                color: "rgba(42,48,24,0.75)",
                lineHeight: 1.8,
                marginBottom: 28,
                maxWidth: 400,
              }}
            >
              {project.description ||
                "A production-grade application built with modern technologies."}
            </p>

            {/* tags */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 32,
              }}
            >
              {(project.tags || []).slice(0, 4).map((t) => (
                <span
                  key={t}
                  className={`ptag-${project.id}`}
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontSize: 9,
                    letterSpacing: "0.18em",
                    // ↓ 0.7 instead of 0.5
                    color: "rgba(42,48,24,0.7)",
                    padding: "5px 12px",
                    border: "1px solid rgba(42,48,24,0.25)",
                    borderRadius: 100,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* data rows */}
          <div>
            {rows.map((r, ri) => (
              <div
                key={r.key}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 0",
                  position: "relative",
                  borderBottom:
                    ri < rows.length - 1
                      ? "1px solid rgba(42,48,24,0.08)"
                      : "none",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontSize: 9,
                    letterSpacing: "0.3em",
                    color: "rgba(42,48,24,0.45)",
                  }}
                >
                  {r.key}
                </span>
                <span
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    color: r.key === "STATUS" ? accent : "#1c2410",
                  }}
                >
                  {r.key === "STATUS" && (
                    <span
                      style={{
                        display: "inline-block",
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: accent,
                        marginRight: 8,
                      }}
                    />
                  )}
                  {r.val}
                </span>
              </div>
            ))}

            {/* links */}
            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 24,
                flexWrap: "wrap",
              }}
            >
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    color: "#1c2410",
                    padding: "10px 22px",
                    border: "1px solid rgba(42,48,24,0.25)",
                    borderRadius: 100,
                    textDecoration: "none",
                    transition: "background 0.2s, border-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = accent;
                    e.target.style.borderColor = accent;
                    e.target.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "transparent";
                    e.target.style.borderColor = "rgba(42,48,24,0.25)";
                    e.target.style.color = "#1c2410";
                  }}
                >
                  VISIT ↗
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    color: "rgba(42,48,24,0.5)",
                    padding: "10px 22px",
                    border: "1px solid rgba(42,48,24,0.15)",
                    borderRadius: 100,
                    textDecoration: "none",
                    transition: "color 0.2s, border-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "#1c2410";
                    e.target.style.borderColor = "rgba(42,48,24,0.35)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "rgba(42,48,24,0.4)";
                    e.target.style.borderColor = "rgba(42,48,24,0.12)";
                  }}
                >
                  GITHUB ↗
                </a>
              )}
              {!project.url && !project.githubUrl && (
                <span
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontSize: 9,
                    letterSpacing: "0.25em",
                    color: "rgba(42,48,24,0.3)",
                  }}
                >
                  COMING SOON
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SECTION ──────────────────────────────────────────────────────────────────
export function ProjectsSection() {
  const secRef = useRef();
  const labelRef = useRef();
  const headingRef = useRef();

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

      if (headingRef.current) {
        const split = new SplitType(headingRef.current, { types: "lines" });
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
              trigger: headingRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      gsap.fromTo(
        ".proj-sec-sub",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: secRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        },
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="projects"
      ref={secRef}
      style={{ background: "#f5f0e4", position: "relative" }}
    >
      <div style={{ height: 1, background: "rgba(42,48,24,0.1)" }} />

      {/* ── HEADER ── */}
      <div
        style={{
          padding:
            "clamp(48px,8vh,96px) clamp(20px,6vw,72px) clamp(32px,5vh,64px)",
        }}
      >
        <span
          ref={labelRef}
          className="mono"
          style={{
            fontFamily: "'Space Mono',monospace",
            fontSize: 20,
            letterSpacing: "0.1em",
            color: "rgba(42,48,24,0.45)",
            display: "inline-block",
            marginBottom: "0.5rem",
          }}
        >
          02 / Projects
        </span>

        <div style={{ overflow: "hidden", marginBottom: 20 }}>
          <h2
            ref={headingRef}
            style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: "clamp(2.5rem,7vw,7rem)",
              color: "#1c2410",
              lineHeight: 0.95,
              letterSpacing: "0.02em",
              margin: 0,
            }}
          >
            SELECTED <span style={{ color: "#4a6020" }}>WORK.</span>
          </h2>
        </div>

        <div
          className="proj-sec-sub"
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 24,
            paddingTop: 24,
            borderTop: "1px solid rgba(42,48,24,0.1)",
          }}
        >
          <p
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: "clamp(13px,1.3vw,15px)",
              color: "rgba(42,48,24,0.65)",
              lineHeight: 1.75,
              maxWidth: 440,
              margin: 0,
            }}
          >
            End-to-end products built for real businesses — fintech platforms,
            brand identities, e-commerce ecosystems. Each one shipped and owned.
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 4,
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: "clamp(2rem,4vw,3.5rem)",
                color: "#1c2410",
                lineHeight: 1,
              }}
            >
              {String(projects.length).padStart(2, "0")}
            </span>
            <span
              style={{
                fontFamily: "'Space Mono',monospace",
                fontSize: 9,
                letterSpacing: "0.3em",
                color: "rgba(42,48,24,0.45)",
              }}
            >
              PROJECTS
            </span>
          </div>
        </div>
      </div>

      {/* ── CARDS ── */}
      <div style={{ borderTop: "1px solid rgba(42,48,24,0.1)" }}>
        {projects.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} />
        ))}
      </div>

      {/* ── BOTTOM QUOTE STRIP ── */}
      <div
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
          style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: "clamp(1.2rem,3.5vw,3rem)",
            color: "#f5f0e4",
            letterSpacing: "0.04em",
            maxWidth: 700,
            lineHeight: 1.15,
            margin: 0,
          }}
        >
          MORE WORK AVAILABLE ON REQUEST.
        </p>
        <a
          href="https://github.com/jamesking77-create/"
          target="_blank"
          rel="noreferrer"
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
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: ".04em",
            textDecoration: "none",
            flexShrink: 0,
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#bcd470")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#a8c060")}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#1c2410",
            }}
          />
          View GitHub
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#1c2410",
            }}
          />
        </a>
      </div>

      {/* ── RESPONSIVE ── */}
      <style>{`
        /* Force HoverEffect canvas to fill its oversized parallax wrapper */
        .pcard-hover-canvas,
        .pcard-hover-canvas canvas {
          width: 100% !important;
          height: 100% !important;
          display: block;
          object-fit: cover !important;
        }

        @media (max-width: 700px) {
          .pcard-grid {
            grid-template-columns: 1fr !important;
          }
          .pcard-img-col {
            order: 0 !important;
            height: 300px;
            min-height: 300px;
          }
          /* Reset inset so image fills the fixed-height mobile cell */
          /* On mobile reset oversized wrapper to flush fill the fixed-height cell */
          .pcard-img-col > div:first-child {
            top: 0 !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
          }
          .pcard-info-col {
            order: 1 !important;
            border-left: none !important;
            border-right: none !important;
            border-top: 1px solid rgba(42,48,24,0.1) !important;
            padding: 28px 20px !important;
          }
        }
      `}</style>
    </section>
  );
}

export default ProjectsSection;
