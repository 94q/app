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
  {
    id: 2,
    name: 'Ion Metiu',
    isLocked: false,
    image: '/assets/ion.jpeg',
    bio: [
      '"Hacking your mindset. Designing your future."',
      'Ion works at the intersection of Business Consulting and NLP (Neuro-Linguistic Programming). Instead of just looking at numbers, he analyzes the "algorithms" behind human behavior: why we do what we do and how we can change the results we get.',
      'Certified as a Licensed Trainer of Neuro-Linguistic Programming directly by Dr. Richard Bandler, co-creator of NLP, Ion uses his 25+ years of experience to help leaders and teams break free from the patterns that hold them back. He does not believe in "magic pills," but in clear, practical techniques that can be programmed into daily life.',
      'At TEDx ICHB Colentina, he is here to show that the future is not something that "happens to you," it is something you architect yourself.',
      'His message is simple: learn to master your Mind(Set) before someone else does it for you. From the fear of missing out to the courage of building your own path, Ion provides the tools to help every young person switch from "Snooze" mode to Massive Action mode.',
    ],
  },
  {
    id: 3,
    name: 'Andrei Dunuță',
    isLocked: false,
    image: '/assets/danuta.jpeg',
    bio: [
      'Antrenor Vânzări & Public Speaking, Fondator „Arta de a NU vinde”',
      'Andrei Dunuță este fondatorul "Arta de a NU vinde".',
      'Este antrenor de Public Speaking & Vânzări, TEDx Keynote Speaker, aka omul care îți va arăta că poţi să fii nebun de bun în vânzări & public speaking.',
      'Lui Andrei i-au trecut prin mână în cei 17+ ani de experiență peste 20.000 de oameni de antreprenori, oameni vânzări și speakeri de la branduri precum: Banca Transilvania, NN Asigurări, RE/MAX, Allianz Asigurări, Coca Cola și multe altele.',
      'Dar a lucrat și lucrează cu multe asociații de studenți antrenându-i să își vândă mai bine ideile și proiectele.',
    ],
  },
  {
    id: 5,
    name: 'Mihaela Niță',
    isLocked: false,
    image: '/assets/mihaela-nita.jpg',
    bio: [
      'Mihaela Niță, medic specialist pediatru.',
      'Consultant în lactație certificat internațional IBCLC din 2011.',
      'Doctor în științe medicale cu tema Băncilor de lapte matern.',
      'Fondatoarea Asociației Consultanților în Lactație din România.',
      'Președintă a ELACTA (European Lactation Consultants Alliance).',
      'Organizator de conferințe medicale și speaker.',
      'Preocupată de medicina preventivă și cum să îi menținem pe copii cât mai mult timp sănătoși.',
    ],
  },
  {
    id: 6,
    name: 'Amr Araj',
    isLocked: false,
    image: '/assets/amr.jfif',
    bio: [
      'Entrepreneur and young innovator passionate about technology, leadership, and human performance.',
      'Combines interests in AI, business, communication, and self-development to create projects that inspire the next generation to think bigger and act boldly.',
      'Founder of a profitable fragrance business and creator of AI-powered educational and media initiatives, including an AI-based radio platform for students.',
      'Researcher in nutrition, peptides, and self-optimization, exploring the connection between science, performance, and modern wellbeing.',
      'Experienced in website development, digital systems, and emerging technologies, with a focus on innovation, automation, and user experience.',
      'Award-winning public speaker and competitive debater, recognized for leadership, communication, and mentoring young people in confidence and strategic thinking.',
      'Organizer of chess tournaments and intellectual events promoting discipline, collaboration, and critical thinking among students.',
      'Organizer at the TEDx event, exploring the intersection of mindset, innovation, and the future of ambitious young creators.',
      '"Greatness is built through discipline, vision, and the courage to take action."',
    ],
  },
  {
    id: 7,
    name: 'Nicoleta Pauliuc',
    isLocked: false,
    image: '/assets/nicoleta.png',
    bio: [
      'În 2017, la doar câteva luni după ce a depus jurământul ca senator, Nicoleta Pauliuc a primit un diagnostic care, pentru cei mai mulți, înseamnă sfârșitul: cancer pancreatic. A ales contrariul. A făcut din boală o misiune - și din Parlamentul României, un instrument prin care alți pacienți să poată urca, așa cum spune ea, "în trenul supraviețuitorilor".',
      'Avocată din 1997, este senator de Ilfov din 2016 și Președinte al Comisiei pentru Apărare, Ordine Publică și Siguranță Națională a Senatului României, prim-vicepreședinte PNL și președinta Organizației Femeilor Liberale.',
      'Dincolo de funcții, însă, este inițiatoarea unui pachet de legi pe care le numește simplu: "Legi pentru viață". A introdus consiliere psihologică gratuită pentru pacienții oncologici și aparținători și 45 de zile de concediu plătit pentru însoţitorii pacienților de cancer la tratament.',
      'A propus instituirea Zilei Naționale a Supraviețuitorilor de Cancer, marcată în prima duminică din iunie. A transpus în legislația națională Planul European de Combatere a Cancerului și a introdus în România dreptul pacientului la medicină personalizată - accesul la teste genetice gratuite, la tratamente adaptate, la un dosar electronic care să-l urmeze pe pacient prin sistem.',
      'A luptat, de asemenea, pentru eliminarea discriminării financiare a foștilor pacienți oncologici - dreptul la credite și asigurări, după șapte ani fără recidivă, în aceleași condiții ca orice cetățean.',
      'La TEDx povestește cum, uneori, drumul către cea mai bună versiune a ta începe în ziua cea mai grea din viața ta - și lasă în urmă o întrebare pentru fiecare tânăr din sală: ce ai face dacă mâine ai afla că ți-a mai rămas puțin timp? Și ce te oprește să faci asta și acum?',
    ],
  },
  {
    id: 8,
    name: 'Vasilescu Andreea',
    isLocked: false,
    image: '/assets/vasilescu-andreea.jfif',
    bio: [
      'Data Scientist at Microsoft working on software reliability, automation, experimentation systems, and AI-powered solutions.',
      'Started her journey at Microsoft while still a university student, transitioning from Technical Support Engineering into Data Science and AI-focused work.',
      'Holds both a Bachelor’s in Computer Science and a Master’s degree in Natural Language Processing from University of Bucharest.',
      'Speaker at technology conferences and events focused on Artificial Intelligence, Large Language Models, automation, and the future of AI-powered workflows.',
      'Part of the organisation team behind Azure AI Summer School in 2025, a Microsoft Romania initiative created together with the Polytechnic University of Bucharest.',
      'Involved in mentoring and educational initiatives focused on technology and AI.',
      'Interested in how AI agents and intelligent automation can help people focus less on repetitive tasks and more on creativity, innovation, and meaningful ideas.',
    ],
  },
  {
    id: 9,
    name: 'Virjan Darius',
    isLocked: false,
    image: '/assets/virjan.jfif',
    bio: [
      'Police Academy student, preparing for a future career as Subinspector de poliție within the Organized Crime Division, while also pursuing a future position as prosecutor within DIICOT, Romania’s highest authority for combating organized crime and terrorism.',
      'Student Battalion Commander, recognized for elite tactical conditioning, operational leadership training, and high-performance team coordination under pressure.',
      'Certified Firearms Qualification Instructor, while also personally holding advanced firearm qualification standards and tactical weapons proficiency.',
      'Successfully passed an elite military training program focused on discipline, endurance, resilience, and operational readiness.',
      'Former professional athlete for the Under-18 division of Club Atletico Madrid, developing a competitive mindset, discipline, and high-level performance standards from an early age.',
      'NATO Conference Speaker Associate representing the Romanian Police Academy division, contributing to discussions focused on security, leadership, and international cooperation.',
    ],
  },
  {
    id: 10,
    name: 'Corina Cucoli',
    isLocked: false,
    image: '/assets/corina.jfif',
    bio: [
      'Corina Cucoli is a senior executive and management consultant with over 25 years of experience in business development, financial services, restructuring, and strategic leadership across insurance, pensions, banking, manufacturing, and healthcare industries.',
      'She has held CEO and Board-level roles within major organizations including BT Pensii, Certinvest Pensii, UNIQA, Aviva Romania, and KPMG Romania, leading business transformation, M&A integration, operational growth, and governance initiatives.',
      'Corina is recognized for her strategic vision, leadership capabilities, and expertise in building partnerships, driving organizational performance, and managing complex projects across regional and international markets.',
      'She holds a Ph.D. in Economics from the Academy of Economic Studies in Bucharest and has completed executive programs at Harvard Business School and INSEAD.',
    ],
  },
  {
    id: 4,
    name: 'Alexia Simion',
    isLocked: false,
    image: '/assets/simion.jpeg',
    bio: [
      'Antreprenor și fondator al brandului Arc-en-ciel Atelier, cunoscut pentru produsele sale creative și estetica feminină.',
      'Îmbină pasiunea pentru design și branding cu dezvoltarea de concepte "cool" de business dedicate noii generații.',
      'La doar 22 de ani brandul său a depășit granițele României, dezvoltând proiecte și colaborări cu branduri internaționale din industria fashion și beauty.',
    ],
  },
];

const shuffleSpeakers = (speakerList: Speaker[]) => {
  const shuffled = [...speakerList];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
  }

  return shuffled;
};

export const SpeakersSection: React.FC = () => {
  const [shuffledSpeakers] = useState(() => shuffleSpeakers(speakers));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeSpeaker, setActiveSpeaker] = useState<Speaker | null>(null);
  const { ref, isInView } = useInView<HTMLElement>({ threshold: 0.2 });

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? shuffledSpeakers.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === shuffledSpeakers.length - 1 ? 0 : prev + 1));
  };

  const getVisibleSpeakers = () => {
    const visible = [];
    for (let i = -1; i <= 1; i++) {
      const index = (currentIndex + i + shuffledSpeakers.length) % shuffledSpeakers.length;
      visible.push({ ...shuffledSpeakers[index], position: i });
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
