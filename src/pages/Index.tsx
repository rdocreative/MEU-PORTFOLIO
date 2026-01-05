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

  // Se estiver carregando, mostramos apenas o fundo para evitar o "flash" do perfil errado
  // O Preloader estará cobrindo isso visualmente na primeira carga
  if (isLoading) {
    return <div style={{ backgroundColor: config.backgroundColor }} className="min-h-screen" />;
  }

  return (
    <div 
      style={{ backgroundColor: config.backgroundColor }}
      className="min-h-screen flex flex-col items-center font-['Press_Start_2P'] relative overflow-hidden transition-colors duration-500"
    >
      <StarsBackground />
      
      {/* Navbar entra de cima */}
      <div className="animate-in slide-in-from-top-full duration-1000 delay-300 fill-mode-backwards w-full z-50">
        <Navbar />
      </div>

      <main className="z-10 w-full flex flex-col items-center mt-32 mb-20 max-w-7xl px-4">
        {/* Profile - Entra de baixo com delay */}
        <div className="w-full flex flex-col items-center animate-in slide-in-from-bottom-24 fade-in duration-1000 delay-500 fill-mode-backwards mb-20">
          <ProfileCard />
        </div>

        {/* Clients - Entra de baixo com mais delay */}
        <div className="w-full flex justify-center mb-20 animate-in slide-in-from-bottom-24 fade-in duration-1000 delay-700 fill-mode-backwards">
          <ClientsSection />
        </div>

        {/* Featured Content */}
        <div className="w-full flex flex-col items-center mb-12 animate-in slide-in-from-bottom-24 fade-in duration-1000 delay-900 fill-mode-backwards">
          <h2 
            style={{ color: config.primaryColor }} 
            className="text-[10px] md:text-xs mb-8 tracking-[0.2em] uppercase opacity-70"
          >
            LONG-FORM
          </h2>
          <VideoSection />
        </div>

        {/* Shorts Content */}
        <div className="w-full flex flex-col items-center animate-in slide-in-from-bottom-24 fade-in duration-1000 delay-1000 fill-mode-backwards">
          <h2 
            style={{ color: config.primaryColor }} 
            className="text-[10px] md:text-xs mb-0 tracking-[0.2em] uppercase opacity-70"
          >
            SHORTS
          </h2>
          <ShortsSection />
        </div>
      </main>

      <footer className="mt-auto pb-8 z-10 opacity-30 hover:opacity-100 transition-opacity animate-in fade-in duration-1000 delay-1000">
        <MadeWithDyad />
      </footer>
    </div>
  );
};

export default Index;