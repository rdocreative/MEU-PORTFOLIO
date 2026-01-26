"use client";

import React, { useEffect, useState } from 'react';
import { useConfig } from '@/context/ConfigContext';

const BackgroundReviews = () => {
  const { config } = useConfig();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // Usando requestAnimationFrame para garantir que a atualização acompanhe a taxa de atualização do monitor
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    // Inicializa
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!config.reviews || config.reviews.length === 0) return null;
  const hasAnyValidReview = config.reviews.some(r => r && r.url);
  if (!hasAnyValidReview) return null;

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
      {config.reviews.slice(0, 6).map((review, index) => {
        if (!review || !review.url) return null;

        const isLeft = index % 2 === 0;
        // Distribuição vertical
        const topPosition = 10 + (index * 18); 
        
        // Fator de paralaxe suave
        const parallaxOffset = scrollY * -0.08; 

        return (
          <div
            key={review.id || index}
            className="absolute hidden lg:block will-change-transform" // will-change otimiza a renderização
            style={{
              top: `${topPosition}vh`,
              // Puxa um pouco para fora da tela para ficar apenas como "moldura"
              [isLeft ? 'left' : 'right']: '-2%', 
              width: '300px',
              height: 'auto',
              // Transformação direta sem transição CSS para evitar delay
              transform: `
                translate3d(0, ${parallaxOffset}px, 0) 
                perspective(1000px) 
                rotateY(${isLeft ? '20deg' : '-20deg'}) 
                rotateX(5deg)
              `,
              opacity: 0.15, // Bem sutil (15%)
              zIndex: 0
            }}
          >
            {/* Imagem limpa, sem bordas, em escala de cinza */}
            <img 
              src={review.url} 
              alt="" 
              className="w-full h-auto rounded-lg grayscale opacity-80"
              style={{
                // Máscara suave para integrar com o fundo
                maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)'
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default BackgroundReviews;