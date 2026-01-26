"use client";

import React from 'react';
import { useConfig } from '@/context/ConfigContext';

const BackgroundReviews = () => {
  const { config } = useConfig();
  
  if (!config.reviews || config.reviews.every(r => !r)) return null;

  // Posições estratégicas espalhadas de cima a baixo
  const positions = [
    { top: '10%', left: '-5%', rotate: '12deg', delay: '0s' },
    { top: '25%', right: '-8%', rotate: '-15deg', delay: '0.5s' },
    { top: '45%', left: '-10%', rotate: '8deg', delay: '1s' },
    { top: '60%', right: '-5%', rotate: '-10deg', delay: '1.5s' },
    { top: '75%', left: '-2%', rotate: '15deg', delay: '2s' },
    { top: '88%', right: '2%', rotate: '-8deg', delay: '2.5s' },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-40">
      <div className="relative w-full h-full min-h-[2000px]">
        {config.reviews.map((url, idx) => {
          if (!url) return null;
          const pos = positions[idx];
          
          return (
            <div
              key={idx}
              className="absolute transition-all duration-1000 ease-in-out animate-float"
              style={{
                top: pos.top,
                left: pos.left,
                right: pos.right,
                width: '335px',
                height: '88px',
                perspective: '1000px',
                animationDelay: pos.delay
              }}
            >
              <div 
                className="w-full h-full rounded-lg border border-white/10 shadow-2xl overflow-hidden"
                style={{
                  transform: `rotateZ(${pos.rotate}) rotateX(5deg) rotateY(${idx % 2 === 0 ? '10deg' : '-10deg'})`,
                  backgroundImage: `url(${url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            </div>
          );
        })}
      </div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.02); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default BackgroundReviews;