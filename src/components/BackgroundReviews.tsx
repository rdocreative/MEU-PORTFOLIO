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
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
      {config.reviews.slice(0, 6).map((review, index) => {
        if (!review || !review.url) return null;

        const isLeft = index % 2 === 0;
        const topPosition = 10 + (index * 18); 
        const parallaxOffset = scrollY * -0.08; 

        return (
          <div
            key={review.id || index}
            className="absolute hidden lg:block will-change-transform"
            style={{
              top: `${topPosition}vh`,
              [isLeft ? 'left' : 'right']: '-2%', 
              width: '300px',
              height: 'auto',
              transform: `
                translate3d(0, ${parallaxOffset}px, 0) 
                perspective(1000px) 
                rotateY(${isLeft ? '20deg' : '-20deg'}) 
                rotateX(5deg)
              `,
              opacity: 0.4, // Aumentado para 40% (mais visível)
              zIndex: 0
            }}
          >
            <img 
              src={review.url} 
              alt="" 
              className="w-full h-auto rounded-lg grayscale" 
              style={{
                // Ajustei a máscara para mostrar um pouco mais da imagem antes de desaparecer
                maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)'
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default BackgroundReviews;