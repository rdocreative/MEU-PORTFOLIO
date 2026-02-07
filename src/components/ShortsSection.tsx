"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useConfig } from '@/context/ConfigContext';
import { Reveal } from './Reveal';
import { getYouTubeId } from '@/utils/videoUtils';
import { Volume2, VolumeX } from 'lucide-react';

interface PlayerProps {
  isMuted: boolean;
  onToggleAudio: (e: React.MouseEvent) => void;
}

const ShortsPlayer = ({ videoId, title, isMuted, onToggleAudio }: { videoId: string, title: string } & PlayerProps) => {
  const [key, setKey] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setKey(prev => prev + 1);
    }, 20000); // Reseta a cada 20 segundos para manter o loop
    return () => clearInterval(timer);
  }, [videoId]);

  // Se o áudio estiver ativado, não atualizamos a key automaticamente para não cortar o áudio no meio
  // O usuário terá que dar replay ou o vídeo vai parar (comportamento padrão do youtube embed)
  useEffect(() => {
    if (!isMuted) {
      setKey(prev => prev + 1); // Força recarregar com som ao ativar
    }
  }, [isMuted]);

  return (
    <div className="w-full h-full relative group/player">
      <iframe
        key={`${key}-${isMuted}`}
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${videoId}&playsinline=1&rel=0&showinfo=0&iv_load_policy=3&modestbranding=1&disablekb=1`}
        title={title}
        className="w-full h-full object-cover pointer-events-none"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        tabIndex={-1}
        style={{ border: 0 }}
      />
      <div className="absolute inset-0 z-10 bg-transparent pointer-events-none" />
      
      <button 
        onClick={onToggleAudio}
        className="absolute top-3 right-3 z-30 p-2.5 bg-black/60 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black transition-all duration-300 pointer-events-auto opacity-0 group-hover/player:opacity-100"
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>
    </div>
  );
};

const LocalShortsPlayer = ({ src, isMuted, onToggleAudio }: { src: string } & PlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    // Só faz loop manual se estiver mutado (visualização de fundo)
    // Se estiver com som, deixa o comportamento nativo de loop ou o usuário controla
    if (isMuted && e.currentTarget.currentTime >= 20) {
      e.currentTarget.currentTime = 0;
      e.currentTarget.play();
    }
  };
  
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);
  
  if (!src) return null;

  return (
    <div className="w-full h-full relative group/player">
      <video 
        ref={videoRef}
        src={src} 
        className="w-full h-full object-cover pointer-events-none select-none"
        muted={isMuted}
        loop 
        playsInline
        autoPlay
        controls={false}
        onTimeUpdate={handleTimeUpdate}
      />
      
      <button 
        onClick={onToggleAudio}
        className="absolute top-3 right-3 z-30 p-2.5 bg-black/60 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black transition-all duration-300 pointer-events-auto opacity-0 group-hover/player:opacity-100"
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>
    </div>
  );
};

const ShortsSection = () => {
  const { config } = useConfig();
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  
  if (!config.showShorts) return null;

  // Filtra e depois ordena: primeiro os que NÃO têm customVideoUrl (YouTube), depois os que têm (Uploads)
  const validShorts = (config.shortsVideos?.filter(v => 
    (v.url !== '' && v.url !== undefined) || (v.customVideoUrl && v.customVideoUrl !== '')
  ) || []).sort((a, b) => {
    const aIsUploaded = !!a.customVideoUrl;
    const bIsUploaded = !!b.customVideoUrl;
    
    // Se ambos forem iguais (ambos YT ou ambos Upload), mantém a ordem
    if (aIsUploaded === bIsUploaded) return 0;
    // Se 'a' for upload, vai para o final (1). Se 'a' for YT, vai para o começo (-1)
    return aIsUploaded ? 1 : -1;
  });

  if (validShorts.length === 0) return null;

  const toggleAudio = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveAudioId(current => current === id ? null : id);
  };

  return (
    <section className="w-full flex justify-center px-4 mt-20">
      <div className="w-full max-w-7xl">
        <div className="flex flex-col items-center gap-16 w-full">
          <Reveal>
            <h2 
              style={{ 
                color: config.primaryColor,
                textShadow: `0 0 20px ${config.primaryColor}80`
              }} 
              className="text-xl md:text-3xl tracking-[0.3em] mr-[-0.3em] font-bold uppercase cursor-default text-center"
            >
              SHORTS
            </h2>
          </Reveal>
          
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 w-full mx-auto">
            {validShorts.map((short, index) => {
              const videoId = getYouTubeId(short.url);
              if (!videoId && !short.customVideoUrl) return null;

              const isMuted = activeAudioId !== short.id;

              return (
                <Reveal key={short.id} delay={index * 0.1}>
                  <div className="group relative aspect-[9/16] w-[260px] sm:w-[280px] md:w-[300px] bg-zinc-900 rounded-[32px] overflow-hidden border-2 border-zinc-800 transition-all duration-500 hover:border-white/20 shadow-2xl">
                    {short.customVideoUrl ? (
                      <LocalShortsPlayer 
                        src={short.customVideoUrl} 
                        isMuted={isMuted}
                        onToggleAudio={(e) => toggleAudio(short.id, e)}
                      />
                    ) : (
                      <ShortsPlayer 
                        videoId={videoId!} 
                        title={short.title} 
                        isMuted={isMuted}
                        onToggleAudio={(e) => toggleAudio(short.id, e)}
                      />
                    )}
                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-20">
                      <p className="text-[10px] font-bold tracking-widest text-white/60 uppercase text-center">
                        {short.title}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShortsSection;