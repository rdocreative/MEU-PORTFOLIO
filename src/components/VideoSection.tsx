"use client";

import React, { useRef, useEffect, useState, useMemo, useCallback, memo } from 'react';
import { useConfig, VideoData } from '@/context/ConfigContext';
import { AlertTriangle, X, ArrowLeft, ArrowRight } from 'lucide-react';
import AutoScroll from "embla-carousel-auto-scroll";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Reveal } from './Reveal';

// Cache global para rastrear vídeos que já foram "ativados" para carregar
const LOADED_VIDEOS_CACHE = new Set<string>();

const getYouTubeId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// --- Componentes de Vídeo Otimizados ---

const VideoLoop = memo(({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.1 }
    );
    
    observer.observe(video);
    return () => observer.disconnect();
  }, [src]);

  return (
    <video 
      ref={videoRef}
      src={src} 
      className="w-full h-full object-cover bg-black pointer-events-none select-none rounded-[40px]"
      muted loop playsInline
      preload="none"
      controls={false}
    />
  );
});

VideoLoop.displayName = 'VideoLoop';

const YouTubePreview = memo(({ videoId, title, cacheKey }: { videoId: string, title?: string, cacheKey: string }) => {
  const [shouldLoad, setShouldLoad] = useState(() => LOADED_VIDEOS_CACHE.has(cacheKey));
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (LOADED_VIDEOS_CACHE.has(cacheKey)) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          LOADED_VIDEOS_CACHE.add(cacheKey);
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: '200px' }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [cacheKey]);

  return (
    <div ref={containerRef} className="relative w-full h-full bg-black overflow-hidden rounded-[40px] isolate">
      <img 
        src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} 
        alt="" 
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 rounded-[40px] ${shouldLoad ? 'opacity-0' : 'opacity-100'}`}
        loading="lazy"
      />
      
      {shouldLoad && (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&showinfo=0&modestbranding=1&iv_load_policy=3&fs=0&rel=0&start=0&end=15&playsinline=1&vq=tiny`}
          className="absolute inset-0 w-full h-full pointer-events-none rounded-[40px]" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          tabIndex={-1}
          style={{ border: 0, borderRadius: '40px' }}
          title={title}
        />
      )}
    </div>
  );
});

YouTubePreview.displayName = 'YouTubePreview';

