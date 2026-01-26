"use client";

import React, { useState, memo } from 'react';
import { useConfig } from '@/context/ConfigContext';
import ContactModal from './ContactModal';
import { Reveal } from './Reveal';

const ProfileCard = memo(() => {
  const { config } = useConfig();
  const [isContactOpen, setIsContactOpen] = useState(false);

  const cardStyle = { 
    backgroundColor: config.cardColor ? `${config.cardColor}D9` : '#09090bD9', 
    borderColor: config.primaryColor,
    boxShadow: `0 0 30px -10px ${config.primaryColor}26` // Glow sutil atrás do card
  };

  const displayedClients = config.clients ? [...config.clients].reverse().slice(0, 4) : [];

  return (
    <>
      <Reveal width="100%" className="flex flex-col items-center w-full max-w-lg z-20">
        <style>{`
          @keyframes shimmer {
            0% { transform: translateX(-200%) skewX(-20deg); }
            15% { transform: translateX(200%) skewX(-20deg); }
            100% { transform: translateX(200%) skewX(-20deg); }
          }
        `}</style>

        <div 
          style={cardStyle} 
          className="relative overflow-hidden backdrop-blur-xl border-2 p-8 rounded-[32px] w-full flex flex-col items-center transition-all duration-500 hover:scale-[1.01]"
        >
          {/* Shimmer Effect - Mais suave */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[32px] z-10">
              <div 
                style={{ animation: 'shimmer 6s infinite linear' }}
                className="absolute top-0 bottom-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent"
              />
          </div>

          <div className="scanline z-0 opacity-40"></div>
          
          {/* Avatar / Video Container */}
          <div className="relative w-28 h-28 mb-5 z-20 group">
            <div 
              style={{ borderColor: config.secondaryColor }} 
              className="absolute inset-0 border-2 rounded-full animate-pulse z-30 pointer-events-none opacity-60"
            ></div>
            
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-black/50 bg-black relative shadow-xl">
               {config.profileVideo ? (
                <video
                  src={config.profileVideo}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <img 
                  src={config.profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                />
              )}
            </div>
          </div>
          
          <h1 
            style={{ 
              color: config.primaryColor,
              textShadow: `0 0 15px ${config.primaryColor}50` 
            }} 
            className="text-lg font-['Press_Start_2P'] uppercase text-center cursor-default z-20 tracking-wider mb-3"
          >
            {config.profileName}
          </h1>
          
          {config.description && (
            <p 
              style={{ color: config.secondaryColor }} 
              className="text-[10px] leading-relaxed text-center mb-6 z-20 max-w-[280px] font-medium opacity-90"
            >
              {config.description}
            </p>
          )}

          <button 
            onClick={() => setIsContactOpen(true)}
            className="group/btn relative px-8 py-3 rounded-xl font-bold text-black text-[10px] uppercase tracking-wider transition-all duration-300 hover:-translate-y-0.5 active:scale-95 mb-6 flex items-center justify-center z-20 overflow-hidden"
            style={{
              backgroundColor: config.primaryColor,
              boxShadow: `0 0 20px ${config.primaryColor}40`,
            }}
          >
            <span className="relative z-10 flex items-center gap-2">
              Start Project
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
          </button>

          {displayedClients.length > 0 && (
            <div className="flex flex-col items-center gap-3 z-20 mt-1">
              <div className="flex -space-x-2">
                {displayedClients.map((client: any, index: number) => (
                  <div 
                    key={index} 
                    className="w-7 h-7 rounded-full border border-black/50 overflow-hidden bg-zinc-800 transition-transform hover:scale-110 hover:z-10 relative ring-2 ring-black/20"
                    title={client.name}
                  >
                    <img 
                      src={client.image} 
                      alt={client.name} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
              <div 
                className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
              >
                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.15em]">
                  Trusted by <span style={{ color: config.primaryColor }} className="ml-1 brightness-110">15+ CLIENTS</span>
                </p>
              </div>
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