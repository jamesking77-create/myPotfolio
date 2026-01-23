import { useState, useEffect, Suspense, useRef } from "react";
import { X } from "lucide-react";
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
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { Text, RoundedBox, shaderMaterial } from "@react-three/drei";
import QRCode from "qrcode";

extend({ MeshLineGeometry, MeshLineMaterial });

const LiquidGradientMaterial = shaderMaterial(
  {},
  `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  `
  varying vec2 vUv;
  void main() {
    vec3 dark = vec3(0.102, 0.102, 0.102);
    vec3 mid  = vec3(0.176, 0.290, 0.243);
    vec3 teal = vec3(0.063, 0.725, 0.506);
    float diag = (vUv.x + (1.0 - vUv.y)) * 0.5;
    vec3 color = mix(dark, mid, smoothstep(0.2, 0.8, diag));
    float glow1 = smoothstep(0.55, 0.0, distance(vUv, vec2(0.5, 0.5)));
    color = mix(color, teal, glow1 * 0.08);
    float glow2 = smoothstep(0.7, 0.0, distance(vUv, vec2(0.0, 1.0)));
    color = mix(color, teal, glow2 * 0.05);
    float glow3 = smoothstep(0.7, 0.0, distance(vUv, vec2(1.0, 0.0)));
    color = mix(color, teal, glow3 * 0.04);
    float vignette = smoothstep(0.0, 0.35, vUv.x) * smoothstep(0.0, 0.35, vUv.y) * smoothstep(0.0, 0.35, 1.0 - vUv.x) * smoothstep(0.0, 0.35, 1.0 - vUv.y);
    color *= vignette + 0.85;
    gl_FragColor = vec4(color, 1.0);
  }
  `,
);

extend({ LiquidGradientMaterial });

function GradientBackground() {
  const { viewport } = useThree();
  return (
    <>
      <mesh position={[0, 0, -1]} scale={[viewport.width, viewport.height, 1]}>
        <planeGeometry args={[1.2, 1.2]} />
        <liquidGradientMaterial />
      </mesh>
      <mesh
        position={[0, 0, -0.9]}
        scale={[viewport.width, viewport.height, 1]}
      >
        <planeGeometry args={[1.2, 1.2]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.02} />
      </mesh>
    </>
  );
}

function createLanyardTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#1f2933";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 6000; i++) {
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.04})`;
    ctx.fillRect(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      1,
      1,
    );
  }
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = "#10b981";
  ctx.font = "bold 42px Inter, system-ui";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let y = -600; y <= 600; y += 160) {
    ctx.fillText("JAMES_KING", 0, y);
  }
  ctx.restore();
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 6);
  texture.anisotropy = 16;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
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

