import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, ContactShadows, Float, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import './PerfumeBottle3D.css';

/* ─────────────────────────────────────────────
   VELORA Label Texture (procedurally generated)
   ───────────────────────────────────────────── */
function createLabelTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, 512, 256);

  // "VELORA" brand name
  ctx.fillStyle = '#c8a45e';
  ctx.font = 'bold 52px "Playfair Display", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('VELORA', 256, 100);

  // "EAU DE PARFUM" subtitle
  ctx.fillStyle = '#a08040';
  ctx.font = '300 18px "Inter", Helvetica, sans-serif';
  ctx.letterSpacing = '6px';
  ctx.fillText('E A U   D E   P A R F U M', 256, 148);

  // Decorative lines
  ctx.strokeStyle = '#c8a45e';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(140, 70);
  ctx.lineTo(372, 70);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(140, 172);
  ctx.lineTo(372, 172);
  ctx.stroke();

  // Small decorative diamond
  ctx.fillStyle = '#c8a45e';
  ctx.beginPath();
  ctx.moveTo(256, 190);
  ctx.lineTo(262, 198);
  ctx.lineTo(256, 206);
  ctx.lineTo(250, 198);
  ctx.closePath();
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/* ─────────────────────────────────────────────
   Glass Bottle Body
   ───────────────────────────────────────────── */
function BottleBody() {
  const labelTexture = useMemo(() => createLabelTexture(), []);

  // Create the bottle shape via extrusion of a rounded rectangle
  const bottleShape = useMemo(() => {
    const shape = new THREE.Shape();
    const w = 0.75;
    const h = 1.3;
    const r = 0.08;
    shape.moveTo(-w + r, -h);
    shape.lineTo(w - r, -h);
    shape.quadraticCurveTo(w, -h, w, -h + r);
    shape.lineTo(w, h - r);
    shape.quadraticCurveTo(w, h, w - r, h);
    shape.lineTo(-w + r, h);
    shape.quadraticCurveTo(-w, h, -w, h - r);
    shape.lineTo(-w, -h + r);
    shape.quadraticCurveTo(-w, -h, -w + r, -h);
    return shape;
  }, []);

  const extrudeSettings = useMemo(() => ({
    depth: 0.55,
    bevelEnabled: true,
    bevelThickness: 0.06,
    bevelSize: 0.06,
    bevelSegments: 8,
  }), []);

  return (
    <group position={[0, 0, 0]}>
      {/* Outer glass shell */}
      <mesh position={[0, 0, -0.275]} castShadow>
        <extrudeGeometry args={[bottleShape, extrudeSettings]} />
        <meshPhysicalMaterial
          color="#1a1410"
          metalness={0.1}
          roughness={0.05}
          transmission={0.6}
          thickness={0.8}
          ior={1.5}
          clearcoat={1}
          clearcoatRoughness={0.05}
          envMapIntensity={2.5}
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Inner liquid */}
      <mesh position={[0, -0.15, 0]} castShadow>
        <boxGeometry args={[1.35, 2.15, 0.42, 1, 1, 1]} />
        <meshPhysicalMaterial
          color="#2a1a08"
          metalness={0.2}
          roughness={0.1}
          transmission={0.4}
          thickness={1.5}
          ior={1.45}
          clearcoat={0.5}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Label on front face */}
      <mesh position={[0, 0.1, 0.34]}>
        <planeGeometry args={[1.2, 0.6]} />
        <meshStandardMaterial
          map={labelTexture}
          transparent
          opacity={0.95}
          metalness={0.6}
          roughness={0.3}
          emissive="#c8a45e"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Label on back face */}
      <mesh position={[0, 0.1, -0.34]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[1.2, 0.6]} />
        <meshStandardMaterial
          map={labelTexture}
          transparent
          opacity={0.5}
          metalness={0.4}
          roughness={0.4}
        />
      </mesh>
    </group>
  );
}

/* ─────────────────────────────────────────────
   Gold Spray Nozzle
   ───────────────────────────────────────────── */
function SprayNozzle() {
  return (
    <group position={[0, 1.42, 0]}>
      {/* Nozzle collar - wider ring connecting to bottle neck */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.2, 0.28, 0.12, 32]} />
        <meshStandardMaterial
          color="#c8a45e"
          metalness={0.95}
          roughness={0.15}
          envMapIntensity={2}
        />
      </mesh>
      {/* Nozzle body */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.25, 32]} />
        <meshStandardMaterial
          color="#d4af37"
          metalness={0.95}
          roughness={0.1}
          envMapIntensity={2.5}
        />
      </mesh>
      {/* Spray tube top */}
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 0.15, 16]} />
        <meshStandardMaterial
          color="#b8942e"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>
      {/* Spray tip */}
      <mesh position={[0, 0.42, 0]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial
          color="#c8a45e"
          metalness={0.95}
          roughness={0.1}
          envMapIntensity={3}
        />
      </mesh>
    </group>
  );
}

/* ─────────────────────────────────────────────
   Luxurious Cap
   ───────────────────────────────────────────── */
