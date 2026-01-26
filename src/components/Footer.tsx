"use client";

import React from 'react';
import { useConfig } from '@/context/ConfigContext';
import { Twitter, Mail, MessageSquare } from 'lucide-react';

const Footer = () => {
  const { config } = useConfig();

  return (
    <footer className="border-t border-white/10 py-20 px-6">
      <div className="container mx-auto flex flex-col items-center gap-12">
        <div className="flex gap-8">
          {config.twitterUrl && (
            <a href={config.twitterUrl} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
              <Twitter size={24} />
            </a>
          )}
          {config.discordUrl && (
            <div className="flex items-center gap-2 group cursor-pointer">
              <MessageSquare size={24} />
              <span className="text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
                {config.discordUrl}
              </span>
            </div>
          )}
          {config.email && (
            <a href={`mailto:${config.email}`} className="hover:scale-110 transition-transform">
              <Mail size={24} />
            </a>
          )}
        </div>
        
        <div className="text-center space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">
            © {new Date().getFullYear()} {config.profileName} — ALL_RIGHTS_RESERVED
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;