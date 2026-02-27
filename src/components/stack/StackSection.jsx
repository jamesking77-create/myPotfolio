// src/components/stack/StackSection.jsx
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import uiimage from "../../assets/woman.png";

gsap.registerPlugin(ScrollTrigger);

const stackGroups = [
  {
    label: "Frontend",
    color: "#4a6020",
    items: [
      {
        name: "React",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
      },
      {
        name: "Next.js",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
      },
      {
        name: "TypeScript",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
      },
      {
        name: "Tailwind",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
      },
      {
        name: "Three.js",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg",
      },
      {
        name: "Framer",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/framermotion/framermotion-original.svg",
      },
    ],
  },
  {
    label: "Backend",
    color: "#2a5040",
    items: [
      {
        name: "Node.js",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
      },
      {
        name: "Express",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
      },
      {
        name: "PostgreSQL",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
      },
      {
        name: "MongoDB",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
      },
      {
        name: "Redis",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",
      },
      {
        name: "GraphQL",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg",
      },
    ],
  },
  {
    label: "Tools & Cloud",
    color: "#3a3020",
    items: [
      {
        name: "Git",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
      },
      {
        name: "Docker",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
      },
      {
        name: "AWS",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg",
      },
      {
        name: "Figma",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
      },
      {
        name: "VS Code",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
      },
      {
        name: "Vercel",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg",
      },
    ],
  },
];

const featureCards = [
  {
    img: uiimage,
    tag: "Frontend",
    title: "INTERFACES THAT FEEL ALIVE",
    body: "React, Three.js, Framer Motion — building UI that responds, animates, and delights at every interaction.",
  },
  {
    img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
    tag: "Backend",
    title: "SYSTEMS BUILT TO SCALE",
    body: "Node, PostgreSQL, Redis — architecting backend infrastructure that handles real production load.",
  },
  {
    img: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800&q=80",
    tag: "Tooling",
    title: "SHIPPED WITH PRECISION",
    body: "Docker, AWS, CI/CD — deploying with confidence using modern DevOps practices.",
  },
];

function FeatureCard({ card, index }) {
  const [hovered, setHovered] = useState(false);
  const imgEl = useRef();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{
        duration: 0.8,
        delay: index * 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        borderRadius: 8,
        overflow: "hidden",
        background: "#1a2410",
        minHeight: "clamp(380px,45vw,520px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        cursor: "default",
        boxShadow: hovered
          ? "0 32px 80px rgba(0,0,0,0.6)"
          : "0 8px 32px rgba(0,0,0,0.3)",
        transition: "box-shadow 0.4s",
      }}
    >
      {/* image */}
      <img
        ref={imgEl}
        src={card.img}
        alt={card.title}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          transform: hovered ? "scale(1.06)" : "scale(1)",
          transition: "transform 0.7s cubic-bezier(0.16,1,0.3,1)",
        }}
      />

      {/* gradient overlay — deepens on hover */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: hovered
            ? "linear-gradient(0deg,rgba(20,26,12,0.97) 0%,rgba(20,26,12,0.5) 55%,rgba(20,26,12,0.15) 100%)"
            : "linear-gradient(0deg,rgba(20,26,12,0.92) 0%,rgba(20,26,12,0.3) 55%,transparent 100%)",
          transition: "background 0.4s",
        }}
      />

      {/* Animated corner accent */}
      <div
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          width: hovered ? 48 : 24,
          height: hovered ? 48 : 24,
          borderTop: "1.5px solid rgba(168,192,96,0.6)",
          borderRight: "1.5px solid rgba(168,192,96,0.6)",
          borderRadius: "0 4px 0 0",
          transition: "width 0.4s, height 0.4s",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: 16,
          width: hovered ? 48 : 24,
          height: hovered ? 48 : 24,
          borderBottom: "1.5px solid rgba(168,192,96,0.3)",
          borderLeft: "1.5px solid rgba(168,192,96,0.3)",
          borderRadius: "0 0 0 4px",
          transition: "width 0.4s, height 0.4s",
          zIndex: 3,
        }}
      />

      {/* content card */}
      <motion.div
        animate={{ y: hovered ? -6 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "relative",
          zIndex: 2,
          margin: 20,
          background: "#f5f0e4",
          borderRadius: 4,
          padding: "24px 28px",
        }}
      >
        <div
          style={{
            fontFamily: "'Space Mono',monospace",
            fontSize: 9,
            letterSpacing: "0.4em",
            color: "rgba(42,48,24,0.4)",
            marginBottom: 12,
          }}
        >
          {card.tag.toUpperCase()}
        </div>
        <h3
          style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: "clamp(1.4rem,2.5vw,2rem)",
            color: "#1c2410",
            letterSpacing: "0.04em",
            lineHeight: 1.05,
            marginBottom: 14,
          }}
        >
          {card.title}
        </h3>
        <p
          style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 13,
            color: "rgba(42,48,24,0.6)",
            lineHeight: 1.7,
          }}
        >
          {card.body}
        </p>

        {/* Hover arrow */}
        <div
          style={{
            marginTop: 16,
            display: "flex",
            alignItems: "center",
            gap: 8,
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateX(0)" : "translateX(-8px)",
            transition: "opacity 0.3s, transform 0.3s",
          }}
        >
          <div
            style={{
              width: 24,
              height: 1,
              background: "#4a6020",
              transition: "width 0.3s",
            }}
          />
          <span
            style={{
              fontFamily: "'Space Mono',monospace",
              fontSize: 9,
              letterSpacing: "0.2em",
              color: "#4a6020",
            }}
          >
            EXPLORE
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

