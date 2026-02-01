import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface BrainParticlesProps {
  position?: 'left' | 'right';
}

function BrainParticles({ position = 'right' }: BrainParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 3000;

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorPalette = [
      new THREE.Color(0xD4A853), // gold
      new THREE.Color(0x22D3EE), // cyan
      new THREE.Color(0xEC4899), // pink
      new THREE.Color(0x14B8A6), // teal
      new THREE.Color(0x7C3AED), // purple
      new THREE.Color(0xFFFFFF), // white
    ];

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Create brain-like shape using spherical coordinates with noise
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;
      
      // Add noise for organic brain shape
      const noise = Math.sin(phi * 3) * Math.cos(theta * 2) * 0.3;
      const radius = 2 + noise;
      
      // Two hemispheres (brain shape)
      const hemisphereOffset = i < particleCount / 2 ? -0.8 : 0.8;
      
      positions[i3] = radius * Math.cos(theta) * Math.sin(phi) + hemisphereOffset;
      positions[i3 + 1] = radius * Math.sin(theta) * Math.sin(phi) * 0.8;
      positions[i3 + 2] = radius * Math.cos(phi) * 0.8;

      // Assign colors
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    return [positions, colors];
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
    }
  });

  const xPosition = position === 'right' ? 2 : -2;

  return (
    <Points
      ref={pointsRef}
      positions={positions}
      colors={colors}
      position={[xPosition, 0, 0]}
    >
      <PointMaterial
        vertexColors
        size={0.03}
        sizeAttenuation
        transparent
        opacity={0.8}
        depthWrite={false}
      />
    </Points>
  );
}

interface BrainVisualizationProps {
  position?: 'left' | 'right';
  className?: string;
}

export const BrainVisualization: React.FC<BrainVisualizationProps> = ({
  position = 'right',
  className = '',
}) => {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <BrainParticles position={position} />
      </Canvas>
    </div>
  );
};

export default BrainVisualization;
