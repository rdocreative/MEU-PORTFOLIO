"use client";

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useConfig, VideoData } from '@/context/ConfigContext';
import { AlertTriangle } from 'lucide-react';
import AutoScroll from "embla-carousel-auto-scroll";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const getYouTubeId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Componente de vídeo puramente visual (Loop, Mudo, Sem controles)
const VideoLoop = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Força atributos críticos via JS
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    
    const startPlay = async () => {
      try {
        await video.play();
      } catch (err) {
        console.warn("Autoplay inicial falhou, tentando novamente mudo:", err);
        video.muted = true;
        try {
          await video.play();
        } catch (e) {
          console.error("Autoplay falhou definitivamente:", e);
        }
      }
    };

    startPlay();
  }, [src]);

  return (
    <video 
      ref={videoRef}
      key={src}
      src={src} 
      className="w-full h-full object-cover pointer-events-none select-none"
      muted
      loop 
      playsInline 
      autoPlay
      preload="auto"
      crossOrigin="anonymous" 
      controls={false}
    />
  );
};

const VideoCard = ({ video }: { video: VideoData }) => {
  const videoId = getYouTubeId(video.url);
  const [imgError, setImgError] = useState(false);
  const [imgSrc, setImgSrc] = useState(
    videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : ''
  );

  const handleImgError = () => {
    if (imgSrc.includes('maxresdefault')) {
      setImgSrc(`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`);
    } else {
      setImgError(true);
    }
  };

  return (
    <div className="group relative flex flex-col gap-4 p-1">
      <div className="aspect-video relative bg-zinc-900 rounded-[40px] overflow-hidden border-4 border-white/5 transition-all duration-500 shadow-2xl group-hover:border-white/20 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]">
        <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center pointer-events-none">
            {video.customVideoUrl ? (
              <VideoLoop src={video.customVideoUrl} />
            ) : !imgError && videoId ? (
              <div className="relative w-full h-full">
                 <img 
                  src={imgSrc}
                  alt={video.title}
                  className="w-full h-full object-cover"
                  onError={handleImgError}
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center opacity-20 gap-2">
                <AlertTriangle className="w-8 h-8" />
                <span className="text-[8px] uppercase tracking-widest">No Signal</span>
              </div>
            )}
        </div>
      </div>
      
      <div className="flex flex-col gap-1 items-center">
        <h3 className="text-[10px] text-white/80 uppercase tracking-[0.2em] font-bold">
          {video.title}
        </h3>
        <span className="text-[8px] text-white/30 font-bold uppercase">
          {video.editTime} // {video.deliveryTime}
        </span>
      </div>
    </div>
  );
};

const VideoSection = () => {
  const { config } = useConfig();

  const plugin = useRef(
    AutoScroll({ 
      speed: 1, 
      stopOnInteraction: false,
      stopOnMouseEnter: false, 
      startDelay: 0,
    })
  );

  // Filtra vídeos válidos
  const baseVideos = useMemo(() => 
    config.featuredVideos.filter(v => (v.url && v.url.trim() !== "") || (v.customVideoUrl && v.customVideoUrl.trim() !== "")),
    [config.featuredVideos]
  );

  // Técnica de duplicação para garantir loop infinito suave mesmo com poucos itens
  const displayVideos = useMemo(() => {
    if (baseVideos.length === 0) return [];
    if (baseVideos.length < 6) return [...baseVideos, ...baseVideos, ...baseVideos];
    return baseVideos;
  }, [baseVideos]);

  if (displayVideos.length === 0) return null;

  return (
    <section className="w-full max-w-7xl px-4 mx-auto group/carousel relative">
      <div 
        className="absolute left-0 top-0 bottom-0 w-24 md:w-40 z-20 pointer-events-none"
        style={{ background: `linear-gradient(to right, ${config.backgroundColor} 10%, transparent)` }}
      />
      
      <div 
        className="absolute right-0 top-0 bottom-0 w-24 md:w-40 z-20 pointer-events-none"
        style={{ background: `linear-gradient(to left, ${config.backgroundColor} 10%, transparent)` }}
      />

      <Carousel
        plugins={[plugin.current]}
        opts={{
          align: "center",
          loop: true,
          dragFree: true,
        }}
        className="w-full relative"
      >
        <CarouselContent className="-ml-4">
          {displayVideos.map((video, idx) => (
            <CarouselItem key={`${video.id}-${idx}`} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
              <VideoCard video={video} />
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <div className="flex justify-center gap-4 mt-8 lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:w-full lg:left-0 lg:px-4 lg:justify-between pointer-events-none z-30">
          <CarouselPrevious className="relative lg:absolute lg:left-0 pointer-events-auto h-12 w-12 border-2 border-white/20 bg-black/50 text-white hover:bg-white hover:text-black transition-all rounded-full flex items-center justify-center backdrop-blur-md cursor-pointer" />
          <CarouselNext className="relative lg:absolute lg:right-0 pointer-events-auto h-12 w-12 border-2 border-white/20 bg-black/50 text-white hover:bg-white hover:text-black transition-all rounded-full flex items-center justify-center backdrop-blur-md cursor-pointer" />
        </div>
      </Carousel>
    </section>
  );
};

export default VideoSection;