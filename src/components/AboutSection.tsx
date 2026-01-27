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
            
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
              
              {/* Avatar Section */}
              <div className="flex-shrink-0 relative group/avatar">
                 <div 
                    style={{ borderColor: config.secondaryColor }}
                    className="absolute inset-0 border-2 rounded-full opacity-20 group-hover/avatar:opacity-100 transition-opacity duration-500 scale-110" 
                 />
                 <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-white/10 shadow-2xl relative bg-black">
                    <img 
                      src={config.profileImage} 
                      alt="About Me" 
                      className="w-full h-full object-cover grayscale group-hover/avatar:grayscale-0 transition-all duration-500"
                    />
                 </div>
              </div>

              {/* Text Section */}
              <div className="flex flex-col gap-6 flex-1 text-center md:text-left">
                <h2 
                  style={{ color: config.primaryColor }}
                  className="text-lg md:text-xl font-bold uppercase tracking-[0.3em] flex items-center justify-center md:justify-start gap-4"
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
                
                <div className="h-px w-20 bg-gradient-to-r from-white/20 to-transparent mt-2 mx-auto md:mx-0" />
              </div>

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