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

  // Duplicamos a lista para garantir um loop infinito fluído
  const displayClients = [...config.clients, ...config.clients, ...config.clients];

  return (
    <div className="w-full py-4 overflow-hidden">
      <div className="max-w-4xl mx-auto px-12">
        <Carousel
          plugins={[plugin.current]}
          opts={{
            align: "start",
            loop: true,
            dragFree: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4 items-center">
            {displayClients.map((client, idx) => (
              <CarouselItem key={`${client.id}-${idx}`} className="pl-4 basis-1/3 md:basis-1/5">
                <div className="flex flex-col items-center group relative cursor-default py-2">
                  {/* Logo/Avatar do Cliente - Reduzido de w-24 para w-16 */}
                  <div 
                    className="relative w-16 h-16 md:w-20 md:h-20 mb-3 rounded-full overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-110"
                  >
                    <div 
                      style={{ borderColor: config.primaryColor }}
                      className="absolute inset-0 border-2 rounded-full opacity-20 z-10" 
                    />
                    <img 
                      src={client.image} 
                      alt={client.name} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>

                  {/* Texto - Reduzido para ficar proporcional */}
                  <div className="flex flex-col items-center gap-0.5">
                    <span 
                      className="text-[8px] md:text-[9px] text-white font-bold tracking-wider uppercase opacity-60 group-hover:opacity-100 transition-opacity"
                    >
                      {client.name}
                    </span>
                    
                    {client.subtitle && (
                      <span 
                        className="text-[6px] md:text-[7px] text-zinc-500 font-normal tracking-wide uppercase"
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