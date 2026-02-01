import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface Triangle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  rotation: number;
}

interface FloatingTrianglesProps {
  density?: 'low' | 'medium' | 'high';
  className?: string;
}

const colors = [
  'rgba(34, 211, 238, 0.4)', // cyan
  'rgba(236, 72, 153, 0.4)', // pink
  'rgba(20, 184, 166, 0.4)', // teal
  'rgba(212, 168, 83, 0.4)', // gold
  'rgba(124, 58, 237, 0.4)', // purple
];

export const FloatingTriangles: React.FC<FloatingTrianglesProps> = ({
  density = 'medium',
  className = '',
}) => {
  const triangleCount = density === 'low' ? 15 : density === 'medium' ? 30 : 50;

  const triangles = useMemo<Triangle[]>(() => {
    return Array.from({ length: triangleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: Math.random() * 4 + 6,
      delay: Math.random() * 4,
      rotation: Math.random() * 360,
    }));
  }, [triangleCount]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {triangles.map((triangle) => (
        <motion.div
          key={triangle.id}
          className="absolute"
          style={{
            left: `${triangle.x}%`,
            top: `${triangle.y}%`,
            width: 0,
            height: 0,
            borderLeft: `${triangle.size / 2}px solid transparent`,
            borderRight: `${triangle.size / 2}px solid transparent`,
            borderBottom: `${triangle.size}px solid ${triangle.color}`,
            transform: `rotate(${triangle.rotation}deg)`,
          }}
          animate={{
            y: [-20, 20, -20],
            rotate: [triangle.rotation, triangle.rotation + 10, triangle.rotation],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: triangle.duration,
            delay: triangle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

export default FloatingTriangles;
