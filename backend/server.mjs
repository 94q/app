import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_SOLD_SEATS_PATH = path.join(__dirname, 'data', 'sold-seats.json');
const SOLD_SEATS_PATH = process.env.SOLD_SEATS_PATH || DEFAULT_SOLD_SEATS_PATH;

const PORT = Number(process.env.PORT || 8787);
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://tedxichbcoletina.xyz';

const DEFAULT_ALLOWED_ORIGINS = [
  FRONTEND_URL,
  'https://tedxichbcoletina.xyz',
  'https://www.tedxichbcoletina.xyz',
  'https://tedxichbcolentina.xyz',
  'https://www.tedxichbcolentina.xyz',
];

const ENV_ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const ALLOWED_ORIGINS = [...new Set([...DEFAULT_ALLOWED_ORIGINS, ...ENV_ALLOWED_ORIGINS])];
const SOLD_SEAT_REGEX = /^(left|center|right)-[A-H]-\d{1,2}$/;

const stripeCacheSecondsRaw = Number(process.env.SOLD_SEATS_STRIPE_CACHE_SECONDS || 45);
const SOLD_SEATS_STRIPE_CACHE_MS =
  Number.isFinite(stripeCacheSecondsRaw) && stripeCacheSecondsRaw > 0 ? stripeCacheSecondsRaw * 1000 : 45_000;
const stripeMaxPagesRaw = Number(process.env.SOLD_SEATS_STRIPE_MAX_PAGES || 20);
const SOLD_SEATS_STRIPE_MAX_PAGES =
  Number.isFinite(stripeMaxPagesRaw) && stripeMaxPagesRaw > 0 ? Math.floor(stripeMaxPagesRaw) : 20;

const PRICE_ID_BY_TIER = {
  ga: process.env.STRIPE_PRICE_GA,
  vip: process.env.STRIPE_PRICE_VIP,
  upgrade: process.env.STRIPE_PRICE_UPGRADE,
};

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-01-27.acacia' })
  : null;

const MANUAL_SOLD_SEATS = (process.env.MANUAL_SOLD_SEATS || '')
  .split(',')
  .map((seat) => normalizeSeatId(seat))
  .filter((seat) => SOLD_SEAT_REGEX.test(seat));

let stripeSoldSeatsCache = {
  seats: [],
  expiresAt: 0,
  inFlight: null,
};

function normalizeSeatId(value) {
  if (typeof value !== 'string') return '';

  const trimmed = value.trim();
  if (!trimmed) return '';

  const [section, row, number] = trimmed.split('-');
  if (!section || !row || !number) return trimmed.toLowerCase();

  return `${section.toLowerCase()}-${row.toUpperCase()}-${number}`;
}

function dedupeAndSortSeats(seats) {
  return [...new Set(seats.map((seat) => normalizeSeatId(seat)).filter((seat) => SOLD_SEAT_REGEX.test(seat)))].sort();
}

