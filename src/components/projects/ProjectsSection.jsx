// src/components/projects/ProjectsSection.jsx
import { useRef, useEffect, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import HoverEffect from "hover-effect";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { projects } from "../../data/projects";

gsap.registerPlugin(ScrollTrigger);

function ProjectCard({ project, index }) {
  const ref = useRef();
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  const imgRef = useRef();
  const cardRef = useRef();
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = imgRef.current;
    if (
      !el ||
      !project.image ||
      !project.logoImage ||
      !project.displacementImage
    )
      return;
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

  // Subtle tilt on mouse move
  const handleMouseMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -6;
    gsap.to(el, {
      rotateY: x,
      rotateX: y,
      transformPerspective: 1000,
      duration: 0.4,
      ease: "power2.out",
    });
  };
  const resetTilt = () => {
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.6,
      ease: "power2.out",
    });
  };

  const hasAll =
    project.image && project.logoImage && project.displacementImage;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1],
        delay: index * 0.05,
      }}
      style={{ width: "100%", marginBottom: "clamp(32px,5vh,64px)" }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={resetTilt}
        onMouseEnter={() => setHovered(true)}
        style={{
          position: "relative",
          background: "#1a2410",
          border: "1px solid rgba(245,240,228,0.08)",
          borderRadius: 12,
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          minHeight: "clamp(340px,45vw,500px)",
          transformStyle: "preserve-3d",
          willChange: "transform",
          transition: "border-color 0.3s, box-shadow 0.3s",
          boxShadow: hovered
            ? "0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(168,192,96,0.15)"
            : "0 8px 32px rgba(0,0,0,0.3)",
        }}
      >
        {/* Animated border glow on hover */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 12,
            border: "1px solid rgba(168,192,96,0)",
            transition: "border-color 0.4s",
            pointerEvents: "none",
            zIndex: 10,
            ...(hovered ? { borderColor: "rgba(168,192,96,0.2)" } : {}),
          }}
        />

        {/* image half */}
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            background: project.color || "#232e15",
          }}
        >
          {hasAll ? (
            <div
              ref={imgRef}
              style={{ width: "100%", height: "100%", cursor: "crosshair" }}
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
                transform: hovered ? "scale(1.06)" : "scale(1)",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                background: `linear-gradient(145deg,${project.color || "#232e15"},#141a0c)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "'Space Mono',monospace",
                  fontSize: 10,
                  color: "rgba(245,240,228,0.15)",
                  letterSpacing: "0.3em",
                }}
              >
                NO IMAGE
              </span>
            </div>
          )}

          {/* Hover overlay tint */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(168,192,96,0.06)",
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.4s",
              pointerEvents: "none",
            }}
          />

          {/* index ghost */}
          <div
            style={{
              position: "absolute",
              bottom: -10,
              right: 16,
              fontFamily: "'Cabinet Grotesk',sans-serif",
              fontSize: "clamp(6rem,10vw,9rem)",
              fontWeight: 900,
              color: "rgba(245,240,228,0.04)",
              lineHeight: 1,
              userSelect: "none",
              letterSpacing: "-0.04em",
              transition: "color 0.3s",
              ...(hovered ? { color: "rgba(168,192,96,0.07)" } : {}),
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </div>
        </div>

        {/* content half */}
        <div
          style={{
            padding: "clamp(32px,4vw,56px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.15 + index * 0.05, duration: 0.6 }}
              style={{
                fontFamily: "'Space Mono',monospace",
                fontSize: 10,
                letterSpacing: "0.4em",
                color: "rgba(245,240,228,0.3)",
                marginBottom: 20,
              }}
            >
              {String(index + 1).padStart(2, "0")} / PROJECT
            </motion.div>

            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + index * 0.05, duration: 0.7 }}
              style={{
                fontFamily: "'Cabinet Grotesk',sans-serif",
                fontSize: "clamp(1.8rem,3.5vw,3rem)",
                color: "#f5f0e4",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                fontWeight: 800,
                marginBottom: 20,
              }}
            >
              {project.title}
            </motion.h3>

            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 + index * 0.05, duration: 0.7 }}
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 14,
                color: "rgba(245,240,228,0.45)",
                lineHeight: 1.75,
                marginBottom: 28,
              }}
            >
              {project.description ||
                "A production-grade application built with modern technologies."}
            </motion.p>

            {/* tags */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.35 + index * 0.05, duration: 0.6 }}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 36,
              }}
            >
              {(
                project.tags ||
                project.stack?.split("·").map((s) => s.trim()) ||
                []
              )
                .slice(0, 4)
                .map((t, ti) => (
                  <motion.span
                    key={t}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.4 + ti * 0.06 }}
                    whileHover={{
                      scale: 1.08,
                      background: "rgba(168,192,96,0.15)",
                    }}
                    style={{
                      fontFamily: "'Space Mono',monospace",
                      fontSize: 9,
                      letterSpacing: "0.2em",
                      color: "#a8c060",
                      padding: "4px 10px",
                      border: "1px solid rgba(168,192,96,0.2)",
                      borderRadius: 100,
                      cursor: "default",
                      transition: "background 0.2s",
                    }}
                  >
                    {t}
                  </motion.span>
                ))}
            </motion.div>
          </div>

          {/* links */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.45 + index * 0.05, duration: 0.6 }}
            style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
          >
            {project.url && (
              <motion.a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -3, background: "rgba(168,192,96,0.12)" }}
                whileTap={{ scale: 0.96 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "11px 22px",
                  borderRadius: 100,
                  border: "1px solid rgba(168,192,96,0.35)",
                  background: "transparent",
                  color: "#a8c060",
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: ".04em",
                  textDecoration: "none",
                  transition: "background 0.3s",
                }}
              >
                Visit site ↗
              </motion.a>
            )}
            {project.githubUrl && (
              <motion.a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                whileHover={{
                  y: -3,
                  color: "#f5f0e4",
                  borderColor: "rgba(245,240,228,0.35)",
                }}
                whileTap={{ scale: 0.96 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "11px 22px",
                  borderRadius: 100,
                  border: "1px solid rgba(245,240,228,0.12)",
                  background: "transparent",
                  color: "rgba(245,240,228,0.4)",
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: ".04em",
                  textDecoration: "none",
                  transition: "all 0.3s",
                }}
              >
                GitHub ↗
              </motion.a>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export function ProjectsSection() {
  const headerRef = useRef();
  const labelRef = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Label slide in
      gsap.fromTo(
        labelRef.current,
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

      // Heading lines stagger
      gsap.fromTo(
        ".projects-heading-line",
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
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="projects"
      style={{
        background: "#141a0c",
        padding: "clamp(80px,12vh,130px) clamp(24px,6vw,72px)",
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
          background: "rgba(245,240,228,0.06)",
        }}
      />

      {/* Background ambient glow */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(168,192,96,0.03) 0%,transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div ref={headerRef}>
        <div
          ref={labelRef}
          style={{
            fontFamily: "'Space Mono',monospace",
            fontSize: 10,
            letterSpacing: "0.4em",
            color: "rgba(245,240,228,0.25)",
            marginBottom: 20,
          }}
        >
          02 / Projects
        </div>
        <h2
          style={{
            fontFamily: "'Cabinet Grotesk',sans-serif",
            fontSize: "clamp(2.5rem,5.5vw,5rem)",
            color: "#f5f0e4",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            marginBottom: 72,
            overflow: "hidden",
          }}
        >
          <div className="projects-heading-line" style={{ display: "block" }}>
            Selected
          </div>
          <div className="projects-heading-line" style={{ display: "block" }}>
            <span style={{ color: "#a8c060", fontStyle: "italic" }}>work.</span>
          </div>
        </h2>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {projects.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}
export default ProjectsSection;
