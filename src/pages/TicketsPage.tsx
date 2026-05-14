import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Gift, Loader2, Users } from 'lucide-react';
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

type TicketTier = 'ga' | 'vip' | 'upgrade';
type SeatSection = 'left' | 'center' | 'right';
type SeatStatus = 'available' | 'locked' | 'sold' | 'selected';

const API_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? '';

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] as const;
const DISPLAY_ROWS = [...ROWS].reverse() as (typeof ROWS)[number][];

const SECTION_COUNTS: Record<SeatSection, Record<(typeof ROWS)[number], number>> = {
  left: { A: 6, B: 7, C: 7, D: 8, E: 9, F: 9, G: 9, H: 10 },
  center: { A: 10, B: 11, C: 12, D: 13, E: 14, F: 15, G: 15, H: 14 },
  right: { A: 6, B: 7, C: 7, D: 8, E: 8, F: 9, G: 8, H: 10 },
};

const PRICE_BY_TIER: Record<TicketTier, string> = {
  ga: '70 RON',
  vip: '150 RON',
  upgrade: '80 RON',
};

function apiUrl(path: string): string {
  return `${API_BASE}${path}`;
}

function isVipSeat(section: SeatSection, row: (typeof ROWS)[number]): boolean {
  if (section === 'left') return row === 'A';
  if (section === 'center') return ['A', 'B', 'C', 'D'].includes(row);
  return row === 'A';
}

function seatId(section: SeatSection, row: (typeof ROWS)[number], number: number): string {
  return `${section}-${row}-${number}`;
}

function getSeatStatus(
  tier: TicketTier | null,
  section: SeatSection,
  row: (typeof ROWS)[number],
  number: number,
  selectedId: string | null,
  soldSeats: Set<string>
): SeatStatus {
  const id = seatId(section, row, number);
  if (selectedId === id) return 'selected';
  if (soldSeats.has(id)) return 'sold';

  const vip = isVipSeat(section, row);
  if (!tier) return vip ? 'locked' : 'available';
  if ((tier === 'vip' || tier === 'upgrade') && !vip) return 'locked';
  if (tier === 'ga' && vip) return 'locked';

  return 'available';
}

function getSeatClassName(status: SeatStatus, vip: boolean): string {
  if (status === 'selected') {
    return 'bg-white text-black border-white shadow-[0_0_14px_rgba(255,255,255,0.7)]';
  }
  if (status === 'sold') {
    return 'bg-red-600/80 text-white border-red-400/80 shadow-[0_0_10px_rgba(239,68,68,0.45)] cursor-not-allowed';
  }
  if (status === 'locked') {
    return 'bg-yellow-500/55 text-yellow-100 border-yellow-300/80 shadow-[0_0_8px_rgba(234,179,8,0.3)] cursor-not-allowed';
  }
  if (vip) {
    return 'bg-yellow-300 text-black border-yellow-100 shadow-[0_0_16px_rgba(253,224,71,0.8)]';
  }
  return 'bg-green-600/75 text-white border-green-300/80 shadow-[0_0_10px_rgba(34,197,94,0.42)]';
}

