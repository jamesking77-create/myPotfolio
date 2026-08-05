// src/components/about/AboutSection.jsx
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitType from "split-type";
import ContactPopup from "../contact/ContactPopup";

gsap.registerPlugin(ScrollTrigger);

const FONT = `@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;600;700;800&family=Space+Mono:wght@400;700&display=swap');`;

const stats = [
  { value: "4+", label: "Years of production experience" },
  { value: "15+", label: "Projects shipped" },
  { value: "100%", label: "Remote-ready, globally" },
  { value: "∞", label: "Lines of code written" },
];

const dataRows = [
  { key: "STATUS", val: "Available for work", green: true },
  { key: "SPECIALTY", val: "Full Stack Engineering", green: false },
  {
    key: "STACK",
    val: "Java · Python · JS · React · Node · Three.js",
    green: false,
  },
  { key: "BASE", val: "Lagos, Nigeria", green: false },
];

const CONTACTS = [
  {
    id: "email",
    label: "Send an Email",
    sub: "jamesasuelimen77@gmail.com",
    href: "mailto:jamesasuelimen77@gmail.com",
    accent: "#a8c060",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M2 7l10 7 10-7" />
      </svg>
    ),
  },
  {
    id: "whatsapp",
    label: "WhatsApp Me",
    sub: "+234 814 218 6524",
    href: "https://wa.me/2348142186524",
    accent: "#25d366",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
  },
  {
    id: "call",
    label: "Direct Call",
    sub: "+234 814 218 6524",
    href: "tel:+2348142186524",
    accent: "#d4a843",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.06 6.06l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z" />
      </svg>
    ),
  },
];

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/jamesking77-create/",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/jamesasuelimen77/",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "Twitter / X",
    href: "https://x.com/JamesAsuelimen",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 4l16 16M4 20L20 4" />
      </svg>
    ),
  },
  {
    label: "Dribbble",
    href: "https://dribbble.com/jamesking777",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72" />
        <path d="M10.6 21.7c1.12-5.23 1.8-8.46 3.35-11.55" />
        <path d="M2.36 13.5c5.57.63 9.13.44 13.85-1" />
      </svg>
    ),
  },
  {
    label: "Discord",
    href: "https://discord.com/users/jamesking8460",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
        <circle cx="9" cy="13" r="1.5" />
        <circle cx="15" cy="13" r="1.5" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/08142186524",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/_jamess_kingg/",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
];

// ── Download CV icon ──────────────────────────────────────────────────────────
const DownloadIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3v13M5 14l7 7 7-7" />
    <path d="M3 21h18" />
  </svg>
);

function SocialIcon({ s, light = false }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={s.href}
      target="_blank"
      rel="noopener noreferrer"
      title={s.label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 38,
        height: 38,
        borderRadius: "50%",
        border: light
          ? `1px solid rgba(245,240,228,${hovered ? "0.45" : "0.15"})`
          : `1px solid rgba(42,48,24,${hovered ? "0.3" : "0.1"})`,
        background: hovered
          ? light
            ? "rgba(168,192,96,0.18)"
            : "rgba(42,48,24,0.08)"
          : "transparent",
        color: hovered
          ? light
            ? "#a8c060"
            : "#4a6020"
          : light
            ? "rgba(245,240,228,0.55)"
            : "rgba(42,48,24,0.45)",
        textDecoration: "none",
        transition: "all 0.22s ease",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        flexShrink: 0,
      }}
    >
      {s.icon}
    </a>
  );
}

const institutions = [
  {
    name: "Semicolon Africa",
    shortName: "SC",
    logo: "https://semicolon.africa/favicon.ico",
    bg: "#0a0f05",
    border: "#a8c060",
    credential: "Problem Solving · Design Thinking · Software Engineering",
    url: "https://semicolon.africa",
    initials: "SC",
    color: "#a8c060",
  },
  {
    name: "Henley Business School",
    shortName: "HBS",
    logo: "https://www.henley.ac.uk/favicon.ico",
    bg: "#00205b",
    border: "#d4af37",
    credential: "Business & Enterprise · Certified",
    url: "https://www.henley.ac.uk",
    initials: "HB",
    color: "#d4af37",
  },
  {
    name: "MIVA Open University",
    shortName: "MIVA",
    logo: "https://miva.edu.ng/favicon.ico",
    bg: "#0a1128",
    border: "#2563eb",
    credential: "BSc Software Engineering",
    url: "https://miva.edu.ng",
    initials: "MV",
    color: "#2563eb",
  },
];

