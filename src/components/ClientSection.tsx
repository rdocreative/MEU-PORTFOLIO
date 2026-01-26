"use client";

import React from 'react';
import { useConfig } from '@/context/ConfigContext';
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const ClientSection = () => {
  const { config } = useConfig();
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false })
  );

  if (!config.clients || config.clients.length === 0) return null;

  return (
    <Carousel
      plugins={[plugin.current]}
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {config.clients.map((client, index) => (
          <CarouselItem key={client.id} className="pl-2 md:pl-4 basis-1/3 md:basis-1/4 lg:basis-1/6">
            <div className="group relative flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300 cursor-default">
              <div className="relative w-12 h-12 md:w-14 md:h-14">
                <img 
                  src={client.image} 
                  alt={client.name}
                  className="w-full h-full rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                />
              </div>
              <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-center opacity-40 group-hover:opacity-100 transition-opacity truncate w-full">
                {client.name}
              </span>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default ClientSection;