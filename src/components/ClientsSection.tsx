"use client";

import React, { useRef } from 'react';
import { useConfig } from '@/context/ConfigContext';
import AutoScroll from "embla-carousel-auto-scroll";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const ClientsSection = () => {
  const { config } = useConfig();

  const plugin = useRef(
    AutoScroll({ 
      speed: 0.8,
      stopOnInteraction: false,
      stopOnMouseEnter: false, 
    })
  );

  if (!config.clients || config.clients.length === 0) return null;

  // Garantimos itens suficientes para um loop fluido
  const displayClients = config.clients.length < 10 
    ? [...config.clients, ...config.clients, ...config.clients] 
    : config.clients;

  // Cor de fundo para o degradê (fallback para preto se não houver config)
  const bgColor = config.backgroundColor || "#09090b";

  return (
    <div className="w-full py-8 relative">
      {/* Máscaras de Degradê Laterais */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{ background: `linear-gradient(to right, ${bgColor}, transparent)` }}
      />
      <div 
        className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{ background: `linear-gradient(to left, ${bgColor}, transparent)` }}
      />

      <div className="w-full overflow-hidden">
        <Carousel
          plugins={[plugin.current]}
          opts={{
            align: "start",
            loop: true,
            dragFree: true,
          }}
          className="w-full max-w-[1400px] mx-auto"
        >
          <CarouselContent className="-ml-2 items-center">
            {displayClients.map((client, idx) => (
              <CarouselItem 
                key={`${client.id}-${idx}`} 
                className="pl-2 basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/5"
              >
                <div className="flex flex-col items-center group relative cursor-default">
                  {/* Logo/Avatar do Cliente */}
                  <div 
                    className="relative w-16 h-16 md:w-20 md:h-20 mb-3 rounded-full overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105"
                  >
                    <div 
                      style={{ borderColor: config.primaryColor }}
                      className="absolute inset-0 border-[1px] rounded-full opacity-20 z-10" 
                    />
                    <img 
                      src={client.image} 
                      alt={client.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Texto: Nome e Subtítulo */}
                  <div className="flex flex-col items-center gap-0.5 text-center px-1">
                    <span 
                      className="text-[9px] md:text-[10px] text-white font-semibold tracking-wider uppercase opacity-70"
                    >
                      {client.name}
                    </span>
                    
                    {client.subtitle && (
                      <span 
                        className="text-[7px] md:text-[8px] text-zinc-500 font-normal tracking-wide uppercase line-clamp-1"
                      >
                        {client.subtitle}
                      </span>
                    )}
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};

export default ClientsSection;