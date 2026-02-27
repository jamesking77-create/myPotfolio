// src/components/hero/HeroSection.jsx
import { useState, useEffect, Suspense, useRef } from "react";
import * as THREE from "three";
import { Canvas, extend, useThree, useFrame } from "@react-three/fiber";
import {
  Physics,
  RigidBody,
  BallCollider,
  CuboidCollider,
  useRopeJoint,
  useSphericalJoint,
} from "@react-three/rapier";
import { Text, RoundedBox, shaderMaterial } from "@react-three/drei";
import QRCode from "qrcode";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Shader ──────────────────────────────────────────────────────────────────
const LiquidGradientMaterial = shaderMaterial(
  {},
  `varying vec2 vUv;
   void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
  `varying vec2 vUv;
   void main(){
     vec3 dark=vec3(0.08,0.10,0.04);vec3 mid=vec3(0.11,0.14,0.06);
     vec3 g1=vec3(0.14,0.20,0.07);vec3 g2=vec3(0.18,0.26,0.09);
     vec3 g3=vec3(0.10,0.16,0.05);vec3 g4=vec3(0.16,0.22,0.08);
     float d=(vUv.x+(1.0-vUv.y))*0.5;
     vec3 c=mix(dark,mid,smoothstep(0.3,0.7,d));
     c=mix(c,g1,smoothstep(0.35,0.0,distance(vUv,vec2(0.15,0.85)))*0.3);
     c=mix(c,g2,smoothstep(0.28,0.0,distance(vUv,vec2(0.82,0.15)))*0.35);
     c=mix(c,g3,smoothstep(0.32,0.0,distance(vUv,vec2(0.25,0.3)))*0.25);
     c=mix(c,g4,smoothstep(0.3,0.0,distance(vUv,vec2(0.7,0.75)))*0.28);
     c=mix(c,g2,smoothstep(0.25,0.0,distance(vUv,vec2(0.5,0.5)))*0.2);
     float v=smoothstep(0.0,0.5,vUv.x)*smoothstep(0.0,0.5,vUv.y)*
             smoothstep(0.0,0.5,1.0-vUv.x)*smoothstep(0.0,0.5,1.0-vUv.y);
     c*=v+0.4;
     gl_FragColor=vec4(c,1.0);
   }`,
);
extend({ LiquidGradientMaterial });

function GradientBackground() {
  const { viewport } = useThree();
  return (
    <mesh position={[0, 0, -2]} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1.5, 1.5]} />
      <liquidGradientMaterial />
    </mesh>
  );
}

// ─── Lanyard ─────────────────────────────────────────────────────────────────
function createLanyardTexture() {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 1024;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#1a1d21";
  ctx.fillRect(0, 0, 256, 1024);
  for (let i = 0; i < 6000; i++) {
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.04})`;
    ctx.fillRect(Math.random() * 256, Math.random() * 1024, 1, 1);
  }
  ctx.save();
  ctx.translate(128, 512);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = "#a8c060";
  ctx.font = "bold 42px Inter,system-ui";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let y = -600; y <= 600; y += 160) ctx.fillText("JAMES_KING", 0, y);
  ctx.restore();
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(1, 6);
  t.anisotropy = 16;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function LanyardClip() {
  return (
    <group position={[0, 0.1, 0]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.15, 16]} />
        <meshStandardMaterial color="#d4c9a8" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh
        position={[0, -0.12, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
        receiveShadow
      >
        <torusGeometry args={[0.08, 0.02, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#d4c9a8" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh
        position={[0, 0.12, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
        receiveShadow
      >
        <torusGeometry args={[0.04, 0.012, 12, 24]} />
        <meshStandardMaterial
          color="#c8bfa8"
          metalness={0.75}
          roughness={0.25}
        />
      </mesh>
      <mesh position={[0.08, -0.12, 0]} castShadow>
        <sphereGeometry args={[0.025, 12, 12]} />
        <meshStandardMaterial color="#d4c9a8" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

function Badge({ isMobile }) {
  const ropeMesh = useRef();
  const ropeTexture = useRef(createLanyardTexture());
  const fixed = useRef(),
    j1 = useRef(),
    j2 = useRef(),
    j3 = useRef(),
    card = useRef();
  const vec = new THREE.Vector3(),
    ang = new THREE.Vector3(),
    dir = new THREE.Vector3();
  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ]),
  );
  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);
  const [qrTexture, setQrTexture] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load("/james.jpg", (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.minFilter = t.magFilter = THREE.LinearFilter;
      setProfileImage(t);
    });
    QRCode.toCanvas(
      document.createElement("canvas"),
      "https://github.com/jamesking77-create",
      { width: 512, margin: 1 },
    )
      .then((c) => {
        const t = new THREE.CanvasTexture(c);
        t.colorSpace = THREE.SRGBColorSpace;
        setQrTexture(t);
      })
      .catch(console.error);
  }, []);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 0.85, 0],
  ]);

  // On mobile, pin the badge to the right side of screen
  const fixedX = isMobile ? 0 : 2;
  const fixedY = isMobile ? 4 : 5;

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((r) => r.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }
    [j1, j2, j3, card].forEach((r) => r.current?.wakeUp());
    if (fixed.current) {
      fixed.current.setNextKinematicTranslation({ x: fixedX, y: fixedY, z: 0 });
      [j1, j2].forEach((ref, i) => {
        if (!ref.current.lerped)
          ref.current.lerped = new THREE.Vector3().copy(
            ref.current.translation(),
          );
        const cd = Math.max(
          0.1,
          Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())),
        );
        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (i === 0 ? 1 : 1 + cd),
        );
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      const pts = curve.getPoints(40);
      if (ropeMesh.current) {
        ropeMesh.current.geometry.dispose();
        ropeMesh.current.geometry = new THREE.TubeGeometry(
          new THREE.CatmullRomCurve3(pts),
          64,
          0.035,
          12,
          false,
        );
      }
      ang.copy(card.current.angvel());
      card.current.setAngvel(
        { x: ang.x * 0.98, y: ang.y * 0.98, z: ang.z * 0.98 },
        true,
      );
    }
  });
  curve.curveType = "chordal";

  return (
    <>
      <group position={[fixedX, fixedY, 0]}>
        <RigidBody ref={fixed} type="kinematicPosition">
          <LanyardClip />
        </RigidBody>
        <RigidBody
          position={[0.3, 0, 0]}
          ref={j1}
          angularDamping={2}
          linearDamping={2}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[0.6, 0, 0]}
          ref={j2}
          angularDamping={2}
          linearDamping={2}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[0.9, 0, 0]}
          ref={j3}
          angularDamping={2}
          linearDamping={2}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          ref={card}
          angularDamping={0.5}
          linearDamping={0.5}
          type={dragged ? "kinematicPosition" : "dynamic"}
          position={[1.2, 0, 0]}
          restitution={0.2}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <mesh position={[0, 1.15, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.035, 0.035, 0.06, 16]} />
            <meshStandardMaterial
              color="#c8bfa8"
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
          <group position={[0, 0.72, 0]}>
            <mesh>
              <boxGeometry args={[0.18, 0.32, 0.045]} />
              <meshPhysicalMaterial
                color="#1a1a1a"
                metalness={0.2}
                roughness={0.4}
                clearcoat={0.3}
              />
            </mesh>
            <mesh castShadow receiveShadow position={[0, 0, 0.002]}>
              <boxGeometry args={[0.15, 0.28, 0.04]} />
              <meshPhysicalMaterial
                color="#f5f0e4"
                transparent
                opacity={0.9}
                metalness={0.1}
                roughness={0.3}
                clearcoat={0.5}
              />
            </mesh>
            <mesh position={[0, 0.1, 0.002]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.05, 0.015, 12, 20]} />
              <meshPhysicalMaterial
                color="#f5f0e4"
                metalness={0.3}
                roughness={0.4}
              />
            </mesh>
            <mesh position={[0, -0.1, 0.023]}>
              <boxGeometry args={[0.12, 0.06, 0.01]} />
              <meshStandardMaterial color="#c8bfa8" />
            </mesh>
            <mesh position={[-0.065, 0, 0.024]}>
              <boxGeometry args={[0.02, 0.24, 0.005]} />
              <meshStandardMaterial color="#b8b090" />
            </mesh>
            <mesh position={[0.065, 0, 0.024]}>
              <boxGeometry args={[0.02, 0.24, 0.005]} />
              <meshStandardMaterial color="#b8b090" />
            </mesh>
          </group>
          <group
            scale={2.25}
            position={[0, -0.55, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              e.target.releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e) => {
              e.target.setPointerCapture(e.pointerId);
              drag(
                new THREE.Vector3()
                  .copy(e.point)
                  .sub(vec.copy(card.current.translation())),
              );
            }}
          >
            <RoundedBox
              args={[0.71, 1, 0.02]}
              radius={0.03}
              smoothness={4}
              castShadow
              receiveShadow
            >
              <meshPhysicalMaterial
                color="#2a3018"
                metalness={0.8}
                roughness={0.2}
                clearcoat={1}
                clearcoatRoughness={0.1}
                reflectivity={0.9}
                emissive="#3a4020"
                emissiveIntensity={0.2}
              />
            </RoundedBox>
            <RoundedBox
              args={[0.72, 1.01, 0.021]}
              radius={0.03}
              smoothness={4}
              position={[0, 0, 0.001]}
            >
              <meshPhysicalMaterial
                color="#4a5830"
                metalness={0.7}
                roughness={0.3}
                transparent
                opacity={0.4}
              />
            </RoundedBox>
            <group position={[0, 0, 0.012]}>
              <mesh position={[0, 0.43, 0]}>
                <planeGeometry args={[0.71, 0.08]} />
                <meshStandardMaterial color="#1a2010" />
              </mesh>
              <Text
                position={[0, 0.43, 0.001]}
                fontSize={0.025}
                color="#a8c060"
                anchorX="center"
                anchorY="middle"
                letterSpacing={0.15}
                fontWeight={700}
              >
                PROFESSIONAL ID
              </Text>
              <Text
                position={[0, 0.28, 0]}
                fontSize={0.045}
                color="#f5f0e4"
                anchorX="center"
                anchorY="middle"
                fontWeight={900}
                letterSpacing={0.02}
              >
                JAMES ASUELIMEN O.
              </Text>
              <Text
                position={[0, 0.19, 0]}
                fontSize={0.034}
                color="#c8bfa8"
                anchorX="center"
                anchorY="middle"
                fontWeight={600}
              >
                SOFTWARE ENGINEER
              </Text>
              <mesh position={[0, -0.08, 0]}>
                <planeGeometry args={[0.38, 0.38]} />
                <meshStandardMaterial color="#2a3018" />
              </mesh>
              {profileImage ? (
                <mesh position={[0, -0.08, 0.001]}>
                  <planeGeometry args={[0.36, 0.36]} />
                  <meshStandardMaterial
                    map={profileImage}
                    roughness={0.4}
                    metalness={0}
                  />
                </mesh>
              ) : (
                <Text
                  position={[0, -0.08, 0.002]}
                  fontSize={0.025}
                  color="#888888"
                  anchorX="center"
                  anchorY="middle"
                >
                  PHOTO
                </Text>
              )}
              <mesh position={[0, -0.32, 0]}>
                <planeGeometry args={[0.6, 0.002]} />
                <meshStandardMaterial color="#a8c060" />
              </mesh>
              <Text
                position={[0, -0.41, 0]}
                fontSize={0.018}
                color="#8a8070"
                anchorX="center"
                anchorY="middle"
                fontWeight={600}
              >
                ID: EMP-2024-001
              </Text>
            </group>
            <RoundedBox
              args={[0.71, 1, 0.02]}
              radius={0.03}
              smoothness={4}
              position={[0, 0, -0.011]}
              rotation={[0, Math.PI, 0]}
              castShadow
              receiveShadow
            >
              <meshPhysicalMaterial
                color="#f0ebe0"
                metalness={0.3}
                roughness={0.2}
                clearcoat={0.8}
                clearcoatRoughness={0.2}
              />
            </RoundedBox>
            {qrTexture && (
              <mesh position={[0, 0.05, -0.022]} rotation={[0, Math.PI, 0]}>
                <planeGeometry args={[0.5, 0.5]} />
                <meshStandardMaterial map={qrTexture} />
              </mesh>
            )}
            <group position={[0, 0, -0.022]} rotation={[0, Math.PI, 0]}>
              <mesh position={[0, 0.43, 0]}>
                <planeGeometry args={[0.71, 0.08]} />
                <meshStandardMaterial color="#1a2010" />
              </mesh>
              <Text
                position={[0, 0.43, 0.001]}
                fontSize={0.025}
                color="#a8c060"
                anchorX="center"
                anchorY="middle"
                fontWeight={600}
                letterSpacing={0.1}
              >
                SCAN FOR GITHUB
              </Text>
              <Text
                position={[0, -0.35, 0.001]}
                fontSize={0.02}
                color="#8a8070"
                anchorX="center"
                anchorY="middle"
              >
                github.com/jamesking77-create
              </Text>
              <mesh position={[0, -0.42, 0.001]}>
                <planeGeometry args={[0.5, 0.001]} />
                <meshStandardMaterial color="#a8c060" />
              </mesh>
              <Text
                position={[0, -0.46, 0.001]}
                fontSize={0.015}
                color="#6a6050"
                anchorX="center"
                anchorY="middle"
              >
                EST. 2024
              </Text>
            </group>
          </group>
        </RigidBody>
      </group>
      <mesh ref={ropeMesh} castShadow receiveShadow>
        <meshStandardMaterial
          map={ropeTexture.current}
          roughness={0.85}
          metalness={0}
        />
      </mesh>
    </>
  );
}

function BadgeCanvas({ isMobile }) {
  // Wider FOV on mobile so the badge fits in view
  const fov = isMobile ? 38 : 25;
  return (
    <Canvas
      camera={{ position: [0, 0, 13], fov }}
      shadows
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.9,
      }}
      style={{ pointerEvents: "auto" }}
    >
      <GradientBackground />
      <directionalLight
        position={[8, 10, 6]}
        intensity={2.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight position={[-6, 4, 4]} intensity={1.2} color="#f5f0e4" />
      <pointLight position={[6, 2, -4]} intensity={1} color="#c8bfa8" />
      <ambientLight intensity={0.5} />
      <Suspense fallback={null}>
        <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
          <Badge isMobile={isMobile} />
        </Physics>
      </Suspense>
    </Canvas>
  );
}

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
            <BadgeCanvas isMobile={isMobile} />
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
