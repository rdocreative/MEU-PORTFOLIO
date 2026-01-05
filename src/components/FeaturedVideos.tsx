"use client";

import React from 'react';
import { useConfig } from '@/context/ConfigContext';

const FeaturedVideos = () => {
  const { config } = useConfig();

  if (!config.featured_videos || config.featured_videos.length === 0) return null;

  return (
    <div className="w-full max-w-6xl px-4">
      <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: config.primary_color }}>Vídeos em Destaque</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {config.featured_videos.map((video: any, index: number) => (
          <div key={index} className="aspect-video w-full overflow-hidden rounded-xl shadow-2xl bg-black/20">
            <iframe
              src={video.url}
              title={video.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedVideos;