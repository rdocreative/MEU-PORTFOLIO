"use client";

import React, { useState } from 'react';
import { useConfig } from '@/context/ConfigContext';
import { Play, Eye } from 'lucide-react';

const VideoSection = () => {
  const { config } = useConfig();
  const [playingId, setPlayingId] = useState<string | null>(null);

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videos = config.featuredVideos.filter(v => v.url);

  if (videos.length === 0) {
    return (
      <div className="text-center py-10 opacity-20 text-[8px] uppercase">
        WAITING_FOR_FEATURED_CONTENT
      </div>
    );
  }

  return (
    <section className="w-full max-w-7xl px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {videos.map((video) => {
          const videoId = getYouTubeId(video.url);
          const isPlaying = playingId === video.id;

          return (
            <div 
              key={video.id}
              className="group relative flex flex-col gap-4"
            >
              <div className="aspect-video relative bg-zinc-900 rounded-[32px] overflow-hidden border-2 border-white/5 transition-transform hover:scale-[1.02] duration-500">
                {isPlaying && videoId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                    className="w-full h-full"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <button 
                    onClick={() => setPlayingId(video.id)}
                    className="w-full h-full relative"
                  >
                    {videoId ? (
                      <img 
                        src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[8px] opacity-20">NO_SIGNAL</div>
                    )}
                    
                    {/* Metadados Estilo Imagem */}
                    <div className="absolute bottom-6 left-6 flex flex-col items-start gap-1">
                      <div className="flex items-center gap-2 text-cyan-400">
                        <Eye className="w-4 h-4 fill-cyan-400/20" />
                        <span className="text-[10px] font-bold">{video.views || "0 VIEWS"}</span>
                      </div>
                      <div className="text-[8px] text-white/40 font-bold tracking-tighter">
                        {video.editTime} • {video.deliveryTime}
                      </div>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="p-4 bg-black/40 backdrop-blur-md rounded-full border border-white/20">
                        <Play className="w-8 h-8 text-white fill-white" />
                      </div>
                    </div>
                  </button>
                )}
              </div>
              
              <h3 className="text-[11px] text-center text-white/90 uppercase tracking-widest font-bold">
                {video.title}
              </h3>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default VideoSection;