"use client";

import React from 'react';
import { useConfig } from '@/context/ConfigContext';
import { Twitter, Mail, MessageSquare } from 'lucide-react';

const Header = () => {
  const { config } = useConfig();

  return (
    <header className="flex flex-col items-center text-center gap-6 max-w-2xl">
      <div className="relative w-32 h-32 md:w-40 md:h-40">
        <img 
          src={config.profile_image || 'https://via.placeholder.com/150'} 
          alt={config.profile_name}
          className="w-full h-full object-cover rounded-full border-4 shadow-xl"
          style={{ borderColor: config.primary_color || '#ffffff' }}
        />
      </div>
      
      <div className="space-y-2">
        <h1 
          className="text-4xl md:text-5xl font-bold tracking-tight"
          style={{ color: config.primary_color || '#ffffff' }}
        >
          {config.profile_name || 'Seu Nome'}
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-md">
          {config.description || 'Editor de Vídeo & Designer'}
        </p>
      </div>

      <div className="flex gap-4 mt-2">
        {config.twitter_url && (
          <a href={config.twitter_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
            <Twitter className="w-6 h-6 text-white" />
          </a>
        )}
        {config.discord_url && (
          <a href={config.discord_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
            <MessageSquare className="w-6 h-6 text-white" />
          </a>
        )}
        {config.email && (
          <a href={`mailto:${config.email}`} className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
            <Mail className="w-6 h-6 text-white" />
          </a>
        )}
      </div>
    </header>
  );
};

export default Header;