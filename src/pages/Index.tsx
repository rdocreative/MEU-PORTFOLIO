"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import ProfileCard from '@/components/ProfileCard';
import VideoSection from '@/components/VideoSection';
import ClientsSection from '@/components/ClientsSection';
import ShortsSection from '@/components/ShortsSection';
import StarsBackground from '@/components/StarsBackground';
import { useConfig } from '@/context/ConfigContext';

const Index = () => {
  const { config } = useConfig();

  return (
    <div 
      className="min-h-screen flex flex-col items-center overflow-x-hidden selection:bg-white selection:text-black relative"
      style={{ backgroundColor: config.backgroundColor }}
    >
      <StarsBackground />
      <Navbar />
      
      {/* Background Noise Effect */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0"></div>
      
      <main className="w-full flex flex-col items-center gap-16 md:gap-24 pt-32 pb-20 relative z-10">
        <ProfileCard />
        
        <div className="w-full flex flex-col items-center">
          <VideoSection />
          <ClientsSection />
        </div>
        
        <ShortsSection />
      </main>

      <footer className="w-full py-10 flex flex-col items-center gap-4 text-[8px] opacity-20 font-['Press_Start_2P'] uppercase">
        <p>© {new Date().getFullYear()} {config.profileName}</p>
        <p>Created by pixel_void</p>
      </footer>
    </div>
  );
};

export default Index;