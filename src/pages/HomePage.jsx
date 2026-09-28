import React from 'react';
import { motion } from 'framer-motion';
import HeroSection from '../components/HeroSection';
import FeaturedCollection from '../components/FeaturedCollection';
import InteractiveShowcase from '../components/InteractiveShowcase';
import FragranceDiscovery from '../components/FragranceDiscovery';
import BrandStory from '../components/BrandStory';
import PromoSection from '../components/PromoSection';
import Reviews from '../components/Reviews';
import Newsletter from '../components/Newsletter';

const HomePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <HeroSection />
      <FeaturedCollection />
      <InteractiveShowcase />
      <FragranceDiscovery />
      <BrandStory />
      <PromoSection />
      <Reviews />
      <Newsletter />
    </motion.div>
  );
};

export default HomePage;
