"use client";

import React from 'react';
import { useConfig } from '@/context/ConfigContext';
import { Reveal } from './Reveal';

const VideoSection = () => {
  const { config } = useConfig();
  
  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    try {
      if (url.includes('watch?v=')) return url.replace('watch?v=', 'embed/');
      if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'embed/');
      return url;
    } catch (e) {
      return null;
    }
  };

  const validVideos = config.featuredVideos.filter(v => v.url !== '');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full px-4">
      {validVideos.map((video, index) => (
        <Reveal key={video.id} delay={index * 0.1}>
          <div className="group relative aspect-video w-full bg-zinc-900 rounded-[40px] overflow-hidden border-2 border-zinc-800 transition-all duration-500 hover:border-white/20 shadow-2xl">
            {video.isDirectUpload ? (
              <video 
                src={video.url} 
                controls 
                className="w-full h-full object-cover"
                poster="/video-placeholder.png"
              />
            ) : (
              <iframe
                src={`${getEmbedUrl(video.url)}?rel=0&modestbranding=1`}
                title={video.title}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
            
            <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              <p className="text-[10px] md:text-xs font-bold tracking-[0.3em] text-white/40 uppercase group-hover:text-white/90 transition-colors">
                {video.title}
              </p>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
};

export default VideoSection;