function BottleCap() {
  return (
    <group position={[0, 2.1, 0]}>
      {/* Cap base ring */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.32, 0.35, 0.08, 32]} />
        <meshStandardMaterial
          color="#c8a45e"
          metalness={0.95}
          roughness={0.1}
          envMapIntensity={2}
        />
      </mesh>
      {/* Main cap body */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.62, 0.65, 0.45, 2, 2, 2]} />
        <meshPhysicalMaterial
          color="#0a0a0a"
          metalness={0.3}
          roughness={0.15}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={1.5}
        />
      </mesh>
      {/* Cap top accent */}
      <mesh position={[0, 0.53, 0]}>
        <boxGeometry args={[0.58, 0.02, 0.42]} />
        <meshStandardMaterial
          color="#c8a45e"
          metalness={0.95}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
}

/* ─────────────────────────────────────────────
   Bottle Neck
   ───────────────────────────────────────────── */
function BottleNeck() {
  return (
    <group position={[0, 1.15, 0]}>
      {/* Neck transition */}
      <mesh>
        <cylinderGeometry args={[0.22, 0.4, 0.3, 32]} />
        <meshPhysicalMaterial
          color="#1a1410"
          metalness={0.1}
          roughness={0.05}
          transmission={0.5}
          thickness={0.5}
          ior={1.5}
          clearcoat={1}
          transparent
          opacity={0.8}
        />
      </mesh>
      {/* Gold neck ring */}
      <mesh position={[0, 0.16, 0]}>
        <cylinderGeometry args={[0.24, 0.22, 0.04, 32]} />
        <meshStandardMaterial
          color="#c8a45e"
          metalness={0.95}
          roughness={0.1}
          envMapIntensity={2.5}
        />
      </mesh>
    </group>
  );
}

/* ─────────────────────────────────────────────
   Golden Floating Particles
   ───────────────────────────────────────────── */
function GoldenParticles({ count = 80 }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6,
      ],
      speed: 0.2 + Math.random() * 0.5,
      offset: Math.random() * Math.PI * 2,
      scale: 0.01 + Math.random() * 0.025,
    }));
  }, [count]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    particles.forEach((p, i) => {
      dummy.position.set(
        p.position[0] + Math.sin(t * p.speed + p.offset) * 0.5,
        p.position[1] + Math.cos(t * p.speed * 0.7 + p.offset) * 0.8,
        p.position[2] + Math.sin(t * p.speed * 0.5 + p.offset) * 0.3
      );
      dummy.scale.setScalar(p.scale * (0.5 + 0.5 * Math.sin(t * 2 + p.offset)));
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial
        color="#c8a45e"
        emissive="#c8a45e"
        emissiveIntensity={2}
        metalness={0.8}
        roughness={0.2}
        transparent
        opacity={0.8}
      />
    </instancedMesh>
  );
}

/* ─────────────────────────────────────────────
   Atmospheric Smoke
   ───────────────────────────────────────────── */
function SmokeEffect() {
  const groupRef = useRef();
  const smokePlanes = useMemo(() =>
    Array.from({ length: 6 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 3,
        -0.5 + Math.random() * 2,
        -1 - Math.random() * 2,
      ],
      rotation: Math.random() * Math.PI,
      scale: 2 + Math.random() * 3,
      speed: 0.1 + Math.random() * 0.2,
      offset: Math.random() * Math.PI * 2,
    }))
  , []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      const s = smokePlanes[i];
      child.position.y = s.position[1] + Math.sin(t * s.speed + s.offset) * 0.5;
      child.position.x = s.position[0] + Math.cos(t * s.speed * 0.5 + s.offset) * 0.3;
      child.rotation.z = s.rotation + t * s.speed * 0.1;
      child.material.opacity = 0.04 + 0.03 * Math.sin(t * 0.5 + s.offset);
    });
  });

  return (
    <group ref={groupRef}>
      {smokePlanes.map((s, i) => (
        <mesh
          key={i}
          position={s.position}
          rotation={[0, 0, s.rotation]}
          scale={s.scale}
        >
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial
            color="#c8a45e"
            transparent
            opacity={0.05}
            depthWrite={false}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ─────────────────────────────────────────────
   Golden Light Sweep
   ───────────────────────────────────────────── */
function GoldenLightSweep() {
  const lightRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (lightRef.current) {
      lightRef.current.position.x = Math.sin(t * 0.3) * 5;
      lightRef.current.position.z = Math.cos(t * 0.3) * 5;
      lightRef.current.intensity = 15 + 8 * Math.sin(t * 0.5);
    }
  });

  return (
    <pointLight
      ref={lightRef}
      position={[5, 3, 5]}
      color="#c8a45e"
      intensity={15}
      distance={15}
      decay={2}
    />
  );
}

/* ─────────────────────────────────────────────
   Complete Perfume Bottle Assembly
   ───────────────────────────────────────────── */
function PerfumeBottleAssembly() {
  const groupRef = useRef();
  const { pointer } = useThree();
  const mouseTarget = useRef({ x: 0, y: 0 });
  const currentMouse = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Smooth mouse following for interactive rotation
    mouseTarget.current.x = pointer.x * 0.3;
    mouseTarget.current.y = pointer.y * 0.15;
    currentMouse.current.x += (mouseTarget.current.x - currentMouse.current.x) * 0.05;
    currentMouse.current.y += (mouseTarget.current.y - currentMouse.current.y) * 0.05;

    if (groupRef.current) {
      // Continuous slow rotation + mouse interaction
      groupRef.current.rotation.y = t * 0.15 + currentMouse.current.x;
      groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.03 + currentMouse.current.y;

      // Subtle floating motion
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.08;
    }
  });

  return (
    <Float
      speed={1}
      rotationIntensity={0.05}
      floatIntensity={0.1}
      floatingRange={[-0.05, 0.05]}
    >
      <group ref={groupRef} scale={1.35}>
        <BottleBody />
        <BottleNeck />
        <SprayNozzle />
        <BottleCap />
      </group>
    </Float>
  );
}

