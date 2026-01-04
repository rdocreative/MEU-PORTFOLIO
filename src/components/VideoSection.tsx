"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useConfig, VideoData } from '@/context/ConfigContext';
import { Play, Eye, AlertTriangle } from 'lucide-react';
import AutoScroll from "embla-carousel-auto-scroll";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Componente robusto para garantir autoplay
const AutoPlayVideo = ({ 
  src, 
  className, 
  controls = false 
}: { 
  src: string, 
  className?: string, 
  controls?: boolean 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video && !controls) {
      // Garante que está mudo para autoplay funcionar
      video.muted = true;
      video.defaultMuted = true;
      
      const playVideo = async () => {
        try {
          await video.play();
        } catch (err) {
          console.warn("Autoplay falhou, tentando novamente ao interagir:", err);
        }
      };
      
      playVideo();
    }
  }, [src, controls]);

  return (
    <video 
      ref={videoRef}
      src={src} 
      className={className} 
      muted={!controls}
      loop 
      playsInline 
      controls={controls}
      // autoPlay é mantido como fallback
      autoPlay={!controls}
    />
  );
};

const getYouTubeId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const VideoCard = ({ 
  video, 
  isPlaying, 
  onPlay, 
  onStop 
}: { 
  video: VideoData, 
  isPlaying: boolean, 
  onPlay: () => void, 
  onStop: () => void 
}) => {
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
        
        {/* Fundo: Thumbnail ou Vídeo Manual */}
        <div className="absolute inset-0 z-0 bg-zinc-900 flex items-center justify-center">
            {video.customVideoUrl ? (
              <AutoPlayVideo 
                src={video.customVideoUrl} 
                className="w-full h-full object-cover" 
              />
            ) : !imgError && videoId ? (
              <img 
                src={imgSrc}
                alt={video.title}
                className="w-full h-full object-cover"
                onError={handleImgError}
              />
            ) : (
              <div className="flex flex-col items-center justify-center opacity-20 gap-2">
                <AlertTriangle className="w-8 h-8" />
                <span className="text-[8px] uppercase tracking-widest">No Signal</span>
              </div>
            )}
        </div>

        {isPlaying ? (
          <div className="absolute inset-0 z-30 bg-black animate-in fade-in duration-300">
            {video.customVideoUrl ? (
              <AutoPlayVideo 
                src={video.customVideoUrl} 
                className="w-full h-full object-cover" 
                controls={true}
              />
            ) : videoId ? (
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : null}
            <button 
              onClick={(e) => { e.stopPropagation(); onStop(); }}
              className="absolute top-4 right-4 z-40 bg-black/80 text-white text-[8px] px-4 py-2 rounded-full border border-white/20 hover:bg-white hover:text-black transition-colors font-bold"
            >
              EXIT_PLAYER
            </button>
          </div>
        ) : (
          <button 
            onClick={onPlay}
            className="w-full h-full relative block overflow-hidden"
          >
            {/* Hover Preview Animado (Apenas para YouTube, pois vídeo custom já toca no fundo) */}
            <div className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              {!video.customVideoUrl && videoId && (
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&playlist=${videoId}&loop=1&playsinline=1&enablejsapi=1`}
                  className="w-full h-full scale-[1.35]"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                ></iframe>
              )}
            </div>
            
            <div className="absolute bottom-6 left-6 z-20 flex flex-col items-start gap-1 pointer-events-none">
              <div className="flex items-center gap-2 text-white bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                <Eye className="w-3 h-3 text-cyan-400" />
                <span className="text-[9px] font-bold tracking-tighter">{video.views || "0 VIEWS"}</span>
              </div>
            </div>

            <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="p-4 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 scale-75 group-hover:scale-100 transition-transform duration-500">
                <Play className="w-8 h-8 text-white fill-white" />
              </div>
            </div>
          </button>
        )}
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
  const [playingId, setPlayingId] = useState<string | null>(null);

  const plugin = useRef(
    AutoScroll({ 
      speed: 0.8,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      startDelay: 0,
    })
  );

  const videos = config.featuredVideos.filter(v => v.url || v.customVideoUrl);

  return (
    <section className="w-full max-w-7xl px-4 mx-auto group/carousel relative">
      <Carousel
        plugins={[plugin.current]}
        opts={{
          align: "start",
          loop: true,
          dragFree: true,
        }}
        className="w-full relative"
      >
        <CarouselContent className="-ml-4">
          {videos.map((video) => (
            <CarouselItem key={video.id} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
              <VideoCard 
                video={video} 
                isPlaying={playingId === video.id}
                onPlay={() => setPlayingId(video.id)}
                onStop={() => setPlayingId(null)}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <div className="flex justify-center gap-4 mt-8 lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:w-full lg:left-0 lg:px-4 lg:justify-between pointer-events-none z-30">
          <CarouselPrevious className="relative lg:absolute lg:left-0 pointer-events-auto h-12 w-12 border-2 border-white/20 bg-black/50 text-white hover:bg-white hover:text-black transition-all rounded-full flex items-center justify-center backdrop-blur-md" />
          <CarouselNext className="relative lg:absolute lg:right-0 pointer-events-auto h-12 w-12 border-2 border-white/20 bg-black/50 text-white hover:bg-white hover:text-black transition-all rounded-full flex items-center justify-center backdrop-blur-md" />
        </div>
      </Carousel>
    </section>
  );
};

export default VideoSection;