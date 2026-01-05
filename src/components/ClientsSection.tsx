"use client";

import React from 'react';
import { useConfig } from '@/context/ConfigContext';

const ClientsSection = () => {
  const { config } = useConfig();

  if (!config.clients || config.clients.length === 0) return null;

  return (
    <div className="w-full max-w-5xl flex flex-col items-center">
      <div className="flex flex-wrap justify-center gap-8 md:gap-12">
        {config.clients.map((client) => (
          <div 
            key={client.id}
            className="flex flex-col items-center gap-4 group"
          >
            <div 
              style={{ borderColor: `${config.primaryColor}33` }}
              className="relative w-24 h-24 md:w-32 md:h-32 transition-transform group-hover:scale-110 border-2 rounded-full overflow-hidden"
            >
              <img 
                src={client.image} 
                alt={client.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <span 
              style={{ color: config.secondaryColor }}
              className="text-[8px] md:text-[10px] uppercase tracking-widest text-center font-bold opacity-60 group-hover:opacity-100 transition-opacity"
            >
              {client.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientsSection;