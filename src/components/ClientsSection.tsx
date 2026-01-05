"use client";

import React from 'react';
import { useConfig } from '@/context/ConfigContext';

const ClientsSection = () => {
  const { config } = useConfig();

  if (!config.clients || config.clients.length === 0) return null;

  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-6">
      <h2 style={{ color: config.secondaryColor }} className="text-[10px] font-['Press_Start_2P'] uppercase tracking-widest opacity-50">
        Trusted_Clients
      </h2>
      
      <div className="flex flex-wrap justify-center gap-6">
        {config.clients.map((client) => (
          <div 
            key={client.id}
            style={{ 
              backgroundColor: `${config.cardColor}cc`,
              borderColor: config.primaryColor 
            }}
            className="w-20 h-20 border-2 rounded-2xl flex items-center justify-center p-3 grayscale hover:grayscale-0 transition-all hover:scale-110"
            title={client.name}
          >
            <img 
              src={client.image} 
              alt={client.name} 
              className="w-full h-full object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientsSection;