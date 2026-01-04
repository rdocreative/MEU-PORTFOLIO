"use client";

import React, { useMemo } from 'react';

const StarsBackground = () => {
  // Gera estrelas aleatórias uma única vez
  const stars = useMemo(() => {
    return Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
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
          className="absolute bg-white rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            animationDuration: star.duration,
            animationDelay: star.delay,
            opacity: 0.4,
          }}
        />
      ))}
    </div>
  );
};

export default StarsBackground;