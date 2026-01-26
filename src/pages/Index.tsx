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
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen transition-colors duration-500 overflow-x-hidden"
      style={{ backgroundColor: config.backgroundColor, color: config.primaryColor }}
    >
      <Navbar />

      <main className="container mx-auto px-6 pt-32 pb-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-24">
          <Reveal width="100%" delay={0.1} className="lg:w-1/3 flex flex-col items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-500" />
              <img 
                src={config.profileImage} 
                alt={config.profileName}
                className="w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-white relative z-10 object-cover shadow-2xl"
              />
            </div>
            
            <div className="mt-8 flex flex-col items-center gap-4">
              <StatsCard label="SUBSCRIBERS" value={config.subscribers} />
            </div>
          </Reveal>

          <Reveal width="100%" delay={0.2} className="lg:w-2/3 text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-black mb-6 tracking-tighter uppercase leading-[0.9]">
              {config.profileName}
            </h1>
            <p 
              className="text-lg md:text-xl font-bold uppercase tracking-[0.2em] mb-8"
              style={{ color: config.secondaryColor }}
            >
              {config.description}
            </p>
          </Reveal>
        </div>

        <section id="work" className="mb-32">
          <Reveal width="100%">
            <div className="flex items-center gap-6 mb-12">
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">Selected_Work</h2>
              <div className="h-[2px] flex-1 bg-white/10" />
            </div>
          </Reveal>
          <VideoSection />
        </section>

        <section id="clients" className="mb-32">
          <Reveal width="100%">
            <div className="flex items-center gap-6 mb-12">
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">Partnerships</h2>
              <div className="h-[2px] flex-1 bg-white/10" />
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