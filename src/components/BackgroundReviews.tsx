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

  // Se não houver reviews, não renderiza nada
  if (!config.reviews || config.reviews.length === 0) {
    return null;
  }

  return (
    // Container fixo que cobre toda a viewport, mas deixa os cliques passarem (pointer-events-none)
    // z-0 garante que fique atrás do conteúdo principal (que geralmente tem z-10 ou mais)
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
      {config.reviews.slice(0, 6).map((review, index) => {
        // Alterna entre esquerda e direita
        const isLeft = index % 2 === 0;
        
        // Posição vertical base distribuída uniformemente na tela
        // Usamos 'vh' para garantir que se espalhem pela altura da viewport
        const topPosition = 15 + (index * 15); 

        // Efeito Paralaxe: Move o elemento levemente contra o scroll
        // Fator negativo faz com que eles subam mais devagar que a página, criando profundidade
        const parallaxOffset = scrollY * -0.1; 

        return (
          <div
            key={review.id || index}
            className="absolute hidden xl:block transition-opacity duration-700 ease-in-out"
            style={{
              top: `${topPosition}vh`, // Usando vh para posicionamento relativo à viewport
              [isLeft ? 'left' : 'right']: '2%', // Margem lateral
              width: '335px',
              height: '88px',
              transform: `
                translateY(${parallaxOffset}px) 
                perspective(1000px) 
                rotateY(${isLeft ? '25deg' : '-25deg'}) 
                rotateX(10deg)
              `,
              opacity: 0.6, // Opacidade base para não distrair muito
            }}
          >
            {/* Efeito de vidro/fundo do review */}
            <div className="relative w-full h-full group">
              <div 
                className="absolute inset-0 bg-black/80 rounded-xl transform translate-y-2 translate-x-2 blur-sm" 
              />
              <img 
                src={review.url} 
                alt={`Review ${index + 1}`} 
                className="relative w-full h-full object-cover rounded-xl border border-white/10 shadow-2xl"
              />
              {/* Brilho suave */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/5 to-transparent" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BackgroundReviews;