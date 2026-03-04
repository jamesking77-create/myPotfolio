// src/components/stack/StackSection.jsx
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
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
      // touch toggle for mobile
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setTimeout(() => setHovered(false), 600)}
      style={{
        position: "relative",
        borderRadius: 8,
        overflow: "hidden",
        background: "#1a2410",
        // on mobile cards are full-width and shorter; desktop uses clamp
        minHeight: "clamp(300px,40vw,520px)",
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
        src={card.img}
        alt={card.title}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          display: "block",
          transform: hovered ? "scale(1.06)" : "scale(1)",
          transition: "transform 0.7s cubic-bezier(0.16,1,0.3,1)",
        }}
      />

      {/* gradient overlay */}
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

      {/* corner accents */}
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
          margin: "clamp(12px,3vw,20px)",
          background: "#f5f0e4",
          borderRadius: 4,
          padding: "clamp(16px,3vw,24px) clamp(16px,3vw,28px)",
        }}
      >
        <div
          style={{
            fontFamily: "'Space Mono',monospace",
            fontSize: 9,
            letterSpacing: "0.4em",
            color: "rgba(42,48,24,0.4)",
            marginBottom: 10,
          }}
        >
          {card.tag.toUpperCase()}
        </div>
        <h3
          style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: "clamp(1.2rem,2.5vw,2rem)",
            color: "#1c2410",
            letterSpacing: "0.04em",
            lineHeight: 1.05,
            marginBottom: 12,
          }}
        >
          {card.title}
        </h3>
        <p
          style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: "clamp(12px,1.3vw,13px)",
            color: "rgba(42,48,24,0.65)",
            lineHeight: 1.7,
          }}
        >
          {card.body}
        </p>
        <div
          style={{
            marginTop: 14,
            display: "flex",
            alignItems: "center",
            gap: 8,
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateX(0)" : "translateX(-8px)",
            transition: "opacity 0.3s, transform 0.3s",
          }}
        >
          <div style={{ width: 24, height: 1, background: "#4a6020" }} />
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
        gap: 8,
        padding: "clamp(14px,2vw,24px) clamp(10px,1.5vw,20px)",
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
          width: "clamp(28px,3vw,36px)",
          height: "clamp(28px,3vw,36px)",
          objectFit: "contain",
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
          fontSize: "clamp(7px,0.9vw,9px)",
          letterSpacing: "0.18em",
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

  useEffect(() => {
    const ctx = gsap.context(() => {
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
        style={{
          padding:
            "clamp(60px,10vh,120px) clamp(20px,6vw,72px) clamp(40px,6vh,64px)",
        }}
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
            fontSize: "clamp(13px,1.4vw,15px)",
            color: "rgba(245,240,228,0.5)",
            maxWidth: 480,
            lineHeight: 1.75,
          }}
        >
          Technologies I work with daily to ship production-grade software —
          from pixel-perfect interfaces to scalable backend systems.
        </p>
      </div>

      {/* ── PART 2 — Feature cards ── */}
      <div style={{ padding: "0 clamp(20px,6vw,72px) clamp(48px,8vh,80px)" }}>
        {/* 3 cols on desktop → 1 col on mobile */}
        <div className="stack-feature-grid">
          {featureCards.map((c, i) => (
            <FeatureCard key={i} card={c} index={i} />
          ))}
        </div>
      </div>

      {/* ── PART 3 — Light cream logo grid ── */}
      <div
        className="stack-logo-grid"
        style={{
          background: "#f5f0e4",
          borderTop: "1px solid rgba(42,48,24,0.08)",
        }}
      >
        <div style={{ padding: "clamp(48px,8vh,100px) clamp(20px,6vw,72px)" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "clamp(36px,6vh,64px)",
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
                fontSize: "clamp(12px,1.3vw,14px)",
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
              style={{
                marginBottom:
                  gi < stackGroups.length - 1 ? "clamp(36px,6vh,56px)" : 0,
              }}
            >
              <div
                className="stack-group-header"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 20,
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
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontSize: 10,
                    letterSpacing: "0.35em",
                    color: group.color,
                    whiteSpace: "nowrap",
                  }}
                >
                  {group.label.toUpperCase()}
                </span>
                <div
                  className="stack-group-line"
                  style={{ flex: 1, height: 1, background: group.color + "25" }}
                />
              </div>
              {/* pills: 3 cols on mobile, auto-fill on desktop */}
              <div className="stack-pill-grid">
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

      {/* ── RESPONSIVE STYLES ── */}
      <style>{`
        /* Feature cards: 3 col → 1 col */
        .stack-feature-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        /* Logo pills: auto-fill on desktop, 3 cols on mobile */
        .stack-pill-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
          gap: 10px;
        }

        @media (max-width: 900px) {
          .stack-feature-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 600px) {
          .stack-feature-grid {
            grid-template-columns: 1fr;
          }
          /* tighter pill grid on small screens */
          .stack-pill-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
          }
        }
      `}</style>
    </section>
  );
}
