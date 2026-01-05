"use client";

import React, { useRef, useState, useMemo, memo } from 'react';
import { useConfig, VideoData } from '@/context/ConfigContext';
import { AlertTriangle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Reveal } from './Reveal';

const getYouTubeId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// --- Componente de Vídeo (Custom) ---
const VideoLoop = memo(({ src }: { src: string }) => {
  return (
    <video 
      src={src} 
      className="w-full h-full object-contain bg-black pointer-events-none select-none"
      muted loop playsInline
      autoPlay
      preload="auto"
      controls={false}
    />
  );
});

VideoLoop.displayName = 'VideoLoop';

// --- Componente YouTube (Preview) ---
const YouTubePreview = memo(({ videoId, title }: { videoId: string, title?: string }) => {
  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&playsinline=1&rel=0&showinfo=0&iv_load_policy=3&modestbranding=1&disablekb=1`}
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

// --- Card do Vídeo ---
const VideoCard = memo(({ video, onClick }: { video: VideoData, onClick: () => void }) => {
  const videoId = getYouTubeId(video.url);

  return (
    <div 
      onClick={onClick}
      className="flex-shrink-0 w-[80vw] md:w-[450px] snap-center group relative flex flex-col gap-4 p-2 cursor-pointer transition-transform duration-300 hover:scale-[1.01]"
    >
      <div className="aspect-video relative bg-black rounded-[30px] md:rounded-[40px] overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-black flex items-center justify-center">
            {video.customVideoUrl ? (
              <VideoLoop src={video.customVideoUrl} />
            ) : videoId ? (
              <YouTubePreview videoId={videoId} title={video.title} />
            ) : (
              <div className="flex flex-col items-center justify-center opacity-20 gap-2">
                <AlertTriangle className="w-8 h-8" />
                <span className="text-[8px] uppercase tracking-widest">No Signal</span>
              </div>
            )}
        </div>
        
        {/* Overlay do botão WATCH ao passar o mouse */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[1px] z-40 pointer-events-none">
          <span className="text-[10px] bg-white text-black px-6 py-2 rounded-full font-bold uppercase tracking-[0.2em] shadow-lg transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
            Watch
          </span>
        </div>

        <div className="absolute inset-0 rounded-[40px] border-4 border-white/5 z-30 group-hover:border-white/20 transition-colors" />
      </div>
      <h3 className="text-[10px] text-white/60 uppercase tracking-[0.2em] font-bold text-center group-hover:text-white transition-colors">
        {video.title}
      </h3>
    </div>
  );
});

VideoCard.displayName = 'VideoCard';

// --- Seção Principal (Slider Controlável) ---
const VideoSection = () => {
  const { config } = useConfig();
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const activeVideos = useMemo(() => 
    config.featuredVideos.filter(v => (v.url && v.url.trim() !== "") || (v.customVideoUrl && v.customVideoUrl.trim() !== "")),
    [config.featuredVideos]
  );

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = current.clientWidth < 768 ? current.clientWidth : 450; // Scroll 1 slide at a time
      
      current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (activeVideos.length === 0) return null;

  return (
    <>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <Reveal width="100%" delay={0.2} className="w-full relative py-10 group/section">
        
        {/* Container Scrollável */}
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-4 px-4 md:px-12 pb-8 hide-scrollbar snap-x snap-mandatory scroll-smooth"
        >
          {/* Espaçador inicial para centralizar se necessário ou dar respiro */}
          <div className="w-2 md:w-12 flex-shrink-0" />
          
          {activeVideos.map((video, idx) => (
            <VideoCard 
              key={`${video.id}-${idx}`} 
              video={video} 
              onClick={() => setSelectedVideo(video)} 
            />
          ))}

          <div className="w-2 md:w-12 flex-shrink-0" />
        </div>

        {/* Setas de Navegação */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-2 md:px-8 z-30">
          <button 
            onClick={() => scroll('left')}
            className="pointer-events-auto w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all hover:scale-110 active:scale-95 disabled:opacity-0"
            aria-label="Previous videos"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button 
            onClick={() => scroll('right')}
            className="pointer-events-auto w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all hover:scale-110 active:scale-95"
            aria-label="Next videos"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </Reveal>

      {/* Modal de Vídeo */}
      <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
        <DialogContent className="max-w-5xl w-[95vw] aspect-video p-0 bg-black border-none overflow-hidden outline-none">
           <div className="relative w-full h-full bg-black group/modal">
              {selectedVideo && (
                selectedVideo.customVideoUrl ? (
                  <video src={selectedVideo.customVideoUrl} className="w-full h-full object-contain" autoPlay controls />
                ) : (
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${getYouTubeId(selectedVideo.url)}?autoplay=1&controls=1`}
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