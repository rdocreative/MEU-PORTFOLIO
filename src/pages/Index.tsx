"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Projects from '@/components/Projects';
import Skills from '@/components/Skills';
import Contact from '@/components/Contact';
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/10">
      <Navbar />
      <main>
        <Hero />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <footer className="py-12 border-t text-center text-muted-foreground text-sm">
        <p>© {new Date().getFullYear()} Seu Nome. Todos os direitos reservados.</p>
        <MadeWithDyad />
      </footer>
    </div>
  );
};

export default Index;