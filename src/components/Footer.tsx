"use client";

import React from 'react';
import { useConfig } from '@/context/ConfigContext';

const Footer = () => {
  const { config } = useConfig();
  
  return (
    <footer className="w-full py-8 mt-auto border-t border-white/10 flex justify-center items-center">
      <p className="text-sm text-gray-500">
        © {new Date().getFullYear()} {config.profile_name || 'Portfólio'}. Todos os direitos reservados.
      </p>
    </footer>
  );
};

export default Footer;