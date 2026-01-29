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

  // Posições distribuídas verticalmente para não sobrepor
  // Side define o lado (left/right)
  const positions = [
    { top: 8,  side: 'left',  rotate: 6 },
    { top: 22, side: 'right', rotate: -5 },
    { top: 40, side: 'left',  rotate: -3 },
    { top: 58, side: 'right', rotate: 4 },
    { top: 75, side: 'left',  rotate: 5 },
    { top: 90, side: 'right', rotate: -4 },
  ];

  return (
    <>
      <style jsx>{`
        @keyframes subtle-wiggle {
          0% { transform: rotate(0deg) translateY(0); }
          25% { transform: rotate(1deg) translateY(-3px); }
          50% { transform: rotate(0deg) translateY(0); }
          75% { transform: rotate(-1deg) translateY(3px); }
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
          const isLeft = pos.side === 'left';
          const parallaxOffset = scrollY * -0.08 * (1 + (index * 0.05));
          
          const animationDelay = `${index * 1.5}s`;
          const spinDirection = index % 2 === 0 ? 'animate-spin-cw' : 'animate-spin-ccw';
          const spinDuration = 4 + (index % 3);

          return (
            <div
              key={review.id || index}
              className="absolute block will-change-transform"
              style={{
                // Posição vertical baseada na viewport height
                top: `${pos.top}vh`,
                
                // Posição horizontal segura (nunca cola na borda)
                [isLeft ? 'left' : 'right']: '2%',
                
                // Largura responsiva:
                // Mobile: min 140px
                // Tablet/Desktop: cresce até 300px baseado na largura da tela
                width: 'clamp(140px, 25vw, 300px)',
                
                // Transformações
                transform: `
                  translate3d(0, ${parallaxOffset}px, 0) 
                  rotate(${pos.rotate}deg)
                `,
                opacity: 0.60,
                zIndex: 0
              }}
            >
              <div 
                className="w-full h-auto animate-wiggle p-[1px] rounded-lg overflow-hidden relative bg-transparent"
                style={{ 
                  animationDelay,
                  // Garante que a imagem mantenha proporção e não corte
                  aspectRatio: 'auto' 
                }}
              >
                {/* Borda brilhante animada */}
                <div 
                  className={`absolute inset-[-150%] ${spinDirection} will-change-transform opacity-50`}
                  style={{
                    animationDuration: `${spinDuration}s`,
                    background: 'conic-gradient(from 0deg, transparent 0deg, transparent 90deg, white 360deg)',
                    filter: 'blur(4px)', 
                  }}
                />
                
                <img 
                  src={review.url} 
                  alt="" 
                  className="relative w-full h-auto rounded-lg grayscale z-10 bg-black/90 block" 
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