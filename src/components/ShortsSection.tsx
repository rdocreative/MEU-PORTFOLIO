"use client";

import React from 'react';
import { useConfig } from '@/context/ConfigContext';

const ShortsSection = () => {
  const { config } = useConfig();

  if (!config.shorts_videos || config.shorts_videos.length === 0) return null;

  return (
    <div className="w-full max-w-6xl px-4">
      <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: config.primary_color }}>Shorts & Reels</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {config.shorts_videos.map((video: any, index: number) => (
          <div key={index} className="aspect-[9/16] w-full overflow-hidden rounded-xl shadow-lg bg-black/20">
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

export default ShortsSection;