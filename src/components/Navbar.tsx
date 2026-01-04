"use client";

import React from 'react';
import { motion } from 'framer-motion';

const Navbar = () => {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center gap-8"
    >
      <a href="#home" className="text-sm font-medium hover:text-primary transition-colors">Início</a>
      <a href="#projects" className="text-sm font-medium hover:text-primary transition-colors">Projetos</a>
      <a href="#skills" className="text-sm font-medium hover:text-primary transition-colors">Habilidades</a>
      <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">Contato</a>
    </motion.nav>
  );
};

export default Navbar;