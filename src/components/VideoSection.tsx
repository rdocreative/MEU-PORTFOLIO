"use client";

import React, { useRef, useState, useMemo, memo, useEffect } from 'react';
import { useConfig, VideoData } from '@/context/ConfigContext';
import { AlertTriangle, X } from 'lucide-react';
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import AutoScroll from "embla-carousel-auto-scroll";
import { getYouTubeId } from '@/utils/videoUtils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

const VideoLoop = memo(({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (e.currentTarget.currentTime >= 20) {
      e.currentTarget.currentTime = 0;
      e.currentTarget.play();
    }
  };
  
  if (!src || src.trim() === '') return null;

  return (
    <video 
      ref={videoRef}
      src={src} 
      className="w-full h-full object-contain bg-black pointer-events-none select-none"
      muted loop playsInline
      autoPlay
      preload="auto"
      controls={false}
      onTimeUpdate={handleTimeUpdate}
    />
  );
});

VideoLoop.displayName = 'VideoLoop';

const YouTubePreview = memo(({ videoId, title }: { videoId: string, title?: string }) => {
  const [key, setKey] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setKey(prev => prev + 1);
    }, 20000); // Reset every 20 seconds
    
    return () => clearInterval(timer);
  }, [videoId]);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center">
      <iframe
        key={key}
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&playsinline=1&rel=0&showinfo=0&iv_load_policy=3&modestbranding=1&disablekb=1&end=20`}
        className="w-full h-full pointer-events-none" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        tabIndex={-1}
        style={{ border: 0 }}
        title={title}
      />
      <div className="absolute inset-0 z-10 bg-transparent" />
    </div>
  );
});

YouTubePreview.displayName = 'YouTubePreview';

const VideoCard = memo(({ video, onClick }: { video: VideoData, onClick: () => void }) => {
  const videoId = getYouTubeId(video.url);
  const hasCustomVideo = video.customVideoUrl && video.customVideoUrl.trim() !== '';

  return (
    <div 
      onClick={onClick}
      className="group relative flex flex-col gap-2 md:gap-4 p-1 cursor-pointer w-full"
    >
      <div className="aspect-video relative bg-black rounded-[24px] md:rounded-[40px] overflow-hidden shadow-2xl transition-all duration-300 group-hover:scale-[1.02] border border-zinc-800">
        <div className="absolute inset-0 bg-black flex items-center justify-center">
            {hasCustomVideo ? (
              <VideoLoop src={video.customVideoUrl!} />
            ) : videoId ? (
              <YouTubePreview videoId={videoId} title={video.title} />
            ) : (
              <div className="flex flex-col items-center justify-center opacity-50 gap-2 text-red-500">
                <AlertTriangle className="w-8 h-8" />
                <span className="text-[8px] uppercase tracking-widest font-bold">Invalid Link</span>
                <span className="text-[6px] max-w-[80%] truncate">{video.url}</span>
              </div>
            )}
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[1px] z-40 pointer-events-none">
          <span className="text-[8px] md:text-[10px] bg-white text-black px-4 md:px-6 py-1.5 md:py-2 rounded-full font-bold uppercase tracking-[0.2em] shadow-lg transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
            Watch
          </span>
        </div>
        <div className="absolute inset-0 rounded-[24px] md:rounded-[40px] border-2 md:border-4 border-white/5 z-30 group-hover:border-white/20 transition-colors" />
      </div>
      <h3 className="text-[9px] md:text-[10px] text-white/60 uppercase tracking-[0.2em] font-bold text-center group-hover:text-white transition-colors truncate px-2">
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

  const activeVideos = useMemo(() => 
    config.featuredVideos.filter(v => (v.url && v.url.trim().length > 0) || (v.customVideoUrl && v.customVideoUrl.trim().length > 0)),
    [config.featuredVideos]
  );

  const shouldLoop = activeVideos.length > 1;

  const plugin = useRef(
    AutoScroll({ 
      speed: 1,
      stopOnInteraction: false,
      stopOnMouseEnter: false,
    })
  );

  if (activeVideos.length === 0) return null;

  return (
    <>
      <div className="w-full relative group/section animate-in fade-in duration-700">
        <Carousel
          setApi={setApi}
          plugins={shouldLoop ? [plugin.current] : []}
          opts={{
            align: "start",
            loop: shouldLoop,
            dragFree: true,
          }}
          className="w-full"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          }}
        >
          <CarouselContent className={`-ml-4 md:-ml-8 items-center py-6 md:py-10 ${!shouldLoop ? 'justify-center' : ''}`}>
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
      </div>

      <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
        <DialogContent className="max-w-5xl w-[95vw] aspect-video p-0 bg-black border-none overflow-hidden outline-none">
           <div className="relative w-full h-full bg-black group/modal">
              {selectedVideo && (
                selectedVideo.customVideoUrl && selectedVideo.customVideoUrl.trim() !== '' ? (
                  <video src={selectedVideo.customVideoUrl} className="w-full h-full object-contain" autoPlay controls />
                ) : (
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${getYouTubeId(selectedVideo?.url || '')}?autoplay=1&controls=1`}
                    allowFullScreen
                  />
                )
              )}
              <DialogClose className="absolute top-4 right-4 z-50 p-2 bg-black/50 rounded-full text-white hover:bg-white hover:text-black transition-all">
                <X className="w-6 h-6" />
              </DialogClose>
           </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VideoSection;