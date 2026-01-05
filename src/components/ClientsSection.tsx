"use client";

import React from 'react';
import { useConfig } from '@/context/ConfigContext';

const ClientsSection = () => {
  const { config } = useConfig();

  if (!config.clients || config.clients.length === 0) return null;

  return (
    <div className="w-full max-w-6xl flex flex-col items-center">
      <div className="flex flex-wrap justify-center gap-x-16 gap-y-16">
        {config.clients.map((client) => (
          <div 
            key={client.id}
            className="flex flex-col items-center group relative cursor-default"
          >
            {/* Logo/Avatar do Cliente */}
            <div 
              className="relative w-28 h-28 md:w-32 md:h-32 mb-4 transition-transform duration-300 group-hover:scale-110 rounded-full overflow-hidden shadow-2xl"
            >
              <div 
                style={{ borderColor: config.primaryColor }}
                className="absolute inset-0 border-2 rounded-full opacity-50 z-10" 
              />
              <img 
                src={client.image} 
                alt={client.name} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Texto: Nome e Subtítulo */}
            <div className="flex flex-col items-center gap-1 transition-transform group-hover:-translate-y-1">
              <span 
                className="text-xs md:text-sm text-white font-bold tracking-wider drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
              >
                {client.name}
              </span>
              
              {client.subtitle && (
                <span 
                  className="text-[10px] md:text-[10px] text-zinc-400 font-normal tracking-wide"
                >
                  {client.subtitle}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientsSection;