"use client";

import React, { useRef, useEffect, useMemo } from 'react';
import { useConfig } from '@/context/ConfigContext';
import AutoScroll from "embla-carousel-auto-scroll";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const AutoPlayVideo = ({ src, className }: { src: string, className?: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const startPlay = async () => {
      try {
        await video.play();
      } catch (err) {
        console.warn("Autoplay shorts falhou, tentando novamente:", err);
        video.muted = true;
        video.play().catch(e => console.error("Autoplay shorts erro final:", e));
      }
    };
    
    startPlay();
  }, [src]);

  return (
    <video 
      ref={videoRef}
      key={src} 
      src={src} 
      className={`${className} pointer-events-none select-none`}
      muted 
      loop 
      playsInline 
      autoPlay
      controls={false}
    />
  );
};

const ShortsSection = () => {
  const { config } = useConfig();
  
  // Filtra shorts válidos
  const baseShorts = useMemo(() => 
    config.shortsVideos.filter(v => (v.url && v.url.trim() !== "") || (v.customVideoUrl && v.customVideoUrl.trim() !== "")),
    [config.shortsVideos]
  );

  const plugin = useRef(
    AutoScroll({ 
      speed: 1,
      stopOnInteraction: false,
      stopOnMouseEnter: false, 
    })
  );

  if (baseShorts.length === 0) return null;

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const ShortItem = ({ short }: { short: any }) => {
    const videoId = getYouTubeId(short.url);
    return (
      <div 
        style={{ 
          borderColor: `${config.primaryColor}22`,
          WebkitMaskImage: "-webkit-radial-gradient(white, black)"
        }}
        className="w-48 md:w-56 aspect-[9/16] bg-zinc-900 rounded-[40px] overflow-hidden border-4 relative shadow-2xl transition-transform duration-300 mx-auto"
      >
        {short.customVideoUrl ? (
          <AutoPlayVideo 
            src={short.customVideoUrl} 
            className="w-full h-full object-cover opacity-80"
          />
        ) : videoId ? (
          <img 
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} 
            className="w-full h-full object-cover opacity-80"
            alt=""
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[8px] opacity-20">NO_SIGNAL</div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>
    );
  };

  // Se houver poucos shorts (menos de 5), não usa carrossel, mostra centralizado
  if (baseShorts.length < 5) {
    return (
      <div className="w-full py-12 flex flex-wrap justify-center gap-6 px-4">
        {baseShorts.map((short, idx) => (
          <div key={`${short.id}-${idx}`} className="hover:scale-105 transition-transform">
             <ShortItem short={short} />
          </div>
        ))}
      </div>
    );
  }

  // Se houver muitos, usa carrossel infinito
  return (
    <div className="w-full py-12 overflow-hidden pointer-events-none">
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
          {baseShorts.map((short, idx) => (
            <CarouselItem key={`${short.id}-${idx}`} className="pl-6 basis-auto">
              <ShortItem short={short} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default ShortsSection;