function DuoOfferBadge({ variant }: { variant: 'ga' | 'vip' }) {
  const isVip = variant === 'vip';

  return (
    <div
      className={`mt-5 overflow-hidden rounded-2xl border p-[1px] ${
        isVip
          ? 'border-yellow-200/40 bg-gradient-to-r from-yellow-300/55 via-purple-300/45 to-yellow-300/55 shadow-[0_0_28px_rgba(250,204,21,0.18)]'
          : 'border-purple-200/40 bg-gradient-to-r from-purple-400/55 via-fuchsia-300/40 to-purple-400/55 shadow-[0_0_28px_rgba(168,85,247,0.18)]'
      }`}
    >
      <div className="relative rounded-[15px] bg-black/45 px-4 py-3">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_36%)]" />
        <div className="relative flex items-start gap-3">
          <div
            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
              isVip ? 'bg-yellow-300 text-black' : 'bg-purple-300 text-black'
            }`}
          >
            {isVip ? <Gift className="h-4 w-4" /> : <Users className="h-4 w-4" />}
          </div>
          <div>
            <p className={`text-xs font-bold uppercase tracking-[0.2em] ${isVip ? 'text-yellow-100' : 'text-purple-100'}`}>
              Limited duo pass
            </p>
            <p className="mt-1 text-lg font-semibold leading-snug text-white">
              Bring your +1 on us
            </p>
            <p className="mt-1 text-sm leading-relaxed text-purple-100/85">
              One checkout unlocks two seats. Perfect for the friend who will regret missing this.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export const TicketsPage: React.FC = () => {
  const location = useLocation();
  const [showUpgradeNote, setShowUpgradeNote] = useState(false);
  const [selectorTier, setSelectorTier] = useState<TicketTier | null>(null);
  const [selectedSeatId, setSelectedSeatId] = useState<string | null>(null);
  const [showCheckoutNotice, setShowCheckoutNotice] = useState(false);
  const [noticeCountdown, setNoticeCountdown] = useState(5);
  const [redirecting, setRedirecting] = useState(false);
  const [soldSeats, setSoldSeats] = useState<Set<string>>(new Set());
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const loadSoldSeats = async (options?: { retries?: number; showError?: boolean }): Promise<boolean> => {
    const retries = options?.retries ?? 3;
    const showError = options?.showError ?? true;

    for (let attempt = 0; attempt <= retries; attempt += 1) {
      try {
        const response = await fetch(apiUrl('/api/seats/sold'), { cache: 'no-store' });
        if (!response.ok) throw new Error(`Failed to fetch sold seats (${response.status}).`);

        const data = (await response.json()) as { seats?: string[] };
        setSoldSeats(new Set(Array.isArray(data.seats) ? data.seats : []));
        if (showError) {
          setCheckoutMessage((current) => (current === 'Could not load sold seats from server.' ? null : current));
        }
        return true;
      } catch (error) {
        const lastAttempt = attempt >= retries;
        if (lastAttempt) {
          console.error(error);
          if (showError) {
            setCheckoutMessage('Could not load sold seats from server.');
          }
          return false;
        }

        await sleep(1200 * (attempt + 1));
      }
    }

    return false;
  };

  useEffect(() => {
    void loadSoldSeats({ retries: 5, showError: true });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paymentState = params.get('payment');
    if (paymentState !== 'success' && paymentState !== 'canceled') return;

    if (paymentState === 'success') {
      setCheckoutMessage('Payment confirmed. Refreshing sold seats...');
      void (async () => {
        const loaded = await loadSoldSeats({ retries: 5, showError: false });
        if (loaded) {
          setCheckoutMessage('Payment confirmed. Seat marked sold.');
          return;
        }

        setCheckoutMessage('Payment confirmed. Could not refresh sold seats yet. Please reload in a few seconds.');
      })();
      return;
    }

    setCheckoutMessage('Payment canceled. Your seat is still available.');
  }, [location.search]);

  useEffect(() => {
    if (!showCheckoutNotice) return;

    setNoticeCountdown(5);
    const timer = window.setInterval(() => {
      setNoticeCountdown((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [showCheckoutNotice]);

  const selectorTitle = useMemo(() => {
    if (selectorTier === 'ga') return 'Choose Your General Admission Seat';
    if (selectorTier === 'vip') return 'Choose Your VIP Seat';
    if (selectorTier === 'upgrade') return 'Choose Your VIP Upgrade Seat';
    return '';
  }, [selectorTier]);

  const selectedPrice = selectorTier ? PRICE_BY_TIER[selectorTier] : '-';

  const openSeatSelector = (tier: TicketTier) => {
    setSelectorTier(tier);
    setSelectedSeatId(null);
    setShowCheckoutNotice(false);
    setNoticeCountdown(5);
    setRedirecting(false);
    setCheckoutMessage(null);
  };

  const closeSeatSelector = () => {
    setSelectorTier(null);
    setSelectedSeatId(null);
    setShowCheckoutNotice(false);
    setNoticeCountdown(5);
    setRedirecting(false);
  };

  const closeCheckoutNotice = () => {
    if (redirecting) return;

    setShowCheckoutNotice(false);
    setNoticeCountdown(5);
  };

  const handleSeatPick = (section: SeatSection, row: (typeof ROWS)[number], number: number) => {
    if (!selectorTier || redirecting) return;

    const status = getSeatStatus(selectorTier, section, row, number, selectedSeatId, soldSeats);
    if (status === 'locked' || status === 'sold') return;

    setSelectedSeatId(seatId(section, row, number));
  };

  const handleBuySelectedSeat = async () => {
    if (!selectorTier || !selectedSeatId || redirecting) return;

    setShowCheckoutNotice(true);
    setCheckoutMessage(null);
  };

  const continueToCheckout = async () => {
    if (!selectorTier || !selectedSeatId || redirecting || noticeCountdown > 0) return;

    setRedirecting(true);
    setCheckoutMessage(null);

    try {
      const response = await fetch(apiUrl('/api/checkout-session'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: selectorTier, seatId: selectedSeatId }),
      });

      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) {
        throw new Error(data.error || 'Failed to create Stripe checkout session.');
      }

      window.location.href = data.url;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Checkout failed.';
      setCheckoutMessage(message);
      setRedirecting(false);
      await loadSoldSeats();
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black section-padding pt-32">
      <FloatingTriangles density="medium" />

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
                <h3 className="mt-2 text-2xl font-semibold text-white">Early Bird - General Admission</h3>
                <DuoOfferBadge variant="ga" />
              </div>
              <div className="py-6 flex-1">
                <p className="text-purple-100/90">
                  Full access to all speaker sessions, live performances, and networking receptions. Includes curated
                  food and drinks throughout the event. Best price available.
                </p>
              </div>
              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-purple-200">Price</p>
                  <p className="text-5xl font-bold text-white leading-none">70 RON</p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-purple-200/80">Per person</p>
                </div>
                <button
                  type="button"
                  onClick={() => openSeatSelector('ga')}
                  className="btn-primary shadow-lg shadow-purple-500/60 hover:shadow-purple-400/80 hover:scale-105 transition-transform ring-1 ring-purple-300/40 hover:ring-purple-200/80"
                >
                  Buy Early Bird
                </button>
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
                <h3 className="mt-3 text-2xl font-semibold text-white">Early Bird VIP - The Curator&apos;s Experience</h3>
                <DuoOfferBadge variant="vip" />
              </div>
              <div className="py-6 flex-1">
                <p className="text-purple-100/90">
                  Premium experience with priority seating in first rows, exclusive pre-event reception with
                  speakers, private lounge access, priority Q&A, and unlimited F&B. Limited spots.
                </p>
              </div>
              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-purple-200">Price</p>
                  <p className="text-5xl font-bold text-white leading-none">150 RON</p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-purple-200/80">Per person</p>
                </div>
                <button
                  type="button"
                  onClick={() => openSeatSelector('vip')}
                  className="btn-primary shadow-lg shadow-purple-500/60 hover:shadow-purple-400/80 hover:scale-105 transition-transform ring-1 ring-purple-300/40 hover:ring-purple-200/80"
                >
                  Buy VIP
                </button>
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
                <h3 className="mt-3 text-2xl font-semibold text-white">Upgrade to VIP - The Curator&apos;s Experience</h3>
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
                <button
                  type="button"
                  onClick={() => openSeatSelector('upgrade')}
                  className="btn-primary shadow-lg shadow-purple-500/60 hover:shadow-purple-400/80 hover:scale-105 transition-transform ring-1 ring-purple-300/40 hover:ring-purple-200/80"
                >
                  Upgrade to VIP
                </button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectorTier && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-3 md:px-8 py-6">
            <motion.div
              className="absolute inset-0 bg-black/90"
              onClick={closeSeatSelector}
              role="button"
              aria-label="Close seat selection"
              tabIndex={0}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.div
              className="relative z-10 w-full max-w-7xl max-h-[92vh] overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-[#171717] to-[#090909] p-3 md:p-5 text-white shadow-2xl shadow-black/80"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-lg md:text-2xl font-semibold tracking-wide">{selectorTitle}</h4>
                  <p className="mt-1 text-xs md:text-sm text-white/70">Choose seat, review details, then buy.</p>
                </div>
                <button
                  type="button"
                  onClick={closeSeatSelector}
                  className="rounded-full p-2 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-5 w-5"
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

              <div className="mt-3 rounded-2xl bg-black/35 p-1 md:p-3 seat-map-surface overflow-x-auto overflow-y-hidden">
                <div className="grid grid-cols-[14px_1fr] md:grid-cols-[26px_1fr] items-start gap-1 md:gap-5">
                  <div className="pt-1 md:pt-2.5 space-y-1 md:space-y-2.5">
                    {DISPLAY_ROWS.map((row) => (
                      <div key={`label-${row}`} className="h-4 md:h-6 text-[9px] md:text-xs font-semibold text-white/85 text-center">
                        {row}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-[auto_auto_auto] md:grid-cols-3 justify-center md:justify-stretch gap-[2px] md:gap-0">
                    {(['left', 'center', 'right'] as const).map((section) => (
                      <div
                        key={`section-${section}`}
                        className={`relative rounded-[20px] px-0 md:px-2 py-1 md:py-2 origin-bottom ${
                          section === 'left'
                            ? 'md:-rotate-[8deg] md:translate-y-3 md:translate-x-14 lg:translate-x-20'
                            : section === 'right'
                              ? 'md:rotate-[8deg] md:translate-y-3 md:-translate-x-14 lg:-translate-x-20'
                              : ''
                        }`}
                      >
                        <div
                          className="pointer-events-none absolute inset-0 rounded-[inherit] border border-white/10"
                          style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)' }}
                        />

                        <div className="relative space-y-1 md:space-y-2.5">
                          {DISPLAY_ROWS.map((row) => (
                            <div key={`${section}-${row}`} className="h-4 md:h-6 flex items-center justify-center gap-[1px] md:gap-1">
                              {Array.from({ length: SECTION_COUNTS[section][row] }).map((_, idx) => {
                                const number = idx + 1;
                                const id = seatId(section, row, number);
                                const vip = isVipSeat(section, row);
                                const status = getSeatStatus(selectorTier, section, row, number, selectedSeatId, soldSeats);
                                return (
                                  <button
                                    key={id}
                                    type="button"
                                    onClick={() => handleSeatPick(section, row, number)}
                                    disabled={status === 'locked' || status === 'sold' || redirecting}
                                    className={`relative w-[7px] h-[7px] md:w-5 md:h-5 border text-[4px] md:text-[8px] font-semibold leading-none transition-transform duration-150 hover:scale-105 disabled:hover:scale-100 ${getSeatClassName(status, vip)} ${vip && status !== 'sold' ? 'vip-seat-premium' : ''}`}
                                    style={{ borderRadius: '4px 4px 1.5px 1.5px' }}
                                    title={`${section.toUpperCase()} ${row}-${number}${vip ? ' VIP' : ''}`}
                                  >
                                    <span className="relative z-10">{number}</span>
                                  </button>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 mx-auto w-[96%]">
                  <svg
                    viewBox="0 0 140 22"
                    className="w-full h-10 md:h-12"
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient id="stageLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(148,163,184,0.08)" />
                        <stop offset="20%" stopColor="rgba(148,163,184,0.34)" />
                        <stop offset="50%" stopColor="rgba(203,213,225,0.56)" />
                        <stop offset="80%" stopColor="rgba(148,163,184,0.34)" />
                        <stop offset="100%" stopColor="rgba(148,163,184,0.08)" />
                      </linearGradient>
                      <filter id="stageGlow" x="-20%" y="-20%" width="140%" height="180%">
                        <feGaussianBlur stdDeviation="1.1" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    <path
                      d="M4 18 Q70 2 136 18"
                      fill="none"
                      stroke="url(#stageLineGradient)"
                      strokeWidth="2.1"
                      strokeLinecap="round"
                      filter="url(#stageGlow)"
                    />
                    <path
                      d="M12 19 Q70 7 128 19"
                      fill="none"
                      stroke="rgba(148,163,184,0.22)"
                      strokeWidth="1"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="-mt-1 text-center text-[10px] md:text-xs tracking-[0.3em] text-slate-300/65 uppercase">
                    Stage
                  </div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
                <div className="flex flex-wrap items-center gap-3 text-[10px] md:text-xs text-white/80">
                  {selectorTier === 'ga' && (<span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded bg-green-600" />Available</span>)}
                  <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded bg-yellow-400" />Locked</span>
                  <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded bg-red-600" />Sold</span>
                  <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded bg-white border border-white/60" />Selected</span>
                  <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded bg-yellow-200 shadow-[0_0_10px_rgba(253,224,71,0.9)]" />VIP seats</span>
                </div>

                <div className="rounded-xl border border-white/15 bg-black/35 p-3 text-xs md:text-sm">
                  <p className="text-white/70">Selected seat</p>
                  <p className="mt-1 text-white font-semibold">{selectedSeatId ? selectedSeatId.toUpperCase() : '-'}</p>
                  <p className="mt-2 text-white/70">Price</p>
                  <p className="mt-1 text-white font-semibold">{selectedSeatId ? selectedPrice : '-'}</p>

                  <button
                    type="button"
                    onClick={handleBuySelectedSeat}
                    disabled={!selectedSeatId || redirecting || showCheckoutNotice}
                    className="mt-3 w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {redirecting ? 'Redirecting...' : 'Buy Selected Seat'}
                  </button>
                </div>
              </div>

              {checkoutMessage && <p className="mt-3 text-xs md:text-sm text-white/75">{checkoutMessage}</p>}
            </motion.div>
          </div>
        )}

        {showCheckoutNotice && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-6">
            <motion.div
              className="absolute inset-0 bg-black/90"
              onClick={closeCheckoutNotice}
              role="button"
              aria-label="Close checkout notice"
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
                  <h4 className="mt-2 text-2xl font-semibold tracking-wide">Notice</h4>
                </div>
                <button
                  type="button"
                  onClick={closeCheckoutNotice}
                  disabled={redirecting}
                  className="text-white/70 hover:text-white transition-colors p-2 -m-2 rounded-full hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
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
                After you purchase your ticket, to claim your 1+1 offer, please message our team on WhatsApp at{' '}
                <a
                  href="tel:+40752270011"
                  className="font-semibold text-white underline decoration-purple-200/60 underline-offset-4 transition-colors hover:text-purple-100"
                >
                  +40 752 270 011
                </a>{' '}
                (Andrei P.). We will help you confirm the additional seat.
              </p>
              <button
                type="button"
                onClick={continueToCheckout}
                disabled={noticeCountdown > 0 || redirecting}
                className="mt-7 w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  {(noticeCountdown > 0 || redirecting) && <Loader2 className="h-4 w-4 animate-spin" />}
                  {redirecting ? 'Redirecting...' : noticeCountdown > 0 ? `Continue (${noticeCountdown})` : 'Continue'}
                </span>
              </button>
            </motion.div>
          </div>
        )}

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