const FullVideo = ({ video }: { video: VideoData }) => {
  const videoId = getYouTubeId(video.url);

  if (video.customVideoUrl) {
    return (
      <video 
        src={video.customVideoUrl} 
        className="w-full h-full object-contain bg-black"
        playsInline 
        autoPlay
        controls={true}
      />
    );
  }

  if (videoId) {
    return (
      <div className="relative w-full h-full overflow-hidden bg-black select-none">
        <iframe
          className="w-full h-full pointer-events-auto"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&modestbranding=1&rel=0`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={video.title || "Video"}
        />
      </div>
    );
  }

  return null;
};

const VideoCard = memo(({ video, onClick, cacheKey }: { video: VideoData, onClick: () => void, cacheKey: string }) => {
  const videoId = getYouTubeId(video.url);

  return (
    <div 
      onClick={onClick}
      className="group relative flex flex-col gap-4 p-1 cursor-pointer transform-gpu backface-hidden"
    >
      <div className="aspect-video relative bg-zinc-900 rounded-[40px] overflow-hidden shadow-2xl transition-all duration-300 ease-out group-hover:scale-[1.02] group-hover:shadow-[0_0_50px_rgba(255,255,255,0.1)] isolate">
        <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center pointer-events-none rounded-[40px] overflow-hidden">
            {video.customVideoUrl ? (
              <VideoLoop src={video.customVideoUrl} />
            ) : videoId ? (
              <YouTubePreview videoId={videoId} title={video.title} cacheKey={cacheKey} />
            ) : (
              <div className="flex flex-col items-center justify-center opacity-20 gap-2">
                <AlertTriangle className="w-8 h-8" />
                <span className="text-[8px] uppercase tracking-widest">No Signal</span>
              </div>
            )}
        </div>
        <div className="absolute inset-0 z-10 bg-transparent rounded-[40px]" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[1px] z-20 rounded-[40px]">
          <span className="text-[10px] bg-white text-black px-3 py-1 rounded-full font-bold uppercase tracking-widest">
            Watch
          </span>
        </div>
        <div className="absolute inset-0 rounded-[40px] border-4 border-white/5 pointer-events-none transition-colors duration-300 group-hover:border-white/40 z-30" />
      </div>
      <div className="flex flex-col gap-1 items-center">
        <h3 className="text-[10px] text-white/80 uppercase tracking-[0.2em] font-bold group-hover:text-white transition-colors">
          {video.title}
        </h3>
      </div>
    </div>
  );
});

VideoCard.displayName = 'VideoCard';

const VideoSection = () => {
  const { config } = useConfig();
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const [api, setApi] = useState<CarouselApi>();

  // Configurado para PARAR o auto-scroll ao interagir (permitindo movimento livre)
  const plugin = useRef(
    AutoScroll({ 
      speed: 1, 
      stopOnInteraction: true, // Agora para quando o usuário clica ou arrasta
      stopOnMouseEnter: false,
      startDelay: 0,
    })
  );

  const baseVideos = useMemo(() => 
    config.featuredVideos.filter(v => (v.url && v.url.trim() !== "") || (v.customVideoUrl && v.customVideoUrl.trim() !== "")),
    [config.featuredVideos]
  );

  const displayVideos = useMemo(() => {
    if (baseVideos.length === 0) return [];
    let result = [...baseVideos];
    while (result.length < 12) {
      result = [...result, ...baseVideos];
    }
    return result;
  }, [baseVideos]);

  const handlePrev = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (api) {
      api.scrollPrev();
      // O AutoScroll irá parar devido ao stopOnInteraction: true
    }
  }, [api]);

  const handleNext = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (api) {
      api.scrollNext();
    }
  }, [api]);

  if (displayVideos.length === 0) return null;

  const pixelArrowClass = "h-14 w-14 rounded-none border-2 border-zinc-700 bg-black/80 text-white hover:bg-white hover:text-black transition-all flex items-center justify-center cursor-pointer z-[100] shadow-2xl absolute top-1/2 -translate-y-1/2 active:scale-90 pointer-events-auto backdrop-blur-sm";

  return (
    <>
      <Reveal width="100%" delay={0.2} className="w-full">
        <section className="w-full max-w-7xl px-4 mx-auto relative overflow-visible group/carousel">
          {/* Gradientes laterais */}
          <div 
            className="absolute left-0 top-0 bottom-0 w-24 md:w-40 z-20 pointer-events-none"
            style={{ background: `linear-gradient(to right, ${config.backgroundColor} 10%, transparent)` }}
          />
          <div 
            className="absolute right-0 top-0 bottom-0 w-24 md:w-40 z-20 pointer-events-none"
            style={{ background: `linear-gradient(to left, ${config.backgroundColor} 10%, transparent)` }}
          />

          {/* Botões manuais posicionados na raiz da section para evitar bloqueio */}
          <button 
            onClick={handlePrev} 
            className={`${pixelArrowClass} left-2 md:left-6`}
            aria-label="Previous slide"
          >
            <ArrowLeft className="w-8 h-8" />
          </button>
          
          <button 
            onClick={handleNext} 
            className={`${pixelArrowClass} right-2 md:right-6`}
            aria-label="Next slide"
          >
            <ArrowRight className="w-8 h-8" />
          </button>

          <Carousel
            setApi={setApi}
            plugins={[plugin.current]}
            opts={{
              align: "center",
              loop: true,
              dragFree: true, // Permite mover livremente ao arrastar
              containScroll: false,
            }}
            className="w-full relative"
          >
            <CarouselContent className="-ml-4 items-center py-10">
              {displayVideos.map((video, idx) => (
                <CarouselItem key={`${video.id}-${idx}`} className="pl-4 basis-full md:basis-[58%] lg:basis-[38%]">
                  <VideoCard 
                    video={video} 
                    onClick={() => setSelectedVideo(video)} 
                    cacheKey={`${video.id}-${idx}`}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>
      </Reveal>

      <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
        <DialogContent className="max-w-5xl w-[90vw] aspect-video p-0 bg-black border-none overflow-hidden ring-0 outline-none">
           <div className="relative w-full h-full bg-black group/modal">
              {selectedVideo && <FullVideo video={selectedVideo} />}
              <DialogClose className="absolute top-4 right-4 z-50 p-2 bg-black/50 rounded-full text-white hover:bg-white hover:text-black transition-all opacity-0 group-hover/modal:opacity-100">
                <X className="w-6 h-6" />
              </DialogClose>
           </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VideoSection;