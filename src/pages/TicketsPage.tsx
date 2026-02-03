import React from 'react';
import { motion } from 'framer-motion';
import { FloatingTriangles } from '@/components/FloatingTriangles';
import { fadeInUp, staggerContainer } from '@/lib/animations';

export const TicketsPage: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black section-padding pt-32">
      {/* Floating Triangles Background */}
      <FloatingTriangles density="medium" />

      {/* Content */}
      <div className="container-custom relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h1
            variants={fadeInUp}
            className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-tight"
          >
            Tickets
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="mt-6 text-text-secondary text-lg md:text-xl max-w-2xl mx-auto"
          >
            Get your tickets for TEDx ICHB Colentina Youth. Join us on May 23rd, 2026.
          </motion.p>

          {/* Placeholder for ticket content */}
          <motion.div
            variants={fadeInUp}
            className="mt-12"
          >
            <p className="text-text-muted">Ticket purchasing options coming soon...</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default TicketsPage;
