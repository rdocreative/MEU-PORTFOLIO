"use client";

import React, { useRef } from 'react';
import { useConfig } from '@/context/ConfigContext';
import { Play } from 'lucide-react';
import AutoScroll from "embla-carousel-auto-scroll";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const ShortsSection = () => {
  const { config } = useConfig();
  const shorts = config.shortsVideos.filter(v => v.url);

  const plugin = useRef(
    AutoScroll({ 
      speed: 1,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  if (shorts.length === 0) return null;

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    // Container externo com overflow-hidden para não criar barra de rolagem na página,
    // mas com padding vertical para permitir o zoom dos cards.
    <div className="w-full py-12 overflow-hidden">
      <Carousel
        plugins={[plugin.current]}
        opts={{
          align: "center",
          loop: true,
          dragFree: true,
        }}
        // w-fit + mx-auto centraliza o bloco de cards se houver poucos itens.
        // [&>div]:overflow-visible permite que o card "saia" do container ao dar zoom.
        className="w-fit max-w-[1400px] mx-auto [&>div]:overflow-visible"
      >
        <CarouselContent className="-ml-6 items-center">
          {shorts.map((short, idx) => {
            const videoId = getYouTubeId(short.url);
            return (
              <CarouselItem key={`${short.id}-${idx}`} className="pl-6 basis-auto">
                <div 
                  style={{ 
                    borderColor: `${config.primaryColor}22`,
                    // Correção técnica (hack) para forçar o navegador a respeitar o border-radius durante animações
                    WebkitMaskImage: "-webkit-radial-gradient(white, black)"
                  }}
                  className="w-48 md:w-56 aspect-[9/16] bg-zinc-900 rounded-[32px] overflow-hidden border-2 relative group cursor-pointer shadow-2xl transition-transform duration-300 hover:scale-110 hover:z-10 transform-gpu"
                  onClick={() => window.open(short.url, '_blank')}
                >
                  {videoId ? (
                    <img 
                      src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} 
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                      alt=""
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[8px] opacity-20">NO_SIGNAL</div>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="p-4 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 scale-75 group-hover:scale-100 transition-transform duration-300">
                      <Play className="w-6 h-6 text-white fill-white" />
                    </div>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default ShortsSection;