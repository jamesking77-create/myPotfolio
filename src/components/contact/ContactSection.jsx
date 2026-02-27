// src/components/contact/ContactSection.jsx
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const socialLinks = [
  ["GitHub", "https://github.com/jamesking77-create/"],
  ["LinkedIn", "https://www.linkedin.com/in/jamesasuelimen77/"],
  ["Email", "mailto:james@example.com"],
];

export function ContactSection() {
  const secRef = useRef();
  const hRef = useRef();
  const glowRef = useRef();
  const [ctaHover, setCtaHover] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Magnetic CTA
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 180, damping: 18 });
  const springY = useSpring(my, { stiffness: 180, damping: 18 });

  useEffect(() => {
    // Track mouse for ambient glow
    const onMouseMove = (e) => {
      const rect = secRef.current?.getBoundingClientRect();
      if (!rect) return;
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };
    secRef.current?.addEventListener("mousemove", onMouseMove);

    const ctx = gsap.context(() => {
      // Section label
      gsap.fromTo(
        ".contact-label",
        { opacity: 0, y: -16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: secRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // Main heading — scale from center
      gsap.fromTo(
        hRef.current,
        { scale: 0.65, opacity: 0, y: 40 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          ease: "power3.out",
          scrollTrigger: {
            trigger: secRef.current,
            start: "top 70%",
            end: "top 20%",
            scrub: 1.4,
          },
        },
      );

      // Glow pulse loop
      gsap.to(glowRef.current, {
        scale: 1.3,
        opacity: 0.5,
        duration: 2.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // CTA button entrance
      gsap.fromTo(
        ".contact-cta",
        { opacity: 0, y: 30, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.6)",
          scrollTrigger: {
            trigger: secRef.current,
            start: "top 55%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // Social links stagger
      gsap.fromTo(
        ".contact-social-link",
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".contact-socials",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // Footer text stagger
      gsap.fromTo(
        ".contact-footer-text",
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.5,
          stagger: 0.12,
          ease: "none",
          scrollTrigger: {
            trigger: ".contact-footer",
            start: "top 95%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // Heading lines — word by word on scroll
      gsap.fromTo(
        ".contact-word",
        { y: "110%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          duration: 0.8,
          stagger: 0.06,
          ease: "power4.out",
          scrollTrigger: {
            trigger: hRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, secRef);

    return () => {
      ctx.revert();
      secRef.current?.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  const handleMagnet = (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    mx.set((e.clientX - rect.left - rect.width / 2) * 0.35);
    my.set((e.clientY - rect.top - rect.height / 2) * 0.35);
  };
  const resetMagnet = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <section
      id="contact"
      ref={secRef}
      style={{
        minHeight: "100vh",
        background: "#141a0c",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(80px,12vh,130px) clamp(24px,6vw,72px)",
        position: "relative",
        textAlign: "center",
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

      {/* Mouse-tracking ambient glow */}
      <div
        style={{
          position: "absolute",
          top: mousePos.y - 300,
          left: mousePos.x - 300,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(168,192,96,0.07) 0%,transparent 65%)",
          pointerEvents: "none",
          transition: "top 0.8s ease, left 0.8s ease",
        }}
      />

      {/* Static center glow (pulsing) */}
      <div
        ref={glowRef}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(168,192,96,0.05) 0%,transparent 60%)",
          pointerEvents: "none",
        }}
      />

      {/* Decorative concentric rings */}
      {[300, 500, 700].map((size, i) => (
        <motion.div
          key={size}
          animate={{ scale: [1, 1.05, 1], opacity: [0.03, 0.06, 0.03] }}
          transition={{ duration: 4 + i, repeat: Infinity, delay: i * 1.2 }}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: size,
            height: size,
            borderRadius: "50%",
            border: "1px solid rgba(168,192,96,0.08)",
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Section label */}
      <div
        className="contact-label"
        style={{
          fontFamily: "'Space Mono',monospace",
          fontSize: 10,
          letterSpacing: "0.4em",
          color: "rgba(245,240,228,0.25)",
          marginBottom: 48,
          position: "relative",
          zIndex: 1,
        }}
      >
        05 / Contact
      </div>

      {/* Main heading */}
      <div
        ref={hRef}
        style={{
          marginBottom: 40,
          willChange: "transform,opacity",
          position: "relative",
          zIndex: 1,
        }}
      >
        <h2
          style={{
            fontFamily: "'Cabinet Grotesk',sans-serif",
            fontSize: "clamp(3.5rem,9vw,8rem)",
            color: "#f5f0e4",
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: "-0.04em",
            marginBottom: 32,
            overflow: "hidden",
          }}
        >
          {["Let's", "build", "something"].map((word, wi) => (
            <span key={wi} style={{ display: "block", overflow: "hidden" }}>
              <span
                className="contact-word"
                style={{ display: "inline-block" }}
              >
                {wi === 2 ? <>{word} </> : word}
              </span>
            </span>
          ))}
          <span style={{ display: "block", overflow: "hidden" }}>
            <span
              className="contact-word"
              style={{
                display: "inline-block",
                color: "#a8c060",
                fontStyle: "italic",
              }}
            >
              great.
            </span>
          </span>
        </h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 16,
            color: "rgba(245,240,228,0.45)",
            maxWidth: 440,
            margin: "0 auto",
            lineHeight: 1.75,
          }}
        >
          Have a project in mind? Looking for a collaborator? My inbox is always
          open.
        </motion.p>
      </div>

      {/* CTA button — magnetic */}
      <motion.a
        href="mailto:james@example.com"
        className="contact-cta"
        onMouseMove={handleMagnet}
        onMouseLeave={() => {
          resetMagnet();
          setCtaHover(false);
        }}
        onMouseEnter={() => setCtaHover(true)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          padding: "16px 40px",
          borderRadius: 100,
          background: ctaHover ? "#bcd470" : "#a8c060",
          border: "1px solid #a8c060",
          color: "#1c2410",
          fontFamily: "'Cabinet Grotesk',sans-serif",
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: ".02em",
          textDecoration: "none",
          marginBottom: 56,
          x: springX,
          y: springY,
          position: "relative",
          zIndex: 1,
          overflow: "hidden",
          transition: "background 0.3s",
        }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
      >
        {/* Shimmer sweep */}
        <motion.div
          animate={ctaHover ? { x: ["−100%", "200%"] } : { x: "-100%" }}
          transition={{ duration: 0.6, ease: "linear" }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "50%",
            height: "100%",
            background:
              "linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)",
            pointerEvents: "none",
          }}
        />
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#1c2410",
            flexShrink: 0,
          }}
        />
        Get in touch
        <motion.span
          animate={{ rotate: ctaHover ? 360 : 0 }}
          transition={{ duration: 0.5 }}
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#1c2410",
            flexShrink: 0,
            display: "block",
          }}
        />
      </motion.a>

      {/* Social links */}
      <div
        className="contact-socials"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "clamp(20px,4vw,48px)",
          marginBottom: 80,
          position: "relative",
          zIndex: 1,
        }}
      >
        {socialLinks.map(([l, h], i) => (
          <SocialLink key={l} label={l} href={h} />
        ))}
      </div>

      {/* Footer */}
      <div
        className="contact-footer"
        style={{
          position: "absolute",
          bottom: 28,
          left: "clamp(24px,6vw,72px)",
          right: "clamp(24px,6vw,72px)",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        {[
          "© 2026 JAMES ASUELIMEN",
          "BUILT WITH REACT + GSAP + THREE.JS",
          "LAGOS, NIGERIA",
        ].map((t) => (
          <span
            key={t}
            className="contact-footer-text"
            style={{
              fontFamily: "'Space Mono',monospace",
              fontSize: 9,
              color: "rgba(245,240,228,0.15)",
              letterSpacing: "0.3em",
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </section>
  );
}

function SocialLink({ label, href }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="contact-social-link"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "'Space Mono',monospace",
        fontSize: 10,
        color: hovered ? "#a8c060" : "rgba(245,240,228,0.25)",
        letterSpacing: "0.3em",
        textDecoration: "none",
        transition: "color 0.25s",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        position: "relative",
      }}
    >
      <motion.span
        animate={{ x: hovered ? 2 : 0, y: hovered ? -2 : 0 }}
        transition={{ duration: 0.25 }}
      >
        ↗
      </motion.span>
      {label.toUpperCase()}
      {/* Underline */}
      <span
        style={{
          position: "absolute",
          bottom: -2,
          left: 0,
          height: 1,
          width: hovered ? "100%" : "0%",
          background: "#a8c060",
          transition: "width 0.3s ease",
        }}
      />
    </motion.a>
  );
}

export default ContactSection;
