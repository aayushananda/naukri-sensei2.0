import React from 'react';
import Hero from '../layouts/Hero';
import LandingSection from '../layouts/LandingSection';
import ScrollingServices from '../layouts/Scrolling';
import QuoteImageSection from '../layouts/quote';

export default function Landing() {
  return (
    <>
      <Hero />
      <ScrollingServices />
      <LandingSection />
      <QuoteImageSection />
    </>
  );
}
