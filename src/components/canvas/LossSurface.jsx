import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { heightToColor } from '../../math/simulationMath';

const SEGMENTS = 80;
const DOMAIN = 8; // covers [-4, 4]

export function LossSurface({ surfaceFn }) {
  const wireMeshRef = useRef();

  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(DOMAIN, DOMAIN, SEGMENTS, SEGMENTS);
    g.rotateX(-Math.PI / 2);

    const pos = g.attributes.position;
    const colors = new Float32Array(pos.count * 3);

    // First pass: set heights
    const heights = [];
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const y = surfaceFn(x, z);
      pos.setY(i, y);
      heights.push(y);
    }

    // Second pass: assign vertex colors based on normalized height
    const minH = Math.min(...heights);
    const maxH = Math.max(...heights);
    const range = maxH - minH || 1;
    for (let i = 0; i < pos.count; i++) {
      const t = (heights[i] - minH) / range;
      const [r, gr, b] = heightToColor(t);
      colors[i * 3] = r;
      colors[i * 3 + 1] = gr;
      colors[i * 3 + 2] = b;
    }

    g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    g.computeVertexNormals();
    pos.needsUpdate = true;
    return g;
  }, [surfaceFn]);

  // Subtle wireframe pulse animation
  useFrame(({ clock }) => {
    if (wireMeshRef.current) {
      wireMeshRef.current.material.opacity = 0.08 + 0.04 * Math.sin(clock.elapsedTime * 0.8);
    }
  });

  return (
    <group>
      {/* Solid colored surface */}
      <mesh geometry={geometry} receiveShadow>
        <meshStandardMaterial
          vertexColors
          side={THREE.DoubleSide}
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>

      {/* Wireframe overlay */}
      <mesh geometry={geometry} ref={wireMeshRef}>
        <meshBasicMaterial
          wireframe
          color="#ffffff"
          transparent
          opacity={0.1}
        />
      </mesh>
    </group>
  );
}
