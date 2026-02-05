import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
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

      {/* Social Icons */}
      <div className="absolute right-6 bottom-6 z-20 flex items-center gap-3">
        <a
          href="https://www.instagram.com/tedx.ichbcolentina/"
          target="_blank"
          rel="noreferrer"
          className="text-white/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
          aria-label="Instagram"
        >
          <Instagram className="h-6 w-6 md:h-5 md:w-5" />
        </a>
        <a
          href="https://tiktok.com/@tedx.ichbcolentina25"
          target="_blank"
          rel="noreferrer"
          className="text-white/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
          aria-label="TikTok"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-6 w-6 md:h-5 md:w-5"
            fill="currentColor"
          >
            <path d="M14.5 3c.4 2.2 2 4 4.2 4.3v2.3c-1.5 0-2.9-.5-4.2-1.4v6.1c0 3-2.5 5.5-5.5 5.5S3.5 17.3 3.5 14.3s2.5-5.5 5.5-5.5c.5 0 1 .1 1.5.2v2.5c-.4-.2-.9-.3-1.5-.3-1.7 0-3 1.4-3 3s1.3 3 3 3 3-1.3 3-3V3h3z" />
          </svg>
        </a>
      </div>
    </section>
  );
};

export default CTASection;
