"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useConfig } from '@/context/ConfigContext';
import { Volume2, VolumeX, Play } from 'lucide-react';
import { Reveal } from './Reveal';

const AudioPlayer = () => {
  const { config } = useConfig();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Verificação de segurança
  const musicUrl = config.musicUrl?.trim();
  if (!musicUrl) return null;

  // Verifica se é um link do Spotify
  const isSpotify = musicUrl.includes('spotify.com');

  // Lógica para extrair o ID do Spotify e montar o link de Embed
  const getSpotifyEmbedUrl = (url: string) => {
    try {
      // Suporta links do tipo:
      // https://open.spotify.com/track/123...
      // https://open.spotify.com/playlist/123...
      // https://open.spotify.com/album/123...
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/').filter(Boolean); // remove vazios
      
      // Geralmente [type, id] ex: ['track', '4cOdK2...']
      if (pathParts.length >= 2) {
        const type = pathParts[pathParts.length - 2];
        const id = pathParts[pathParts.length - 1];
        return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  // --- RENDERIZAÇÃO SPOTIFY ---
  if (isSpotify) {
    const embedUrl = getSpotifyEmbedUrl(musicUrl);
    if (!embedUrl) return null;

    return (
      <Reveal delay={0.2} width="100%" className="flex justify-center mt-6 mb-2">
        <div className="w-full max-w-sm rounded-[12px] overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.3)] border border-white/10 relative z-30 bg-black">
          <iframe 
            style={{ borderRadius: '12px' }} 
            src={embedUrl} 
            width="100%" 
            height="152" 
            frameBorder="0" 
            allowFullScreen 
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy"
          />
        </div>
      </Reveal>
    );
  }

  // --- RENDERIZAÇÃO MP3 (Nativo) ---

  // Efeitos apenas para o player nativo
  useEffect(() => {
    if (!isSpotify && musicUrl && audioRef.current) {
      audioRef.current.volume = 0.4;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            console.log("Autoplay blocked");
            setIsPlaying(false);
          });
      }
    }
  }, [musicUrl, isSpotify]);

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
        
        <button
          onClick={togglePlay}
          className="flex items-center gap-3 px-4 py-2 rounded-full border backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95"
          style={{
            backgroundColor: `${config.cardColor}D9`,
            borderColor: isPlaying ? config.primaryColor : 'rgba(255,255,255,0.2)',
            boxShadow: isPlaying ? `0 0 15px ${config.primaryColor}30` : 'none'
          }}
        >
          <div className="relative w-4 h-4 flex items-center justify-center">
            {isPlaying ? (
              <div className="flex items-end gap-[2px] h-3">
                <div className="w-[2px] bg-green-400 animate-[pulse_0.6s_ease-in-out_infinite] h-full" />
                <div className="w-[2px] bg-green-400 animate-[pulse_0.8s_ease-in-out_infinite] h-2/3" />
                <div className="w-[2px] bg-green-400 animate-[pulse_1s_ease-in-out_infinite] h-full" />
                <div className="w-[2px] bg-green-400 animate-[pulse_0.7s_ease-in-out_infinite] h-1/2" />
              </div>
            ) : (
              <Play className="w-3 h-3 text-zinc-400 ml-0.5" fill="currentColor" />
            )}
          </div>

          <div className="flex flex-col text-left mr-2">
            <span 
              className="text-[8px] font-bold uppercase tracking-wider"
              style={{ color: isPlaying ? config.primaryColor : '#71717a' }}
            >
              {isPlaying ? 'Now Playing' : 'Paused'}
            </span>
            <span className="text-[7px] text-zinc-500 font-mono">
              BACKGROUND_AUDIO
            </span>
          </div>

          <div 
            role="button"
            onClick={toggleMute}
            className="p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-3 h-3 text-red-400" />
            ) : (
              <Volume2 className="w-3 h-3 text-zinc-400" />
            )}
          </div>
        </button>
      </div>
    </Reveal>
  );
};

export default AudioPlayer;