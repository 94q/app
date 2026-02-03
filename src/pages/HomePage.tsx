import React from 'react';
import { HeroSection } from '@/sections/HeroSection';
import { ContentSection } from '@/sections/ContentSection';
import { TextSection } from '@/sections/TextSection';
import { SpeakersSection } from '@/sections/SpeakersSection';
import { TeamSection } from '@/sections/TeamSection';
import { CTASection } from '@/sections/CTASection';

export const HomePage: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Discover What Moves the World */}
      <ContentSection
        title="Discover What Moves the World"
        paragraphs={[
          "Step into a space where ideas take center stage. Hear from inspiring speakers, innovators, and leaders as they share insights, experiences, and stories that expand your perspective. Each talk is an opportunity to learn, grow, and see the world through new eyes.",
        ]}
        layout="brain-left"
        brainPosition="left"
        triangleDensity="low"
      />

      {/* Be part of a day... */}
      <TextSection
        lines={[
          "Be part of a day that sparks ideas and inspires action. Get your ticket and join the experience.",
          "Join the curious minds. Reserve your spot now.",
        ]}
        triangleDensity="high"
      />

      {/* TEDx ICHB Colentina Youth */}
      <TextSection
        lines={[
          "TEDx ICHB Colentina Youth explores the theme From Vision to Impact. Speakers from diverse fields share ideas that turn visions into action.",
          "This event sparks curiosity, challenges perspectives, and inspires change. Join us to see how ideas can create real impact.",
        ]}
        triangleDensity="medium"
      />

      {/* Connect, Reflect */}
      <TextSection
        lines={[
          "Connect, reflect, and imagine what's possible.",
          "Leave inspired to turn your own ideas into action.",
        ]}
        triangleDensity="medium"
      />

      {/* A Spark of Ideas */}
      <ContentSection
        title="A Spark of Ideas"
        paragraphs={[
          "Mark your calendars for May 23rd, 2026. TEDx ICHB Colentina Youth will bring together speakers, innovators, and curious minds for a day of inspiration and discovery. Explore ideas that challenge the ordinary, ignite creativity, and turn visions into impact.",
          "Don't miss your chance to be part of a community where imagination meets action and ideas light the way to change.",
        ]}
        layout="brain-left"
        brainPosition="left"
        triangleDensity="low"
      />

      {/* Shaping Tomorrow Together */}
      <ContentSection
        title="Shaping Tomorrow Together"
        paragraphs={[
          "Our Mission is to inspire action and growth by connecting young minds with experiences that broaden perspective and encourage meaningful contribution. We aim to create a space where curiosity, courage, and collaboration lead to real change in communities and beyond.",
        ]}
        accentText="We aim to create a space where curiosity, courage, and collaboration lead to real change in communities and beyond."
        layout="brain-right"
        brainPosition="right"
        triangleDensity="low"
      />

      {/* Speakers Section */}
      <SpeakersSection />

      {/* Team Section */}
      <TeamSection />

      {/* CTA Section */}
      <CTASection />
    </>
  );
};

export default HomePage;
