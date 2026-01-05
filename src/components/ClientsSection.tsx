"use client";

import React from 'react';
import { useConfig } from '@/context/ConfigContext';

const ClientsSection = () => {
  const { config } = useConfig();

  if (!config.clients || config.clients.length === 0) return null;

  return (
    <div className="w-full max-w-5xl flex flex-col items-center gap-10">
      <h2 className="text-white text-lg md:text-xl font-['Press_Start_2P'] uppercase tracking-widest">
        Clients
      </h2>
      
      <div className="flex flex-wrap justify-center gap-8 md:gap-12">
        {config.clients.map((client) => (
          <div 
            key={client.id}
            style={{ 
              backgroundColor: `${config.cardColor}cc`
            }}
            className="w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center p-6 transition-all hover:scale-110 hover:bg-white/5 bg-black/40"
            title={client.name}
          >
            <img 
              src={client.image} 
              alt={client.name} 
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientsSection;