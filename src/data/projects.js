import bimeHero from "../assets/bime.png"; // ← was bimehero.svg (SVGs ignore object-fit)
import planning from "../assets/planning.jpg";
import falcon from "../assets/treasury.jpg";
import fluid from "../assets/fluid2.jpg";
import bimelogo from "../assets/bimelogo.svg";
import falconlogo from "../assets/falconlogo.svg";
import ibloomlogo from "../assets/ibloomlogo.svg";
import ibloomHero from "../assets/decoration.jpg";

const DISPLACEMENT = fluid;

export const projects = [
  {
    id: 1,
    title: "Bime",
    stack: "BRANDING, UI DESIGN, VISUAL IDENTITY",
    url: null,
    githubUrl: null,
    linkedinUrl: null,
    image: bimeHero, // ← now a PNG — fills the box perfectly
    logoImage: bimelogo,
    displacementImage: DISPLACEMENT,
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
    title: "Falcon-Treasury",
    stack: "REACT JS, NODE.JS, FINTECH, DASHBOARD",
    url: null,
    githubUrl: null,
    linkedinUrl: null,
    image: falcon,
    logoImage: falconlogo,
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
    logoImage: ibloomlogo,
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
    image: planning,
    logoImage: ibloomlogo,
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