function MobileLogoCircle({ inst, delay = 0 }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <a
      href={inst.url}
      target="_blank"
      rel="noreferrer"
      title={inst.name}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 44,
        height: 44,
        borderRadius: "50%",
        background: imgErr ? inst.bg : "#fff",
        border: `2.5px solid ${inst.border}`,
        boxShadow: `0 3px 14px rgba(0,0,0,0.35), 0 0 0 1px ${inst.border}33`,
        overflow: "hidden",
        flexShrink: 0,
        animation: `badge-float 3s ease-in-out ${delay}s infinite`,
        textDecoration: "none",
        transition: "transform 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {!imgErr ? (
        <img
          src={inst.logo}
          alt={inst.name}
          onError={() => setImgErr(true)}
          style={{ width: "65%", height: "65%", objectFit: "contain" }}
        />
      ) : (
        <span
          style={{
            fontFamily: "'Space Mono',monospace",
            fontWeight: 700,
            fontSize: 11,
            color: inst.color,
            letterSpacing: "0.05em",
          }}
        >
          {inst.initials}
        </span>
      )}
    </a>
  );
}

function InstitutionBadge({ inst, size = "md" }) {
  const [imgErr, setImgErr] = useState(false);
  const isLg = size === "lg";
  const avatarSize = isLg ? 52 : 40;
  return (
    <a
      href={inst.url}
      target="_blank"
      rel="noreferrer"
      title={inst.name}
      style={{
        display: "flex",
        alignItems: "center",
        gap: isLg ? 14 : 10,
        padding: isLg ? "10px 18px 10px 10px" : "8px 14px 8px 8px",
        background: "rgba(245,240,228,0.92)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: `1.5px solid ${inst.border}44`,
        borderRadius: 100,
        textDecoration: "none",
        boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
        flexShrink: 0,
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.28)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.18)";
      }}
    >
      <div
        style={{
          width: avatarSize,
          height: avatarSize,
          borderRadius: "50%",
          background: imgErr ? inst.bg : "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          flexShrink: 0,
          border: `2px solid ${inst.border}66`,
        }}
      >
        {!imgErr ? (
          <img
            src={inst.logo}
            alt={inst.name}
            onError={() => setImgErr(true)}
            style={{ width: "70%", height: "70%", objectFit: "contain" }}
          />
        ) : (
          <span
            style={{
              fontFamily: "'Space Mono',monospace",
              fontWeight: 700,
              fontSize: isLg ? 13 : 10,
              color: inst.color,
              letterSpacing: "0.05em",
            }}
          >
            {inst.initials}
          </span>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <span
          style={{
            fontFamily: "'DM Sans',sans-serif",
            fontWeight: 800,
            fontSize: isLg ? 13 : 11,
            color: "#1c2410",
            whiteSpace: "nowrap",
            lineHeight: 1.2,
          }}
        >
          {inst.name}
        </span>
        <span
          style={{
            fontFamily: "'Space Mono',monospace",
            fontWeight: 700,
            fontSize: isLg ? 9 : 8,
            color: inst.color,
            letterSpacing: "0.08em",
            whiteSpace: "nowrap",
          }}
        >
          {inst.credential}
        </span>
      </div>
    </a>
  );
}

function CredentialCard({ inst }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <a
      href={inst.url}
      target="_blank"
      rel="noreferrer"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 14,
        padding: "16px 20px",
        background: "rgba(42,48,24,0.04)",
        border: "1px solid rgba(42,48,24,0.1)",
        borderLeft: `3px solid ${inst.border}`,
        borderRadius: 8,
        textDecoration: "none",
        transition: "background 0.2s, border-color 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(42,48,24,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(42,48,24,0.04)";
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: imgErr ? inst.bg : "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          flexShrink: 0,
          border: `1.5px solid ${inst.border}55`,
        }}
      >
        {!imgErr ? (
          <img
            src={inst.logo}
            alt={inst.name}
            onError={() => setImgErr(true)}
            style={{ width: "70%", height: "70%", objectFit: "contain" }}
          />
        ) : (
          <span
            style={{
              fontFamily: "'Space Mono',monospace",
              fontWeight: 700,
              fontSize: 10,
              color: inst.color,
            }}
          >
            {inst.initials}
          </span>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <span
          style={{
            fontFamily: "'DM Sans',sans-serif",
            fontWeight: 800,
            fontSize: "clamp(13px,1.3vw,15px)",
            color: "#1c2410",
            lineHeight: 1.2,
          }}
        >
          {inst.name}
        </span>
        <span
          style={{
            fontFamily: "'Space Mono',monospace",
            fontWeight: 700,
            fontSize: "clamp(9px,0.9vw,10px)",
            color: inst.color,
            letterSpacing: "0.1em",
          }}
        >
          {inst.credential}
        </span>
      </div>
    </a>
  );
}

