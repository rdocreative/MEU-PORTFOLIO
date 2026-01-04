"use client";

import React from 'react';
import { Twitter, Mail, MessageSquare } from 'lucide-react';
import { useConfig } from '@/context/ConfigContext';

const ProfileCard = () => {
  const { config } = useConfig();

  const primaryStyle = { borderColor: config.primaryColor };
  const cardStyle = { 
    backgroundColor: `${config.cardColor}cc`, 
    borderColor: config.primaryColor,
    boxShadow: `10px 10px 0px 0px ${config.primaryColor}4d`
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-lg">
      {/* Profile Section - Updated to rounded-[40px] */}
      <div style={cardStyle} className="relative overflow-hidden backdrop-blur-md border-4 p-12 rounded-[40px] w-full flex flex-col items-center group/card">
        <div className="scanline"></div>
        
        <div className="relative w-32 h-32 mb-6 group-hover/card:scale-105 transition-transform duration-500">
          <div style={{ borderColor: config.secondaryColor }} className="absolute inset-0 border-4 rounded-full animate-pulse"></div>
          <img 
            src={config.profileImage} 
            alt="Profile" 
            className="w-full h-full p-2 bg-black rounded-full object-cover"
          />
        </div>
        
        <h1 
          style={{ color: config.primaryColor }} 
          className="text-2xl mb-3 font-['Press_Start_2P'] uppercase text-center pixel-glitch cursor-default transition-all"
        >
          {config.profileName}
        </h1>
        <p className="text-gray-400 text-[12px] text-center mb-8 leading-relaxed px-6 uppercase opacity-80 group-hover/card:opacity-100 transition-opacity">
          {config.description}
        </p>

        <div className="flex gap-6">
          <a href={config.twitterUrl} target="_blank" rel="noopener" style={primaryStyle} className="p-4 bg-zinc-900 hover:bg-white hover:text-black transition-all border-2 rounded-full group">
            <Twitter className="w-6 h-6" />
          </a>
          <a href={config.discordUrl} target="_blank" rel="noopener" style={primaryStyle} className="p-4 bg-zinc-900 hover:bg-white hover:text-black transition-all border-2 rounded-full group">
            <MessageSquare className="w-6 h-6" />
          </a>
          <a href={`mailto:${config.email}`} style={primaryStyle} className="p-4 bg-zinc-900 hover:bg-white hover:text-black transition-all border-2 rounded-full group">
            <Mail className="w-6 h-6" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;