import React from 'react';
import { motion } from 'framer-motion';
import { FloatingTriangles } from '@/components/FloatingTriangles';
import { useInView } from '@/hooks/useInView';
import { fadeInUp, staggerContainer } from '@/lib/animations';

interface TextSectionProps {
  lines: string[];
  triangleDensity?: 'low' | 'medium' | 'high';
  className?: string;
}

export const TextSection: React.FC<TextSectionProps> = ({
  lines,
  triangleDensity = 'high',
  className = '',
}) => {
  const { ref, isInView } = useInView<HTMLElement>({ threshold: 0.3 });

  return (
    <section
      ref={ref}
      className={`relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-black section-padding ${className}`}
    >
      {/* Floating Triangles Background */}
      <FloatingTriangles density={triangleDensity} />

      {/* Content */}
      <div className="container-custom relative z-10 text-center">
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="max-w-3xl mx-auto"
        >
          {lines.map((line, index) => (
            <motion.p
              key={index}
              variants={fadeInUp}
              className={`text-xl md:text-2xl lg:text-3xl text-white leading-relaxed ${
                index > 0 ? 'mt-4' : ''
              }`}
            >
              {line}
            </motion.p>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TextSection;
