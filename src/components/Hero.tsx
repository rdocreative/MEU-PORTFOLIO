"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Github, Linkedin } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex flex-col items-center justify-center pt-20 px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-wider mb-6 inline-block">
          Disponível para novos projetos
        </span>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">
          Transformando ideias em <br /> experiências digitais.
        </h1>
        <p className="max-w-2xl mx-auto text-muted-foreground text-lg mb-10">
          Sou um desenvolvedor focado em criar interfaces de alta performance e design refinado. Especializado em React, Tailwind e arquiteturas modernas.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="rounded-full gap-2">
            Ver meus projetos <ArrowRight size={18} />
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Github size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Linkedin size={20} />
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;