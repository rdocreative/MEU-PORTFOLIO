"use client";

import React, { useState } from 'react';
import { useConfig } from '@/context/ConfigContext';
import { Play } from 'lucide-react';

const VideoSection = () => {
  const { config } = useConfig();
  const [playingId, setPlayingId] = useState<string | null>(null);

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videos = config.videos.filter(v => v.url);

  if (videos.length === 0) return null;

  return (
    <section id="videos" className="w-full max-w-4xl mt-20 px-4 flex flex-col items-center gap-10">
      <div className="flex flex-col items-center gap-2">
        <h2 style={{ color: config.primaryColor }} className="text-xl font-['Press_Start_2P'] uppercase tracking-tighter">
          Long_Form_Content
        </h2>
        <div style={{ backgroundColor: config.secondaryColor }} className="w-24 h-1 opacity-50"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {videos.map((video) => {
          const videoId = getYouTubeId(video.url);
          const isPlaying = playingId === video.id;

          return (
            <div 
              key={video.id}
              style={{ 
                backgroundColor: config.cardColor,
                borderColor: config.primaryColor,
                boxShadow: `6px 6px 0px 0px ${config.primaryColor}33`
              }}
              className="group relative border-4 rounded-2xl overflow-hidden flex flex-col transition-all hover:-translate-y-1"
            >
              <div className="aspect-video relative bg-black flex items-center justify-center">
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
                    className="w-full h-full relative group/thumb"
                  >
                    {videoId ? (
                      <img 
                        src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover opacity-60 group-hover/thumb:opacity-80 transition-opacity"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[8px] opacity-30">NO_SIGNAL</div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="p-4 bg-white/10 backdrop-blur-sm rounded-full border-2 border-white/50 group-hover/thumb:scale-110 transition-transform">
                        <Play className="w-8 h-8 text-white fill-white" />
                      </div>
                    </div>
                  </button>
                )}
              </div>
              
              <div className="p-5 border-t-2 border-white/5">
                <h3 className="text-[10px] text-white/90 line-clamp-1 uppercase leading-relaxed">
                  {video.title}
                </h3>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default VideoSection;