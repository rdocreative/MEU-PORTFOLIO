"use client";

import React, { useState, useEffect } from 'react';
import { useConfig } from '@/context/ConfigContext';
import { Reveal } from './Reveal';
import { getYouTubeId } from '@/utils/videoUtils';

const ShortsPlayer = ({ videoId, title }: { videoId: string, title: string }) => {
  const [key, setKey] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setKey(prev => prev + 1);
    }, 20000); // Reset every 20 seconds
    return () => clearInterval(timer);
  }, [videoId]);

  return (
    <div className="w-full h-full relative">
      <iframe
        key={key}
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&playsinline=1&rel=0&showinfo=0&iv_load_policy=3&modestbranding=1&disablekb=1&end=20`}
        title={title}
        className="w-full h-full object-cover pointer-events-none"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        tabIndex={-1}
        style={{ border: 0 }}
      />
      <div className="absolute inset-0 z-10 bg-transparent" />
    </div>
  );
};

const ShortsSection = () => {
  const { config } = useConfig();
  
  if (!config.showShorts) return null;

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
              const videoId = getYouTubeId(short.url);
              if (!videoId) return null;

              return (
                <Reveal key={short.id} delay={index * 0.1}>
                  <div className="group relative aspect-[9/16] w-full bg-zinc-900 rounded-[32px] overflow-hidden border-2 border-zinc-800 transition-all duration-500 hover:border-white/20 shadow-2xl">
                    <ShortsPlayer videoId={videoId} title={short.title} />
                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-20">
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