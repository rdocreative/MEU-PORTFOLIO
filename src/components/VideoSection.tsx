"use client";

import React, { useState } from 'react';
import { useConfig } from '@/context/ConfigContext';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from '@/components/ui/button';

const VideoSection = () => {
  const { config } = useConfig();
  // Estado para controlar quais vídeos foram "ativados" (clicados para tocar)
  const [playingVideos, setPlayingVideos] = useState<Record<string, boolean>>({});

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handlePlay = (id: string) => {
    setPlayingVideos(prev => ({ ...prev, [id]: true }));
  };

  if (!config.featuredVideos.length) return null;

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-4">
        {config.featuredVideos.map((video, index) => {
          const videoId = getYoutubeId(video.url);
          const isPlaying = playingVideos[video.id];

          return (
            <CarouselItem key={video.id} className="pl-4 md:basis-1/2 lg:basis-1/2">
              <div className="group relative space-y-3">
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 group-hover:border-white/30 transition-all duration-500 shadow-lg">
                  
                  {isPlaying && videoId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    /* Thumbnail Otimizada */
                    <div 
                      className="w-full h-full cursor-pointer relative"
                      onClick={() => handlePlay(video.id)}
                    >
                      {videoId ? (
                        <img 
                          src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} 
                          alt={video.title}
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-zinc-800" />
                      )}
                      
                      {/* Botão de Play Centralizado */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-300">
                          <Play className="w-5 h-5 fill-white text-white ml-1" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-start px-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider max-w-[85%] truncate">
                    {video.title}
                  </h3>
                  <span className="text-[10px] font-mono opacity-30">
                    {(index + 1).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <div className="hidden md:flex justify-end gap-2 mt-4">
        <CarouselPrevious className="static translate-y-0 bg-transparent border-white/10 hover:bg-white/10 hover:text-white" />
        <CarouselNext className="static translate-y-0 bg-transparent border-white/10 hover:bg-white/10 hover:text-white" />
      </div>
    </Carousel>
  );
};

export default VideoSection;