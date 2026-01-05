"use client";

import React, { useState } from 'react';
import { Twitter, Mail, MessageSquare, Copy, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    
    // Toast pequeno e rápido
    toast.success("✅ Copied to clipboard", {
      duration: 1000,
      className: "font-pixel text-[10px] uppercase",
    });

    setTimeout(() => setCopiedType(null), 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-[#0a0a0a] border-4 border-white rounded-[32px] p-8 text-center sm:rounded-[40px] outline-none shadow-[0_0_50px_rgba(255,255,255,0.1)] [&>button]:hidden">
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
            href="https://x.com/rdocreative"
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
            onClick={() => handleCopy('rdovfx1@gmail.com', 'email')}
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
                rdovfx1@gmail.com
              </span>
              {copiedType === 'email' ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-zinc-400 group-hover:text-white" />
              )}
            </div>
          </button>
        </div>

        <button 
          onClick={onClose}
          className="mt-10 text-[10px] text-zinc-500 hover:text-white transition-colors uppercase font-['Press_Start_2P'] underline-offset-4 hover:underline"
        >
          [ Back to Profile ]
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;