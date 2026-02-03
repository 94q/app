import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { FloatingTriangles } from '@/components/FloatingTriangles';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const cardStagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18 },
  },
};

const cardItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export const TicketsPage: React.FC = () => {
  const [showUpgradeNote, setShowUpgradeNote] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black section-padding pt-32">
      {/* Floating Triangles Background */}
      <FloatingTriangles density="medium" />

      {/* Content */}
      <div className="container-custom relative z-10">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium tracking-wider text-white/80 hover:text-white transition-colors duration-300"
          >
            <span className="text-base leading-none">&lt;-</span>
            Back to Home
          </Link>
        </div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-5xl mx-auto text-center"
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

          {/* Ticket Cards */}
          <motion.div
            variants={cardStagger}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 text-left"
          >
            <motion.div
              variants={cardItem}
              className="bg-[#2a1b3d]/80 backdrop-blur-md rounded-3xl border border-white/10 shadow-lg shadow-purple-900/30 p-6 flex flex-col min-h-[320px]"
            >
              <div className="pb-4 border-b border-white/10">
                <p className="text-xs font-semibold tracking-wider text-purple-200 uppercase">Ticket Tier</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">Early Bird — General Admission</h3>
              </div>
              <div className="py-6 flex-1">
                <p className="text-purple-100/90">
                  Full access to all speaker sessions, live performances, and networking receptions. Includes curated
                  food & drinks throughout the event. Best price available — expires March 1st.
                </p>
              </div>
              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-purple-200">Price</p>
                  <p className="text-5xl font-bold text-white leading-none">70 RON</p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-purple-200/80">Per person</p>
                </div>
                <a
                  href="https://buy.stripe.com/5kQ28k1Cn0Dq9Wt6hEb3q01"
                  className="btn-primary shadow-lg shadow-purple-500/60 hover:shadow-purple-400/80 hover:scale-105 transition-transform ring-1 ring-purple-300/40 hover:ring-purple-200/80"
                >
                  Buy Early Bird
                </a>
              </div>
            </motion.div>

            <motion.div
              variants={cardItem}
              className="bg-[#2a1b3d]/80 backdrop-blur-md rounded-3xl border border-white/10 shadow-lg shadow-purple-900/30 p-6 flex flex-col min-h-[320px]"
            >
              <div className="pb-4 border-b border-white/10">
                <p className="text-xs font-semibold tracking-wider text-purple-200 uppercase">Ticket Tier</p>
                <span className="mt-3 inline-flex items-center rounded-full bg-purple-400/15 text-purple-100 border border-purple-300/40 px-3 py-1 text-xs font-semibold tracking-wider uppercase">
                  Limited spots available
                </span>
                <h3 className="mt-3 text-2xl font-semibold text-white">Early Bird VIP — The Curator&apos;s Experience</h3>
              </div>
              <div className="py-6 flex-1">
                <p className="text-purple-100/90">
                  Premium experience with priority seating in first three rows, exclusive pre-event reception with
                  speakers, private lounge access, priority Q&A, and unlimited F&B. Limited spots — expires March 1st.
                </p>
              </div>
              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-purple-200">Price</p>
                  <p className="text-5xl font-bold text-white leading-none">150 RON</p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-purple-200/80">Per person</p>
                </div>
                <a
                  href="https://buy.stripe.com/8x25kw4Oz4TGb0x21ob3q02"
                  className="btn-primary shadow-lg shadow-purple-500/60 hover:shadow-purple-400/80 hover:scale-105 transition-transform ring-1 ring-purple-300/40 hover:ring-purple-200/80"
                >
                  Buy VIP
                </a>
              </div>
            </motion.div>

            <motion.div
              variants={cardItem}
              className="bg-[#2a1b3d]/80 backdrop-blur-md rounded-3xl border border-white/10 shadow-lg shadow-purple-900/30 p-6 flex flex-col min-h-[320px]"
            >
              <div className="pb-4 border-b border-white/10">
                <p className="text-xs font-semibold tracking-wider text-purple-200 uppercase">Ticket Tier</p>
                <span className="mt-3 inline-flex items-center rounded-full bg-purple-400/15 text-purple-100 border border-purple-300/40 px-3 py-1 text-xs font-semibold tracking-wider uppercase">
                  Limited spots available
                </span>
                <h3 className="mt-3 text-2xl font-semibold text-white">Upgrade to VIP — The Curator&apos;s Experience</h3>
              </div>
              <div className="py-6 flex-1">
                <p className="text-purple-100/90">
                  Already have Early Bird GA? Upgrade to unlock VIP perks: front-row seating, speaker reception,
                  private lounge, priority Q&A, and unlimited refreshments. Limited availability.
                </p>
              </div>
              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-purple-200">Price</p>
                  <div className="flex items-start gap-2">
                    <p className="text-5xl font-bold text-white leading-none">80 RON</p>
                    <button
                      type="button"
                      onClick={() => setShowUpgradeNote(true)}
                      className="text-purple-200 text-sm leading-none hover:text-white transition-colors"
                      aria-label="Upgrade note"
                    >
                      *
                    </button>
                  </div>
                  <p className="mt-1 text-xs uppercase tracking-wider text-purple-200/80">Per person</p>
                </div>
                <a
                  href="https://buy.stripe.com/28E00cftddqc4C95dAb3q03"
                  className="btn-primary shadow-lg shadow-purple-500/60 hover:shadow-purple-400/80 hover:scale-105 transition-transform ring-1 ring-purple-300/40 hover:ring-purple-200/80"
                >
                  Upgrade to VIP
                </a>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showUpgradeNote && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
            <motion.div
              className="absolute inset-0 bg-black"
              onClick={() => setShowUpgradeNote(false)}
              role="button"
              aria-label="Close upgrade note"
              tabIndex={0}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.div
              className="relative z-10 w-full max-w-md rounded-2xl border border-white/15 bg-[#1f1430] shadow-2xl shadow-purple-900/60 p-8 text-white"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="pl-1">
                  <h4 className="mt-2 text-2xl font-semibold tracking-wide">Upgrade Requirement</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setShowUpgradeNote(false)}
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
              <p className="mt-6 text-lg leading-relaxed text-purple-100/90 pl-1">
                Requires existing General Admission ticket
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default TicketsPage;
