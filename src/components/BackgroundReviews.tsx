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

  if (!config.reviews || config.reviews.length === 0) return null;
  const hasAnyValidReview = config.reviews.some(r => r && r.url);
  if (!hasAnyValidReview) return null;

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
        .animate-wiggle {
          animation: subtle-wiggle 8s ease-in-out infinite;
        }
      `}</style>
      
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        {config.reviews.slice(0, 6).map((review, index) => {
          if (!review || !review.url) return null;

          const isLeft = index % 2 === 0;
          const topPosition = 10 + (index * 18); 
          const parallaxOffset = scrollY * -0.08; 
          
          const animationDelay = `${index * 1.5}s`;

          return (
            <div
              key={review.id || index}
              className="absolute hidden lg:block will-change-transform"
              style={{
                top: `${topPosition}vh`,
                // Ajustado para não cortar tanto na borda
                [isLeft ? 'left' : 'right']: '0%', 
                width: '345px',
                height: 'auto',
                transform: `
                  translate3d(${isLeft ? '-20%' : '20%'}, ${parallaxOffset}px, 0) 
                  perspective(1000px) 
                  rotateY(${isLeft ? '20deg' : '-20deg'}) 
                  rotateX(5deg)
                `,
                opacity: 0.4,
                zIndex: 0
              }}
            >
              <div 
                className="w-full h-full animate-wiggle"
                style={{ animationDelay }}
              >
                <img 
                  src={review.url} 
                  alt="" 
                  className="w-full h-auto rounded-lg grayscale" 
                  style={{
                    // Máscara mais suave para evitar o corte seco na lateral
                    maskImage: `linear-gradient(${isLeft ? 'to right' : 'to left'}, black 60%, transparent 100%), linear-gradient(to bottom, black 80%, transparent 100%)`,
                    WebkitMaskImage: `linear-gradient(${isLeft ? 'to right' : 'to left'}, black 60%, transparent 100%), linear-gradient(to bottom, black 80%, transparent 100%)`,
                    maskComposite: 'intersect',
                    WebkitMaskComposite: 'source-in'
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