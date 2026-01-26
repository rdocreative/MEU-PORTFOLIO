"use client";

import React from 'react';
import { useConfig } from '@/context/ConfigContext';
import { Reveal } from './Reveal';

const ShortsSection = () => {
  const { config } = useConfig();
  
  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    try {
      if (url.includes('shorts/')) {
        return url.replace('shorts/', 'embed/');
      }
      if (url.includes('watch?v=')) {
        return url.replace('watch?v=', 'embed/');
      }
      if (url.includes('youtu.be/')) {
        return url.replace('youtu.be/', 'embed/');
      }
      return url;
    } catch (e) {
      return null;
    }
  };

  const validShorts = config.shortsVideos?.filter(v => v.url !== '') || [];

  if (validShorts.length === 0) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 mt-20">
      <Reveal>
        <div className="flex flex-col items-center gap-16">
          <h2 
            style={{ 
              color: config.primaryColor,
              textShadow: `0 0 20px ${config.primaryColor}80`
            }} 
            className="text-xl md:text-3xl tracking-[0.3em] font-bold uppercase cursor-default"
          >
            SHORTS
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
            {validShorts.map((short, index) => {
              const embedUrl = getEmbedUrl(short.url);
              if (!embedUrl) return null;

              return (
                <Reveal key={short.id} delay={index * 0.1}>
                  <div className="group relative aspect-[9/16] w-full bg-zinc-900 rounded-[32px] overflow-hidden border-2 border-zinc-800 transition-all duration-500 hover:border-white/20 shadow-2xl">
                    <iframe
                      src={`${embedUrl}?rel=0&modestbranding=1`}
                      title={short.title}
                      className="w-full h-full object-cover"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
                      <p className="text-[10px] font-bold tracking-widest text-white/60 uppercase">
                        {short.title}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Reveal>
    </div>
  );
};

export default ShortsSection;