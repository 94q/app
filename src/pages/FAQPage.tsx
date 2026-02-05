import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FloatingTriangles } from '@/components/FloatingTriangles';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const faqs = [
  {
    question: 'Where will the event take place?',
    answer: [
      'The TEDx event will take place at ICHB Colentina.',
      'Address: Șoseaua Colentina 64B, 021187, Bucharest, Romania',
    ],
  },
  {
    question: 'When does the event start and how long will it last?',
    answer: [
      'The exact start time and duration are still being finalized.',
      'Once confirmed, all attendees will be informed and the information will be updated on our website.',
    ],
  },
  {
    question: 'Do children need to purchase a ticket?',
    answer: [
      'Children under the age of 10 may attend free of charge only if accompanied by a parent or legal guardian.',
    ],
  },
  {
    question: 'Why are the ticket prices relatively high?',
    answer: [
      'Our goal is to deliver a premium TEDx experience. Ticket pricing reflects the quality of the event, including:',
      'High-quality production and venue',
      'A wide range of food and beverage options',
      'Professional hospitality and security',
      'Carefully curated experiences for both General Access and VIP attendees',
    ],
  },
  {
    question: 'What will you do with the profits?',
    answer: [
      'All profits generated from ticket sales will be donated to a charitable cause after ticket sales officially close.',
    ],
  },
  {
    question: 'Will the event have sponsors?',
    answer: [
      'Yes, the event will be supported by a limited number of sponsors.',
      'Sponsor details will be announced at a later date.',
    ],
  },
  {
    question: 'What payment methods are accepted?',
    answer: [
      'We accept the following payment methods through our website:',
      'Card payments (Apple Pay & Google Pay included)',
      'Revolut',
      'Bank transfer',
      'Installments (3 payments)',
      'For alternative payment methods, please contact our Lead of Development & Co-Lead of Management:',
      'Andrei P. — +40 752 270 011',
    ],
  },
  {
    question: 'How will I receive my ticket?',
    answer: [
      'Immediately after purchase, your ticket will be sent to you via the billing email address you provided.',
    ],
  },
  {
    question: 'How can I contact customer support?',
    answer: [
      'For any questions or assistance, please contact us directly:',
      'Amr A. — +40 731 825 888',
      'Andrei P. — +40 752 270 011',
      'Fast response times.',
    ],
  },
  {
    question: 'Refunds?',
    answer: ['All sales are final.'],
  },
];

export const FAQPage: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black section-padding pt-32">
      <FloatingTriangles density="medium" />

      <div className="container-custom relative z-10 w-full">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium tracking-wider text-white/80 hover:text-white transition-colors duration-300"
          >
            <span className="text-base leading-none">&lt;-</span>
            BACK
          </Link>
        </div>

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
            FAQ
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="mt-4 text-text-secondary text-lg md:text-xl"
          >
            Everything you need to know before the event.
          </motion.p>

          <motion.div variants={fadeInUp} className="mt-10 text-left">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq) => (
                <AccordionItem
                  key={faq.question}
                  value={faq.question}
                  className="rounded-2xl border border-white/10 bg-[#1f1430]/80 px-6"
                >
                  <AccordionTrigger className="text-base md:text-lg text-white py-5 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-purple-100/90 text-base md:text-lg pb-6">
                    <div className="space-y-3">
                      {faq.answer.map((line) => (
                        <p key={line} className="leading-relaxed">
                          {line}
                        </p>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQPage;
