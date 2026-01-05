"use client";

import React from 'react';
import { useConfig } from '@/context/ConfigContext';

const ClientsSection = () => {
  const { config } = useConfig();

  if (!config.clients || config.clients.length === 0) return null;

  return (
    <div className="w-full max-w-6xl flex flex-col items-center">
      <div className="flex flex-wrap justify-center gap-x-12 gap-y-16">
        {config.clients.map((client) => (
          <div 
            key={client.id}
            className="flex flex-col items-center group relative"
          >
            {/* Linha de conexão (opcional, estilo tech) */}
            <div 
                style={{ backgroundColor: config.primaryColor }}
                className="absolute top-20 h-8 w-[2px] opacity-30 group-hover:h-10 transition-all duration-300 z-0"
            />

            {/* Logo/Avatar do Cliente */}
            <div 
              style={{ 
                borderColor: config.primaryColor,
                boxShadow: `0 0 20px ${config.primaryColor}20`
              }}
              className="relative z-10 w-24 h-24 md:w-28 md:h-28 bg-black transition-transform duration-300 group-hover:scale-105 border-2 rounded-full overflow-hidden mb-6"
            >
              <img 
                src={client.image} 
                alt={client.name} 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              />
            </div>

            {/* Badge de Nome - Estilo mais forte e legível */}
            <div 
              style={{ 
                backgroundColor: '#09090b', // Zinc-950
                borderColor: config.primaryColor,
                boxShadow: `4px 4px 0 0 ${config.primaryColor}`
              }}
              className="z-10 px-6 py-3 border-2 transition-all duration-200 group-hover:-translate-y-1 group-hover:translate-x-[-2px] group-hover:shadow-[6px_6px_0_0_rgba(255,255,255,0.2)]"
            >
              <span 
                style={{ color: '#ffffff' }}
                className="text-[10px] md:text-xs uppercase font-bold tracking-widest whitespace-nowrap drop-shadow-md"
              >
                {client.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientsSection;