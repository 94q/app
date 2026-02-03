import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FloatingTriangles } from '@/components/FloatingTriangles';
import { useInView } from '@/hooks/useInView';
import { fadeInUp, staggerContainer } from '@/lib/animations';

export const CTASection: React.FC = () => {
  const { ref, isInView } = useInView<HTMLElement>({ threshold: 0.3 });
  const navigate = useNavigate();

  const handleBuyTickets = () => {
    navigate('/tickets');
  };

  return (
    <section
      id="cta"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black section-padding"
    >
      {/* Dense Floating Triangles Background */}
      <FloatingTriangles density="high" />

      {/* Particle Explosion Effect - Simulated with CSS */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-[600px] h-[600px]">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background:
                  i % 4 === 0
                    ? '#D4A853'
                    : i % 4 === 1
                    ? '#22D3EE'
                    : i % 4 === 2
                    ? '#EC4899'
                    : '#7C3AED',
                left: '50%',
                top: '50%',
              }}
              animate={
                isInView
                  ? {
                      x: Math.cos((i / 20) * Math.PI * 2) * 200,
                      y: Math.sin((i / 20) * Math.PI * 2) * 200,
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                    }
                  : {}
              }
              transition={{
                duration: 3,
                delay: i * 0.1,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="container-custom relative z-10 text-center">
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="max-w-2xl mx-auto"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-tight"
          >
            Join us and experience the vision with us.
          </motion.h2>

          <motion.div variants={fadeInUp} className="mt-12">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBuyTickets}
              className="btn-primary text-lg px-8 py-4"
            >
              BUY TICKETS
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
