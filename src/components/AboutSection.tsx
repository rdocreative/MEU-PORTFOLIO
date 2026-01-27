"use client";

import React from 'react';
import { useConfig } from '@/context/ConfigContext';
import { Reveal } from './Reveal';

const AboutSection = () => {
  const { config } = useConfig();

  if (!config.showAbout || !config.aboutText) return null;

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12">
      <Reveal width="100%">
        <div className="relative group">
          {/* Efeito de fundo */}
          <div 
            style={{ backgroundColor: config.primaryColor }}
            className="absolute -inset-1 rounded-2xl opacity-10 blur-xl group-hover:opacity-20 transition-opacity duration-500"
          />
          
          <div 
            style={{ 
              borderColor: `${config.primaryColor}33`,
              backgroundColor: `${config.cardColor}80` 
            }}
            className="relative border backdrop-blur-md rounded-2xl p-8 md:p-12 overflow-hidden"
          >
            {/* Linhas decorativas estilo terminal */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            <div className="flex flex-col gap-6 relative z-10">
              <h2 
                style={{ color: config.primaryColor }}
                className="text-lg md:text-xl font-bold uppercase tracking-[0.3em] flex items-center gap-4"
              >
                <span className="w-2 h-2 bg-current rounded-full animate-pulse" />
                About Me
              </h2>
              
              <div className="space-y-4">
                {config.aboutText.split('\n').map((paragraph, idx) => (
                  <p 
                    key={idx}
                    className="text-sm md:text-base leading-relaxed text-zinc-300 font-medium font-sans tracking-wide"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
              
              <div className="h-px w-20 bg-gradient-to-r from-white/20 to-transparent mt-2" />
            </div>
            
            {/* Elemento decorativo no canto */}
            <div className="absolute bottom-4 right-4 text-[9px] text-zinc-700 font-mono">
              SYS.INFO_V1.0
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
};

export default AboutSection;