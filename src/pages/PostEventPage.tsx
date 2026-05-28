import React from 'react';
import { motion } from 'framer-motion';

export const PostEventPage: React.FC = () => {
  const tickerText = 'CONTACT FOR INQUIRIES: tedxcolentina@ichb.ro';

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="fixed left-0 right-0 top-0 z-50 overflow-hidden bg-[#e62b1e] py-3 text-white shadow-[0_10px_30px_rgba(0,0,0,0.28)]">
        <div className="tedx-contact-ticker flex w-max items-center gap-10 whitespace-nowrap text-sm font-black uppercase tracking-[0.22em] sm:text-base">
          {Array.from({ length: 8 }).map((_, index) => (
            <span key={index}>{tickerText}</span>
          ))}
        </div>
      </div>

      <section className="relative flex min-h-screen items-center justify-center px-5 pb-12 pt-24 sm:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(230,43,30,0.18),transparent_28%),radial-gradient(circle_at_80%_15%,rgba(212,168,83,0.12),transparent_24%),linear-gradient(180deg,#0b0b0b_0%,#000_100%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e62b1e] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center text-center"
        >
          <div className="flex w-full flex-col items-center justify-center gap-8 sm:flex-row sm:gap-12 lg:gap-16">
            <img
              src="/assets/ichb.png"
              alt="ICHB Colentina logo"
              className="h-28 w-auto object-contain sm:h-36 lg:h-44"
            />

            <div
              aria-label="TEDx ICHB Colentina Youth"
              className="flex flex-col items-center leading-none"
            >
              <span className="font-black tracking-normal text-[#e62b1e] text-[clamp(4.5rem,14vw,11rem)]">
                TEDx
              </span>
              <span className="-mt-2 whitespace-nowrap text-[clamp(0.8rem,2.4vw,2.25rem)] font-semibold uppercase tracking-[0.12em] text-white sm:tracking-[0.18em]">
                ICHB Colentina Youth
              </span>
            </div>

            <img
              src="/assets/lumina.png"
              alt="Lumina logo"
              className="h-32 w-auto max-w-[18rem] object-contain sm:h-40 lg:h-52"
            />
          </div>

          <div className="mt-12 max-w-4xl">
            <h1 className="text-balance text-4xl font-black leading-[0.96] sm:text-6xl lg:text-7xl">
              Thank you for sharing the room with us.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-balance text-base leading-8 text-white/72 sm:text-lg">
              TEDx ICHB Colentina Youth has closed this chapter with a full stage,
              bright questions, and the kind of energy that stays after the lights go
              down. We were honored to host you.
            </p>
            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.28em] text-white/55">
              See you next year
            </p>
          </div>
        </motion.div>
      </section>
    </main>
  );
};

export default PostEventPage;
