"use client";

import React, { useRef, useState, useMemo, memo } from 'react';
import { useConfig, VideoData } from '@/context/ConfigContext';
import { AlertTriangle, X } from 'lucide-react';
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
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <video 
      ref={videoRef}
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
      // Aumentado de 44vw para 65vw no mobile (~40% maior)
      className="flex-shrink-0 w-[65vw] md:w-[450px] group relative flex flex-col gap-2 md:gap-4 p-1 cursor-pointer"
    >
      <div className="aspect-video relative bg-black rounded-[20px] md:rounded-[40px] overflow-hidden shadow-2xl transition-all duration-300 group-hover:scale-[1.02]">
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
          <span className="text-[8px] md:text-[10px] bg-white text-black px-4 md:px-6 py-1.5 md:py-2 rounded-full font-bold uppercase tracking-[0.2em] shadow-lg transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
            Watch
          </span>
        </div>

        <div className="absolute inset-0 rounded-[20px] md:rounded-[40px] border-2 md:border-4 border-white/5 z-30 group-hover:border-white/20 transition-colors" />
      </div>
      <h3 className="text-[8px] md:text-[10px] text-white/60 uppercase tracking-[0.2em] font-bold text-center group-hover:text-white transition-colors truncate px-2">
        {video.title}
      </h3>
    </div>
  );
});

VideoCard.displayName = 'VideoCard';

// --- Seção Principal com Marquee Infinito ---
const VideoSection = () => {
  const { config } = useConfig();
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);

  const activeVideos = useMemo(() => 
    config.featuredVideos.filter(v => (v.url && v.url.trim() !== "") || (v.customVideoUrl && v.customVideoUrl.trim() !== "")),
    [config.featuredVideos]
  );

  if (activeVideos.length === 0) return null;

  // Duplicamos a lista para criar o efeito infinito visual no CSS
  const marqueeItems = activeVideos.length > 4 ? [...activeVideos, ...activeVideos] : [...activeVideos, ...activeVideos, ...activeVideos, ...activeVideos];

  return (
    <>
      <style>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-infinite {
          display: flex;
          width: fit-content;
          animation: marquee-scroll 40s linear infinite;
        }
        /* Pausa a animação ao passar o mouse para facilitar o clique */
        .animate-marquee-infinite:hover {
          animation-play-state: paused;
        }
      `}</style>

      <Reveal width="100%" delay={0.2} className="w-full overflow-hidden py-6 md:py-10 relative group/section">
        {/* Gradientes laterais para suavizar as bordas */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-8 md:w-60 z-20 pointer-events-none"
          style={{ background: `linear-gradient(to right, ${config.backgroundColor}, transparent)` }}
        />
        <div 
          className="absolute right-0 top-0 bottom-0 w-8 md:w-60 z-20 pointer-events-none"
          style={{ background: `linear-gradient(to left, ${config.backgroundColor}, transparent)` }}
        />

        {/* Container Marquee */}
        {/* Ajustado gap para mobile para acompanhar o aumento do card */}
        <div className="animate-marquee-infinite gap-4 md:gap-8 px-2 md:px-4">
          {marqueeItems.map((video, idx) => (
            <VideoCard 
              key={`${video.id}-${idx}`} 
              video={video} 
              onClick={() => setSelectedVideo(video)} 
            />
          ))}
        </div>
      </Reveal>

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