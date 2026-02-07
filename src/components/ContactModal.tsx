"use client";

import React, { useState, useEffect } from 'react';
import { Twitter, Mail, MessageSquare, Copy, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useConfig } from '@/context/ConfigContext';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
  const { config } = useConfig();
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [showLocalToast, setShowLocalToast] = useState(false);

  // Define o link do Twitter fixo conforme solicitado
  const twitterLink = "https://x.com/rdocreative";

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setShowLocalToast(true);
    
    setTimeout(() => {
      setCopiedType(null);
      setShowLocalToast(false);
    }, 3000);
  };

  useEffect(() => {
    if (!isOpen) {
      setCopiedType(null);
      setShowLocalToast(false);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-[#0a0a0a] border-4 border-white rounded-[32px] p-8 text-center sm:rounded-[40px] outline-none shadow-[0_0_50px_rgba(255,255,255,0.1)] [&>button]:hidden duration-150 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-white text-lg font-['Press_Start_2P'] leading-relaxed uppercase tracking-tight">
            Let's work together
          </DialogTitle>
          <DialogDescription className="text-zinc-400 text-[10px] font-['Press_Start_2P'] tracking-wide uppercase">
            contact me:
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-5 mt-10">
          <a
            href={twitterLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-center gap-4 w-full py-6 px-6 rounded-2xl bg-zinc-900/50 border-2 border-zinc-700 transition-all hover:scale-[1.02] active:scale-[0.98] hover:border-[#1DA1F2] hover:bg-[#1DA1F2]/5"
          >
            <Twitter className="w-6 h-6 text-[#1DA1F2] transition-transform group-hover:scale-110" />
            <span className="text-white text-[11px] font-bold uppercase tracking-widest font-['Press_Start_2P']">
              Twitter
            </span>
          </a>

          <button
            onClick={() => handleCopy('rdocreative', 'discord')}
            className="group relative flex flex-col items-center justify-center gap-3 w-full py-6 px-6 rounded-2xl bg-zinc-900/50 border-2 border-zinc-700 transition-all hover:scale-[1.02] active:scale-[0.98] hover:border-[#5865F2] hover:bg-[#5865F2]/5"
          >
            <div className="flex items-center gap-4">
              <MessageSquare className="w-6 h-6 text-[#5865F2] group-hover:scale-110 transition-transform" />
              <span className="text-white text-[11px] font-bold uppercase tracking-widest font-['Press_Start_2P']">
                Discord
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1 bg-black/40 px-4 py-2 rounded-lg border border-zinc-800 group-hover:border-[#5865F2]/30">
              <span className="text-white text-[9px] font-['Press_Start_2P'] lowercase tracking-tighter">
                rdocreative
              </span>
              {copiedType === 'discord' ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-zinc-400 group-hover:text-white" />
              )}
            </div>
          </button>

          <button
            onClick={() => handleCopy(config.email, 'email')}
            className="group relative flex flex-col items-center justify-center gap-3 w-full py-6 px-6 rounded-2xl bg-zinc-900/50 border-2 border-zinc-700 transition-all hover:scale-[1.02] active:scale-[0.98] hover:border-white/40 hover:bg-white/5"
          >
            <div className="flex items-center gap-4">
              <Mail className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              <span className="text-white text-[11px] font-bold uppercase tracking-widest font-['Press_Start_2P']">
                Email
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1 bg-black/40 px-4 py-2 rounded-lg border border-zinc-800 group-hover:border-white/20">
              <span className="text-white text-[9px] font-['Press_Start_2P'] lowercase tracking-tighter">
                {config.email}
              </span>
              {copiedType === 'email' ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-zinc-400 group-hover:text-white" />
              )}
            </div>
          </button>
        </div>

        <div className="h-8 mt-4 flex items-center justify-center">
          <div 
            className={`transition-all duration-300 transform ${showLocalToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}
          >
            <span className="text-[9px] font-['Press_Start_2P'] text-green-400 uppercase tracking-tighter">
              ✅ Copied to clipboard
            </span>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="mt-6 text-[10px] text-zinc-500 hover:text-white transition-colors uppercase font-['Press_Start_2P'] underline-offset-4 hover:underline"
        >
          [ Back to Portfolio ]
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;