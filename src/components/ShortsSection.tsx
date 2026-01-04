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
  const shorts = config.shortsVideos.filter(v => v.url || v.customVideoUrl);

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
    <div className="w-full py-12 overflow-hidden">
      <Carousel
        plugins={[plugin.current]}
        opts={{
          align: "center",
          loop: true,
          dragFree: true,
        }}
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
                    WebkitMaskImage: "-webkit-radial-gradient(white, black)"
                  }}
                  className="w-48 md:w-56 aspect-[9/16] bg-zinc-900 rounded-[40px] overflow-hidden border-4 relative group cursor-pointer shadow-2xl transition-transform duration-300 hover:scale-110 hover:z-10 transform-gpu"
                  onClick={() => window.open(short.customVideoUrl || short.url, '_blank')}
                >
                  {short.customVideoUrl ? (
                    <video 
                      src={short.customVideoUrl} 
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" 
                      muted 
                      loop 
                      autoPlay 
                      playsInline 
                    />
                  ) : videoId ? (
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