"use client";

import React, { useRef, useState } from 'react';
import { Twitter, Mail, MessageSquare } from 'lucide-react';
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

  const primaryStyle = { borderColor: config.primaryColor };
  const cardStyle = { 
    backgroundColor: `${config.cardColor}cc`, 
    borderColor: config.primaryColor,
    boxShadow: `10px 10px 0px 0px ${config.primaryColor}4d`,
    transform: isHovering 
      ? `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(1.02, 1.02, 1.02)` 
      : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    transition: isHovering ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out'
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-lg perspective-1000">
      {/* Profile Section */}
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={resetRotation}
        style={cardStyle} 
        className="relative overflow-hidden backdrop-blur-md border-4 p-12 rounded-[40px] w-full flex flex-col items-center group/card will-change-transform"
      >
        {/* Efeito de brilho (Glare) */}
        <div 
            className="absolute inset-0 pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 mix-blend-overlay"
            style={{
                background: `linear-gradient(${115 + rotation.x * 2}deg, transparent 30%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 55%, transparent 70%)`,
                transform: `translateX(${rotation.y * 2}px) translateY(${rotation.x * 2}px)`
            }}
        />

        <div className="scanline"></div>
        
        <div 
          className="relative w-32 h-32 mb-6 transition-transform duration-500"
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
          className="text-2xl mb-3 font-['Press_Start_2P'] uppercase text-center pixel-glitch cursor-default transition-transform duration-300"
        >
          {config.profileName}
        </h1>
        <p 
          style={{ transform: isHovering ? 'translateZ(5px)' : 'translateZ(0)' }}
          className="text-gray-400 text-[12px] text-center mb-8 leading-relaxed px-6 uppercase opacity-80 group-hover/card:opacity-100 transition-all duration-300"
        >
          {config.description}
        </p>

        <div 
          className="flex gap-6 transition-transform duration-300"
          style={{ transform: isHovering ? 'translateZ(15px)' : 'translateZ(0)' }}
        >
          <a href={config.twitterUrl} target="_blank" rel="noopener" style={primaryStyle} className="p-4 bg-zinc-900 hover:bg-white hover:text-black transition-all border-2 rounded-full group">
            <Twitter className="w-6 h-6" />
          </a>
          <a href={config.discordUrl} target="_blank" rel="noopener" style={primaryStyle} className="p-4 bg-zinc-900 hover:bg-white hover:text-black transition-all border-2 rounded-full group">
            <MessageSquare className="w-6 h-6" />
          </a>
          <a href={`mailto:${config.email}`} style={primaryStyle} className="p-4 bg-zinc-900 hover:bg-white hover:text-black transition-all border-2 rounded-full group">
            <Mail className="w-6 h-6" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;