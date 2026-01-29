"use client";

import React, { useEffect, useState } from 'react';
import { useConfig } from '@/context/ConfigContext';

const BackgroundReviews = () => {
  const { config } = useConfig();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
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
    
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!config.showReviews) return null;
  if (!config.reviews || config.reviews.length === 0) return null;
  const hasAnyValidReview = config.reviews.some(r => r && r.url);
  if (!hasAnyValidReview) return null;

  // Configurações "aleatórias" fixas para cada slot para garantir visual agradável
  // side: -1 (esquerda), 1 (direita)
  const positions = [
    { top: 5,  side: -1, xOffset: 2,  rotate: 15,  scale: 0.9 },  // Topo Esq
    { top: 20, side: 1,  xOffset: 5,  rotate: -8,  scale: 1.1 },  // Topo Dir
    { top: 38, side: -1, xOffset: -5, rotate: -5,  scale: 1.0 },  // Meio Esq
    { top: 52, side: 1,  xOffset: -2, rotate: 12,  scale: 0.85 }, // Meio Dir
    { top: 70, side: -1, xOffset: 8,  rotate: 20,  scale: 0.95 }, // Baixo Esq
    { top: 85, side: 1,  xOffset: 0,  rotate: -15, scale: 1.05 }, // Baixo Dir
  ];

  return (
    <>
      <style jsx>{`
        @keyframes subtle-wiggle {
          0% { transform: rotate(0deg) translateY(0); }
          25% { transform: rotate(1.5deg) translateY(-5px); }
          50% { transform: rotate(0deg) translateY(0); }
          75% { transform: rotate(-1.5deg) translateY(5px); }
          100% { transform: rotate(0deg) translateY(0); }
        }
        @keyframes spin-cw {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-ccw {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .animate-wiggle {
          animation: subtle-wiggle 8s ease-in-out infinite;
        }
        .animate-spin-cw {
          animation: spin-cw linear infinite;
        }
        .animate-spin-ccw {
          animation: spin-ccw linear infinite;
        }
      `}</style>
      
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        {config.reviews.slice(0, 6).map((review, index) => {
          if (!review || !review.url) return null;

          const pos = positions[index] || positions[0];
          const isLeft = pos.side === -1;
          const parallaxOffset = scrollY * -0.05 * (1 + (index * 0.1)); // Velocidades diferentes
          
          const animationDelay = `${index * 1.2}s`;
          
          // Directions & Speeds
          const spinDirection = index % 2 === 0 ? 'animate-spin-cw' : 'animate-spin-ccw';
          const spinDuration = 3 + (index % 3);

          return (
            <div
              key={review.id || index}
              className={`absolute block will-change-transform w-[220px] sm:w-[280px] lg:w-[320px]`}
              style={{
                top: `${pos.top}vh`,
                [isLeft ? 'left' : 'right']: `${pos.xOffset}%`, // Posição base mais variável
                // Adicionamos margens negativas baseadas no tamanho da tela para controlar a "invasão" na tela
                marginLeft: isLeft ? (pos.xOffset > 0 ? '2%' : '-10%') : 'auto',
                marginRight: !isLeft ? (pos.xOffset > 0 ? '2%' : '-10%') : 'auto',
                
                transform: `
                  translate3d(0, ${parallaxOffset}px, 0) 
                  rotate(${pos.rotate}deg) 
                  scale(${pos.scale})
                `,
                opacity: 0.60,
                zIndex: 0
              }}
            >
              <div 
                className="w-full h-full animate-wiggle p-[1px] rounded-lg overflow-hidden relative bg-transparent"
                style={{ 
                  animationDelay,
                }}
              >
                {/* Rotating Border Glow */}
                <div 
                  className={`absolute inset-[-200%] ${spinDirection} will-change-transform`}
                  style={{
                    animationDuration: `${spinDuration}s`,
                    background: 'conic-gradient(from 0deg, transparent 0deg, transparent 180deg, white 360deg)',
                    filter: 'blur(3px)', 
                  }}
                />
                
                <img 
                  src={review.url} 
                  alt="" 
                  className="relative w-full h-auto rounded-lg grayscale z-10 bg-black/90" 
                  style={{
                    boxShadow: 'inset 0 0 20px rgba(0,0,0,1)'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default BackgroundReviews;