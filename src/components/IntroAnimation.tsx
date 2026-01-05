"use client";

import React, a from 'react';
import { useConfig } from '@/context/ConfigContext';

interface IntroAnimationProps {
  onComplete: () => void;
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const { config } = useConfig();
  const [phase, setPhase] = a.useState<'start' | 'shrink' | 'fade'>('start');

  a.useEffect(() => {
    // Inicia a animação de encolher quase imediatamente
    const shrinkTimer = setTimeout(() => setPhase('shrink'), 100);
    // Inicia o fade out antes do fim para sobrepor com o conteúdo principal
    const fadeTimer = setTimeout(() => setPhase('fade'), 1300);
    // Completa e desmonta o componente
    const completeTimer = setTimeout(onComplete, 1800); // Duração total de 1.8s

    return () => {
      clearTimeout(shrinkTimer);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-500 ease-out pointer-events-none ${
        phase === 'fade' ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ backgroundColor: config.backgroundColor }}
    >
      <div 
        className="relative flex flex-col items-center gap-8 will-change-transform"
        style={{
          transform: phase === 'start' ? 'scale(1.5)' : 'scale(1)',
          transition: 'transform 1200ms cubic-bezier(0.22, 1, 0.36, 1)', // Curva de ease-out suave
        }}
      >
        {/* Imagem do Perfil */}
        <div className="relative w-32 h-32">
            <div 
                className="rounded-full overflow-hidden border-4 shadow-[0_0_30px_rgba(255,255,255,0.2)] bg-black"
                style={{ borderColor: config.primaryColor }}
            >
                <img 
                    src={config.profileImage} 
                    alt="Intro Profile" 
                    className="w-full h-full object-cover"
                />
            </div>
        </div>

        {/* Nome - some um pouco antes para não colidir com o nome real */}
        <h1 
          className="text-xl font-['Press_Start_2P'] uppercase text-center tracking-widest absolute top-40 w-[200%] transition-opacity duration-500"
          style={{ 
            color: config.primaryColor,
            textShadow: `0 0 20px ${config.primaryColor}80`,
            opacity: phase === 'start' ? 1 : 0,
          }}
        >
          {config.profileName}
        </h1>
      </div>
    </div>
  );
};

export default IntroAnimation;