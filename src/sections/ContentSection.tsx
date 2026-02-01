import React from 'react';
import { motion } from 'framer-motion';
import { BrainVisualization } from '@/components/BrainVisualization';
import { FloatingTriangles } from '@/components/FloatingTriangles';
import { useInView } from '@/hooks/useInView';
import { fadeInUp, slideInFromLeft, slideInFromRight } from '@/lib/animations';

interface ContentSectionProps {
  id?: string;
  title: string;
  paragraphs: string[];
  accentText?: string;
  layout: 'brain-left' | 'brain-right' | 'text-only';
  brainPosition?: 'left' | 'right';
  triangleDensity?: 'low' | 'medium' | 'high';
  className?: string;
}

export const ContentSection: React.FC<ContentSectionProps> = ({
  id,
  title,
  paragraphs,
  accentText,
  layout,
  brainPosition = 'right',
  triangleDensity = 'low',
  className = '',
}) => {
  const { ref, isInView } = useInView<HTMLElement>({ threshold: 0.2 });

  const isBrainLeft = layout === 'brain-left';
  const hasBrain = layout !== 'text-only';

  return (
    <section
      id={id}
      ref={ref}
      className={`relative min-h-screen flex items-center overflow-hidden bg-black section-padding ${className}`}
    >
      {/* Floating Triangles Background */}
      <FloatingTriangles density={triangleDensity} />

      {/* Brain Visualization */}
      {hasBrain && (
        <div
          className={`absolute ${
            isBrainLeft ? 'left-0' : 'right-0'
          } top-0 w-full md:w-[55%] h-full opacity-60 md:opacity-100`}
        >
          <BrainVisualization position={brainPosition} />
        </div>
      )}

      {/* Content */}
      <div className="container-custom relative z-10">
        <div
          className={`max-w-lg ${
            isBrainLeft ? 'ml-auto mr-0 md:mr-10' : 'mr-auto ml-0 md:ml-10'
          }`}
        >
          <motion.div
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={isBrainLeft ? slideInFromRight : slideInFromLeft}
          >
            {/* Title */}
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-semibold text-white leading-tight"
            >
              {title}
            </motion.h2>

            {/* Paragraphs */}
            {paragraphs.map((paragraph, index) => (
              <motion.p
                key={index}
                variants={fadeInUp}
                className="mt-6 text-text-secondary text-base md:text-lg leading-relaxed"
              >
                {paragraph}
              </motion.p>
            ))}

            {/* Accent Text */}
            {accentText && (
              <motion.p
                variants={fadeInUp}
                className="mt-6 text-accent-gold text-base md:text-lg leading-relaxed italic"
              >
                {accentText}
              </motion.p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContentSection;
