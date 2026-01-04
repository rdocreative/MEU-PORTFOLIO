"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MessageSquare } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="py-24 px-4 container mx-auto">
      <div className="max-w-4xl mx-auto bg-primary text-primary-foreground rounded-[2.5rem] p-8 md:p-16 flex flex-col md:flex-row gap-12 items-center">
        <div className="flex-1">
          <h2 className="text-4xl font-bold mb-6">Vamos criar algo extraordinário?</h2>
          <p className="text-primary-foreground/80 mb-8 text-lg">
            Estou sempre em busca de novos desafios. Se você tem uma ideia ou projeto em mente, entre em contato!
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail size={20} />
              <span>contato@seuemail.com</span>
            </div>
            <div className="flex items-center gap-3">
              <MessageSquare size={20} />
              <span>WhatsApp: (11) 99999-9999</span>
            </div>
          </div>
        </div>
        <div className="flex-1 w-full space-y-4 bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/10">
          <Input placeholder="Seu nome" className="bg-transparent border-white/20 placeholder:text-white/40 text-white" />
          <Input placeholder="Seu email" type="email" className="bg-transparent border-white/20 placeholder:text-white/40 text-white" />
          <Textarea placeholder="Como posso ajudar?" className="bg-transparent border-white/20 placeholder:text-white/40 text-white min-h-[120px]" />
          <Button variant="secondary" className="w-full h-12 font-bold">Enviar Mensagem</Button>
        </div>
      </div>
    </section>
  );
};

export default Contact;