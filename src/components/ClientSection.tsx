"use client";

import React from 'react';
import { useConfig } from '@/context/ConfigContext';
import { Reveal } from './Reveal';

const ClientSection = () => {
  const { config } = useConfig();

  if (!config.clients || config.clients.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
      {config.clients.map((client, index) => (
        <Reveal key={client.id} delay={index * 0.1}>
          <div className="group relative flex flex-col items-center gap-4 p-6 rounded-[32px] bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="relative w-20 h-20 md:w-24 md:h-24">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img 
                src={client.image} 
                alt={client.name}
                className="w-full h-full rounded-full object-cover border-2 border-white/20 group-hover:border-white transition-colors duration-300"
              />
            </div>
            <span className="text-[10px] md:text-[12px] font-black uppercase tracking-widest text-center opacity-60 group-hover:opacity-100 transition-opacity">
              {client.name}
            </span>
          </div>
        </Reveal>
      ))}
    </div>
  );
};

export default ClientSection;