function LogoPill({ item, groupColor, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.45,
        delay: index * 0.04,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        padding: "24px 20px",
        background: hovered ? groupColor + "0a" : "#fff",
        border: hovered
          ? `1px solid ${groupColor}40`
          : "1px solid rgba(42,48,24,0.08)",
        borderRadius: 8,
        cursor: "default",
        boxShadow: hovered ? `0 8px 32px ${groupColor}20` : "none",
        transform: hovered
          ? "translateY(-5px) scale(1.04)"
          : "translateY(0) scale(1)",
        transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <img
        src={item.icon}
        alt={item.name}
        style={{
          width: 36,
          height: 36,
          objectFit: "contain",
          filter: hovered ? "none" : "grayscale(0)",
          transform: hovered
            ? "rotate(-5deg) scale(1.1)"
            : "rotate(0) scale(1)",
          transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1)",
        }}
        onError={(e) => {
          e.target.style.display = "none";
          e.target.nextSibling.style.display = "flex";
        }}
      />
      <div
        style={{
          display: "none",
          width: 36,
          height: 36,
          alignItems: "center",
          justifyContent: "center",
          background: groupColor + "20",
          borderRadius: 8,
        }}
      >
        <span
          style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: 14,
            color: groupColor,
          }}
        >
          {item.name[0]}
        </span>
      </div>
      <span
        style={{
          fontFamily: "'Space Mono',monospace",
          fontSize: 9,
          letterSpacing: "0.2em",
          color: hovered ? groupColor : "rgba(42,48,24,0.55)",
          textAlign: "center",
          transition: "color 0.25s",
        }}
      >
        {item.name}
      </span>
    </motion.div>
  );
}

export default function StackSection() {
  const secRef = useRef();
  const headerRef = useRef();
  const headingRef = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section label
      gsap.fromTo(
        ".stack-label",
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

      // Heading lines
      gsap.fromTo(
        ".stack-heading-line",
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

      // Paragraph
      gsap.fromTo(
        ".stack-para",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // Group headers stagger
      gsap.fromTo(
        ".stack-group-header",
        { opacity: 0, x: -24 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".stack-logo-grid",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // Divider lines grow
      gsap.fromTo(
        ".stack-group-line",
        { scaleX: 0, transformOrigin: "left" },
        {
          scaleX: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".stack-logo-grid",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, secRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="stack"
      ref={secRef}
      style={{ background: "#1c2410", position: "relative" }}
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

      {/* ── PART 1 — dark header ── */}
      <div
        ref={headerRef}
        style={{ padding: "clamp(80px,10vh,120px) clamp(24px,6vw,72px) 64px" }}
      >
        <div
          className="stack-label"
          style={{
            fontFamily: "'Space Mono',monospace",
            fontSize: 10,
            letterSpacing: "0.4em",
            color: "rgba(245,240,228,0.25)",
            marginBottom: 20,
          }}
        >
          03 / Stack
        </div>
        <h2
          ref={headingRef}
          style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: "clamp(3rem,7vw,7rem)",
            color: "#f5f0e4",
            letterSpacing: "0.03em",
            lineHeight: 0.95,
            marginBottom: 24,
            overflow: "hidden",
          }}
        >
          <div
            className="stack-heading-line"
            style={{ display: "block", overflow: "hidden" }}
          >
            TOOLS OF
          </div>
          <div
            className="stack-heading-line"
            style={{ display: "block", overflow: "hidden" }}
          >
            <span style={{ color: "#a8c060" }}>THE TRADE.</span>
          </div>
        </h2>
        <p
          className="stack-para"
          style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 15,
            color: "rgba(245,240,228,0.45)",
            maxWidth: 480,
            lineHeight: 1.75,
          }}
        >
          Technologies I work with daily to ship production-grade software —
          from pixel-perfect interfaces to scalable backend systems.
        </p>
      </div>

      {/* ── PART 2 — Feature cards ── */}
      <div
        style={{
          padding: "0 clamp(24px,6vw,72px) 80px",
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 16,
        }}
      >
        {featureCards.map((c, i) => (
          <FeatureCard key={i} card={c} index={i} />
        ))}
      </div>

      {/* ── PART 3 — Light cream logo grid ── */}
      <div
        className="stack-logo-grid"
        style={{
          background: "#f5f0e4",
          borderTop: "1px solid rgba(42,48,24,0.08)",
        }}
      >
        <div style={{ padding: "clamp(64px,8vh,100px) clamp(24px,6vw,72px)" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 64,
              flexWrap: "wrap",
              gap: 20,
            }}
          >
            <motion.h3
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: "clamp(2rem,4vw,3.5rem)",
                color: "#1c2410",
                letterSpacing: "0.03em",
                lineHeight: 1,
              }}
            >
              EVERY TOOL,
              <br />
              <span style={{ color: "#4a6020" }}>EVERY LAYER.</span>
            </motion.h3>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 14,
                color: "rgba(42,48,24,0.5)",
                maxWidth: 320,
                lineHeight: 1.7,
              }}
            >
              The full picture — from UI components to cloud infrastructure.
            </motion.p>
          </div>

          {stackGroups.map((group, gi) => (
            <div
              key={group.label}
              style={{ marginBottom: gi < stackGroups.length - 1 ? 56 : 0 }}
            >
              <div
                className="stack-group-header"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 24,
                }}
              >
                <motion.div
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: gi * 0.5,
                  }}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: group.color,
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontSize: 10,
                    letterSpacing: "0.35em",
                    color: group.color,
                  }}
                >
                  {group.label.toUpperCase()}
                </span>
                <div
                  className="stack-group-line"
                  style={{ flex: 1, height: 1, background: group.color + "25" }}
                />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill,minmax(110px,1fr))",
                  gap: 10,
                }}
              >
                {group.items.map((item, ii) => (
                  <LogoPill
                    key={item.name}
                    item={item}
                    groupColor={group.color}
                    index={ii + gi * 6}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
