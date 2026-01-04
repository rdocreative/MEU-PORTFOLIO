"use client";

import React from 'react';
import ProfileCard from "@/components/ProfileCard";
import Navbar from "@/components/Navbar";
import StarsBackground from "@/components/StarsBackground";
import ClientsSection from "@/components/ClientsSection";
import VideoSection from "@/components/VideoSection";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { useConfig } from "@/context/ConfigContext";

const Index = () => {
  const { config } = useConfig();

  return (
    <div 
      style={{ backgroundColor: config.backgroundColor }}
      className="min-h-screen flex flex-col items-center p-4 font-['Press_Start_2P'] relative overflow-hidden transition-colors duration-500"
    >
      {/* Estrelas de Fundo */}
      <StarsBackground />

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="z-10 w-full flex flex-col items-center mt-32 mb-20 max-w-4xl">
        {/* Profile Section */}
        <div className="w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-500 mb-16">
          <ProfileCard />
          <ClientsSection />
        </div>

        {/* Video Section - Agora mais próximo do perfil */}
        <div id="videos" className="w-full flex flex-col items-center pt-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="w-full flex flex-col items-center gap-4 mb-16">
            <h2 style={{ color: config.primaryColor }} className="text-[14px] md:text-[18px] uppercase tracking-widest">
              LONG_FORM_CONTENT
            </h2>
            <div style={{ backgroundColor: config.secondaryColor }} className="w-24 h-[3px] opacity-40"></div>
          </div>

          <VideoSection />
        </div>
      </main>

      <footer className="mt-auto pb-8 z-10 opacity-30 hover:opacity-100 transition-opacity">
        <MadeWithDyad />
      </footer>
    </div>
  );
};

export default Index;