function Badge() {
  const ropeMesh = useRef();
  const ropeTexture = useRef(createLanyardTexture());
  const fixed = useRef();
  const j1 = useRef();
  const j2 = useRef();
  const j3 = useRef();
  const card = useRef();
  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const dir = new THREE.Vector3();

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
    const loadImages = async () => {
      const loader = new THREE.TextureLoader();
      loader.load("/james.jpg", (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        setProfileImage(texture);
      });
      try {
        const canvas = document.createElement("canvas");
        await QRCode.toCanvas(canvas, "https://github.com/jamesking77-create", {
          width: 512,
          margin: 1,
        });
        const qrTex = new THREE.CanvasTexture(canvas);
        qrTex.colorSpace = THREE.SRGBColorSpace;
        setQrTexture(qrTex);
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    };
    loadImages();
  }, []);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 0.85, 0],
  ]);

  useFrame((state, delta) => {
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
    [j1, j2, j3, card].forEach((r) => r.current?.wakeUp());
    if (fixed.current) {
      fixed.current.setNextKinematicTranslation({ x: 3, y: 5, z: 0 });
      [j1, j2].forEach((ref, i) => {
        if (!ref.current.lerped)
          ref.current.lerped = new THREE.Vector3().copy(
            ref.current.translation(),
          );
        const clampedDistance = Math.max(
          0.1,
          Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())),
        );
        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (i === 0 ? 1 : 1 + clampedDistance),
        );
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      const points = curve.getPoints(40);
      if (ropeMesh.current) {
        ropeMesh.current.geometry.dispose();
        ropeMesh.current.geometry = new THREE.TubeGeometry(
          new THREE.CatmullRomCurve3(points),
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
          <mesh position={[0, 1.15, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.035, 0.035, 0.06, 16]} />
            <meshStandardMaterial
              color="#e5e7eb"
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
      <mesh ref={ropeMesh} castShadow receiveShadow>
        <meshStandardMaterial
          map={ropeTexture.current}
          roughness={0.85}
          metalness={0}
        />
      </mesh>
      <Text
        position={[3, 5.2, 0]}
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

function BadgeCanvas() {
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
      <GradientBackground />
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
          <Badge />
        </Physics>
      </Suspense>
    </Canvas>
  );
}

export default function MenuPage({ onBack, onNavigate }) {
  const [pageLoaded, setPageLoaded] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const menuItems = [
    { id: "about", label: "ABOUT", number: "01" },
    { id: "skills", label: "SKILLS", number: "02" },
    { id: "experience", label: "EXPERIENCE", number: "03" },
    { id: "projects", label: "PROJECTS", number: "04" },
    { id: "education", label: "EDUCATION", number: "05" },
    { id: "contact", label: "CONTACT", number: "06" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeInUp { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .animate-fadeIn { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .menu-item-text { font-family: 'Rostex'; letter-spacing: 0.02em; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .menu-item:hover .menu-item-text { letter-spacing: 0.06em; }
        .menu-number { font-family: 'Courier New', monospace; font-size: 0.7rem; opacity: 0.5; }
        .blob-bg { position: absolute; width: 600px; height: 600px; background: radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%); border-radius: 50%; filter: blur(80px); animation: float 8s ease-in-out infinite; }
        @keyframes float { 0%, 100% { transform: translate(0, 0) scale(1); } 33% { transform: translate(50px, -50px) scale(1.1); } 66% { transform: translate(-50px, 50px) scale(0.9); } }
        .social-link { font-family: 'Courier New', monospace; font-size: 0.75rem; letter-spacing: 0.05em; opacity: 0.6; transition: opacity 0.3s ease; }
        .social-link:hover { opacity: 1; }
      `}</style>

      <div className="h-screen w-screen relative overflow-hidden bg-[#3a3d44] flex">
        <div className="w-1/2 relative z-10">
          <div className="blob-bg top-[-100px] left-[-100px]"></div>
          <div
            className="blob-bg bottom-[-100px] right-[-100px]"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className={`absolute top-8 left-12 z-30 ${pageLoaded ? "animate-fadeIn" : "opacity-0"}`}
          >
            <div className="text-white/60 text-sm tracking-wider font-light">
              sharlee / james asuelimen
            </div>
          </div>
          <button
            onClick={onBack}
            className={`absolute top-8 right-12 z-30 group text-white/60 hover:text-white transition-colors duration-300 ${pageLoaded ? "animate-fadeIn" : "opacity-0"}`}
            style={{ animationDelay: "0.1s" }}
          >
            <X className="w-8 h-8" strokeWidth={1.5} />
          </button>
          <div className="h-full flex items-center pl-32">
            <div className="flex flex-col items-start space-y-2">
              {menuItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`menu-item group ${pageLoaded ? "animate-fadeInUp" : "opacity-0"}`}
                  style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                >
                  <div className="flex items-center gap-8">
                    <span className="menu-number text-white/50 whitespace-nowrap">
                      {item.number}
                    </span>
                    <span className="menu-item-text text-white text-5xl font-bold tracking-wide">
                      {item.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div
            className={`absolute bottom-8 left-12 right-12 flex justify-between items-center z-20 ${pageLoaded ? "animate-fadeIn" : "opacity-0"}`}
            style={{ animationDelay: "0.8s" }}
          >
            <div className="social-link text-white">↗ instagram</div>
            <div className="social-link text-white">↗ github</div>
          </div>
        </div>
        <div className="w-1/2 relative">
          <BadgeCanvas />
        </div>
      </div>
    </>
  );
}
