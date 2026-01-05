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

  return (
    <div className="w-full py-8 overflow-hidden">
      <Carousel
        plugins={[plugin.current]}
        opts={{
          align: "start",
          loop: true,
          dragFree: true,
        }}
        className="w-full max-w-[1400px] mx-auto"
      >
        <CarouselContent className="-ml-4 items-center">
          {displayClients.map((client, idx) => (
            <CarouselItem 
              key={`${client.id}-${idx}`} 
              className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
            >
              <div className="flex flex-col items-center group relative cursor-default">
                {/* Logo/Avatar do Cliente */}
                <div 
                  className="relative w-20 h-20 md:w-24 md:h-24 mb-4 rounded-full overflow-hidden shadow-xl transition-transform duration-300 group-hover:scale-110"
                >
                  <div 
                    style={{ borderColor: config.primaryColor }}
                    className="absolute inset-0 border-2 rounded-full opacity-30 z-10" 
                  />
                  <img 
                    src={client.image} 
                    alt={client.name} 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Texto: Nome e Subtítulo */}
                <div className="flex flex-col items-center gap-1 text-center px-2">
                  <span 
                    className="text-[10px] md:text-xs text-white font-bold tracking-wider uppercase opacity-80"
                  >
                    {client.name}
                  </span>
                  
                  {client.subtitle && (
                    <span 
                      className="text-[8px] md:text-[9px] text-zinc-500 font-normal tracking-wide uppercase line-clamp-1"
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
  );
};

export default ClientsSection;