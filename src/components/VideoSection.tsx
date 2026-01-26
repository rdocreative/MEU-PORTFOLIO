"use client";

import React, { useState, useMemo, memo, useEffect, useRef } from 'react';
import { useConfig, VideoData } from '@/context/ConfigContext';
import { AlertTriangle, X, Play } from 'lucide-react';
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Reveal } from './Reveal';
import AutoScroll from "embla-carousel-auto-scroll";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

const getYouTubeId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Componente de thumbnail otimizado
const VideoThumbnail = memo(({ videoId, title, customUrl }: { videoId: string | null, title: string, customUrl?: string }) => {
  const [imgSrc, setImgSrc] = useState<string>(
    videoId ? `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg` : ''
  );

  const handleError = () => {
    // Fallback para qualidade menor se a máxima não existir
    if (videoId && imgSrc.includes('maxresdefault')) {
      setImgSrc(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`);
    }
  };

  if (customUrl) {
    return (
      <video 
        src={customUrl} 
        className="w-full h-full object-cover"
        muted 
        playsInline 
        loop 
        onMouseOver={(e) => e.currentTarget.play()}
        onMouseOut={(e) => e.currentTarget.pause()}
      />
    );
  }

  return (
    <div className="w-full h-full relative group/thumb">
      <img
        src={imgSrc}
        alt={title}
        onError={handleError}
        className="w-full h-full object-cover transition-transform duration-700 group-hover/thumb:scale-110"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/20 group-hover/thumb:bg-black/0 transition-colors duration-300" />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-300">
        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <Play className="w-5 h-5 text-white fill-white" />
        </div>
      </div>
    </div>
  );
});

VideoThumbnail.displayName = 'VideoThumbnail';

const VideoCard = memo(({ video, onClick }: { video: VideoData, onClick: () => void }) => {
  const videoId = getYouTubeId(video.url);
  const hasContent = videoId || (video as any).customVideoUrl;

  return (
    <div 
      onClick={onClick}
      className="group relative flex flex-col gap-3 p-1 cursor-pointer w-full"
    >
      <div className="aspect-video relative bg-zinc-900 rounded-[24px] md:rounded-[32px] overflow-hidden shadow-2xl border border-white/5 transition-all duration-300 group-hover:border-white/20 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]">
        {hasContent ? (
          <VideoThumbnail 
            videoId={videoId} 
            title={video.title} 
            customUrl={(video as any).customVideoUrl} 
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full opacity-20 gap-2">
            <AlertTriangle className="w-8 h-8" />
            <span className="text-[8px] uppercase tracking-widest">No Signal</span>
          </div>
        )}
      </div>
      
      <h3 className="text-[10px] md:text-xs text-zinc-400 uppercase tracking-[0.2em] font-bold text-center group-hover:text-white transition-colors truncate px-2">
        {video.title}
      </h3>
    </div>
  );
});

VideoCard.displayName = 'VideoCard';

const VideoSection = () => {
  const { config } = useConfig();
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const [api, setApi] = useState<CarouselApi>();
  const scrollAccumulator = useRef(0);

  // Filter valid videos
  const activeVideos = useMemo(() => 
    config.featuredVideos.filter(v => (v.url && v.url.trim() !== "") || ((v as any).customVideoUrl && (v as any).customVideoUrl.trim() !== "")),
    [config.featuredVideos]
  );

  const plugin = useRef(
    AutoScroll({ 
      speed: 1,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  useEffect(() => {
    if (!api) return;

    const onWheel = (e: WheelEvent) => {
      // Allow vertical scroll to pass through if deltaY is dominant and we aren't trying to scroll the carousel explicitly
      // But here we want to hijack scroll for carousel movement
      
      if (Math.abs(e.deltaY) > 2) {
        // Only prevent default if we are hovering the carousel (which we are, via event listener on rootNode)
        // e.preventDefault(); 
        // Removing e.preventDefault to allow page scrolling, 
        // OR keeping it if the intention is horizontal scroll control.
        // Assuming user wants page scroll:
        
        scrollAccumulator.current += e.deltaY * 0.8;

        if (Math.abs(scrollAccumulator.current) >= 100) {
          if (scrollAccumulator.current < 0) {
            api.scrollNext();
          } else {
            api.scrollPrev();
          }
          scrollAccumulator.current = 0;
        }
      }
    };

    const rootNode = api.rootNode();
    rootNode.addEventListener('wheel', onWheel, { passive: true }); // Changed to passive: true to improve scroll performance
    return () => rootNode.removeEventListener('wheel', onWheel);
  }, [api]);

  if (activeVideos.length === 0) return null;

  return (
    <>
      <Reveal width="100%" delay={0.2} className="w-full relative group/section">
        <Carousel
          setApi={setApi}
          plugins={[plugin.current]}
          opts={{
            align: "start",
            loop: true,
            dragFree: true,
            skipSnaps: true, // Improves performance
          }}
          className="w-full"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          }}
        >
          <CarouselContent className="-ml-4 md:-ml-8 items-center py-6 md:py-10">
            {activeVideos.map((video, idx) => (
              <CarouselItem 
                key={`${video.id}-${idx}`} 
                className="pl-4 md:pl-8 basis-[85vw] md:basis-[450px]"
              >
                <VideoCard 
                  video={video} 
                  onClick={() => setSelectedVideo(video)} 
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </Reveal>

      <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
        <DialogContent className="max-w-5xl w-[95vw] aspect-video p-0 bg-black border-none overflow-hidden outline-none shadow-2xl">
           <div className="relative w-full h-full bg-black group/modal flex items-center justify-center">
              {selectedVideo && (
                (selectedVideo as any).customVideoUrl ? (
                  <video 
                    src={(selectedVideo as any).customVideoUrl} 
                    className="w-full h-full object-contain" 
                    autoPlay 
                    controls 
                  />
                ) : (
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${getYouTubeId(selectedVideo.url)}?autoplay=1&rel=0&modestbranding=1`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )
              )}
              <DialogClose className="absolute top-4 right-4 z-50 p-2 bg-black/50 rounded-full text-white hover:bg-white hover:text-black transition-all hover:rotate-90">
                <X className="w-6 h-6" />
              </DialogClose>
           </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VideoSection;