"use client";

import React from 'react';
import { useConfig } from '@/context/ConfigContext';
import { Play } from 'lucide-react';

const ShortsSection = () => {
  const { config } = useConfig();
  const shorts = config.shortsVideos.filter(v => v.url);

  if (shorts.length === 0) return null;

  // Duplicamos a lista para criar o efeito infinito
  const displayShorts = [...shorts, ...shorts, ...shorts];

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="w-full overflow-hidden py-10 relative">
      <div className="flex animate-marquee hover:pause whitespace-nowrap gap-6 px-6">
        {displayShorts.map((short, idx) => {
          const videoId = getYouTubeId(short.url);
          return (
            <div 
              key={`${short.id}-${idx}`}
              className="flex-shrink-0 w-64 aspect-video bg-zinc-900 rounded-3xl overflow-hidden border-2 border-white/5 relative group cursor-pointer"
              onClick={() => window.open(short.url, '_blank')}
            >
              {videoId ? (
                <img 
                  src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`} 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                  alt=""
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[8px] opacity-20">NO_SIGNAL</div>
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-3 bg-black/40 backdrop-blur-sm rounded-full border border-white/20 scale-75 group-hover:scale-100 transition-transform">
                  <Play className="w-6 h-6 text-white fill-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShortsSection;