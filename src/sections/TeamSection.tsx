import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingTriangles } from '@/components/FloatingTriangles';
import { useInView } from '@/hooks/useInView';
import { fadeInUp, slideInFromLeft, slideInFromRight } from '@/lib/animations';

interface TeamMember {
  name: string;
  role: string;
  shapeColor: string;
}

const teamMembers: TeamMember[] = [
  { name: 'Amr A.', role: 'Lead Management', shapeColor: 'bg-yellow-400' },
  { name: 'Maya H.', role: 'Co-Lead Management', shapeColor: 'bg-teal-400' },
  { name: 'Andrei P.', role: 'Lead of Development & Co-Lead Management', shapeColor: 'bg-purple-400' },
];

const contactLeads = [
  { name: 'Amr A.', role: 'Lead Management', phone: '+40 731 825 888' },
  { name: 'Maya H.', role: 'Co-Lead Management', phone: '+40 775 580 671' },
  { name: 'Andrei P.', role: 'Lead of Development & Co-Lead Management', phone: '+40 752 270 011' },
];

const TriangleShape: React.FC<{ color: string; className?: string }> = ({
  color,
  className = '',
}) => (
  <div
    className={`w-0 h-0 ${className}`}
    style={{
      borderLeft: '12px solid transparent',
      borderRight: '12px solid transparent',
      borderBottom: `20px solid ${color}`,
    }}
  />
);

export const TeamSection: React.FC = () => {
  const { ref, isInView } = useInView<HTMLElement>({ threshold: 0.2 });
  const [showContactModal, setShowContactModal] = useState(false);
  const [revealedPhones, setRevealedPhones] = useState<Record<string, boolean>>({});

  const togglePhone = (name: string) => {
    setRevealedPhones((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <section
      id="team"
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden bg-black section-padding"
    >
      {/* Floating Triangles Background */}
      <FloatingTriangles density="medium" />

      {/* Content */}
      <div className="container-custom relative z-10">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Left Side - Team Members */}
          <motion.div
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={slideInFromLeft}
            className="relative"
          >
            {/* Decorative Triangles */}
            <div className="absolute -left-10 top-10 animate-float">
              <TriangleShape color="#FACC15" />
            </div>
            <div className="absolute left-20 -top-5 animate-float-slow">
              <TriangleShape color="#2DD4BF" />
            </div>
            <div className="absolute right-10 top-20 animate-float">
              <TriangleShape color="#A78BFA" />
            </div>

            {/* Team Members List */}
            <div className="space-y-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  variants={fadeInUp}
                  className="relative"
                  style={{ marginLeft: index * 40 }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-0 h-0`}
                      style={{
                        borderLeft: '10px solid transparent',
                        borderRight: '10px solid transparent',
                        borderBottom: `16px solid ${
                          index === 0
                            ? '#FACC15'
                            : index === 1
                            ? '#2DD4BF'
                            : '#A78BFA'
                        }`,
                      }}
                    />
                    <div>
                      <h3 className="text-xl md:text-2xl font-semibold text-white">
                        {member.name}
                      </h3>
                      <p className="text-text-secondary text-sm">{member.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Additional Decorative Triangles */}
            <div className="absolute left-40 bottom-0 animate-float-slow">
              <TriangleShape color="#FACC15" />
            </div>
            <div className="absolute right-20 bottom-10 animate-float">
              <TriangleShape color="#A78BFA" />
            </div>
          </motion.div>

          {/* Right Side - Description */}
          <motion.div
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={slideInFromRight}
          >
            <motion.h2
              variants={fadeInUp}
              className="text-5xl md:text-6xl font-semibold text-white leading-tight"
            >
              Our
              <br />
              Team
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="mt-8 text-text-secondary text-base md:text-lg leading-relaxed"
            >
              Our team is a group of passionate students, organizers, and volunteers
              dedicated to bringing From Vision to Impact to life. Together, we plan,
              design, and curate every aspect of the event to create an experience that
              inspires, challenges, and connects.
            </motion.p>

            <motion.div variants={fadeInUp} className="mt-8">
              <button
                type="button"
                onClick={() => setShowContactModal(true)}
                className="btn-primary shadow-lg shadow-purple-500/60 hover:shadow-purple-400/80 hover:scale-105 transition-transform ring-1 ring-purple-300/40 hover:ring-purple-200/80"
              >
                Contact our team
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showContactModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
            <motion.div
              className="absolute inset-0 bg-black"
              onClick={() => setShowContactModal(false)}
              role="button"
              aria-label="Close contact modal"
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
                    Contact our team
                  </h4>
                  <p className="mt-3 text-purple-100/90 text-base md:text-lg">
                    Reach out directly to our leadership for quick responses.
                  </p>
                  <p className="mt-3 text-sm md:text-base text-white/70">
                    (Interested in becoming a speaker or sponsor? Please use the forms above and avoid contacting us directly via phone.)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
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

              <div className="mt-8 space-y-5">
                {contactLeads.map((lead) => {
                  const isRevealed = revealedPhones[lead.name];
                  return (
                    <div
                      key={lead.name}
                      className="rounded-2xl border border-white/10 bg-black/20 px-6 py-5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <h5 className="text-xl font-semibold text-white">
                            {lead.name}
                          </h5>
                          <p className="text-sm text-purple-100/80">
                            {lead.role}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => togglePhone(lead.name)}
                          className="btn-primary text-xs px-4 py-2"
                        >
                          {isRevealed ? 'Hide phone' : 'Show phone'}
                        </button>
                      </div>

                      <AnimatePresence initial={false}>
                        {isRevealed ? (
                          <motion.div
                            key="phone"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            className="overflow-hidden"
                          >
                            <p className="mt-4 text-lg text-white">
                              {lead.phone}
                            </p>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default TeamSection;
