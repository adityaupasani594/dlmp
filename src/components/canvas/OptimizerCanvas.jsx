import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, GizmoHelper, GizmoViewport } from '@react-three/drei';
import { Suspense } from 'react';
import { LossSurface } from './LossSurface';
import { BallAgent } from './BallAgent';
import { SimulationClock, GlobalMinMarker } from './SceneSetup';
import { useSimStore } from '../../store/useSimStore';
import { LEVELS } from '../../levels/levelConfig';

function SceneContent() {
  const currentLevel = useSimStore((s) => s.currentLevel);
  const level = LEVELS[currentLevel];

  return (
    <>
      {/* Ambient + directional light */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-5, 8, -5]} intensity={0.6} color="#4f8ef7" />
      <pointLight position={[5, 5, -5]} intensity={0.4} color="#8b5cf6" />

      {/* Stars background */}
      <Stars radius={60} depth={40} count={2000} factor={3} saturation={0.3} fade speed={0.5} />

      {/* Loss surface */}
      <LossSurface surfaceFn={level.surfaceFn} />

      {/* Global minimum beacon */}
      <GlobalMinMarker surfaceFn={level.surfaceFn} globalMin={level.globalMin} />

      {/* Ball agent */}
      <BallAgent />

      {/* Simulation clock (invisible, drives step loop) */}
      <SimulationClock />

      {/* Camera controls */}
      <OrbitControls
        makeDefault
        enablePan
        enableZoom
        enableRotate
        minDistance={3}
        maxDistance={25}
        minPolarAngle={0.1}
        maxPolarAngle={Math.PI / 2.1}
      />

      {/* Orientation gizmo */}
      <GizmoHelper alignment="bottom-right" margin={[60, 60]}>
        <GizmoViewport axisColors={['#ef4444', '#10b981', '#4f8ef7']} labelColor="white" />
      </GizmoHelper>
    </>
  );
}

export function OptimizerCanvas() {
  return (
    <div className="relative w-full h-full bg-slate-950">
      <Canvas
        shadows
        camera={{ position: [0, 9, 12], fov: 50, near: 0.1, far: 200 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.setClearColor('#0a0e1a');
        }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>

      {/* Canvas overlay label */}
      <div className="absolute top-4 left-4 pointer-events-none">
        <span className="text-xs font-mono text-slate-500 bg-slate-950/60 px-2 py-1 rounded">
          Drag to orbit · Scroll to zoom · Right-drag to pan
        </span>
      </div>
    </div>
  );
}
