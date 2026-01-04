"use client";

import React, { useEffect, useState } from 'react';
import { useConfig } from '@/context/ConfigContext';

const Preloader = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const { config } = useConfig();

  useEffect(() => {
    // Simula o carregamento e cache dos recursos
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsVisible(false), 500); // Delay para sair suavemente
          return 100;
        }
        // Incremento randômico para parecer carregamento real de rede
        return prev + Math.floor(Math.random() * 10) + 1;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      style={{ backgroundColor: config.backgroundColor }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-1000 font-['Press_Start_2P']"
      data-state={progress === 100 ? "loaded" : "loading"}
    >
      <div className="w-64 space-y-4">
        <div className="flex justify-between text-[10px]" style={{ color: config.primaryColor }}>
          <span>SYSTEM_BOOT</span>
          <span>{Math.min(progress, 100)}%</span>
        </div>
        
        {/* Barra de progresso estilo retro */}
        <div className="h-4 border-2 p-1" style={{ borderColor: config.secondaryColor }}>
          <div 
            className="h-full transition-all duration-200 ease-out"
            style={{ 
              width: `${progress}%`,
              backgroundColor: config.primaryColor 
            }}
          />
        </div>

        <div className="text-[8px] text-center opacity-50 animate-pulse mt-4" style={{ color: config.secondaryColor }}>
          CACHING_ASSETS...
        </div>
      </div>
    </div>
  );
};

export default Preloader;