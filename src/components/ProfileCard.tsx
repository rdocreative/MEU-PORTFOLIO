"use client";

import React, { useRef, useState } from 'react';
import { Twitter, Mail } from 'lucide-react';
import { useConfig } from '@/context/ConfigContext';

// Ícone SVG do Discord
const DiscordIcon = ({ className }: { className?: string }) => (
  <svg 
    role="img" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg" 
    fill="currentColor"
    className={className}
  >
    <title>Discord</title>
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z"/>
  </svg>
);

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
    // REMOVIDO: boxShadow: `10px 10px 0px 0px ${config.primaryColor}4d`,
    transform: isHovering 
      ? `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(1.02, 1.02, 1.02)` 
      : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    transition: isHovering ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out'
  };

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
          className="text-2xl mb-8 font-['Press_Start_2P'] uppercase text-center pixel-glitch cursor-default transition-transform duration-300 z-20"
        >
          {config.profileName}
        </h1>

        <div 
          className="flex gap-6 transition-transform duration-300 z-20"
          style={{ transform: isHovering ? 'translateZ(15px)' : 'translateZ(0)' }}
        >
          <a href={config.twitterUrl} target="_blank" rel="noopener" style={primaryStyle} className="p-4 bg-zinc-900 hover:bg-white hover:text-black transition-all border-2 rounded-full group">
            <Twitter className="w-6 h-6" />
          </a>
          <a href={config.discordUrl} target="_blank" rel="noopener" style={primaryStyle} className="p-4 bg-zinc-900 hover:bg-white hover:text-black transition-all border-2 rounded-full group">
            <DiscordIcon className="w-6 h-6" />
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