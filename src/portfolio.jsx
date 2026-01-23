import * as THREE from "three";
import { useRef, useState, Suspense, useEffect } from "react";
import { Canvas, extend, useThree, useFrame } from "@react-three/fiber";
import {
  Physics,
  RigidBody,
  BallCollider,
  CuboidCollider,
  useRopeJoint,
  useSphericalJoint,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { Text, RoundedBox } from "@react-three/drei";
import QRCode from "qrcode";
import { ChevronRight } from "lucide-react";
import jamesking from "./assets/jamesKing.svg";

extend({ MeshLineGeometry, MeshLineMaterial });

function RiceEffect() {
  const points = useRef();
  const particleCount = 3000;

  const [positions] = useState(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  });

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#ffffff"
        transparent
        opacity={0.15}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function LanyardClip() {
  return (
    <group position={[0, 0.1, 0]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.15, 16]} />
        <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh
        position={[0, -0.12, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
        receiveShadow
      >
        <torusGeometry args={[0.08, 0.02, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh
        position={[0, 0.12, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
        receiveShadow
      >
        <torusGeometry args={[0.04, 0.012, 12, 24]} />
        <meshStandardMaterial
          color="#e5e7eb"
          metalness={0.75}
          roughness={0.25}
        />
      </mesh>
      <mesh position={[0.08, -0.12, 0]} castShadow>
        <sphereGeometry args={[0.025, 12, 12]} />
        <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

function Badge({ onLoad, showTerminal }) {
  const band = useRef();
  const fixed = useRef();
  const j1 = useRef();
  const j2 = useRef();
  const j3 = useRef();
  const card = useRef();
  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const dir = new THREE.Vector3();
  const { width, height } = useThree((state) => state.size);

  const [targetX, setTargetX] = useState(0);
  const smoothX = useRef(0);
  const initializedRef = useRef(false);

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ])
  );

  useEffect(() => {
    if (!initializedRef.current) {
      smoothX.current = 0;
      initializedRef.current = true;
    }
    // Slightly increased movement range for more dramatic effect
    setTargetX(showTerminal ? -2.8 : 0);
  }, [showTerminal]);

  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);
  const [qrTexture, setQrTexture] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const loadImages = async () => {
      const loader = new THREE.TextureLoader();
      loader.load(
        "/james.jpg",
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          setProfileImage(texture);
        },
        undefined,
        (error) => console.error("Error loading james.jpg:", error)
      );

      try {
        const canvas = document.createElement("canvas");
        await QRCode.toCanvas(canvas, "https://github.com/jamesking77-create", {
          width: 512,
          margin: 1,
        });
        const qrTex = new THREE.CanvasTexture(canvas);
        qrTex.colorSpace = THREE.SRGBColorSpace;
        qrTex.minFilter = THREE.LinearFilter;
        qrTex.magFilter = THREE.LinearFilter;
        setQrTexture(qrTex);
        onLoad();
      } catch (error) {
        console.error("Error generating QR code:", error);
        onLoad();
      }
    };
    loadImages();
  }, [onLoad]);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 0.85, 0],
  ]);

  useFrame((state, delta) => {
    // Smooth easing function for buttery animation
    const ease = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
    const diff = targetX - smoothX.current;
    const speed = 0.12; // Slower, more elegant speed
    smoothX.current += diff * speed;

    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }

    if (fixed.current) {
      fixed.current.setNextKinematicTranslation({
        x: 3 + smoothX.current,
        y: 5,
        z: 0,
      });

      [j1, j2].forEach((ref, i) => {
        if (!ref.current.lerped)
          ref.current.lerped = new THREE.Vector3().copy(
            ref.current.translation()
          );
        const clampedDistance = Math.max(
          0.1,
          Math.min(1, ref.current.lerped.distanceTo(ref.current.translation()))
        );
        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (i === 0 ? 1 : 1 + clampedDistance)
        );
      });

      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(32));

      ang.copy(card.current.angvel());
      card.current.setAngvel(
        { x: ang.x * 0.98, y: ang.y * 0.98, z: ang.z * 0.98 },
        true
      );
    }
  });

  curve.curveType = "chordal";

  return (
    <>
      <group position={[3, 5, 0]}>
        <RigidBody ref={fixed} type="kinematicPosition" position={[0, 0, 0]}>
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
          <group position={[0, 0.72, 0]}>
            <mesh position={[0, 0, 0]}>
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
                color="#e5e7eb"
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
                color="#ffffff"
                metalness={0.3}
                roughness={0.4}
              />
            </mesh>
            <mesh position={[0, -0.1, 0.023]}>
              <boxGeometry args={[0.12, 0.06, 0.01]} />
              <meshStandardMaterial color="#d1d5db" />
            </mesh>
            <mesh position={[-0.065, 0, 0.024]}>
              <boxGeometry args={[0.02, 0.24, 0.005]} />
              <meshStandardMaterial color="#c7cbd1" />
            </mesh>
            <mesh position={[0.065, 0, 0.024]}>
              <boxGeometry args={[0.02, 0.24, 0.005]} />
              <meshStandardMaterial color="#c7cbd1" />
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
                  .sub(vec.copy(card.current.translation()))
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
                color="#606060"
                metalness={0.8}
                roughness={0.2}
                clearcoat={1}
                clearcoatRoughness={0.1}
                reflectivity={0.9}
                emissive="#707070"
                emissiveIntensity={0.3}
              />
            </RoundedBox>
            <RoundedBox
              args={[0.72, 1.01, 0.021]}
              radius={0.03}
              smoothness={4}
              position={[0, 0, 0.001]}
            >
              <meshPhysicalMaterial
                color="#808080"
                metalness={0.7}
                roughness={0.3}
                transparent
                opacity={0.5}
              />
            </RoundedBox>

            <group position={[0, 0, 0.012]}>
              <mesh position={[0, 0.43, 0]}>
                <planeGeometry args={[0.71, 0.08]} />
                <meshStandardMaterial color="#2a2a2a" />
              </mesh>
              <Text
                position={[0, 0.43, 0.001]}
                fontSize={0.025}
                color="#10b981"
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
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
                fontWeight={900}
                letterSpacing={0.02}
              >
                JAMES ASUELIMEN
              </Text>
              <Text
                position={[0, 0.19, 0]}
                fontSize={0.034}
                color="#e2e8f0"
                anchorX="center"
                anchorY="middle"
                fontWeight={600}
              >
                SOFTWARE ENGINEER
              </Text>
              <mesh position={[0, -0.08, 0]}>
                <planeGeometry args={[0.38, 0.38]} />
                <meshStandardMaterial color="#555555" />
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
                  color="#a0aec0"
                  anchorX="center"
                  anchorY="middle"
                >
                  PHOTO
                </Text>
              )}
              <mesh position={[0, -0.32, 0]}>
                <planeGeometry args={[0.6, 0.002]} />
                <meshStandardMaterial color="#10b981" />
              </mesh>
              <Text
                position={[0, -0.41, 0]}
                fontSize={0.018}
                color="#cbd5e0"
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
                color="#f7fafc"
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
                <meshStandardMaterial color="#1a202c" />
              </mesh>
              <Text
                position={[0, 0.43, 0.001]}
                fontSize={0.025}
                color="#10b981"
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
                color="#718096"
                anchorX="center"
                anchorY="middle"
              >
                github.com/jamesking77-create
              </Text>
              <mesh position={[0, -0.42, 0.001]}>
                <planeGeometry args={[0.5, 0.001]} />
                <meshStandardMaterial color="#10b981" />
              </mesh>
              <Text
                position={[0, -0.46, 0.001]}
                fontSize={0.015}
                color="#a0aec0"
                anchorX="center"
                anchorY="middle"
              >
                EST. 2024
              </Text>
            </group>
          </group>
        </RigidBody>
      </group>

      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="#ffffff"
          opacity={0.6}
          transparent={true}
          depthTest
          resolution={[width, height]}
          lineWidth={0.6}
          sizeAttenuation={1}
        />
      </mesh>
      <Text
        position={[3 + smoothX.current, 5.2, 0]}
        rotation={[0, 0, Math.PI / 2]}
        fontSize={0.15}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        fontWeight={300}
        letterSpacing={0.15}
      >
        JAMES ASUELIMEN
      </Text>
    </>
  );
}

