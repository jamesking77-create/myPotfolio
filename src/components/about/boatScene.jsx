import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useAnimations, Environment } from "@react-three/drei";
import * as THREE from "three";
import boatModel from "../../assets/boat/scene.gltf";

useGLTF.preload(boatModel);

// ─── Model + built-in animations ─────────────────────────────────────────────
function Boat() {
  const group = useRef();
  const { scene, animations } = useGLTF(boatModel);
  const { actions, names } = useAnimations(animations, group);

  // Play ALL baked animations (water waves, boat bob — everything)
  useEffect(() => {
    names.forEach((name) => {
      const action = actions[name];
      if (action) {
        action.reset().fadeIn(0.5).play();
        action.timeScale = 1;
      }
    });
    return () => names.forEach((name) => actions[name]?.fadeOut(0.3));
  }, [actions, names]);

  // Boost envMap so water picks up specular highlights
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        const mats = Array.isArray(child.material)
          ? child.material
          : [child.material];
        mats.forEach((mat) => {
          mat.envMapIntensity = 0.08;
          mat.needsUpdate = true;
        });
      }
    });
    return () => {
      scene.traverse((child) => {
        if (child.isMesh) {
          child.geometry?.dispose();
          const mats = Array.isArray(child.material)
            ? child.material
            : [child.material];
          mats.forEach((m) => m?.dispose());
        }
      });
    };
  }, [scene]);

  // Auto-detect model size and centre it
  useEffect(() => {
    if (!group.current) return;
    const box = new THREE.Box3().setFromObject(group.current);
    const centre = new THREE.Vector3();
    box.getCenter(centre);
    group.current.position.sub(centre); // centre on origin
  }, [scene]);

  return (
    <group ref={group} scale={12} position={[0, 0, 0]}>
      <primitive object={scene} />
    </group>
  );
}

// ─── Scroll-driven camera ─────────────────────────────────────────────────────
function ScrollCamera({ scrollProgress }) {
  const { camera } = useThree();

  useFrame(() => {
    const t = Math.min(Math.max(scrollProgress.current, 0), 1);
    // Start: slightly right and high — dolly left and down toward water level
    camera.position.x = THREE.MathUtils.lerp(1.0, -0.5, t);
    camera.position.y = THREE.MathUtils.lerp(0.3, 0.1, t);
    camera.position.z = THREE.MathUtils.lerp(4.5, 3.0, t);
    // Look at the boat — slightly above water level
    camera.lookAt(0, 0.3, 0);
  });

  return null;
}

// ─── Debug: logs model size so we can tune scale ─────────────────────────────
function SizeChecker() {
  const { scene: rootScene } = useThree();
  useEffect(() => {
    const box = new THREE.Box3().setFromObject(rootScene);
    const size = new THREE.Vector3();
    box.getSize(size);
    console.log("[BoatScene] model size:", size);
  }, [rootScene]);
  return null;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function BoatScene({ scrollProgress }) {
  const containerRef = useRef();
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05 },
    );
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      {inView && (
        <Canvas
          camera={{ position: [0, 0.3, 4.5], fov: 65 }}
          frameloop="always"
          shadows={false}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          style={{ background: "transparent" }}
        >
          <fog attach="fog" args={["#050a05", 10, 28]} />

          {/* Strong overcast sky lighting to activate water reflections */}
          <ambientLight intensity={6.0} color="#ffffff" />
          <directionalLight
            position={[0, 10, 5]}
            intensity={4.0}
            color="#e8eeed"
          />
          <directionalLight
            position={[-5, 5, -3]}
            intensity={2.5}
            color="#d0dbd8"
          />
          <directionalLight
            position={[5, 3, 3]}
            intensity={2.0}
            color="#ccd8d4"
          />
          <directionalLight
            position={[0, -3, 2]}
            intensity={1.5}
            color="#b8ccc8"
          />
          {/* Environment map — this is what activates specular highlights on water */}
          <Environment preset="dawn" background={false} />

          <ScrollCamera scrollProgress={scrollProgress} />
          <SizeChecker />

          <Suspense fallback={null}>
            <Boat />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
