"use client";

import React from 'react';
import { useConfig } from '@/context/ConfigContext';

const ClientsSection = () => {
  const { config } = useConfig();

  if (!config.clients || config.clients.length === 0) return null;

  return (
    <div className="w-full max-w-5xl flex flex-col items-center">
      <div className="flex flex-wrap justify-center gap-10 md:gap-16">
        {config.clients.map((client) => (
          <div 
            key={client.id}
            className="flex flex-col items-center group"
          >
            {/* Logo/Avatar do Cliente */}
            <div 
              style={{ borderColor: `${config.primaryColor}33` }}
              className="relative w-24 h-24 md:w-32 md:h-32 transition-all duration-300 group-hover:scale-110 border-2 rounded-full overflow-hidden mb-6 shadow-xl"
            >
              <img 
                src={client.image} 
                alt={client.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Badge de Nome Estilizado (Referência da imagem) */}
            <div 
              style={{ 
                backgroundColor: config.cardColor,
                borderColor: config.primaryColor,
                boxShadow: `0 4px 0 0 ${config.primaryColor}33`
              }}
              className="px-5 py-2 border-2 rounded-xl transition-transform group-hover:-translate-y-1"
            >
              <span 
                style={{ color: config.primaryColor }}
                className="text-[8px] md:text-[10px] uppercase font-bold tracking-wider whitespace-nowrap"
              >
                {client.name}
              </span>
            </div>
            
            {/* Subtexto sutil (opcional, simulando o 'subs' da imagem) */}
            <span 
              style={{ color: config.secondaryColor }}
              className="mt-3 text-[7px] uppercase opacity-40 font-bold tracking-tighter"
            >
              TRUSTED PARTNER
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientsSection;