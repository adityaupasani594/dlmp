import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Line, Sphere } from '@react-three/drei';
import { useSimStore } from '../../store/useSimStore';
import { LEVELS } from '../../levels/levelConfig';

export function BallAgent() {
  const meshRef = useRef();
  const glowRef = useRef();
  const targetPos = useRef(new THREE.Vector3(0.15, 0, 0.15));

  const ballPosition = useSimStore((s) => s.ballPosition);
  const trail = useSimStore((s) => s.trail);
  const currentLevel = useSimStore((s) => s.currentLevel);
  const levelComplete = useSimStore((s) => s.levelComplete);

  const level = LEVELS[currentLevel];

  // Update target position when ball moves
  useEffect(() => {
    const y = level.surfaceFn(ballPosition.x, ballPosition.z);
    targetPos.current.set(ballPosition.x, y + 0.15, ballPosition.z);
  }, [ballPosition, level]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    // Smooth lerp to target
    meshRef.current.position.lerp(targetPos.current, 0.18);

    // Pulse glow when complete
    if (glowRef.current) {
      if (levelComplete) {
        const s = 1.4 + 0.4 * Math.sin(clock.elapsedTime * 8);
        glowRef.current.scale.setScalar(s);
        glowRef.current.material.opacity = 0.25 + 0.15 * Math.sin(clock.elapsedTime * 6);
      } else {
        const s = 1.1 + 0.05 * Math.sin(clock.elapsedTime * 3);
        glowRef.current.scale.setScalar(s);
        glowRef.current.material.opacity = 0.15;
      }
    }
  });

  // Build trail points on the surface
  const trailPoints = trail.length > 1
    ? trail.map((p) => {
        const y = level.surfaceFn(p.x, p.z);
        return new THREE.Vector3(p.x, y + 0.12, p.z);
      })
    : null;

  const ballColor = levelComplete ? '#10b981' : '#4f8ef7';
  const emissiveColor = levelComplete ? '#10b981' : '#4f8ef7';

  return (
    <group>
      {/* Trail line */}
      {trailPoints && trailPoints.length > 1 && (
        <Line
          points={trailPoints}
          color="#f59e0b"
          lineWidth={2.5}
          transparent
          opacity={0.85}
          vertexColors={false}
        />
      )}

      {/* Glow halo */}
      <mesh ref={glowRef} position={meshRef.current?.position || [0.15, 0.15, 0.15]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshBasicMaterial color={emissiveColor} transparent opacity={0.15} />
      </mesh>

      {/* Main ball */}
      <mesh ref={meshRef} castShadow position={[0.15, 0.15, 0.15]}>
        <sphereGeometry args={[0.14, 32, 32]} />
        <meshStandardMaterial
          color={ballColor}
          emissive={emissiveColor}
          emissiveIntensity={levelComplete ? 2.5 : 1.2}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>
    </group>
  );
}
