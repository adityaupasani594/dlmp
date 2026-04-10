import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSimStore } from '../../store/useSimStore';
import { LEVELS } from '../../levels/levelConfig';

/** Invisible component inside Canvas that drives the simulation clock */
export function SimulationClock() {
  const clockAcc = useRef(0);
  const isRunning = useSimStore((s) => s.isRunning);
  const speed = useSimStore((s) => s.speed);
  const stepSim = useSimStore((s) => s.stepSim);

  useFrame((_, delta) => {
    if (!isRunning) return;
    clockAcc.current += delta;
    const interval = 1 / (speed * 2); // speed 1 → 0.5 steps/s; speed 10 → 20 steps/s
    if (clockAcc.current >= interval) {
      clockAcc.current = 0;
      stepSim();
    }
  });

  return null;
}

/** Global minimum beacon ring */
export function GlobalMinMarker({ surfaceFn, globalMin }) {
  const ringRef = useRef();

  useFrame(({ clock }) => {
    if (ringRef.current) {
      const t = clock.elapsedTime;
      ringRef.current.rotation.y = t * 1.2;
      ringRef.current.scale.setScalar(1 + 0.12 * Math.sin(t * 3));
    }
  });

  const y = surfaceFn(globalMin.x, globalMin.z);

  return (
    <group position={[globalMin.x, y + 0.05, globalMin.z]}>
      {/* Animated ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[0.5, 0.04, 8, 48]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.9} />
      </mesh>
      {/* Beacon pillar (line upward) */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 1.0, 6]} />
        <meshBasicMaterial color="#10b98166" transparent opacity={0.5} />
      </mesh>
      {/* Point light for glow */}
      <pointLight color="#10b981" intensity={2} distance={3} decay={2} />
    </group>
  );
}
