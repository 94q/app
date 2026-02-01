import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FloatingTriangles } from '@/components/FloatingTriangles';
import { useInView } from '@/hooks/useInView';
import { fadeInUp } from '@/lib/animations';

interface Speaker {
  id: number;
  name: string;
  isLocked: boolean;
}

const speakers: Speaker[] = [
  { id: 1, name: '???', isLocked: true },
  { id: 2, name: '???', isLocked: true },
  { id: 3, name: '???', isLocked: true },
  { id: 4, name: '???', isLocked: true },
  { id: 5, name: '???', isLocked: true },
];

export const SpeakersSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { ref, isInView } = useInView<HTMLElement>({ threshold: 0.2 });

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? speakers.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === speakers.length - 1 ? 0 : prev + 1));
  };

  const getVisibleSpeakers = () => {
    const visible = [];
    for (let i = -1; i <= 1; i++) {
      const index = (currentIndex + i + speakers.length) % speakers.length;
      visible.push({ ...speakers[index], position: i });
    }
    return visible;
  };

  return (
    <section
      id="speakers"
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden bg-black section-padding"
    >
      {/* Floating Triangles Background */}
      <FloatingTriangles density="medium" />

      {/* Content */}
      <div className="container-custom relative z-10 w-full">
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <h2 className="text-5xl md:text-6xl font-semibold text-white">
            Speakers
          </h2>
          <p className="mt-4 text-text-secondary text-lg">Loading...</p>
        </motion.div>

        {/* Carousel */}
        <div className="relative flex items-center justify-center gap-4 md:gap-8">
          {/* Speaker Cards */}
          <div className="relative h-[400px] md:h-[500px] w-full max-w-4xl flex items-center justify-center">
            <AnimatePresence mode="popLayout">
              {getVisibleSpeakers().map((speaker) => (
                <motion.div
                  key={`${speaker.id}-${speaker.position}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: speaker.position === 0 ? 1 : 0.4,
                    scale: speaker.position === 0 ? 1 : 0.8,
                    x: speaker.position * 280,
                    zIndex: speaker.position === 0 ? 10 : 1,
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute"
                >
                  <div className="relative w-48 md:w-64 h-72 md:h-96 rounded-2xl overflow-hidden bg-gradient-to-b from-purple-900/30 to-black border border-white/10">
                    {/* Silhouette Background */}
                    <img
                      src="/assets/speaker-silhouette.png"
                      alt="Mystery Speaker"
                      className="absolute inset-0 w-full h-full object-cover opacity-60"
                    />

                    {/* Lock Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <img
                        src="/assets/lock-icon.png"
                        alt="Locked"
                        className="w-20 h-20 md:w-28 md:h-28 object-contain drop-shadow-2xl"
                      />
                      <p className="mt-4 text-2xl md:text-3xl font-bold text-white">
                        {speaker.name}
                      </p>
                      <p className="text-text-secondary text-sm">???</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrev}
            className="w-12 h-12 rounded-full bg-accent-purple flex items-center justify-center text-white hover:bg-accent-purple-hover transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            className="w-12 h-12 rounded-full bg-accent-purple flex items-center justify-center text-white hover:bg-accent-purple-hover transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default SpeakersSection;
