"use client";

import React, { useState } from 'react';
import { useConfig } from '@/context/ConfigContext';
import { Play, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const VideoSection = () => {
  const { config } = useConfig();
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [hoveringId, setHoveringId] = useState<string | null>(null);

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videos = config.featuredVideos.filter(v => v.url || v.customVideoUrl);

  if (videos.length === 0) {
    return (
      <div className="text-center py-10 opacity-20 text-[8px] uppercase">
        WAITING_FOR_FEATURED_CONTENT
      </div>
    );
  }

  return (
    <section className="w-full max-w-7xl px-12 relative">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {videos.map((video) => {
            const videoId = getYouTubeId(video.url);
            const isPlaying = playingId === video.id;
            const isHovering = hoveringId === video.id;

            return (
              <CarouselItem key={video.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div 
                  className="group relative flex flex-col gap-4"
                  onMouseEnter={() => setHoveringId(video.id)}
                  onMouseLeave={() => setHoveringId(null)}
                >
                  <div className="aspect-video relative bg-zinc-900 rounded-[32px] overflow-hidden border-2 border-white/5 transition-all duration-500 shadow-2xl group-hover:border-white/20">
                    {isPlaying ? (
                      <div className="absolute inset-0 z-30">
                        {video.customVideoUrl ? (
                          <video 
                            src={video.customVideoUrl} 
                            className="w-full h-full object-cover" 
                            controls 
                            autoPlay 
                          />
                        ) : (
                          <iframe
                            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                            className="w-full h-full"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                          ></iframe>
                        )}
                        <button 
                          onClick={(e) => { e.stopPropagation(); setPlayingId(null); }}
                          className="absolute top-4 right-4 z-40 bg-black/60 text-white text-[8px] px-3 py-1 rounded-full border border-white/20 hover:bg-white hover:text-black transition-colors"
                        >
                          CLOSE
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setPlayingId(video.id)}
                        className="w-full h-full relative block"
                      >
                        {/* Preview Automática no Hover */}
                        {isHovering ? (
                          <div className="absolute inset-0 z-10 pointer-events-none">
                            {video.customVideoUrl ? (
                              <video 
                                src={video.customVideoUrl} 
                                className="w-full h-full object-cover" 
                                autoPlay 
                                muted 
                                loop 
                                playsInline
                              />
                            ) : (
                              <iframe
                                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&start=10&end=25&modestbranding=1&rel=0&iv_load_policy=3&playlist=${videoId}&loop=1`}
                                className="w-full h-full scale-125"
                                allow="autoplay"
                              ></iframe>
                            )}
                          </div>
                        ) : (
                          <div className="absolute inset-0 z-0">
                            {videoId ? (
                              <img 
                                src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                                alt={video.title}
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-0 transition-opacity duration-300"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
                                }}
                              />
                            ) : video.customVideoUrl ? (
                              <video src={video.customVideoUrl} className="w-full h-full object-cover opacity-60" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[8px] opacity-20">NO_SIGNAL</div>
                            )}
                          </div>
                        )}
                        
                        {/* Overlay de Info */}
                        <div className="absolute bottom-6 left-6 z-20 flex flex-col items-start gap-1 pointer-events-none group-hover:translate-y-[-5px] transition-transform duration-300">
                          <div className="flex items-center gap-2 text-cyan-400">
                            <Eye className="w-4 h-4 fill-cyan-400/20" />
                            <span className="text-[10px] font-bold">{video.views || "0 VIEWS"}</span>
                          </div>
                          <div className="text-[8px] text-white/40 font-bold tracking-tighter uppercase">
                            {video.editTime} • {video.deliveryTime}
                          </div>
                        </div>

                        <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="p-4 bg-black/40 backdrop-blur-md rounded-full border border-white/20 scale-75 group-hover:scale-100 transition-transform duration-500">
                            <Play className="w-8 h-8 text-white fill-white" />
                          </div>
                        </div>
                      </button>
                    )}
                  </div>
                  
                  <h3 className="text-[10px] text-center text-white/70 uppercase tracking-[0.2em] font-bold group-hover:text-white transition-colors">
                    {video.title}
                  </h3>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <div className="hidden lg:block">
          <CarouselPrevious className="absolute -left-16 h-12 w-12 border-4 border-white bg-black text-white hover:bg-white hover:text-black transition-all rounded-full" />
          <CarouselNext className="absolute -right-16 h-12 w-12 border-4 border-white bg-black text-white hover:bg-white hover:text-black transition-all rounded-full" />
        </div>
      </Carousel>
    </section>
  );
};

export default VideoSection;