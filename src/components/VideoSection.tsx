"use client";

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useConfig, VideoData } from '@/context/ConfigContext';
import { AlertTriangle, X } from 'lucide-react';
import AutoScroll from "embla-carousel-auto-scroll";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";

const getYouTubeId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// --- Componentes de Vídeo ---

const VideoLoop = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.play().catch(console.error);
  }, [src]);

  return (
    <video 
      ref={videoRef}
      src={src} 
      className="w-full h-full object-cover pointer-events-none select-none"
      muted loop playsInline autoPlay
      controls={false}
    />
  );
};

const FullVideo = ({ video }: { video: VideoData }) => {
  const videoId = getYouTubeId(video.url);

  if (video.customVideoUrl) {
    return (
      <video 
        src={video.customVideoUrl} 
        className="w-full h-full object-contain bg-black"
        playsInline 
        autoPlay
        controls={false}
        onClick={(e) => {
          const el = e.target as HTMLVideoElement;
          el.paused ? el.play() : el.pause();
        }}
      />
    );
  }

  if (videoId) {
    return (
      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&modestbranding=1&rel=0&showinfo=0`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return null;
};

// --- Componente do Card ---

const VideoCard = ({ video, onClick }: { video: VideoData, onClick: () => void }) => {
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
    <div 
      onClick={onClick}
      className="group relative flex flex-col gap-4 p-1 cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-10"
    >
      <div className="aspect-video relative bg-zinc-900 rounded-[40px] overflow-hidden border-4 border-white/5 transition-all duration-300 shadow-2xl group-hover:border-white/40 group-hover:shadow-[0_0_50px_rgba(255,255,255,0.1)]">
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
        
        {/* Overlay de "Click to Watch" */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[1px]">
          <span className="text-[10px] bg-white text-black px-3 py-1 rounded-full font-bold uppercase tracking-widest">
            Watch
          </span>
        </div>
      </div>
      
      <div className="flex flex-col gap-1 items-center">
        <h3 className="text-[10px] text-white/80 uppercase tracking-[0.2em] font-bold group-hover:text-white transition-colors">
          {video.title}
        </h3>
        <span className="text-[8px] text-white/30 font-bold uppercase">
          {video.editTime} // {video.deliveryTime}
        </span>
      </div>
    </div>
  );
};

// --- Seção Principal ---

const VideoSection = () => {
  const { config } = useConfig();
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);

  const plugin = useRef(
    AutoScroll({ 
      speed: 1, 
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      startDelay: 0,
    })
  );

  const baseVideos = useMemo(() => 
    config.featuredVideos.filter(v => (v.url && v.url.trim() !== "") || (v.customVideoUrl && v.customVideoUrl.trim() !== "")),
    [config.featuredVideos]
  );

  const displayVideos = useMemo(() => {
    if (baseVideos.length === 0) return [];
    if (baseVideos.length <= 2) return [...baseVideos, ...baseVideos, ...baseVideos, ...baseVideos];
    if (baseVideos.length <= 4) return [...baseVideos, ...baseVideos];
    return baseVideos;
  }, [baseVideos]);

  if (displayVideos.length === 0) return null;

  // Estilo pixelado minimalista com borda suave (border-zinc-700 e apenas border)
  const pixelArrowClass = "relative pointer-events-auto h-10 w-10 rounded-none border border-zinc-700 bg-black text-white hover:bg-white hover:text-black transition-none flex items-center justify-center cursor-pointer z-40";

  return (
    <>
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
            containScroll: false,
          }}
          className="w-full relative"
        >
          <CarouselContent className="-ml-4 items-center py-10">
            {displayVideos.map((video, idx) => (
              <CarouselItem key={`${video.id}-${idx}`} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3 transition-all">
                <VideoCard video={video} onClick={() => setSelectedVideo(video)} />
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {/* Setas Centralizadas abaixo do carrossel */}
          <div className="flex justify-center gap-6 mt-2 pointer-events-none">
            <CarouselPrevious className={pixelArrowClass} />
            <CarouselNext className={pixelArrowClass} />
          </div>
        </Carousel>
      </section>

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