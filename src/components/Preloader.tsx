"use client";

import React, { useEffect, useState } from 'react';
import { useConfig } from '@/context/ConfigContext';
import { Terminal } from 'lucide-react';

const LOADING_LOGS = [
  "INITIALIZING_CORE...",
  "LOADING_PROFILE_DATA...",
  "DECRYPTING_ASSETS...",
  "ESTABLISHING_UPLINK...",
  "RENDERING_PIXELS...",
  "CHECKING_SYSTEM_INTEGRITY...",
  "ACCESS_GRANTED"
];

const Preloader = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentLog, setCurrentLog] = useState(LOADING_LOGS[0]);
  const { config } = useConfig();

  useEffect(() => {
    // Verifica se já carregou nesta sessão
    const hasLoaded = sessionStorage.getItem('pixel_profile_loaded');
    
    if (hasLoaded) {
      setIsVisible(false);
      return;
    }

    // Intervalo de progresso
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          sessionStorage.setItem('pixel_profile_loaded', 'true');
          setTimeout(() => setIsVisible(false), 800);
          return 100;
        }
        
        // Atualiza logs baseado no progresso
        const logIndex = Math.floor((prev / 100) * (LOADING_LOGS.length - 1));
        setCurrentLog(LOADING_LOGS[logIndex]);
        
        return prev + Math.floor(Math.random() * 5) + 1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      style={{ backgroundColor: config.backgroundColor }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center font-['Press_Start_2P'] overflow-hidden"
    >
      {/* Background Grid Effect */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ 
          backgroundImage: `linear-gradient(${config.secondaryColor} 1px, transparent 1px), linear-gradient(90deg, ${config.secondaryColor} 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8 max-w-md w-full px-6">
        
        {/* Profile Image Container with Scanner Effect */}
        <div className="relative group">
          {/* Rotating Rings */}
          <div 
            className="absolute -inset-4 border-2 border-dashed rounded-full animate-[spin_10s_linear_infinite] opacity-30"
            style={{ borderColor: config.primaryColor }}
          />
          <div 
            className="absolute -inset-2 border border-dotted rounded-full animate-[spin_5s_linear_infinite_reverse] opacity-50"
            style={{ borderColor: config.secondaryColor }}
          />
          
          {/* Profile Image */}
          <div 
            className="w-32 h-32 rounded-full overflow-hidden border-4 relative"
            style={{ borderColor: config.primaryColor }}
          >
            <img 
              src={config.profileImage} 
              alt="System User" 
              className="w-full h-full object-cover grayscale brightness-50 contrast-125"
            />
            {/* Scanline Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent w-full h-[20%] animate-[scanline_2s_linear_infinite]" />
          </div>
        </div>

        {/* Text Info */}
        <div className="text-center space-y-4">
          <h1 
            className="text-lg md:text-xl uppercase tracking-widest animate-pulse"
            style={{ color: config.primaryColor }}
          >
            {config.profileName}
          </h1>
          
          <div className="h-6 flex items-center justify-center gap-2 text-[10px]" style={{ color: config.secondaryColor }}>
            <Terminal className="w-3 h-3" />
            <span>{currentLog}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-[200px] space-y-2">
          <div className="flex justify-between text-[8px]" style={{ color: config.primaryColor }}>
            <span>SYSTEM_BOOT</span>
            <span>{Math.min(progress, 100)}%</span>
          </div>
          
          <div className="h-3 border-2 p-[2px]" style={{ borderColor: config.secondaryColor }}>
            <div 
              className="h-full transition-all duration-200 ease-out relative overflow-hidden"
              style={{ 
                width: `${progress}%`,
                backgroundColor: config.primaryColor 
              }}
            >
              {/* Striped pattern inside bar */}
              <div className="absolute inset-0 w-full h-full opacity-30 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,#000_2px,#000_4px)]" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Version */}
      <div className="absolute bottom-8 text-[8px] opacity-40" style={{ color: config.secondaryColor }}>
        v1.0.4 SYSTEM_READY
      </div>
    </div>
  );
};

export default Preloader;