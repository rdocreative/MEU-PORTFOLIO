"use client";

import React from 'react';
import ProfileCard from "@/components/ProfileCard";
import Navbar from "@/components/Navbar";
import StarsBackground from "@/components/StarsBackground";
import VideoSection from "@/components/VideoSection";
import ShortsSection from "@/components/ShortsSection";
import ClientsSection from "@/components/ClientsSection";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { useConfig } from "@/context/ConfigContext";

const Index = () => {
  const { config, isLoading } = useConfig();

  if (isLoading) {
    return <div style={{ backgroundColor: config.backgroundColor }} className="min-h-screen" />;
  }

  return (
    <div 
      style={{ backgroundColor: config.backgroundColor }}
      className="min-h-screen flex flex-col font-['Press_Start_2P'] relative overflow-x-hidden transition-colors duration-500 selection:bg-white selection:text-black"
    >
      <StarsBackground />
      <Navbar />

      <main className="flex-grow z-10 w-full flex flex-col items-center px-4 pt-32">
        {/* Hero / Profile Section - Centralizado na tela */}
        <div className="min-h-[60vh] flex flex-col items-center justify-center w-full max-w-7xl gap-16 mb-24 animate-in slide-in-from-bottom-24 fade-in duration-1000 delay-500 fill-mode-backwards">
          <ProfileCard />
          <ClientsSection />
        </div>

        {/* Long Form */}
        <div className="w-full max-w-7xl flex flex-col items-center gap-10 mb-32 animate-in slide-in-from-bottom-24 fade-in duration-1000 delay-700 fill-mode-backwards">
          <h2 
            style={{ color: config.primaryColor }} 
            className="text-[10px] md:text-xs tracking-[0.2em] uppercase opacity-70"
          >
            LONG-FORM
          </h2>
          <VideoSection />
        </div>

        {/* Shorts Content */}
        <div className="w-full max-w-7xl flex flex-col items-center gap-10 mb-32 animate-in slide-in-from-bottom-24 fade-in duration-1000 delay-900 fill-mode-backwards">
          <h2 
            style={{ color: config.primaryColor }} 
            className="text-[10px] md:text-xs tracking-[0.2em] uppercase opacity-70"
          >
            SHORTS
          </h2>
          <ShortsSection />
        </div>
      </main>

      <footer className="z-10 pb-8 animate-in fade-in duration-1000 delay-1000">
        <MadeWithDyad />
      </footer>
    </div>
  );
};

export default Index;