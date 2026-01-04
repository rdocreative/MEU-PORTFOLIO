"use client";

import React from 'react';
import { Twitter, Mail, MessageSquare, ChevronRight } from 'lucide-react';
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
      {/* Profile Section */}
      <div style={cardStyle} className="backdrop-blur-md border-4 p-12 rounded-[50px] w-full flex flex-col items-center">
        <div className="relative w-32 h-32 mb-6">
          <div style={{ borderColor: config.secondaryColor }} className="absolute inset-0 border-4 rounded-full"></div>
          <img 
            src={config.profileImage} 
            alt="Profile" 
            className="w-full h-full p-2 bg-black rounded-full object-cover"
          />
        </div>
        
        <h1 style={{ color: config.primaryColor }} className="text-2xl mb-3 font-['Press_Start_2P'] uppercase text-center">
          {config.profileName}
        </h1>
        <p className="text-gray-400 text-[12px] text-center mb-8 leading-relaxed px-6 uppercase">
          {config.description}
        </p>

        <div className="flex gap-6">
          <a href={config.twitterUrl} style={primaryStyle} className="p-4 bg-zinc-900 hover:bg-zinc-800 transition-all border-2 rounded-full">
            <Twitter className="w-6 h-6 text-white" />
          </a>
          <a href={config.discordUrl} style={primaryStyle} className="p-4 bg-zinc-900 hover:bg-zinc-800 transition-all border-2 rounded-full">
            <MessageSquare className="w-6 h-6 text-white" />
          </a>
          <a href={`mailto:${config.email}`} style={primaryStyle} className="p-4 bg-zinc-900 hover:bg-zinc-800 transition-all border-2 rounded-full">
            <Mail className="w-6 h-6 text-white" />
          </a>
        </div>
      </div>

      {/* Action Sections */}
      <div className="grid grid-cols-1 gap-5 w-full px-4">
        {[config.longFormText, config.shortFormText].map((text, i) => (
          <button 
            key={i}
            style={{ 
              backgroundColor: `${config.cardColor}cc`, 
              borderColor: config.primaryColor,
              boxShadow: `8px 8px 0px 0px ${config.primaryColor}33`
            }}
            className="flex items-center justify-between border-4 py-6 px-10 rounded-full group hover:bg-zinc-900 transition-all"
          >
            <span className="text-white text-[12px] font-['Press_Start_2P'] group-hover:translate-x-1 transition-transform uppercase">
              {text}
            </span>
            <div style={{ backgroundColor: config.secondaryColor }} className="p-1.5 rounded-full">
              <ChevronRight className="w-5 h-5 text-black" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileCard;