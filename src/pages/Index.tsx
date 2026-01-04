"use client";

import React from 'react';
import ProfileCard from "@/components/ProfileCard";
import Navbar from "@/components/Navbar";
import StarsBackground from "@/components/StarsBackground";
import VideoSection from "@/components/VideoSection";
import ShortsSection from "@/components/ShortsSection";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { useConfig } from "@/context/ConfigContext";

const Index = () => {
  const { config } = useConfig();

  return (
    <div 
      style={{ backgroundColor: config.backgroundColor }}
      className="min-h-screen flex flex-col items-center font-['Press_Start_2P'] relative overflow-hidden transition-colors duration-500"
    >
      <StarsBackground />
      <Navbar />

      <main className="z-10 w-full flex flex-col items-center mt-32 mb-20 max-w-7xl">
        {/* Profile */}
        <div className="w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-500 mb-20">
          <ProfileCard />
        </div>

        {/* Featured Content (The 3 big ones) */}
        <div className="w-full flex flex-col items-center mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h2 
            style={{ color: config.primaryColor }} 
            className="text-[10px] md:text-xs mb-8 tracking-[0.2em] uppercase opacity-70"
          >
            LONG-FORM
          </h2>
          <VideoSection />
        </div>

        {/* Shorts Content (The marquee) */}
        <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <h2 
            style={{ color: config.primaryColor }} 
            className="text-[10px] md:text-xs mb-0 tracking-[0.2em] uppercase opacity-70"
          >
            SHORTS
          </h2>
          <ShortsSection />
        </div>
      </main>

      <footer className="mt-auto pb-8 z-10 opacity-30 hover:opacity-100 transition-opacity">
        <MadeWithDyad />
      </footer>
    </div>
  );
};

export default Index;