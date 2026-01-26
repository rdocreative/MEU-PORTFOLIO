"use client";

import React from 'react';
import { useConfig } from '@/context/ConfigContext';
import { Reveal } from '@/components/Reveal';
import VideoSection from '@/components/VideoSection';
import ClientSection from '@/components/ClientSection';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import StatsCard from '@/components/StatsCard';

const Index = () => {
  const { config, isLoading } = useConfig();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen transition-colors duration-500 overflow-x-hidden selection:bg-white/20"
      style={{ backgroundColor: config.backgroundColor, color: config.primaryColor }}
    >
      <Navbar />

      <main className="container mx-auto px-4 md:px-6 pt-24 pb-12">
        {/* Hero Section - Compactada */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 mb-20 md:mb-32 max-w-5xl mx-auto">
          <Reveal width="100%" delay={0.1} className="flex-shrink-0">
            <div className="relative group">
              <div className="absolute -inset-2 bg-white/5 rounded-full blur-xl group-hover:bg-white/10 transition-all duration-500" />
              <img 
                src={config.profileImage} 
                alt={config.profileName}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-white/20 relative z-10 object-cover shadow-2xl"
              />
            </div>
            
            <div className="mt-6 flex justify-center">
              <StatsCard label="SUBS" value={config.subscribers} />
            </div>
          </Reveal>

          <Reveal width="100%" delay={0.2} className="text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter uppercase leading-tight">
              {config.profileName}
            </h1>
            <p 
              className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] leading-relaxed max-w-lg mx-auto md:mx-0"
              style={{ color: config.secondaryColor }}
            >
              {config.description}
            </p>
          </Reveal>
        </div>

        {/* Work Section - Com Carrossel */}
        <section id="work" className="mb-24 max-w-6xl mx-auto">
          <Reveal width="100%">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[1px] w-8 bg-white/20" />
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/60">Selected Work</h2>
              <div className="h-[1px] flex-1 bg-white/20" />
            </div>
          </Reveal>
          <VideoSection />
        </section>

        {/* Partners Section - Com Carrossel Infinito */}
        <section id="clients" className="mb-20 max-w-6xl mx-auto">
          <Reveal width="100%">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[1px] w-8 bg-white/20" />
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/60">Trusted By</h2>
              <div className="h-[1px] flex-1 bg-white/20" />
            </div>
          </Reveal>
          <ClientSection />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;