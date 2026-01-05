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
            className="relative group w-24 h-24 md:w-32 md:h-32 transition-transform hover:scale-110"
            title={client.name}
          >
            <img 
              src={client.image} 
              alt={client.name} 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientsSection;