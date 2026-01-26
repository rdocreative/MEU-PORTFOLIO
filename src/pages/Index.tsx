"use client";

import React, { useState } from 'react';
import ProfileCard from "@/components/ProfileCard";
import StarsBackground from "@/components/StarsBackground";
import VideoSection from "@/components/VideoSection";
import ClientsSection from "@/components/ClientsSection";
import ContactModal from "@/components/ContactModal";
import { useConfig } from "@/context/ConfigContext";
import { Reveal } from "@/components/Reveal";
import BackgroundReviews from "@/components/BackgroundReviews";

const Index = () => {
  const { config, isLoading } = useConfig();
  const [isContactOpen, setIsContactOpen] = useState(false);

  if (isLoading) {
    return <div style={{ backgroundColor: config.backgroundColor }} className="min-h-screen" />;
  }

  return (
    <div 
      style={{ backgroundColor: config.backgroundColor }}
      className="min-h-screen flex flex-col relative overflow-x-hidden transition-colors duration-500 selection:bg-white selection:text-black"
    >
      <StarsBackground />
      <BackgroundReviews />

      {/* Styles for the optimized animations */}
      <style jsx global>{`
        @keyframes subtle-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes text-shimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }

        .animate-float-optimized {
          animation: subtle-float 6s ease-in-out infinite;
          will-change: transform;
        }

        .animate-shimmer-text {
          background-size: 200% auto;
          animation: text-shimmer 3s linear infinite;
          will-change: background-position;
        }
      `}</style>

      {/* Container Principal */}
      <main className="flex-grow z-10 w-full flex flex-col items-center px-4 pt-20 pb-16 gap-20">
        
        {/* Frase de Destaque - TOPO */}
        <div className="w-full max-w-5xl text-center px-4 perspective-1000">
          <h1 
            className="text-sm md:text-xl lg:text-2xl leading-loose uppercase tracking-widest font-bold flex flex-col gap-4 md:gap-6 animate-float-optimized"
          >
            <span style={{ color: config.secondaryColor }} className="opacity-80">
              Receive the value
            </span>
            <span 
              className="relative inline-block md:scale-110 animate-shimmer-text bg-clip-text text-transparent"
              style={{ 
                backgroundImage: `linear-gradient(90deg, ${config.primaryColor} 0%, #ffffff 50%, ${config.primaryColor} 100%)`,
                filter: `drop-shadow(0 0 20px ${config.primaryColor}60)`
              }}
            >
              your content deserves
            </span>
          </h1>
        </div>
        
        {/* Seção 1: Perfil */}
        <div className="flex flex-col items-center justify-center w-full max-w-7xl">
          <ProfileCard />
        </div>

        {/* Seção 2: Videos (com Reveal) */}
        <div className="w-full max-w-7xl flex flex-col items-center gap-16">
          <Reveal>
            <h2 
              style={{ 
                color: config.primaryColor,
                textShadow: `0 0 20px ${config.primaryColor}80`
              }} 
              className="text-xl md:text-3xl tracking-[0.3em] font-bold uppercase cursor-default"
            >
              VIDEOS
            </h2>
          </Reveal>
          <VideoSection />
        </div>

        {/* Seção 3: Clientes (com Reveal) */}
        <div className="w-full max-w-7xl flex justify-center -mt-8">
          <ClientsSection />
        </div>

        {/* CTA FINAL */}
        <div className="w-full flex flex-col items-center gap-12 mt-12 mb-8">
          <Reveal variant="fade-up" delay={0.3}>
            <button 
              onClick={() => setIsContactOpen(true)}
              className="group/btn relative px-8 py-3.5 rounded-full font-bold text-black text-[10px] md:text-xs uppercase tracking-[0.2em] transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden shadow-2xl"
              style={{
                backgroundColor: config.primaryColor,
                boxShadow: `0 0 30px ${config.primaryColor}4d`,
              }}
            >
              <span className="relative z-10">Work With Me</span>
              <div className="absolute inset-0 border-2 border-white/40 rounded-full opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-700 ease-in-out" />
            </button>
          </Reveal>
        </div>
      </main>

      <footer className="z-10 pb-16 flex flex-col items-center gap-6">
        {/* Detalhe Premium no Final */}
        <Reveal variant="fade">
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold border-b border-zinc-800 pb-1">
            Editing focused on retention.
          </p>
        </Reveal>
      </footer>

      <ContactModal 
        isOpen={isContactOpen} 
        onClose={() => setIsContactOpen(false)} 
      />
    </div>
  );
};

export default Index;