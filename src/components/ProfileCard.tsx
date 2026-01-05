"use client";

import React, { useRef, useState } from 'react';
import { useConfig } from '@/context/ConfigContext';

const ProfileCard = () => {
  const { config } = useConfig();
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calcula a rotação baseada na posição do mouse (efeito de "empurrar" o card)
    const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg
    const rotateY = ((x - centerX) / centerX) * 10;  // Max 10 deg

    setRotation({ x: rotateX, y: rotateY });
  };

  const resetRotation = () => {
    setIsHovering(false);
    setRotation({ x: 0, y: 0 });
  };

  const cardStyle = { 
    backgroundColor: `${config.cardColor}cc`, 
    borderColor: config.primaryColor,
    transform: isHovering 
      ? `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(1.02, 1.02, 1.02)` 
      : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    transition: isHovering ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out'
  };

  // Inverte a ordem dos clientes salvos para mostrar "outros" primeiro e limita a 4
  const displayedClients = config.clients ? [...config.clients].reverse().slice(0, 4) : [];

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-xl perspective-1000">
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-200%) skewX(-20deg); }
          15% { transform: translateX(200%) skewX(-20deg); }
          100% { transform: translateX(200%) skewX(-20deg); }
        }
      `}</style>

      {/* Profile Section */}
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={resetRotation}
        style={cardStyle} 
        className="relative overflow-hidden backdrop-blur-md border-4 p-12 rounded-[40px] w-full flex flex-col items-center group/card will-change-transform"
      >
        {/* Efeito de brilho interativo (Glare) */}
        <div 
            className="absolute inset-0 pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 mix-blend-overlay z-10"
            style={{
                background: `linear-gradient(${115 + rotation.x * 2}deg, transparent 30%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 55%, transparent 70%)`,
                transform: `translateX(${rotation.y * 2}px) translateY(${rotation.x * 2}px)`
            }}
        />

        {/* Efeito de brilho automático passando (Shimmer) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[40px] z-10">
            <div 
              style={{ animation: 'shimmer 6s infinite linear' }}
              className="absolute top-0 bottom-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
            />
        </div>

        <div className="scanline z-0"></div>
        
        <div 
          className="relative w-32 h-32 mb-6 transition-transform duration-500 z-20"
          style={{ transform: isHovering ? 'translateZ(20px)' : 'translateZ(0)' }}
        >
          <div style={{ borderColor: config.secondaryColor }} className="absolute inset-0 border-4 rounded-full animate-pulse"></div>
          <img 
            src={config.profileImage} 
            alt="Profile" 
            className="w-full h-full p-2 bg-black rounded-full object-cover"
          />
        </div>
        
        <h1 
          style={{ 
            color: config.primaryColor,
            transform: isHovering ? 'translateZ(10px)' : 'translateZ(0)'
          }} 
          className="text-xl font-['Press_Start_2P'] uppercase text-center pixel-glitch cursor-default transition-transform duration-300 z-20"
        >
          {config.profileName}
        </h1>
        
        {/* Descrição do Perfil */}
        {config.description && (
          <p 
            style={{ 
              color: config.secondaryColor,
              transform: isHovering ? 'translateZ(10px)' : 'translateZ(0)'
            }} 
            className="text-xs text-center mt-4 mb-8 transition-transform duration-300 z-20 max-w-md"
          >
            {config.description}
          </p>
        )}

        {/* Botão CTA Destacado */}
        <a 
          href={`mailto:${config.email}`}
          className="px-8 py-3 rounded-full font-bold text-black text-sm uppercase tracking-wider transition-all hover:scale-105 active:scale-95 mb-6 flex items-center justify-center z-20"
          style={{
            backgroundColor: config.primaryColor,
            boxShadow: `0 0 20px ${config.primaryColor}66`,
            transform: isHovering ? 'translateZ(20px)' : 'translateZ(0)'
          }}
        >
          Work With Me
        </a>

        {/* Trusted By Section */}
        {displayedClients.length > 0 && (
          <div 
            className="flex items-center gap-3 z-20 transition-transform duration-300"
            style={{ transform: isHovering ? 'translateZ(15px)' : 'translateZ(0)' }}
          >
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
    </div>
  );
};

export default ProfileCard;