/* ─────────────────────────────────────────────
   Reflective Floor
   ───────────────────────────────────────────── */
function ReflectiveFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshPhysicalMaterial
        color="#050505"
        metalness={0.8}
        roughness={0.15}
        clearcoat={0.3}
        clearcoatRoughness={0.4}
        envMapIntensity={0.5}
      />
    </mesh>
  );
}

/* ─────────────────────────────────────────────
   Scene Lighting
   ───────────────────────────────────────────── */
function SceneLighting() {
  return (
    <>
      {/* Ambient fill */}
      <ambientLight intensity={0.15} color="#ffffff" />

      {/* Key light - warm gold from top-right */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={2}
        color="#f5e6c8"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Fill light - soft from left */}
      <directionalLight
        position={[-4, 4, 2]}
        intensity={0.8}
        color="#c8a45e"
      />

      {/* Rim light from behind */}
      <pointLight
        position={[0, 3, -5]}
        intensity={8}
        color="#c8a45e"
        distance={12}
        decay={2}
      />

      {/* Bottom accent */}
      <pointLight
        position={[0, -1.5, 2]}
        intensity={5}
        color="#d4af37"
        distance={6}
        decay={2}
      />

      {/* Spotlight from above for cinematic look */}
      <spotLight
        position={[0, 10, 3]}
        angle={0.3}
        penumbra={0.8}
        intensity={15}
        color="#f5e6c8"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
    </>
  );
}

/* ─────────────────────────────────────────────
   Camera Animation
   ───────────────────────────────────────────── */
function CameraAnimation() {
  const { camera } = useThree();
  const initialSetup = useRef(false);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (!initialSetup.current) {
      camera.position.set(0, 1.5, 7);
      camera.lookAt(0, 0.5, 0);
      initialSetup.current = true;
    }

    // Very subtle camera breathing
    camera.position.x = Math.sin(t * 0.1) * 0.15;
    camera.position.z = 6.5 + Math.sin(t * 0.08) * 0.3;
    camera.lookAt(0, 0.5, 0);
  });

  return null;
}

/* ─────────────────────────────────────────────
   Loading Fallback
   ───────────────────────────────────────────── */
function LoadingFallback() {
  return (
    <div className="perfume-3d__loader">
      <div className="perfume-3d__loader-ring"></div>
      <span className="perfume-3d__loader-text">Loading 3D Scene...</span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Static Fallback for no WebGL
   ───────────────────────────────────────────── */
function StaticFallback() {
  return (
    <div className="perfume-3d__fallback">
      <img
        src="/image/ezgif-frame-025.jpg"
        alt="VELORA Luxury Perfume"
        className="perfume-3d__fallback-img"
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   WebGL Support Check
   ───────────────────────────────────────────── */
function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}

/* ═════════════════════════════════════════════
   Main PerfumeBottle3D Component (exported)
   ═════════════════════════════════════════════ */
const PerfumeBottle3D = () => {
  const [webglSupported, setWebglSupported] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setWebglSupported(isWebGLAvailable());
    setReducedMotion(
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }, []);

  if (!webglSupported || reducedMotion) {
    return <StaticFallback />;
  }

  return (
    <div className="perfume-3d">
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          shadows
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2,
            alpha: true,
          }}
          camera={{ position: [0, 1.5, 7], fov: 35 }}
          style={{ background: 'transparent' }}
        >
          <color attach="background" args={['#0a0a0a']} />
          <fog attach="fog" args={['#0a0a0a', 8, 18]} />

          <SceneLighting />
          <GoldenLightSweep />
          <CameraAnimation />

          <PerfumeBottleAssembly />
          <GoldenParticles count={60} />
          <SmokeEffect />
          <ReflectiveFloor />

          <ContactShadows
            position={[0, -2, 0]}
            opacity={0.6}
            scale={10}
            blur={2}
            far={5}
            color="#000000"
          />

          <Environment preset="night" environmentIntensity={0.4} />
        </Canvas>
      </Suspense>

      {/* CSS overlay particles for extra sparkle */}
      <div className="perfume-3d__particles-overlay">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="perfume-3d__sparkle"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default PerfumeBottle3D;
