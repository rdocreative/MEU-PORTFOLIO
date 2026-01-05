"use client";

import React from 'react';
import Header from '@/components/Header';
import FeaturedSection from '@/components/FeaturedSection';
import ClientsSection from '@/components/ClientsSection';
import ShortsMarquee from '@/components/ShortsMarquee';
import Footer from '@/components/Footer';
import { useConfig } from '@/context/ConfigContext';

const Index = () => {
  const { config } = useConfig();

  return (
    <div 
      className="min-h-screen flex flex-col items-center overflow-x-hidden selection:bg-white selection:text-black"
      style={{ backgroundColor: config.backgroundColor }}
    >
      {/* Background Noise Effect */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      <main className="w-full flex flex-col items-center gap-16 md:gap-32 pb-20 relative z-10">
        <Header />
        
        <div className="w-full flex flex-col items-center gap-10">
          <FeaturedSection />
          <ClientsSection />
        </div>
        
        <ShortsMarquee />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;