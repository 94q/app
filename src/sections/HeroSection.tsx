import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BrainVisualization } from '@/components/BrainVisualization';
import { FloatingTriangles } from '@/components/FloatingTriangles';
import { fadeInUp, staggerContainer } from '@/lib/animations';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  const handleBuyTickets = () => {
    navigate('/tickets');
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden bg-black"
    >
      {/* Floating Triangles Background */}
      <FloatingTriangles density="medium" />

      {/* 3D Brain Visualization */}
      <div className="absolute right-0 top-0 w-full md:w-[60%] h-full">
        <BrainVisualization position="right" />
      </div>

      {/* Content */}
      <div className="container-custom relative z-10 pt-20">
        <div className="max-w-xl">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Main Title */}
            <motion.h1
              variants={fadeInUp}
              className="text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.95] tracking-tight"
            >
              TEDx
              <br />
              ICHB
              <br />
              Colentina
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeInUp}
              className="mt-6 text-accent-gold text-sm md:text-base font-medium tracking-wider uppercase"
            >
              FROM VISION TO IMPACT. MAY 23rd 2026.
            </motion.p>

            {/* Description */}
            <motion.p
              variants={fadeInUp}
              className="mt-6 text-text-secondary text-base md:text-lg leading-relaxed max-w-md"
            >
              A stage for ideas that matter. Thought leaders, innovators, and young
              visionaries come together to share stories, experiences, and insights
              that inspire action. Each talk explores how a single idea can grow into
              meaningful change, encouraging everyone to imagine, create, and shape the
              future.
            </motion.p>

            {/* CTA Button */}
            <motion.div variants={fadeInUp} className="mt-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBuyTickets}
                className="btn-primary"
              >
                BUY TICKETS
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
