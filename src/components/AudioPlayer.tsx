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

  // Verificação de segurança
  const musicUrl = config.musicUrl?.trim();
  if (!musicUrl) return null;

  // Verifica se é um link do Spotify
  const isSpotify = musicUrl.includes('spotify.com');

  // Lógica para extrair o ID do Spotify e montar o link de Embed
  const getSpotifyEmbedUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      
      if (pathParts.length >= 2) {
        const type = pathParts[pathParts.length - 2];
        const id = pathParts[pathParts.length - 1];
        // Adiciona theme=0 para dark mode e size compact
        return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  // --- RENDERIZAÇÃO SPOTIFY (Compacto) ---
  if (isSpotify) {
    const embedUrl = getSpotifyEmbedUrl(musicUrl);
    if (!embedUrl) return null;

    return (
      <Reveal delay={0.2} width="100%" className="flex justify-center mt-6 mb-2">
        <div className="w-full max-w-[300px] rounded-[12px] overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.3)] border border-white/10 relative z-30 bg-black">
          {/* Altura reduzida para 80px para ser menos intrusivo */}
          <iframe 
            style={{ borderRadius: '12px' }} 
            src={embedUrl} 
            width="100%" 
            height="80" 
            frameBorder="0" 
            allowFullScreen 
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy"
          />
        </div>
      </Reveal>
    );
  }

  // --- RENDERIZAÇÃO MP3 (Minimalista & Estilizado) ---

  useEffect(() => {
    if (!isSpotify && musicUrl && audioRef.current) {
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
        
        <div
          onClick={togglePlay}
          className="flex items-center gap-4 px-5 py-2.5 rounded-full border backdrop-blur-md cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95"
          style={{
            backgroundColor: `${config.cardColor}D9`,
            borderColor: isPlaying ? config.primaryColor : 'rgba(255,255,255,0.1)',
            boxShadow: isPlaying ? `0 0 20px ${config.primaryColor}20` : 'none'
          }}
        >
          {/* Ícone de Play/Pause */}
          <div className="text-white/80">
            {isPlaying ? <Pause className="w-4 h-4" fill="currentColor" /> : <Play className="w-4 h-4" fill="currentColor" />}
          </div>

          {/* Visualizador Animado */}
          <div className="flex items-center gap-[3px] h-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-[3px] rounded-full bg-current transition-all duration-300"
                style={{
                  color: isPlaying ? config.primaryColor : '#52525b', // primary ou zinc-600
                  height: isPlaying ? '100%' : '20%',
                  animation: isPlaying ? `music-bar 0.8s ease-in-out infinite ${i * 0.1}s` : 'none'
                }}
              />
            ))}
          </div>

          {/* Separador */}
          <div className="w-[1px] h-4 bg-white/10" />

          {/* Botão de Mute */}
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
      
      {/* Keyframes globais para a animação das barras */}
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