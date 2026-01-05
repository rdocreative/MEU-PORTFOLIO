"use client";

import React, { useMemo } from 'react';

const StarsBackground = React.memo(() => {
  // Gera estrelas aleatórias uma única vez
  const stars = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => ({ // Reduzido levemente para 60 para performance mobile, visualmente imperceptível
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1 + 'px',
      duration: Math.random() * 3 + 2 + 's',
      delay: Math.random() * 5 + 's',
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute bg-white rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)] will-change-opacity"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            animationDuration: star.duration,
            animationDelay: star.delay,
            opacity: 0.4,
            // Otimização: Renderização em camada separada
            transform: 'translateZ(0)',
          }}
        />
      ))}
    </div>
  );
});

StarsBackground.displayName = 'StarsBackground';

export default StarsBackground;