async function readSoldSeats() {
  try {
    const raw = await fs.readFile(SOLD_SEATS_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? dedupeAndSortSeats(parsed) : [];
  } catch {
    return [];
  }
}

async function writeSoldSeats(seats) {
  const unique = dedupeAndSortSeats(seats);
  await fs.mkdir(path.dirname(SOLD_SEATS_PATH), { recursive: true });
  await fs.writeFile(SOLD_SEATS_PATH, JSON.stringify(unique, null, 2), 'utf8');
}

async function fetchStripeSoldSeats() {
  if (!stripe) return [];

  const stripeSoldSeats = [];
  let hasMore = true;
  let startingAfter;
  let pageCount = 0;

  while (hasMore && pageCount < SOLD_SEATS_STRIPE_MAX_PAGES) {
    const page = await stripe.paymentIntents.list({
      limit: 100,
      ...(startingAfter ? { starting_after: startingAfter } : {}),
    });

    pageCount += 1;

    for (const paymentIntent of page.data) {
      if (paymentIntent.status !== 'succeeded') continue;

      const seatId = normalizeSeatId(paymentIntent.metadata?.seat_id);
      if (SOLD_SEAT_REGEX.test(seatId)) {
        stripeSoldSeats.push(seatId);
      }
    }

    hasMore = page.has_more;
    startingAfter = page.data.length > 0 ? page.data[page.data.length - 1].id : undefined;
    if (!startingAfter) break;
  }

  return dedupeAndSortSeats(stripeSoldSeats);
}

async function getStripeSoldSeatsCached(forceRefresh = false) {
  if (!stripe) return [];

  const now = Date.now();
  if (!forceRefresh && stripeSoldSeatsCache.expiresAt > now) {
    return stripeSoldSeatsCache.seats;
  }

  if (stripeSoldSeatsCache.inFlight) {
    return stripeSoldSeatsCache.inFlight;
  }

  stripeSoldSeatsCache.inFlight = (async () => {
    try {
      const seats = await fetchStripeSoldSeats();
      stripeSoldSeatsCache = {
        seats,
        expiresAt: Date.now() + SOLD_SEATS_STRIPE_CACHE_MS,
        inFlight: null,
      };
      return seats;
    } catch (error) {
      console.error('[stripe] Could not sync sold seats from Stripe:', error);
      const fallbackSeats = stripeSoldSeatsCache.seats;
      stripeSoldSeatsCache = {
        seats: fallbackSeats,
        expiresAt: Date.now() + 10_000,
        inFlight: null,
      };
      return fallbackSeats;
    }
  })();

  return stripeSoldSeatsCache.inFlight;
}

async function getAllSoldSeats() {
  const [fileSeats, stripeSeats] = await Promise.all([readSoldSeats(), getStripeSoldSeatsCached()]);
  return dedupeAndSortSeats([...fileSeats, ...stripeSeats, ...MANUAL_SOLD_SEATS]);
}

const app = express();

app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    if (!stripe) return res.status(500).send('Stripe not configured.');

    const signature = req.headers['stripe-signature'];
    if (!signature || typeof signature !== 'string') {
      return res.status(400).send('Missing stripe signature header.');
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) return res.status(500).send('Missing STRIPE_WEBHOOK_SECRET.');

    const event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const seatId = normalizeSeatId(session.metadata?.seat_id || session.client_reference_id);

      if (SOLD_SEAT_REGEX.test(seatId)) {
        const soldSeats = await readSoldSeats();
        if (!soldSeats.includes(seatId)) {
          soldSeats.push(seatId);
          await writeSoldSeats(soldSeats);
        }

        stripeSoldSeatsCache = {
          seats: dedupeAndSortSeats([...stripeSoldSeatsCache.seats, seatId]),
          expiresAt: Date.now() + SOLD_SEATS_STRIPE_CACHE_MS,
          inFlight: null,
        };
      }
    }

    return res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(400).send('Webhook error.');
  }
});

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
      console.warn(`[cors] Blocked origin: ${origin}`);
      return callback(null, false);
    },
    credentials: false,
  })
);
app.use(express.json());

app.get('/api/seats/sold', async (_req, res) => {
  const seats = await getAllSoldSeats();
  res.json({ seats });
});

app.post('/api/checkout-session', async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({ error: 'Stripe is not configured. Set STRIPE_SECRET_KEY.' });
    }

    const { tier, seatId } = req.body ?? {};

    if (!['ga', 'vip', 'upgrade'].includes(tier)) {
      return res.status(400).json({ error: 'Invalid ticket tier.' });
    }

    const normalizedSeatId = normalizeSeatId(seatId);
    if (!SOLD_SEAT_REGEX.test(normalizedSeatId)) {
      return res.status(400).json({ error: 'Invalid seat id.' });
    }

    const soldSeats = await getAllSoldSeats();
    if (soldSeats.includes(normalizedSeatId)) {
      return res.status(409).json({ error: 'Seat already sold.' });
    }

    const priceId = PRICE_ID_BY_TIER[tier];
    if (!priceId) {
      return res.status(500).json({ error: `Missing Stripe price id for tier "${tier}".` });
    }

    const requestOrigin = typeof req.headers.origin === 'string' ? req.headers.origin : '';
    const returnOrigin = ALLOWED_ORIGINS.includes(requestOrigin) ? requestOrigin : FRONTEND_URL;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_creation: 'always',
      allow_promotion_codes: true,
      name_collection: {
        individual: {
          enabled: true,
        },
      },
      phone_number_collection: {
        enabled: true,
      },
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${returnOrigin}/tickets?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${returnOrigin}/tickets?payment=canceled`,
      client_reference_id: normalizedSeatId,
      metadata: {
        seat_id: normalizedSeatId,
        ticket_tier: tier,
      },
      payment_intent_data: {
        metadata: {
          seat_id: normalizedSeatId,
          ticket_tier: tier,
        },
      },
    });

    if (!session.url) {
      return res.status(500).json({ error: 'Failed to create checkout URL.' });
    }

    return res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('Checkout session error:', error);
    return res.status(500).json({ error: 'Failed to create checkout session.' });
  }
});

app.listen(PORT, () => {
  console.log(`Stripe backend running on port ${PORT}`);
  console.log(`Allowed CORS origins: ${ALLOWED_ORIGINS.join(', ')}`);
  console.log(`Sold seats file path: ${SOLD_SEATS_PATH}`);
});
