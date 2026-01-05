"use client";

import React from 'react';
import ProfileCard from "@/components/ProfileCard";
import StarsBackground from "@/components/StarsBackground";
import VideoSection from "@/components/VideoSection";
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
      className="min-h-screen flex flex-col relative overflow-x-hidden transition-colors duration-500 selection:bg-white selection:text-black"
    >
      <StarsBackground />

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

        @keyframes glow-pulse {
          0%, 100% { filter: drop-shadow(0 0 15px rgba(var(--primary-rgb), 0.3)); }
          50% { filter: drop-shadow(0 0 25px rgba(var(--primary-rgb), 0.6)); }
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
      <main className="flex-grow z-10 w-full flex flex-col items-center px-4 pt-20 pb-32 gap-20">
        
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
                // Fallback for text-shadow since bg-clip-text hides it usually, we use drop-shadow filter defined in keyframes
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

        {/* Seção 2: Long Form */}
        <div className="w-full max-w-7xl flex flex-col items-center gap-16">
          <h2 
            style={{ 
              color: config.primaryColor,
              textShadow: `0 0 20px ${config.primaryColor}80`
            }} 
            className="text-xl md:text-3xl tracking-[0.3em] font-bold uppercase hover:scale-105 transition-transform cursor-default"
          >
            LONG-FORM
          </h2>
          <VideoSection />
        </div>

        {/* Seção 3: Clientes */}
        <div className="w-full max-w-7xl flex justify-center -mt-8">
          <ClientsSection />
        </div>
      </main>

      <footer className="z-10 pb-8">
        <MadeWithDyad />
      </footer>
    </div>
  );
};

export default Index;