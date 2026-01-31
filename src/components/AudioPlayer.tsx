"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useConfig } from '@/context/ConfigContext';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { Reveal } from './Reveal';

const AudioPlayer = () => {
  const { config } = useConfig();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const musicUrl = config.musicUrl?.trim();
  
  // Se não houver URL ou se for um link do Spotify (que agora ignoramos), não renderiza
  if (!musicUrl || musicUrl.includes('spotify.com')) return null;

  useEffect(() => {
    if (musicUrl && audioRef.current) {
      audioRef.current.volume = 0.4;
      
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            console.log("Autoplay waiting for interaction");
            setIsPlaying(false);
          });
      }
    }
  }, [musicUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <Reveal delay={0.2} width="100%" className="flex justify-center mt-4">
      <div className="relative group z-30">
        <audio ref={audioRef} src={musicUrl} loop playsInline />
        
        <div
          onClick={togglePlay}
          className="flex items-center gap-4 px-5 py-2.5 rounded-full border backdrop-blur-md cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95"
          style={{
            backgroundColor: `${config.cardColor}D9`,
            borderColor: isPlaying ? config.primaryColor : 'rgba(255,255,255,0.1)',
            boxShadow: isPlaying ? `0 0 20px ${config.primaryColor}20` : 'none'
          }}
        >
          <div className="text-white/80">
            {isPlaying ? <Pause className="w-4 h-4" fill="currentColor" /> : <Play className="w-4 h-4" fill="currentColor" />}
          </div>

          <div className="flex items-center gap-[3px] h-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-[3px] rounded-full bg-current transition-all duration-300"
                style={{
                  color: isPlaying ? config.primaryColor : '#52525b',
                  height: isPlaying ? '100%' : '20%',
                  animation: isPlaying ? `music-bar 0.8s ease-in-out infinite ${i * 0.1}s` : 'none'
                }}
              />
            ))}
          </div>

          <div className="w-[1px] h-4 bg-white/10" />

          <button 
            onClick={toggleMute}
            className="text-white/60 hover:text-white transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes music-bar {
          0%, 100% { height: 20%; }
          50% { height: 100%; }
        }
      `}</style>
    </Reveal>
  );
};

export default AudioPlayer;