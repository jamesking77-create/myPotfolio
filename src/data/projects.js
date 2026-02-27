/**
 * data/projects.js
 *
 * Per-project image guide:
 *
 *  image              → square hero shown LEFT on card (before hover)  — 600×600px
 *  logoImage          → appears AFTER water-hover morph                — same 600×600px
 *  displacementImage  → ripple water map — ONE file for all cards
 *                       Download: https://cdn.jsdelivr.net/gh/robin-dela/hover-effect/images/fluid.jpg
 *                       Save as: /public/images/displacement.png
 *
 * Run once:  npm install hover-effect
 */

import ibloomHero from "../assets/ibloomdashboard.png";
import bimeHero from "../assets/bimehero.svg";
import falcon from "../assets/falcondashboard.png";
import fluid from "../assets/fluid2.jpg";
import bimelogo from "../assets/bimelogo.svg"
import falconlogo from "../assets/falconlogo.svg";


// ── Add your logo images here once you have them ──
// import bimeLogo     from "../assets/logos/bime-logo.png";
// import aristackLogo from "../assets/logos/aristack-logo.png";
// import ibloomLogo   from "../assets/logos/ibloom-logo.png";

const DISPLACEMENT = fluid;

export const projects = [
  {
    id: 1,
    title: "Bime",
    stack: "BRANDING, UI DESIGN, VISUAL IDENTITY",
    url: null, // "https://bime.com" when live
    githubUrl: null, // "https://github.com/yourhandle/bime"
    linkedinUrl: null, // "https://linkedin.com/in/yourhandle"

    image: bimeHero,
    logoImage: bimelogo, // ← import bimeLogo and put it here
    displacementImage: DISPLACEMENT,

    // legacy fields kept for other sections
    client: "Bime Brand",
    role: "Brand Identity & Design",
    year: "2024",
    tags: ["Branding", "UI Design", "Visual Identity"],
    description:
      "Full brand identity and visual design for Bime — crafting a bold underwater-inspired identity that stands out in a competitive market.",
    color: "#0d4f3c",
    accent: "#10b981",
  },
  {
    id: 2,
    title: "Aristack",
    stack: "REACT JS, NODE.JS, FINTECH, DASHBOARD",
    url: null,
    githubUrl: null, // "https://github.com/yourhandle/aristack"
    linkedinUrl: null,

    image: falcon,
    logoImage: falconlogo, // ← import aristackLogo and put it here
    displacementImage: DISPLACEMENT,

    client: "Aristack Solutions Limited",
    role: "Full Stack Engineer",
    year: "2025",
    tags: ["React", "Node.js", "Fintech", "Dashboard"],
    description:
      "Enterprise-grade trading and portfolio management platform handling real-time FX, equity, and fixed-income trades at scale.",
    color: "#1a0a3d",
    accent: "#7c3aed",
  },
  {
    id: 3,
    title: "iBloom — Public Site",
    stack: "REACT JS, E-COMMERCE, BOOKINGS",
    url: null,
    githubUrl: null,
    linkedinUrl: null,

    image: ibloomHero,
    logoImage: null, // ← import ibloomLogo and put it here
    displacementImage: DISPLACEMENT,

    client: "iBloom Decor Rentals",
    role: "Full Stack Engineer",
    year: "2025",
    tags: ["React", "E-commerce", "Bookings"],
    description:
      "Public-facing wedding and event decor rental platform with booking flows, galleries, and live quote generation.",
    color: "#2d1a4d",
    accent: "#a855f7",
  },
  {
    id: 4,
    title: "iBloom — Admin",
    stack: "REACT JS, DASHBOARD, REAL-TIME, ADMIN",
    url: null,
    githubUrl: null,
    linkedinUrl: null,

    image: null, // ← add your admin screenshot import
    logoImage: null,
    displacementImage: DISPLACEMENT,

    client: "iBloom Decor Rentals",
    role: "Full Stack Engineer",
    year: "2025",
    tags: ["React", "Dashboard", "Real-time", "Admin"],
    description:
      "Full admin platform with live booking management, revenue analytics, calendar scheduling, and multi-role access control.",
    color: "#0d2d1a",
    accent: "#10b981",
  },
];