function BadgeCanvas({ onLoad, showTerminal }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 13], fov: 25 }}
      shadows
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
      }}
    >
      <color attach="background" args={["#2d2f35"]} />
      <RiceEffect />
      <directionalLight
        position={[8, 10, 6]}
        intensity={3.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight position={[-6, 4, 4]} intensity={1.5} color="#ffffff" />
      <pointLight position={[6, 2, -4]} intensity={1.2} color="#ffffff" />
      <pointLight position={[0, -5, 3]} intensity={1} color="#ffffff" />
      <ambientLight intensity={0.6} />
      <hemisphereLight
        skyColor="#4a5568"
        groundColor="#2d3748"
        intensity={0.5}
      />
      <Suspense fallback={null}>
        <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
          <Badge onLoad={onLoad} showTerminal={showTerminal} />
        </Physics>
      </Suspense>
    </Canvas>
  );
}

function TerminalPanel({ isVisible }) {
  const terminalRef = useRef(null);
  const inputRef = useRef(null);
  const PROMPT = "PS C:\\Users\\james>";
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const commands = {
    start: `Available commands:
about
skills
experience
projects
education
contact
clear
all`,
    about: `Full-stack Software Engineer with 4+ years building enterprise fintech platforms across West Africa.
99.8% uptime. <200ms latency. $50M+ daily operations.`,
    skills: `Frontend: React, TypeScript, Next.js
Backend: Java, Spring Boot, Node.js
Cloud: AWS, Docker, CI/CD
Database: MSSQL, PostgreSQL, MongoDB`,
    experience: `Software Engineer — Aristack Technology Solutions
Architected FX & trading platforms across 3 countries.`,
    projects: `AI Proctoring System
BIME Chrome Extension
Enterprise FX Trading Platform`,
    education: `ND Business Administration
Semicolon Africa — Software Engineering`,
    contact: `Email: jamesasuelimen77@gmail.com
GitHub: github.com/jamesking77-create`,
  };

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    });
  };

  const typeOutput = (text, type = "output", callback) => {
    setIsTyping(true);
    let index = 0;
    let buffer = "";
    setLines((prev) => [...prev, { content: "", type }]);
    const interval = setInterval(() => {
      buffer += text.charAt(index);
      index++;
      setLines((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { content: buffer, type };
        return updated;
      });
      scrollToBottom();
      if (index >= text.length) {
        clearInterval(interval);
        setIsTyping(false);
        if (callback) callback();
      }
    }, 8);
  };

  const executeCommand = () => {
    if (!input.trim() || isTyping) return;
    const cmd = input.trim().toLowerCase();
    setLines((prev) => [
      ...prev,
      { content: `${PROMPT} ${input}`, type: "command" },
    ]);
    setInput("");
    scrollToBottom();
    if (cmd === "clear") {
      setTimeout(() => setLines([]), 50);
      return;
    }
    if (cmd === "all") {
      const commandKeys = Object.keys(commands).filter((k) => k !== "clear");
      let currentIndex = 0;

      const typeNext = () => {
        if (currentIndex < commandKeys.length) {
          const key = commandKeys[currentIndex];
          setLines((prev) => [
            ...prev,
            { content: `\n=== ${key.toUpperCase()} ===`, type: "output" },
          ]);
          currentIndex++;
          typeOutput(commands[key], "output", typeNext);
        }
      };

      typeNext();
      return;
    }
    if (!commands[cmd]) {
      typeOutput(
        `'${cmd}' is not recognized as an internal or external command.`,
        "error"
      );
      return;
    }
    typeOutput(commands[cmd]);
  };

  useEffect(() => {
    if (isVisible) {
      setLines([
        {
          content:
            "Windows JAMES_KING_Shell\nCopyright (C) JAMES KING Corporation.\n\nType 'start' to get started.\n",
          type: "output",
        },
      ]);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isVisible]);

  useEffect(scrollToBottom, [lines]);

  return (
    <div className="w-full h-full bg-[#0c0c0c] border border-white/10 shadow-2xl">
      <div
        ref={terminalRef}
        className="h-full overflow-y-auto p-8 font-mono text-sm"
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((line, i) => (
          <pre
            key={i}
            className={`whitespace-pre-wrap leading-relaxed ${
              line.type === "error"
                ? "text-red-400"
                : line.type === "command"
                ? "text-[#22c55e]"
                : "text-[#d4d4d4]"
            }`}
          >
            {line.content}
          </pre>
        ))}
        <div className="flex items-center">
          <span className="text-[#22c55e] mr-2">{PROMPT}</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && executeCommand()}
            className="bg-transparent outline-none flex-1 text-[#d4d4d4] caret-white font-mono"
            spellCheck={false}
            autoComplete="off"
            disabled={isTyping}
          />
          <span className="ml-1 text-[#22c55e] animate-pulse">█</span>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showTerminal, setShowTerminal] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#2d2f35] relative">
      <style>{`
        * { cursor: none !important; }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>

      <div
        className="fixed pointer-events-none z-[9999] mix-blend-difference"
        style={{
          left: `${cursorPos.x}px`,
          top: `${cursorPos.y}px`,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="w-8 h-8 border-2 border-white rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full"></div>
      </div>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-[#2d2f35]">
          <div className="text-center space-y-6">
            <div className="text-5xl font-light text-white mb-2 tracking-[0.3em] uppercase">
              Hello World
            </div>
            <div className="flex gap-2 justify-center items-center">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
              <div
                className="w-2 h-2 rounded-full bg-white animate-pulse"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 rounded-full bg-white animate-pulse"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
            <div className="text-sm text-white/60 tracking-[0.2em] uppercase font-light">
              Initializing Experience
            </div>
          </div>
        </div>
      )}

      <div className="flex h-full relative">
        <div
          className={`absolute inset-0 transition-all duration-[1400ms] ease-[cubic-bezier(0.65,0,0.35,1)] ${
            showTerminal ? "w-1/2" : "w-full"
          }`}
        >
          <BadgeCanvas
            onLoad={() => setIsLoading(false)}
            showTerminal={showTerminal}
          />
          {!showTerminal && !isLoading && (
            <div className="absolute left-32 top-1/2 -translate-y-1/2 z-10 max-w-3xl">
              <div className="space-y-12">
                <div className="space-y-8">
                  <h1 className="text-white text-[120px] font-light tracking-[-0.02em] leading-none uppercase">
                    Welcome
                  </h1>
                  <div className="w-12 h-[2px] bg-white"></div>
                </div>
                <p className="text-white/70 text-lg leading-relaxed tracking-wide max-w-2xl font-light">
                  Full-stack engineer architecting high-performance enterprise
                  solutions across fintech, e-commerce, and SaaS. Delivering
                  scalable systems that drive measurable business impact with
                  99.8% uptime.
                </p>
                <button
                  onClick={() => setShowTerminal(true)}
                  className="group relative px-8 py-4 border border-white/30 text-white font-light text-base tracking-[0.15em] uppercase hover:bg-white hover:border-[#099c35] hover:text-[#2d352f] transition-all duration-500 flex items-center gap-3 overflow-hidden"
                >
                  <span className="relative z-10">Explore Portfolio</span>
                  <ChevronRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div
          className={`absolute right-0 top-0 h-full transition-all duration-[1400ms] ease-[cubic-bezier(0.65,0,0.35,1)]${
            showTerminal
              ? "translate-x-0 w-1/2 opacity-100"
              : "translate-x-full w-1/2 opacity-0"
          }`}
        >
          <div className="h-full p-8">
            <TerminalPanel isVisible={showTerminal} />
          </div>
        </div>
      </div>

      {!showTerminal && !isLoading && (
        <>
          <div className="absolute top-0 left-32 z-10">
            <img
              src={jamesking}
              alt="Logo"
              className="h-40 w-auto"
              onError={(e) => {
                console.error("Failed to load logo");
                e.target.style.display = "none";
              }}
            />
          </div>
          <div className="absolute top-12 right-32 z-10 bg-white/5 backdrop-blur-sm border border-white/10 p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-1 h-1 rounded-full bg-white/60"></div>
                <p className="text-white/60 font-light text-xs tracking-[0.2em] uppercase">
                  Drag the badge to swing
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
