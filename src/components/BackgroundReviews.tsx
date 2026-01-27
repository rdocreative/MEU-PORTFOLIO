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

          const isLeft = index % 2 === 0;
          const topPosition = 10 + (index * 18); 
          const parallaxOffset = scrollY * -0.08; 
          
          const animationDelay = `${index * 1.5}s`;
          
          // Directions & Speeds
          const spinDirection = index % 2 === 0 ? 'animate-spin-cw' : 'animate-spin-ccw';
          const spinDuration = 3 + (index % 3); // 3s, 4s, 5s

          return (
            <div
              key={review.id || index}
              className={`absolute block will-change-transform w-[260px] sm:w-[340px] lg:w-[345px] ${isLeft ? 'left-[-15%] sm:left-[-8%] lg:left-[-2%] xl:left-[2%] 2xl:left-[12%]' : 'right-[-15%] sm:right-[-8%] lg:right-[-2%] xl:right-[2%] 2xl:right-[12%]'}`}
              style={{
                top: `${topPosition}vh`,
                height: 'auto',
                transform: `
                  translate3d(0, ${parallaxOffset}px, 0) 
                  perspective(1000px) 
                  rotateY(${isLeft ? '20deg' : '-20deg'}) 
                  rotateX(5deg)
                `,
                opacity: 0.70,
                zIndex: 0
              }}
            >
              <div 
                className="w-full h-full animate-wiggle p-[1px] rounded-lg overflow-hidden relative bg-transparent"
                style={{ 
                  animationDelay,
                }}
              >
                {/* Rotating Border Glow - Single Layer */}
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
                  className="relative w-full h-auto rounded-lg grayscale z-10 bg-black" 
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