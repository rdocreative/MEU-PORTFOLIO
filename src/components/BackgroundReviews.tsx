"use client";

import React from 'react';
import { useConfig } from '@/context/ConfigContext';

const BackgroundReviews = () => {
  const { config } = useConfig();
  const reviews = config.reviews || [];

  const positions = [
    { top: '10%', left: '2%', transform: 'rotate(-15deg)' },
    { top: '20%', right: '2%', transform: 'rotate(15deg)' },
    { top: '45%', left: '3%', transform: 'rotate(-10deg)' },
    { top: '55%', right: '3%', transform: 'rotate(10deg)' },
    { top: '80%', left: '2%', transform: 'rotate(-12deg)' },
    { top: '85%', right: '2%', transform: 'rotate(12deg)' },
  ];

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
      {positions.map((pos, index) => {
        const review = reviews[index];
        if (!review || !review.url) return null;

        return (
          <div
            key={review.id || index}
            className="absolute w-[250px] md:w-[350px] transition-all duration-1000"
            style={{
              ...pos,
              opacity: 0.25, // Aumentado para ~25% (mais claro)
              filter: `drop-shadow(0 0 30px ${config.primaryColor}08)`, // Glow suave com ~3% de opacidade
            }}
          >
            <img 
              src={review.url} 
              alt="Review" 
              className="w-full h-auto rounded-lg"
            />
          </div>
        );
      })}
    </div>
  );
};

export default BackgroundReviews;