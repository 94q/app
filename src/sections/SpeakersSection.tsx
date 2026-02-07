import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FloatingTriangles } from '@/components/FloatingTriangles';
import { useInView } from '@/hooks/useInView';
import { fadeInUp } from '@/lib/animations';

interface Speaker {
  id: number;
  name: string;
  isLocked: boolean;
  image?: string;
  bio?: string[];
}

const speakers: Speaker[] = [
  {
    id: 1,
    name: 'Raphael Radut',
    isLocked: false,
    image: '/assets/radut.jpg',
    bio: [
      'Founder of educational platform Raphael Academy',
      'aieseu.ro (First Romanian Student Friendly AI platform)',
      'CEO and Founder of agentvocal.ro - AI romanian Start-up',
      'Co founder of vocalagent.eu (Netherlands AI startup)',
      'CEO of vocalagent.bg (Bulgarian AI Startup)',
      'Founder agentvocal.md (Moldovian Startup)',
      'Co founder of CallFix AI (Moldovian AI Start-up)',
      'Founder of Elyon AI Automations SRL (AI Research Company Romania)',
    ],
  },
  { id: 2, name: '???', isLocked: true },
  { id: 3, name: '???', isLocked: true },
  { id: 4, name: '???', isLocked: true },
  { id: 5, name: '???', isLocked: true },
];

export const SpeakersSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeSpeaker, setActiveSpeaker] = useState<Speaker | null>(null);
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
                    {speaker.isLocked ? (
                      <>
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
                      </>
                    ) : (
                      <>
                        <img
                          src={speaker.image || '/assets/speaker-silhouette.png'}
                          alt={speaker.name}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-4 text-center">
                          <p className="text-xl md:text-2xl font-semibold text-white">
                            {speaker.name}
                          </p>
                          <button
                            type="button"
                            onClick={() => setActiveSpeaker(speaker)}
                            className="mt-3 inline-flex items-center justify-center rounded-full border border-white/20 bg-black/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:border-purple-300/70 hover:text-white"
                          >
                            Show biography
                          </button>
                        </div>
                      </>
                    )}
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

        <div className="mt-10 flex flex-col items-center gap-4">
          <Link
            to="/become-a-speaker"
            className="btn-primary shadow-lg shadow-purple-500/60 hover:shadow-purple-400/80 hover:scale-105 transition-transform ring-1 ring-purple-300/40 hover:ring-purple-200/80"
          >
            Become a speaker
          </Link>
          <Link
            to="/become-a-sponsor"
            className="btn-primary shadow-lg shadow-purple-500/60 hover:shadow-purple-400/80 hover:scale-105 transition-transform ring-1 ring-purple-300/40 hover:ring-purple-200/80"
          >
            Become a sponsor
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {activeSpeaker && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
            <motion.div
              className="absolute inset-0 bg-black"
              onClick={() => setActiveSpeaker(null)}
              role="button"
              aria-label="Close biography"
              tabIndex={0}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.div
              className="relative z-10 w-full max-w-lg sm:max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl border border-white/15 bg-[#1f1430] shadow-2xl shadow-purple-900/70 p-6 sm:p-10 text-white"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="pl-1">
                  <h4 className="text-3xl md:text-4xl font-semibold tracking-wide">
                    {activeSpeaker.name}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSpeaker(null)}
                  className="text-white/70 hover:text-white transition-colors p-2 -m-2 rounded-full hover:bg-white/10"
                  aria-label="Close"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <ul className="mt-6 space-y-3 text-lg md:text-xl text-purple-100/90 pl-6 list-disc">
                {activeSpeaker.bio?.map((line) => (
                  <li key={line} className="leading-relaxed">
                    {line}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default SpeakersSection;
