"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useConfig } from "@/context/ConfigContext";

const VideoSection = () => {
  const { config } = useConfig();
  const videos = config.featured_videos || [];

  if (videos.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full px-4">
      {videos.map((video, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="group relative bg-[#0a0a0a] rounded-2xl overflow-hidden border-2 border-zinc-800 transition-colors hover:border-zinc-700"
        >
          <div className="aspect-video w-full bg-zinc-900 relative">
            {video.thumbnail ? (
              <img 
                src={video.thumbnail} 
                alt={video.title} 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-zinc-700 font-bold uppercase tracking-widest text-xs">Video Preview</span>
              </div>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <a 
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <div 
                style={{ backgroundColor: config.primaryColor }}
                className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
              >
                <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1" />
              </div>
            </a>
          </div>
          
          <div className="p-4">
            <h3 className="text-white text-xs font-['Press_Start_2P'] tracking-tighter uppercase line-clamp-1 mb-2">
              {video.title}
            </h3>
            <p className="text-zinc-500 text-[10px] line-clamp-2 leading-relaxed">
              {video.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default VideoSection;