function InlineContactCard({ c, index, visible }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.a
      href={c.href}
      target={c.id === "email" ? "_self" : "_blank"}
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 32, scale: 0.94 }}
      animate={
        visible
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 32, scale: 0.94 }
      }
      transition={{
        duration: 0.45,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: "20px 18px",
        background: hovered ? `${c.accent}30` : "rgba(245,240,228,0.12)",
        border: `1px solid ${hovered ? c.accent + "88" : "rgba(245,240,228,0.22)"}`,
        borderBottom: `3px solid ${c.accent}`,
        borderRadius: 12,
        textDecoration: "none",
        transition: "background 0.25s, border-color 0.25s, transform 0.25s",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        flex: 1,
        minWidth: 0,
        cursor: "pointer",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: `${c.accent}18`,
          border: `1px solid ${c.accent}33`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: c.accent,
          flexShrink: 0,
        }}
      >
        {c.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: "clamp(12px,1.1vw,14px)",
            fontWeight: 800,
            color: "#f5f0e4",
            lineHeight: 1.2,
            marginBottom: 4,
          }}
        >
          {c.label}
        </div>
        <div
          style={{
            fontFamily: "'Space Mono',monospace",
            fontSize: "clamp(8px,0.75vw,10px)",
            color: "rgba(245,240,228,0.4)",
            letterSpacing: "0.04em",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {c.sub}
        </div>
      </div>
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke={c.accent}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ opacity: 0.7, flexShrink: 0 }}
      >
        <path d="M7 17L17 7M7 7h10v10" />
      </svg>
    </motion.a>
  );
}

