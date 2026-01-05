"use client";

import React, { useState, memo } from 'react';
import { useConfig } from '@/context/ConfigContext';
import ContactModal from './ContactModal';
import { Reveal } from './Reveal';

const ProfileCard = memo(() => {
  const { config } = useConfig();
  const [isContactOpen, setIsContactOpen] = useState(false);

  const cardStyle = { 
    backgroundColor: `${config.cardColor}cc`, 
    borderColor: config.primaryColor,
  };

  const displayedClients = config.clients ? [...config.clients].reverse().slice(0, 4) : [];

  return (
    <>
      <Reveal width="100%" className="flex flex-col items-center gap-8 w-full max-w-xl z-20">
        <style>{`
          @keyframes shimmer {
            0% { transform: translateX(-200%) skewX(-20deg); }
            15% { transform: translateX(200%) skewX(-20deg); }
            100% { transform: translateX(200%) skewX(-20deg); }
          }
        `}</style>

        <div 
          style={cardStyle} 
          className="relative overflow-hidden backdrop-blur-md border-4 p-12 rounded-[40px] w-full flex flex-col items-center"
        >
          {/* Efeito de brilho (Shimmer) passando - Mantido */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[40px] z-10">
              <div 
                style={{ animation: 'shimmer 6s infinite linear' }}
                className="absolute top-0 bottom-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
              />
          </div>

          <div className="scanline z-0"></div>
          
          <div className="relative w-32 h-32 mb-6 z-20">
            <div style={{ borderColor: config.secondaryColor }} className="absolute inset-0 border-4 rounded-full animate-pulse"></div>
            {/* Otimização: fetchPriority="high" pois é a imagem principal (LCP) */}
            <img 
              src={config.profileImage} 
              alt="Profile" 
              fetchPriority="high"
              width={128}
              height={128}
              className="w-full h-full p-2 bg-black rounded-full object-cover"
            />
          </div>
          
          <h1 
            style={{ color: config.primaryColor }} 
            className="text-xl font-['Press_Start_2P'] uppercase text-center cursor-default z-20"
          >
            {config.profileName}
          </h1>
          
          {config.description && (
            <p 
              style={{ color: config.secondaryColor }} 
              className="text-xs text-center mt-4 mb-8 z-20 max-w-md"
            >
              {config.description}
            </p>
          )}

          <button 
            onClick={() => setIsContactOpen(true)}
            className="group/btn relative px-6 py-2.5 rounded-full font-bold text-black text-[10px] uppercase tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 mb-6 flex items-center justify-center z-20 overflow-hidden"
            style={{
              backgroundColor: config.primaryColor,
              boxShadow: `0 0 15px ${config.primaryColor}66`,
            }}
          >
            <span className="relative z-10">Work With Me</span>
            <div className="absolute inset-0 border-2 border-white/50 rounded-full opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
          </button>

          {displayedClients.length > 0 && (
            <div className="flex items-center gap-3 z-20">
              <div className="flex -space-x-3">
                {displayedClients.map((client: any, index: number) => (
                  <div 
                    key={index} 
                    className="w-8 h-8 rounded-full border-2 border-black/50 overflow-hidden bg-zinc-800"
                  >
                    <img 
                      src={client.image} 
                      alt={client.name || `Client ${index + 1}`} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                      width={32}
                      height={32}
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs font-medium text-white/70">
                Trusted by <span style={{ color: config.primaryColor }}>15+</span> creators
              </p>
            </div>
          )}
        </div>
      </Reveal>

      <ContactModal 
        isOpen={isContactOpen} 
        onClose={() => setIsContactOpen(false)} 
      />
    </>
  );
});

ProfileCard.displayName = 'ProfileCard';

export default ProfileCard;