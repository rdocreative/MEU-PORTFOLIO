"use client";

import React, { useEffect, useState } from 'react';
import { useConfig } from '@/context/ConfigContext';

const BackgroundReviews = () => {
  const { config } = useConfig();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Utiliza requestAnimationFrame para performance suave
      requestAnimationFrame(() => {
        setScrollY(window.scrollY);
      });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!config.reviews || config.reviews.length === 0) return null;

  // Pegamos apenas os primeiros 6 reviews
  const reviews = config.reviews.slice(0, 6);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
      {reviews.map((review, index) => {
        const isLeft = index % 2 === 0;
        
        // Posição vertical base distribuída ao longo da página
        const baseTop = 10 + (index * 12); 
        
        // Efeito Paralaxe:
        // O elemento se move a uma velocidade diferente do scroll (factor 0.2)
        // Isso cria a sensação de profundidade/3D
        const parallaxY = scrollY * 0.15;
        
        // Adicionamos um deslocamento inicial para variar a "altura" visual
        const initialOffset = index * 50;

        return (
          <div
            key={review.id}
            // 'hidden xl:block' garante que só apareça em telas grandes onde há espaço nas laterais
            // Isso evita que fique atrás de componentes ou cortado em telas menores
            className="absolute hidden xl:block transition-transform duration-100 ease-out will-change-transform"
            style={{
              top: `${baseTop}%`,
              // Posiciona bem nas extremidades para não colidir com o conteúdo central (max-w-7xl)
              [isLeft ? 'left' : 'right']: '2%', 
              width: '335px',
              height: '88px',
              transform: `
                translate3d(0, ${parallaxY - initialOffset}px, 0) 
                perspective(1000px) 
                rotateY(${isLeft ? '25deg' : '-25deg'}) 
                rotateX(10deg)
              `,
              zIndex: 0
            }}
          >
            {/* Container interno para o efeito visual do print */}
            <div className="relative w-full h-full group">
              <div 
                className="absolute inset-0 bg-black/40 rounded-xl transform translate-y-4 translate-x-2 blur-md" 
                aria-hidden="true" 
              />
              <img 
                src={review.url} 
                alt="Client Review" 
                className="relative w-full h-full object-cover rounded-xl shadow-2xl border border-white/10 opacity-60 group-hover:opacity-100 transition-opacity duration-500"
              />
              {/* Brilho especular para reforçar o efeito 3D */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BackgroundReviews;