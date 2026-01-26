"use client";

import React from 'react';
import { useConfig } from '@/context/ConfigContext';
import { Play } from 'lucide-react';

const VideoSection = () => {
  const { config } = useConfig();

  const getYoutubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      {config.featuredVideos.map((video) => (
        <div key={video.id} className="group space-y-6">
          <div className="relative aspect-video rounded-[40px] overflow-hidden border-2 border-white/5 bg-zinc-900 group-hover:border-white/20 transition-all duration-500">
            {getYoutubeEmbedUrl(video.url) ? (
              <iframe
                src={getYoutubeEmbedUrl(video.url)!}
                className="w-full h-full grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Play className="opacity-20" size={48} />
              </div>
            )}
          </div>
          <div className="flex justify-between items-start px-4">
            <h3 className="text-lg font-black uppercase tracking-tight max-w-[80%]">{video.title}</h3>
            <span className="text-[10px] font-bold opacity-20 group-hover:opacity-100 transition-opacity">0{config.featuredVideos.indexOf(video) + 1}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoSection;