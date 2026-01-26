"use client";

import React from 'react';
import { useConfig } from '@/context/ConfigContext';

const BackgroundReviews = () => {
  const { config } = useConfig();
  
  if (!config.reviews || config.reviews.length === 0) return null;

  // Filtramos apenas os que possuem URL
  const activeReviews = config.reviews.filter(r => r.url && r.url !== '');
  
  if (activeReviews.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
      <div className="relative w-full h-full">
        {activeReviews.map((review, index) => {
          // Posicionamento fixo baseado no índice para criar um layout espalhado
          const positions = [
            { top: '10%', left: '5%', rotate: '-12deg' },
            { top: '15%', right: '8%', rotate: '8deg' },
            { top: '40%', left: '2%', rotate: '-5deg' },
            { bottom: '25%', right: '5%', rotate: '12deg' },
            { bottom: '10%', left: '10%', rotate: '5deg' },
            { top: '65%', right: '12%', rotate: '-8deg' },
          ];

          const pos = positions[index % positions.length];

          return (
            <div
              key={review.id}
              className="absolute transition-all duration-1000 animate-float-slow"
              style={{
                top: pos.top,
                left: pos.left,
                right: pos.right,
                transform: `rotate(${pos.rotate})`,
              }}
            >
              <img
                src={review.url}
                alt="Review"
                className="w-48 md:w-64 h-auto rounded-lg object-contain shadow-2xl"
                style={{
                  // Aumentando o brilho em 15% e adicionando um glow sutil
                  filter: `brightness(1.15) drop-shadow(0 0 10px ${config.primaryColor}33)`,
                  border: `1px solid ${config.primaryColor}22`
                }}
              />
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(var(--base-rotate)); }
          50% { transform: translateY(-20px) rotate(var(--base-rotate)); }
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default BackgroundReviews;