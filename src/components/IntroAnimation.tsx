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
    // Fase 1: Início estático e grande
    
    // Fase 2: Começa a diminuir para o tamanho normal (1000ms)
    const moveTimer = setTimeout(() => {
      setPhase('moving');
    }, 1000);

    // Fase 3: Desaparece suavemente para revelar o card real (2200ms)
    const hideTimer = setTimeout(() => {
      setPhase('hiding');
    }, 2200);

    // Fase 4: Desmonta o componente (3000ms)
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(moveTimer);
      clearTimeout(hideTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  // Se já estiver escondendo, não renderizamos mais o componente visual pesado, 
  // apenas o container transparente para garantir o fade out suave se necessário.
  // Mas para garantir o match perfeito, mantemos o elemento até o fim da opacidade.

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-1000 pointer-events-none ${
        phase === 'hiding' ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ backgroundColor: config.backgroundColor }}
    >
      <div 
        className="relative flex flex-col items-center gap-8 transition-all duration-[1500ms] ease-in-out will-change-transform"
        style={{
          // Ajuste fino: scale(1) para bater com o tamanho real (w-32).
          // translateY(0) ou leve ajuste se soubermos que o card fica mais pra cima.
          // Como o card tem conteúdo acima dele (título), ele não fica no topo absoluto.
          // Vamos manter no centro e deixar o fade-out fazer a mágica da transição.
          transform: phase === 'moving' || phase === 'hiding' 
            ? 'scale(1) translateY(0)' 
            : 'scale(2.5) translateY(0)',
        }}
      >
        {/* Imagem do Perfil - Tamanho base w-32 (128px) igual ao ProfileCard */}
        <div className="relative">
            <div 
              style={{ borderColor: config.secondaryColor }}
              className={`absolute -inset-4 border-2 rounded-full opacity-0 transition-opacity duration-500 ${
                  phase === 'initial' ? 'opacity-100 animate-pulse' : ''
              }`} 
            />
            <div 
                className="w-32 h-32 rounded-full overflow-hidden border-4 shadow-[0_0_30px_rgba(255,255,255,0.2)] bg-black"
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
          className="text-xl font-['Press_Start_2P'] uppercase text-center tracking-widest absolute top-40 w-[200%]"
          style={{ 
            color: config.primaryColor,
            textShadow: `0 0 20px ${config.primaryColor}80`,
            opacity: phase === 'moving' || phase === 'hiding' ? 0 : 1,
            transition: 'opacity 0.5s ease-out'
          }}
        >
          {config.profileName}
        </h1>
      </div>
    </div>
  );
};

export default IntroAnimation;