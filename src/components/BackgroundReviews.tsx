"use client";

import React, { useEffect, useState } from 'react';
import { useConfig } from '@/context/ConfigContext';

const BackgroundReviews = () => {
  const { config } = useConfig();
  const [scrollY, setScrollY] = useState(0);

  // Escuta o scroll para o efeito paralaxe
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    // Seta o valor inicial
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Verifica se há reviews definidos
  if (!config.reviews || config.reviews.length === 0) {
    return null;
  }

  // Verifica se pelo menos UM review tem URL válida (já que agora permitimos slots vazios)
  const hasAnyValidReview = config.reviews.some(r => r && r.url);
  if (!hasAnyValidReview) return null;

  return (
    // 'pointer-events-none' garante que não bloqueie cliques
    // 'hidden lg:block' permite aparecer em laptops (1024px+)
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
      {config.reviews.slice(0, 6).map((review, index) => {
        // Se o slot estiver vazio ou sem URL, não renderiza nada
        if (!review || !review.url) return null;

        const isLeft = index % 2 === 0;
        const topPosition = 15 + (index * 15); 
        const parallaxOffset = scrollY * -0.1; 

        return (
          <div
            key={review.id || index}
            className="absolute hidden lg:block transition-all duration-700 ease-in-out"
            style={{
              top: `${topPosition}vh`,
              [isLeft ? 'left' : 'right']: '2%', // Posição lateral
              width: '335px',
              height: '88px',
              transform: `
                translateY(${parallaxOffset}px) 
                perspective(1000px) 
                rotateY(${isLeft ? '25deg' : '-25deg'}) 
                rotateX(10deg)
              `,
              opacity: 0.8, // Aumentei um pouco a opacidade para garantir visibilidade
              zIndex: 0
            }}
          >
            <div className="relative w-full h-full group">
              {/* Sombra suave atrás */}
              <div className="absolute inset-0 bg-black/60 rounded-xl transform translate-y-2 translate-x-2 blur-sm" />
              
              <img 
                src={review.url} 
                alt={`Review ${index + 1}`} 
                className="relative w-full h-full object-cover rounded-xl border border-white/10 shadow-2xl"
              />
              
              {/* Brilho de reflexo */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BackgroundReviews;