export default function AboutSection({ videeSrc }) {
  const secRef = useRef();
  const imgRef = useRef();
  const rightRef = useRef();
  const headingRef = useRef();
  const labelRef = useRef();
  const paraRef = useRef();
  const quoteRef = useRef();
  const videoRef = useRef();
  const pngRef = useRef();
  const [videoVisible, setVideoVisible] = useState(false);
  const [hoveredStat, setHoveredStat] = useState(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [inlineOpen, setInlineOpen] = useState(false);
  // ── NEW: download CV button state ──
  const [cvHovered, setCvHovered] = useState(false);
  const [cvDownloading, setCvDownloading] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 200, damping: 20 });
  const springY = useSpring(my, { stiffness: 200, damping: 20 });

  // ── Download CV handler ───────────────────────────────────────────────────
  const handleDownloadCV = () => {
    setCvDownloading(true);
    const link = document.createElement("a");
    link.href = "/JAMES OLUWALEKE ASUELIMEN.pdf";
    link.download = "James_Asuelimen_CV.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setCvDownloading(false), 1800);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
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
        gsap.fromTo(
          pngRef.current,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: "power4.out",
            delay: 0.5,
            scrollTrigger: {
              trigger: secRef.current,
              start: "top 75%",
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
        gsap.fromTo(
          ".credentials-block",
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".credentials-block",
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          },
        );
        gsap.fromTo(
          ".about-socials-strip",
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".about-socials-strip",
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }, secRef);
      return () => ctx.revert();
    }, 650);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVideoVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    if (secRef.current) observer.observe(secRef.current);
    return () => observer.disconnect();
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

  const handleGetInTouch = () => {
    if (window.innerWidth >= 900) {
      setInlineOpen((v) => !v);
    } else {
      setContactOpen(true);
    }
  };

  return (
    <>
      <style>{`
        ${FONT}
        .bebas { font-family: 'Bebas Neue', sans-serif; }
        .dm    { font-family: 'DM Sans', sans-serif; }
        .mono  { font-family: 'Space Mono', monospace; }

        .about-row { transition: background 0.25s, padding-left 0.25s; }
        .about-row:hover { background: rgba(42,48,24,0.05); padding-left: 10px; }
        .about-row:hover .about-row-val { color: #4a6020 !important; }

        .about-stat { transition: background 0.3s; cursor: default; }
        .about-stat:hover .about-stat-value { color: #4a6020 !important; transform: scale(1.06); transition: color 0.25s, transform 0.25s; }

        .about-cta { position: relative; overflow: hidden; }
        .about-cta::after { content: ''; position: absolute; top: 0; left: -100%; width: 60%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent); transition: left 0.5s ease; }
        .about-cta:hover::after { left: 150%; }

        /* ── CV button shimmer ── */
        .cv-btn { position: relative; overflow: hidden; }
        .cv-btn::after { content: ''; position: absolute; top: 0; left: -100%; width: 60%; height: 100%; background: linear-gradient(90deg, transparent, rgba(168,192,96,0.18), transparent); transition: left 0.5s ease; }
        .cv-btn:hover::after { left: 150%; }

        /* ── Download spinner animation ── */
        @keyframes cv-spin { to { transform: rotate(360deg); } }
        @keyframes cv-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(3px)} }
        .cv-dl-icon { animation: cv-bounce 0.9s ease-in-out infinite; }

        .heading-overflow { overflow: hidden; }

        .inst-badges-mobile { position: absolute; bottom: clamp(14px,4%,22px); right: clamp(12px,4%,18px); display: flex; flex-direction: column; gap: 6px; z-index: 10; }
        .inst-badges-desktop { display: flex; flex-direction: column; gap: 10px; }
        .about-socials-strip { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .quote-socials-desktop { display: flex; flex-direction: column; align-items: flex-end; gap: 12px; flex-shrink: 0; }
        .quote-socials-row { display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end; }

        .about-quote-inner { display: flex; align-items: center; gap: clamp(32px,5vw,64px); width: 100%; }
        .about-quote-left { flex-shrink: 0; display: flex; flex-direction: column; gap: clamp(16px,2vw,20px); }
        .about-quote-right { flex: 1; display: flex; gap: 12px; align-items: stretch; min-width: 0; }

        /* ── CTA button row ── */
        .cta-btn-row {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        @media (max-width: 900px) {
          .about-split-grid { grid-template-columns: 1fr !important; min-height: unset !important; }
          .about-img-col { height: 72vw !important; min-height: 300px !important; }
          .about-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .about-stats-grid > div:nth-child(2) { border-right: none !important; }
          .about-stats-grid > div:nth-child(1), .about-stats-grid > div:nth-child(2) { border-bottom: 1px solid rgba(42,48,24,0.1) !important; }
          .about-stats-grid > div:nth-child(3) { border-right: 1px solid rgba(42,48,24,0.1) !important; }
          .inst-badges-desktop { display: none !important; }
          .inst-badges-mobile { display: flex !important; }
          .quote-socials-desktop { align-items: flex-start !important; }
          .quote-socials-row { justify-content: flex-start !important; }
          .about-quote-inner { flex-direction: column !important; align-items: flex-start !important; gap: 24px !important; }
          .about-quote-right { display: none !important; }
          .cta-btn-row { gap: 10px; }
        }

        @media (min-width: 901px) {
          .inst-badges-mobile { display: none !important; }
          .inst-badges-desktop { display: flex !important; }
        }

        @media (max-width: 520px) {
          .about-img-col { height: 85vw !important; min-height: 280px !important; }
          .about-stats-grid > div { padding: 28px 18px !important; }
          .inst-badges-mobile { bottom: 55px; right: 10px; gap: 6px; }
          /* Keep side by side but shrink padding on very small screens */
          .cta-btn-row { flex-direction: row; align-items: center; gap: 8px; }
          .cta-btn-row button { padding: 10px 16px !important; font-size: 12px !important; }
        }

        @keyframes pulse-dot { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.5); } }
        @keyframes badge-float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-4px); } }

        .mypng { position: absolute; bottom: 0; right: 43%; height: 95%; width: auto; object-fit: contain; object-position: bottom; z-index: 5; pointer-events: none; }
        @media (max-width: 900px) {
          .mypng { display: none; }
          .mypng-mobile { display: block !important; }
        }
      `}</style>

      <section
        id="about"
        ref={secRef}
        style={{ background: "#f5f0e4", position: "relative" }}
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

        {/* ── SECTION LABEL ── */}
        <div style={{ padding: "14px clamp(20px,6vw,72px) 0" }}>
          <span
            ref={labelRef}
            className="mono"
            style={{
              fontSize: "clamp(11px,1.4vw,14px)",
              fontWeight: 700,
              letterSpacing: "0.3em",
              color: "rgba(42,48,24,0.45)",
              display: "inline-block",
              marginBottom: "0.5rem",
              textTransform: "uppercase",
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
            overflow: "visible",
            position: "relative",
          }}
        >
          {/* LEFT — image panel */}
          <div
            className="about-img-wrap about-img-col"
            style={{
              position: "relative",
              overflow: "visible",
              background: "#2a3018",
              minHeight: "clamp(300px,60vh,100%)",
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
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(145deg,#2a3818 0%,#1c2410 60%,#141a0c 100%)",
                }}
              >
                {videoVisible && (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="none"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      mixBlendMode: "luminosity",
                      opacity: 0.9,
                    }}
                  >
                    <source src="/bg-video.webm" type="video/webm" />
                    <source src="/bg-video.mp4" type="video/mp4" />
                  </video>
                )}
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
            <img
              src="/mypng.png"
              alt=""
              className="mypng-mobile"
              ref={pngRef}
              style={{
                display: "none",
                position: "absolute",
                bottom: 0,
                right: "5%",
                height: "92%",
                width: "auto",
                objectFit: "contain",
                objectPosition: "bottom",
                zIndex: 3,
                pointerEvents: "none",
              }}
            />
            <div className="inst-badges-mobile" style={{ display: "none" }}>
              {institutions.map((inst, idx) => (
                <MobileLogoCircle
                  key={inst.name}
                  inst={inst}
                  delay={idx * 0.4}
                />
              ))}
            </div>
            <div
              className="about-name-overlay"
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 4,
                padding: "clamp(20px,4vw,48px)",
                background:
                  "linear-gradient(0deg,rgba(20,26,12,0.95) 0%,transparent 100%)",
              }}
            >
              <div
                className="bebas"
                style={{
                  fontSize: "clamp(2rem,5vw,4.5rem)",
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
                  fontSize: "clamp(9px,1vw,11px)",
                  fontWeight: 700,
                  letterSpacing: "0.3em",
                  color: "rgba(245,240,228,0.5)",
                  marginTop: 8,
                }}
              >
                SOFTWARE ENGINEER
              </div>
              <div
                className="about-socials-strip"
                style={{ marginTop: 14, display: "none" }}
              >
                {socials.map((s) => (
                  <SocialIcon key={s.label} s={s} light />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — intro + data rows + credentials */}
          <div
            ref={rightRef}
            style={{
              padding: "clamp(28px,5vw,80px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "clamp(20px,3vw,32px)",
              background: "#f5f0e4",
            }}
          >
            <div>
              <div className="heading-overflow">
                <h2
                  ref={headingRef}
                  className="bebas"
                  style={{
                    fontSize: "clamp(2rem,5.5vw,5.5rem)",
                    color: "#1c2410",
                    lineHeight: 0.95,
                    letterSpacing: "0.02em",
                    marginBottom: 20,
                  }}
                >
                  I DON'T JUST WRITE CODE <br />
                  <span style={{ color: "#4a6020" }}>
                    I ENGINEER EXPERIENCES.
                  </span>
                </h2>
              </div>
              <p
                ref={paraRef}
                className="dm"
                style={{
                  fontSize: "clamp(14px,1.5vw,17px)",
                  fontWeight: 600,
                  color: "rgba(42,48,24,0.72)",
                  lineHeight: 1.8,
                  maxWidth: 480,
                }}
              >
                From real-time trading platforms to e-commerce ecosystems, I
                build software that works at the speed of business. Trained in
                problem solving, design thinking and software engineering at{" "}
                <span style={{ color: "#4a6020", fontWeight: 800 }}>
                  Semicolon Africa
                </span>{" "}
                — and certified in{" "}
                <span style={{ color: "#1c2410", fontWeight: 800 }}>
                  Business & Enterprise
                </span>{" "}
                with{" "}
                <span style={{ fontWeight: 800, color: "#00205b" }}>
                  Henley Business School, UK
                </span>
                . Based in Lagos, Nigeria — working globally.
              </p>
            </div>

            <div
              className="inst-badges-desktop credentials-block"
              style={{ display: "none" }}
            >
              <div
                className="mono"
                style={{
                  fontSize: "clamp(8px,0.9vw,9px)",
                  fontWeight: 700,
                  letterSpacing: "0.35em",
                  color: "rgba(42,48,24,0.35)",
                  marginBottom: 8,
                  textTransform: "uppercase",
                }}
              >
                Credentials
              </div>
              {institutions.map((inst) => (
                <CredentialCard key={inst.name} inst={inst} />
              ))}
            </div>

            <div
              className="credentials-block"
              style={{ display: "flex", flexDirection: "column", gap: 10 }}
            >
              <div
                className="mono"
                style={{
                  fontSize: "clamp(11px,1vw,13px)",
                  fontWeight: 700,
                  letterSpacing: "0.35em",
                  color: "rgba(42,48,24,0.65)",
                  textTransform: "uppercase",
                }}
              >
                Find me on
              </div>
              <div className="about-socials-strip">
                {socials.map((s) => (
                  <SocialIcon key={s.label} s={s} light={false} />
                ))}
              </div>
            </div>

            <div>
              {dataRows.map((r) => (
                <div
                  key={r.key}
                  className="about-row"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "clamp(12px,1.5vw,16px) 0",
                    position: "relative",
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
                      fontSize: "clamp(11px,1vw,13px)",
                      fontWeight: 700,
                      letterSpacing: "0.25em",
                      color: "rgba(42,48,24,0.65)",
                      flexShrink: 0,
                    }}
                  >
                    {r.key}
                  </span>
                  <span
                    className="dm about-row-val"
                    style={{
                      fontSize: "clamp(12px,1.3vw,15px)",
                      fontWeight: 700,
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
                          width: 7,
                          height: 7,
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

          <img src="/mypng.png" alt="" className="mypng" ref={pngRef} />
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
                    fontSize: "clamp(2rem,6vw,6rem)",
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
                    fontSize: "clamp(8px,0.85vw,10px)",
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    color:
                      hoveredStat === i
                        ? "rgba(245,240,228,0.6)"
                        : "rgba(42,48,24,0.5)",
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
          ref={quoteRef}
          style={{
            background: "#1c2410",
            padding: "clamp(40px,6vw,80px) clamp(24px,6vw,72px)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* African pattern SVG */}
          <svg
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              zIndex: 0,
            }}
            preserveAspectRatio="xMidYMid slice"
            viewBox="0 0 680 240"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <style>{`
                @keyframes zig-march  { from{stroke-dashoffset:0} to{stroke-dashoffset:-80} }
                @keyframes zig-march2 { from{stroke-dashoffset:0} to{stroke-dashoffset:80}  }
                @keyframes qs-pulse   { 0%,100%{opacity:.03} 50%{opacity:.06} }
                @keyframes qs-pulse2  { 0%,100%{opacity:.02} 50%{opacity:.05} }
                @keyframes qs-pulse3  { 0%,100%{opacity:.025} 50%{opacity:.055} }
                .qm1{stroke-dasharray:40 40;animation:zig-march  6s linear infinite}
                .qm2{stroke-dasharray:40 40;animation:zig-march2 6s linear infinite}
                .qm3{stroke-dasharray:20 20;animation:zig-march  4s linear infinite}
                .qp1{animation:qs-pulse  5s ease-in-out infinite}
                .qp2{animation:qs-pulse2 7s ease-in-out infinite 1.5s}
                .qp3{animation:qs-pulse3 6s ease-in-out infinite 3s}
              `}</style>
            </defs>
            <g stroke="#a8c060" strokeWidth="0.35" fill="none" opacity="0.025">
              {[40, 80, 120, 160, 200].map((y) => (
                <line key={y} x1="0" y1={y} x2="680" y2={y} />
              ))}
              {[68, 136, 204, 272, 340, 408, 476, 544, 612].map((x) => (
                <line key={x} x1={x} y1="0" x2={x} y2="240" />
              ))}
            </g>
            <polyline
              className="qp1"
              points="0,8 17,2 34,8 51,2 68,8 85,2 102,8 119,2 136,8 153,2 170,8 187,2 204,8 221,2 238,8 255,2 272,8 289,2 306,8 323,2 340,8 357,2 374,8 391,2 408,8 425,2 442,8 459,2 476,8 493,2 510,8 527,2 544,8 561,2 578,8 595,2 612,8 629,2 646,8 663,2 680,8"
              stroke="#a8c060"
              strokeWidth="1.1"
              fill="none"
            />
            <polyline
              className="qp2"
              points="0,14 17,8 34,14 51,8 68,14 85,8 102,14 119,8 136,14 153,8 170,14 187,8 204,14 221,8 238,14 255,8 272,14 289,8 306,14 323,8 340,14 357,8 374,14 391,8 408,14 425,8 442,14 459,8 476,14 493,8 510,14 527,8 544,14 561,8 578,14 595,8 612,14 629,8 646,14 663,8 680,14"
              stroke="#d4a843"
              strokeWidth="0.7"
              fill="none"
            />
            <line
              x1="0"
              y1="20"
              x2="680"
              y2="20"
              stroke="#d4a843"
              strokeWidth="0.8"
              fill="none"
              opacity="0.2"
            />
            <polyline
              className="qp1"
              points="0,232 17,238 34,232 51,238 68,232 85,238 102,232 119,238 136,232 153,238 170,232 187,238 204,232 221,238 238,232 255,238 272,232 289,238 306,232 323,238 340,232 357,238 374,232 391,238 408,232 425,238 442,232 459,238 476,232 493,238 510,232 527,238 544,232 561,238 578,232 595,238 612,232 629,238 646,232 663,238 680,232"
              stroke="#a8c060"
              strokeWidth="1.1"
              fill="none"
            />
            <line
              x1="0"
              y1="220"
              x2="680"
              y2="220"
              stroke="#d4a843"
              strokeWidth="0.8"
              fill="none"
              opacity="0.2"
            />
            <g className="qp2">
              <line
                x1="0"
                y1="58"
                x2="680"
                y2="58"
                stroke="#d4a843"
                strokeWidth="1"
                fill="none"
              />
              <polyline
                points="0,64 20,56 40,64 60,56 80,64 100,56 120,64 140,56 160,64 180,56 200,64 220,56 240,64 260,56 280,64 300,56 320,64 340,56 360,64 380,56 400,64 420,56 440,64 460,56 480,64 500,56 520,64 540,56 560,64 580,56 600,64 620,56 640,64 660,56 680,64"
                stroke="#a8c060"
                strokeWidth="0.9"
                fill="none"
              />
              <line
                x1="0"
                y1="70"
                x2="680"
                y2="70"
                stroke="#d4a843"
                strokeWidth="1"
                fill="none"
              />
            </g>
            <g className="qp3">
              <line
                x1="0"
                y1="170"
                x2="680"
                y2="170"
                stroke="#d4a843"
                strokeWidth="1"
                fill="none"
              />
              <polyline
                points="0,176 20,168 40,176 60,168 80,176 100,168 120,176 140,168 160,176 180,168 200,176 220,168 240,176 260,168 280,176 300,168 320,176 340,168 360,176 380,168 400,176 420,168 440,176 460,168 480,176 500,168 520,176 540,168 560,176 580,168 600,176 620,168 640,176 660,168 680,176"
                stroke="#a8c060"
                strokeWidth="0.9"
                fill="none"
              />
              <line
                x1="0"
                y1="182"
                x2="680"
                y2="182"
                stroke="#d4a843"
                strokeWidth="1"
                fill="none"
              />
            </g>
            <polyline
              className="qm1"
              points="0,120 28,100 56,120 84,100 112,120 140,100 168,120 196,100 224,120 252,100 280,120 308,100 336,120 364,100 392,120 420,100 448,120 476,100 504,120 532,100 560,120 588,100 616,120 644,100 672,120 680,120"
              stroke="#a8c060"
              strokeWidth="1.2"
              fill="none"
              opacity="0.18"
            />
            <polyline
              className="qm2"
              points="0,120 28,140 56,120 84,140 112,120 140,140 168,120 196,140 224,120 252,140 280,120 308,140 336,120 364,140 392,120 420,140 448,120 476,140 504,120 532,140 560,120 588,140 616,120 644,140 672,120 680,120"
              stroke="#d4a843"
              strokeWidth="1.2"
              fill="none"
              opacity="0.14"
            />
            <g fill="none" stroke="#a8c060" strokeWidth="0.8">
              <polygon points="60,120 72,108 84,120 72,132" className="qp1" />
              <polygon points="200,50 210,40 220,50 210,60" className="qp2" />
              <polygon
                points="340,120 354,106 368,120 354,134"
                className="qp3"
              />
              <polygon points="480,50 490,40 500,50 490,60" className="qp1" />
              <polygon
                points="620,120 632,108 644,120 632,132"
                className="qp2"
              />
              <polygon
                points="200,190 210,180 220,190 210,200"
                className="qp3"
              />
              <polygon
                points="480,190 490,180 500,190 490,200"
                className="qp1"
              />
            </g>
            <g fill="none" stroke="#a8c060" strokeWidth="0.7" className="qp2">
              <circle cx="44" cy="120" r="10" />
              <circle cx="44" cy="120" r="5" />
              <line x1="44" y1="110" x2="44" y2="130" />
              <line x1="34" y1="120" x2="54" y2="120" />
              <line x1="37" y1="113" x2="51" y2="127" />
              <line x1="51" y1="113" x2="37" y2="127" />
            </g>
            <g fill="none" stroke="#d4a843" strokeWidth="0.7" className="qp3">
              <circle cx="636" cy="120" r="10" />
              <circle cx="636" cy="120" r="5" />
              <line x1="636" y1="110" x2="636" y2="130" />
              <line x1="626" y1="120" x2="646" y2="120" />
              <line x1="629" y1="113" x2="643" y2="127" />
              <line x1="643" y1="113" x2="629" y2="127" />
            </g>
          </svg>

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
              zIndex: 1,
            }}
          />

          <div
            className="about-quote-inner"
            style={{ position: "relative", zIndex: 2 }}
          >
            {/* LEFT: text + buttons */}
            <div className="about-quote-left">
              <p
                className="bebas"
                style={{
                  fontSize: "clamp(1.6rem,3.8vw,3.2rem)",
                  color: "#f5f0e4",
                  letterSpacing: "0.04em",
                  lineHeight: 1.1,
                  margin: 0,
                }}
              >
                AVAILABLE FOR FULL-TIME
                <br />
                ROLES, FREELANCE &amp; COLLABS.
              </p>

              {/* ── CTA BUTTON ROW ── */}
              <div className="cta-btn-row">
                {/* Get in touch */}
                <motion.button
                  onClick={handleGetInTouch}
                  className="about-cta"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "clamp(11px,1.4vw,13px) clamp(22px,2.5vw,30px)",
                    borderRadius: 100,
                    background: inlineOpen
                      ? "rgba(168,192,96,0.15)"
                      : "#a8c060",
                    border: "1px solid #a8c060",
                    color: inlineOpen ? "#a8c060" : "#1c2410",
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: "clamp(13px,1.2vw,15px)",
                    fontWeight: 800,
                    letterSpacing: ".04em",
                    cursor: "pointer",
                    flexShrink: 0,
                    transition: "background 0.3s, color 0.3s",
                    x: springX,
                    y: springY,
                  }}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.97 }}
                  onMouseMove={handleMagnet}
                  onMouseLeave={resetMagnet}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: inlineOpen ? "#a8c060" : "#1c2410",
                      transition: "background 0.3s",
                    }}
                  />
                  {inlineOpen ? "Close" : "Get in touch"}
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: inlineOpen ? "#a8c060" : "#1c2410",
                      transition: "background 0.3s",
                    }}
                  />
                </motion.button>

                {/* ── Download CV button ── */}
                <motion.button
                  onClick={handleDownloadCV}
                  onMouseEnter={() => setCvHovered(true)}
                  onMouseLeave={() => setCvHovered(false)}
                  className="cv-btn"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 9,
                    padding: "clamp(11px,1.4vw,13px) clamp(18px,2vw,26px)",
                    borderRadius: 100,
                    background: cvHovered
                      ? "rgba(168,192,96,0.1)"
                      : "transparent",
                    border: `1px solid rgba(168,192,96,${cvHovered ? "0.7" : "0.35"})`,
                    color: cvHovered ? "#a8c060" : "rgba(245,240,228,0.75)",
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: "clamp(13px,1.2vw,15px)",
                    fontWeight: 800,
                    letterSpacing: ".04em",
                    cursor: "pointer",
                    flexShrink: 0,
                    transition:
                      "background 0.3s, border-color 0.3s, color 0.3s",
                  }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span
                    className={cvDownloading ? "cv-dl-icon" : ""}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      color: "inherit",
                    }}
                  >
                    <DownloadIcon />
                  </span>
                  {cvDownloading ? "Downloading…" : "Download CV"}
                </motion.button>
              </div>
            </div>

            {/* RIGHT: inline contact cards — desktop only */}
            <div className="about-quote-right">
              <AnimatePresence>
                {inlineOpen &&
                  CONTACTS.map((c, i) => (
                    <InlineContactCard
                      key={c.id}
                      c={c}
                      index={i}
                      visible={inlineOpen}
                    />
                  ))}
              </AnimatePresence>
              {!inlineOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    opacity: 0.25,
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: 90,
                        borderRadius: 12,
                        border: "1px dashed rgba(245,240,228,0.2)",
                        background: "rgba(245,240,228,0.02)",
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile bottom-sheet popup */}
        <ContactPopup
          open={contactOpen}
          onClose={() => setContactOpen(false)}
        />
      </section>
    </>
  );
}
