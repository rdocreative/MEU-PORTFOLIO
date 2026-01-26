"use client";

import React, { useRef, memo } from 'react';
import { useConfig } from '@/context/ConfigContext';
import AutoScroll from "embla-carousel-auto-scroll";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Reveal } from './Reveal';

const ClientsSection = memo(() => {
  const { config } = useConfig();

  const plugin = useRef(
    AutoScroll({ 
      speed: 0.8,
      stopOnInteraction: false,
      stopOnMouseEnter: false, 
    })
  );

  if (!config.clients || config.clients.length === 0) return null;

  const displayClients = config.clients.length < 10 
    ? [...config.clients, ...config.clients, ...config.clients] 
    : config.clients;

  const bgColor = config.backgroundColor || "#09090b";

  return (
    <div className="w-full py-12 relative overflow-hidden">
      <div 
        className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
        style={{ background: `linear-gradient(to right, ${bgColor}, transparent)` }}
      />
      <div 
        className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
        style={{ background: `linear-gradient(to left, ${bgColor}, transparent)` }}
      />

      <div className="w-full">
        <Carousel
          plugins={[plugin.current]}
          opts={{
            align: "start",
            loop: true,
            dragFree: true,
          }}
          className="w-full max-w-[1400px] mx-auto"
        >
          <CarouselContent className="-ml-0 items-center py-4">
            {displayClients.map((client, idx) => (
              <CarouselItem 
                key={`${client.id}-${idx}`} 
                className="pl-0 basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/5"
              >
                <Reveal 
                  delay={Math.min(idx * 0.1, 1.5)} 
                  variant="fade"
                  className="w-full"
                >
                  <div className="flex flex-col items-center group relative cursor-default px-4">
                    <div 
                      className="relative w-24 h-24 md:w-32 md:h-32 mb-4 rounded-full shadow-lg transition-transform duration-300 ease-out group-hover:scale-110"
                    >
                      <div 
                        style={{ borderColor: config.primaryColor }}
                        className="absolute inset-0 border-[1px] rounded-full opacity-20 z-10" 
                      />
                      <img 
                        src={client.image} 
                        alt={client.name} 
                        className="w-full h-full object-cover rounded-full"
                        loading="lazy"
                        width={128}
                        height={128}
                      />
                    </div>

                    <div className="flex flex-col items-center gap-1 text-center">
                      <span 
                        className="text-[9px] md:text-[10px] text-white font-bold tracking-wider uppercase opacity-80"
                      >
                        {client.name}
                      </span>
                      
                      {client.subscribers && (
                        <span 
                          className="text-[7px] md:text-[8px] text-zinc-500 font-normal tracking-widest uppercase"
                        >
                          {client.subscribers} SUBS
                        </span>
                      )}
                    </div>
                  </div>
                </Reveal>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
});

ClientsSection.displayName = 'ClientsSection';

export default ClientsSection;