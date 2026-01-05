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
      className="min-h-screen flex flex-col font-['Press_Start_2P'] relative overflow-x-hidden transition-colors duration-500 selection:bg-white selection:text-black"
    >
      <StarsBackground />

      {/* Container Principal */}
      <main className="flex-grow z-10 w-full flex flex-col items-center px-4 pt-20 pb-32 gap-20">
        
        {/* Frase de Destaque - TOPO */}
        <div className="w-full max-w-5xl text-center px-4">
          <h1 
            className="text-sm md:text-xl lg:text-2xl leading-loose uppercase tracking-widest font-bold flex flex-col gap-4 md:gap-6"
          >
            <span style={{ color: config.secondaryColor }} className="opacity-80">
              Receive the value
            </span>
            <span 
              className="relative inline-block transform md:scale-110"
              style={{ 
                color: config.primaryColor,
                textShadow: `0 0 25px ${config.primaryColor}50`
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