"use client";

import React from 'react';
import { useConfig } from '@/context/ConfigContext';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { config } = useConfig();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-8 pointer-events-none">
      <div className="container mx-auto flex justify-between items-center">
        <div className="pointer-events-auto">
          <Link to="/" className="text-xl font-black tracking-tighter uppercase">
            {config.profileName}
          </Link>
        </div>
        
        <div className="flex gap-8 pointer-events-auto bg-black/50 backdrop-blur-xl px-8 py-3 rounded-full border border-white/10">
          <a href="#work" className="text-[10px] font-black uppercase tracking-widest hover:opacity-50 transition-opacity">Work</a>
          <a href="#clients" className="text-[10px] font-black uppercase tracking-widest hover:opacity-50 transition-opacity">Partners</a>
          <Link to="/admin" className="text-[10px] font-black uppercase tracking-widest opacity-20 hover:opacity-100 transition-opacity">Admin</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;