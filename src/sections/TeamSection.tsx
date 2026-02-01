import React from 'react';
import { motion } from 'framer-motion';
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
  { name: 'Andrei P.', role: 'Lead of Development', shapeColor: 'bg-purple-400' },
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
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
