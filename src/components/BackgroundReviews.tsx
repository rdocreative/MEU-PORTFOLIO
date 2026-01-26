"use client";

import React from 'react';
import { useConfig } from '@/context/ConfigContext';

const BackgroundReviews = () => {
  const { config } = useConfig();
  
  if (!config.reviews || config.reviews.length === 0) return null;

  // Posições fixas espalhadas pela página para os 6 slots
  const positions = [
    // Topo Esquerda (perto do título)
    { top: '15%', left: '5%', rotation: '-15deg', scale: 0.9, blur: '1px' },
    // Topo Direita
    { top: '20%', right: '5%', rotation: '15deg', scale: 1.1, blur: '0px' },
    // Meio Esquerda (perto dos vídeos)
    { top: '45%', left: '-5%', rotation: '10deg', scale: 0.8, blur: '2px' },
    // Meio Direita
    { top: '55%', right: '-2%', rotation: '-10deg', scale: 1.0, blur: '1px' },
    // Fundo Esquerda (perto do rodapé)
    { top: '80%', left: '10%', rotation: '-5deg', scale: 0.9, blur: '1px' },
    // Fundo Direita
    { top: '85%', right: '15%', rotation: '5deg', scale: 0.8, blur: '2px' },
  ];

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      {config.reviews.slice(0, 6).map((review, index) => {
        const pos = positions[index];
        if (!pos) return null;
        
        return (
          <div
            key={review.id}
            className="absolute transition-all duration-700 ease-in-out opacity-20 hover:opacity-40"
            style={{
              top: pos.top,
              left: pos.left,
              right: pos.right,
              transform: `perspective(1000px) rotateY(${pos.rotation}) rotateX(5deg) scale(${pos.scale})`,
              filter: `blur(${pos.blur})`,
              width: '335px',
              height: '88px',
            }}
          >
            <img 
              src={review.url} 
              alt="Client Review" 
              className="w-full h-full object-cover rounded-lg shadow-2xl border border-white/10"
            />
            {/* Efeito de brilho/reflexo */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent rounded-lg" />
          </div>
        );
      })}
    </div>
  );
};

export default BackgroundReviews;