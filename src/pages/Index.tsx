"use client";

import React from 'react';
import { motion } from 'framer-motion';
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

      <main className="flex-grow z-10 w-full flex flex-col items-center px-4 pt-20 pb-32 gap-24">
        
        {/* Frase de Destaque */}
        <div className="w-full max-w-5xl text-center px-4 perspective-1000">
          <h1 className="text-sm md:text-xl lg:text-2xl leading-loose uppercase tracking-widest font-bold flex flex-col gap-4 md:gap-6 animate-float-optimized">
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
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center w-full max-w-7xl"
        >
          <ProfileCard />
        </motion.div>

        {/* Seção 2: Videos (Scroll Reveal) */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-7xl flex flex-col items-center gap-16"
        >
          <h2 
            style={{ 
              color: config.primaryColor,
              textShadow: `0 0 20px ${config.primaryColor}80`
            }} 
            className="text-xl md:text-3xl tracking-[0.3em] font-bold uppercase cursor-default"
          >
            VIDEOS
          </h2>
          <VideoSection />
        </motion.div>

        {/* Seção 3: Clientes (Stagger handled inside component) */}
        <div className="w-full max-w-7xl flex flex-col items-center gap-20">
          <ClientsSection />
          
          {/* Detalhe Premium */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.5 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-8"
          >
            <p className="text-[10px] md:text-xs font-['Press_Start_2P'] uppercase tracking-[0.4em] text-white/50 text-center">
              Editing focused on retention.
            </p>
          </motion.div>
        </div>
      </main>

      <footer className="z-10 pb-8">
        <MadeWithDyad />
      </footer>
    </div>
  );
};

export default Index;