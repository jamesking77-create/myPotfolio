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
  const [hovered, setHovered] = useState(false);
  const accent = ACCENTS[project.id] || "#a8c060";
  const hasHover =
    project.image && project.logoImage && project.displacementImage;
  const isEven = index % 2 === 0; // alternates image left / right

  // HoverEffect (untouched)
  useEffect(() => {
    const el = imgRef.current;
    if (!el || !hasHover) return;
    new HoverEffect({
      parent: el,
      intensity: 0.3,
      image1: project.image,
      image2: project.logoImage,
      displacementImage: project.displacementImage,
      imagesRatio: 1,
      ease: "power2.out",
      speed: 1.6,
    });
    return () => {
      if (el) el.innerHTML = "";
    };
  }, [project]);

  // GSAP scroll reveal
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      // card clips in from bottom
      tl.fromTo(
        wrapRef.current,
        { clipPath: "inset(100% 0 0 0)" },
        { clipPath: "inset(0% 0 0 0)", duration: 1.1, ease: "power4.inOut" },
        0,
      );

      // scan-line sweeps
      tl.fromTo(
        scanRef.current,
        { scaleX: 0, transformOrigin: "left" },
        { scaleX: 1, duration: 0.9, ease: "power3.inOut" },
        0.3,
      );

      // image parallax wrapper
      tl.fromTo(
        imgParaRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
        0.25,
      );

      // info panel
      tl.fromTo(
        infoRef.current,
        { y: 36, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85, ease: "power3.out" },
        0.4,
      );

      // title lines
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

      // tags stagger
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

  // scroll parallax on image
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
          // alternates: even = image left, odd = image right
          gridTemplateColumns: isEven ? "1fr 1fr" : "1fr 1fr",
          minHeight: "clamp(380px,45vw,520px)",
          background: "#f5f0e4",
        }}
      >
        {/* IMAGE PANEL */}
        <div
          className="pcard-img-col"
          style={{
            order: isEven ? 0 : 1,
            position: "relative",
            overflow: "hidden",
            background: project.color || "#1c2410",
          }}
        >
          <div
            ref={imgParaRef}
            style={{
              position: "absolute",
              inset: "-10% 0",
              willChange: "transform",
            }}
          >
            {hasHover ? (
              <div
                ref={imgRef}
                style={{
                  width: "100%",
                  height: "100%",
                  minHeight: "inherit",
                  cursor: "crosshair",
                }}
              />
            ) : project.image ? (
              <img
                src={project.image}
                alt={project.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
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

          {/* overlay tint */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(145deg, ${project.color}99, #0a0f0599)`,
              opacity: 0.5,
              pointerEvents: "none",
            }}
          />

          {/* ghost index number */}
          <div
            style={{
              position: "absolute",
              bottom: -16,
              left: 16,
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: "clamp(6rem,12vw,10rem)",
              color: "rgba(245,240,228,0.04)",
              lineHeight: 1,
              userSelect: "none",
              transition: "color 0.4s",
              ...(hovered ? { color: `${accent}18` } : {}),
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

        {/* INFO PANEL */}
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
          {/* top */}
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
                  color: "rgba(42,48,24,0.4)",
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

            {/* description */}
            <p
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: "clamp(13px,1.3vw,15px)",
                color: "rgba(42,48,24,0.6)",
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
                    color: "rgba(42,48,24,0.5)",
                    padding: "5px 12px",
                    border: "1px solid rgba(42,48,24,0.15)",
                    borderRadius: 100,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* data rows — matches about section style exactly */}
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
                    color: "rgba(42,48,24,0.35)",
                  }}
                >
                  {r.key}
                </span>
                <span
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 13,
                    fontWeight: 500,
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
                    color: "rgba(42,48,24,0.4)",
                    padding: "10px 22px",
                    border: "1px solid rgba(42,48,24,0.12)",
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
                    color: "rgba(42,48,24,0.25)",
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
      // label
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

      // heading split
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

      // sub elements
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
      {/* top hairline */}
      <div style={{ height: 1, background: "rgba(42,48,24,0.1)" }} />

      {/* ── HEADER ── same padding/structure as About ── */}
      <div
        style={{
          padding:
            "clamp(48px,8vh,96px) clamp(20px,6vw,72px) clamp(32px,5vh,64px)",
        }}
      >
        {/* label */}
        <span
          ref={labelRef}
          className="mono"
          style={{
            fontFamily: "'Space Mono',monospace",
            fontSize: 20,
            letterSpacing: "0.1em",
            color: "rgba(42,48,24,0.35)",
            display: "inline-block",
            marginBottom: "0.5rem",
          }}
        >
          02 / Projects
        </span>

        {/* heading */}
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

        {/* social icons row */}
        <div
          className="proj-sec-sub"
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 32,
          }}
        >
          {[
            {
              label: "GitHub",
              href: "https://github.com/jamesking77-create/",
              svg: (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="22"
                  height="22"
                >
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
              ),
            },
            {
              label: "LinkedIn",
              href: "https://www.linkedin.com/in/jamesasuelimen77/",
              svg: (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="22"
                  height="22"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              ),
            },
            {
              label: "Behance",
              href: "#",
              svg: (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="22"
                  height="22"
                >
                  <path d="M3 6h7.5a3 3 0 0 1 0 6H3V6z" />
                  <path d="M3 12h8.5a3.5 3.5 0 0 1 0 7H3v-7z" />
                  <path d="M15 7h6M15.5 17c0-2.5 1.5-4 3.5-4s3.5 1.5 3.5 4h-7z" />
                  <path d="M22 15.5c0 1.93-1.57 3.5-3.5 3.5S15 17.43 15 15.5" />
                </svg>
              ),
            },
            {
              label: "Dribbble",
              href: "#",
              svg: (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="22"
                  height="22"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32" />
                </svg>
              ),
            },
          ].map(({ label, href, svg }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              title={label}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 48,
                height: 48,
                border: "1.5px solid rgba(42,48,24,0.25)",
                borderRadius: 0,
                color: "rgba(42,48,24,0.5)",
                textDecoration: "none",
                transition: "color 0.2s, border-color 0.2s, background 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#1c2410";
                e.currentTarget.style.borderColor = "#1c2410";
                e.currentTarget.style.background = "rgba(42,48,24,0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(42,48,24,0.5)";
                e.currentTarget.style.borderColor = "rgba(42,48,24,0.25)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              {svg}
            </a>
          ))}
        </div>

        {/* meta row — project count + description */}
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
              color: "rgba(42,48,24,0.55)",
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
                color: "rgba(42,48,24,0.35)",
              }}
            >
              PROJECTS
            </span>
          </div>
        </div>
      </div>

      {/* ── CARDS — full-bleed, no side padding ── */}
      <div style={{ borderTop: "1px solid rgba(42,48,24,0.1)" }}>
        {projects.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} />
        ))}
      </div>

      {/* ── BOTTOM QUOTE STRIP — matches about's dark strip ── */}
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
        @media (max-width: 700px) {
          .pcard-grid {
            grid-template-columns: 1fr !important;
          }
          .pcard-img-col {
            order: 0 !important;
            height: 260px;
            min-height: 260px;
          }
          .pcard-img-col > div {
            inset: 0 !important;
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
