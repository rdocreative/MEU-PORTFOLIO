"use client";

import React, { useEffect, useState } from 'react';
import { useConfig } from '@/context/ConfigContext';

interface IntroAnimationProps {
  onComplete: () => void;
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const { config } = useConfig();
  const [phase, setPhase] = useState<'initial' | 'moving' | 'hiding'>('initial');

  useEffect(() => {
    // Fase 1: Início estático (0ms - 1000ms)
    
    // Fase 2: Começa a mover para o topo (1000ms)
    const moveTimer = setTimeout(() => {
      setPhase('moving');
    }, 1500);

    // Fase 3: Desaparece o overlay (2500ms)
    const hideTimer = setTimeout(() => {
      setPhase('hiding');
    }, 2500);

    // Fase 4: Completa e desmonta (3000ms)
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(moveTimer);
      clearTimeout(hideTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  if (phase === 'hiding' && false) return null; // Mantemos renderizado até o final para o fade out

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-700 pointer-events-none ${
        phase === 'hiding' ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ backgroundColor: config.backgroundColor }}
    >
      <div 
        className="relative flex flex-col items-center gap-8 transition-all duration-1000 ease-in-out will-change-transform"
        style={{
          transform: phase === 'moving' || phase === 'hiding' 
            ? 'translateY(-25vh) scale(0.6)' // Move para cima e diminui
            : 'translateY(0) scale(1.5)',    // Começa grande no centro
        }}
      >
        {/* Imagem do Perfil */}
        <div className="relative">
            <div 
              style={{ borderColor: config.secondaryColor }}
              className={`absolute -inset-4 border-2 rounded-full opacity-0 transition-opacity duration-500 ${
                  phase === 'initial' ? 'opacity-100 animate-pulse' : ''
              }`} 
            />
            <div 
                className="w-32 h-32 rounded-full overflow-hidden border-4 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                style={{ borderColor: config.primaryColor }}
            >
                <img 
                    src={config.profileImage} 
                    alt="Intro Profile" 
                    className="w-full h-full object-cover"
                />
            </div>
        </div>

        {/* Nome */}
        <h1 
          className="text-xl font-['Press_Start_2P'] uppercase text-center tracking-widest"
          style={{ 
            color: config.primaryColor,
            textShadow: `0 0 20px ${config.primaryColor}80`
          }}
        >
          {config.profileName}
        </h1>

        {/* Loading Bar (apenas decorativo na intro) */}
        <div 
            className={`w-48 h-1 bg-zinc-800 rounded-full overflow-hidden transition-opacity duration-300 ${
                phase !== 'initial' ? 'opacity-0' : 'opacity-100'
            }`}
        >
            <div 
                className="h-full bg-white animate-[shimmer_1.5s_infinite]"
                style={{ backgroundColor: config.primaryColor }}
            />
        </div>
      </div>
    </div>
  );
};

export default IntroAnimation;