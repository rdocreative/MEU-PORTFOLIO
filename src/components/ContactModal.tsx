"use client";

import React from 'react';
import { Twitter, Mail, MessageSquare, X } from 'lucide-react';
import { useConfig } from '@/context/ConfigContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
  const { config } = useConfig();

  const contactOptions = [
    {
      name: 'Twitter',
      icon: <Twitter className="w-5 h-5" />,
      url: config.twitterUrl,
      color: '#1DA1F2'
    },
    {
      name: 'Discord',
      icon: <MessageSquare className="w-5 h-5" />,
      url: config.discordUrl,
      color: '#5865F2'
    },
    {
      name: 'Email',
      icon: <Mail className="w-5 h-5" />,
      url: `mailto:${config.email}`,
      color: config.primaryColor
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-[#0a0a0a] border-4 border-white rounded-[32px] p-8 text-center sm:rounded-[40px] outline-none">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-white text-lg font-['Press_Start_2P'] leading-relaxed uppercase tracking-tight">
            Let's work together
          </DialogTitle>
          <DialogDescription className="text-zinc-400 text-xs font-sans tracking-wide">
            Choose how you prefer to contact me:
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-3 mt-8">
          {contactOptions.map((option) => (
            <a
              key={option.name}
              href={option.url}
              target={option.name !== 'Email' ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="group relative flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl bg-zinc-900 border-2 border-zinc-800 transition-all hover:scale-[1.02] active:scale-[0.98] hover:border-white/20"
            >
              <div style={{ color: option.color }} className="transition-transform group-hover:scale-110">
                {option.icon}
              </div>
              <span className="text-white text-sm font-bold uppercase tracking-widest font-sans">
                {option.name}
              </span>
              
              {/* Hover highlight effect */}
              <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
        </div>

        <button 
          onClick={onClose}
          className="mt-6 text-[10px] text-zinc-500 hover:text-white transition-colors uppercase font-['Press_Start_2P']"
        >
          [ Close ]
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;