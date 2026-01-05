"use client";

import React, { useEffect, useState } from 'react';
import { useConfig } from '@/context/ConfigContext';
import { Terminal, User } from 'lucide-react';

const LOADING_LOGS = [
  "INITIALIZING_CORE...",
  "CONNECTING_DATABASE...",
  "FETCHING_USER_PROFILE...",
  "DECRYPTING_ASSETS...",
  "RENDERING_PIXELS...",
  "SYNCHRONIZING_STREAMS...",
  "ACCESS_GRANTED"
];

const Preloader = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isSlidingUp, setIsSlidingUp] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentLog, setCurrentLog] = useState(LOADING_LOGS[0]);
  const { config, isLoading } = useConfig();

  // Verifica se a imagem atual é a padrão (placeholder)
  const isDefaultImage = config.profileImage.includes("seed=void");
  // Só mostra a imagem real se não estiver carregando E não for a padrão
  const showRealImage = !isLoading && !isDefaultImage;

  useEffect(() => {
    // Se já carregou na sessão E os dados já estão prontos, não mostra
    const hasLoaded = sessionStorage.getItem('pixel_profile_loaded');
    if (hasLoaded && !isLoading) {
      setIsVisible(false);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        // Se ainda está carregando os dados reais, trava em 90-99%
        if (isLoading && prev >= 90) {
          return 90 + (prev % 9);
        }

        // Se terminou de carregar, inicia a saída
        if (prev >= 100) {
          clearInterval(interval);
          sessionStorage.setItem('pixel_profile_loaded', 'true');
          setIsSlidingUp(true);
          setTimeout(() => setIsVisible(false), 1000);
          return 100;
        }
        
        const logIndex = Math.floor((prev / 100) * (LOADING_LOGS.length - 1));
        setCurrentLog(LOADING_LOGS[logIndex]);
        
        return prev + Math.floor(Math.random() * 8) + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isVisible) return null;

  return (
    <div 
      style={{ backgroundColor: config.backgroundColor }}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center font-['Press_Start_2P'] overflow-hidden transition-transform duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)] ${isSlidingUp ? '-translate-y-full' : 'translate-y-0'}`}
    >
      {/* Background Grid Effect */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ 
          backgroundImage: `linear-gradient(${config.secondaryColor} 1px, transparent 1px), linear-gradient(90deg, ${config.secondaryColor} 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className={`relative z-10 flex flex-col items-center gap-8 max-w-md w-full px-6 transition-all duration-700 ${isSlidingUp ? 'scale-90 opacity-50' : 'scale-100'}`}>
        
        {/* Profile Image Container */}
        <div className="relative group">
          <div 
            className="absolute -inset-6 border-2 border-dashed rounded-full animate-[spin_10s_linear_infinite] opacity-40"
            style={{ borderColor: config.primaryColor }}
          />
          <div 
            className="absolute -inset-3 border border-dotted rounded-full animate-[spin_5s_linear_infinite_reverse] opacity-60"
            style={{ borderColor: config.secondaryColor }}
          />
          
          <div 
            className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 relative shadow-[0_0_30px_rgba(0,0,0,0.5)] bg-black flex items-center justify-center"
            style={{ 
              borderColor: config.primaryColor,
              boxShadow: `0 0 40px ${config.primaryColor}40`
            }}
          >
            {showRealImage ? (
              <img 
                src={config.profileImage} 
                alt="System User" 
                className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
              />
            ) : (
              // Placeholder tecnológico enquanto carrega
              <div className="flex flex-col items-center justify-center text-center opacity-50 animate-pulse">
                 <User className="w-12 h-12 mb-2" style={{ color: config.primaryColor }} />
                 <span className="text-[8px]" style={{ color: config.secondaryColor }}>NO_DATA</span>
              </div>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent w-full h-[20%] animate-[scanline_2s_linear_infinite] pointer-events-none" />
          </div>
        </div>

        {/* Text Info */}
        <div className="text-center space-y-4">
          <h1 
            className="text-lg md:text-2xl uppercase tracking-widest animate-pulse drop-shadow-md min-h-[2rem]"
            style={{ color: config.primaryColor }}
          >
            {showRealImage ? config.profileName : "LOADING_USER..."}
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
          
          <div className="h-3 border-2 p-[2px] bg-black/20" style={{ borderColor: config.secondaryColor }}>
            <div 
              className="h-full transition-all duration-200 ease-out relative overflow-hidden"
              style={{ 
                width: `${progress}%`,
                backgroundColor: config.primaryColor 
              }}
            >
              <div className="absolute inset-0 w-full h-full opacity-30 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,#000_2px,#000_4px)]" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 text-[8px] opacity-40" style={{ color: config.secondaryColor }}>
        v1.0.5 SYSTEM_READY
      </div>
    </div>
  );
};

export default Preloader;