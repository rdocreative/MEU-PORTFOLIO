"use client";

import React, { useState } from 'react';
import { Twitter, Mail, MessageSquare, Copy, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { showSuccess } from '@/utils/toast';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    showSuccess(`${type.toUpperCase()} COPIADO!`);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-[#0a0a0a] border-4 border-white rounded-[32px] p-8 text-center sm:rounded-[40px] outline-none">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-white text-lg font-['Press_Start_2P'] leading-relaxed uppercase tracking-tight">
            Let's work together
          </DialogTitle>
          <DialogDescription className="text-zinc-400 text-[10px] font-['Press_Start_2P'] tracking-wide uppercase">
            contact me:
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 mt-8">
          {/* Twitter - Redirecionamento Direto */}
          <a
            href="https://x.com/rdocreative"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-center gap-3 w-full py-5 px-6 rounded-2xl bg-zinc-900 border-2 border-zinc-800 transition-all hover:scale-[1.02] active:scale-[0.98] hover:border-[#1DA1F2]/50"
          >
            <Twitter className="w-5 h-5 text-[#1DA1F2] transition-transform group-hover:scale-110" />
            <span className="text-white text-[10px] font-bold uppercase tracking-widest font-['Press_Start_2P']">
              Twitter
            </span>
          </a>

          {/* Discord - Mostrar e Copiar */}
          <button
            onClick={() => handleCopy('rdocreative', 'discord')}
            className="group relative flex flex-col items-center justify-center gap-2 w-full py-5 px-6 rounded-2xl bg-zinc-900 border-2 border-zinc-800 transition-all hover:scale-[1.02] active:scale-[0.98] hover:border-[#5865F2]/50"
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-[#5865F2]" />
              <span className="text-white text-[10px] font-bold uppercase tracking-widest font-['Press_Start_2P']">
                Discord
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-zinc-500 text-[8px] font-['Press_Start_2P'] lowercase">
                rdocreative
              </span>
              {copiedType === 'discord' ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-zinc-600" />}
            </div>
          </button>

          {/* Email - Mostrar e Copiar */}
          <button
            onClick={() => handleCopy('rdovfx1@gmail.com', 'email')}
            className="group relative flex flex-col items-center justify-center gap-2 w-full py-5 px-6 rounded-2xl bg-zinc-900 border-2 border-zinc-800 transition-all hover:scale-[1.02] active:scale-[0.98] hover:border-white/20"
          >
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-white" />
              <span className="text-white text-[10px] font-bold uppercase tracking-widest font-['Press_Start_2P']">
                Email
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-zinc-500 text-[8px] font-['Press_Start_2P'] lowercase">
                rdovfx1@gmail.com
              </span>
              {copiedType === 'email' ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-zinc-600" />}
            </div>
          </button>
        </div>

        <button 
          onClick={onClose}
          className="mt-8 text-[10px] text-zinc-500 hover:text-white transition-colors uppercase font-['Press_Start_2P']"
        >
          [ Close ]
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;