"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { useConfig } from '@/context/ConfigContext';
import { Settings } from 'lucide-react';

const Navbar = () => {
  const { config } = useConfig();

  return (
    <nav className="fixed top-6 left-0 w-full z-50 px-4 flex justify-center">
      <div 
        style={{ 
          backgroundColor: `${config.cardColor}e6`, 
          borderColor: config.primaryColor,
          boxShadow: `0px 4px 0px 0px ${config.primaryColor}4d`
        }}
        className="w-full max-w-2xl backdrop-blur-md border-4 flex items-center justify-between p-3 rounded-full"
      >
        <div className="flex items-center gap-2">
          {/* Logo/Profile Image Link */}
          <Link to="/" className="flex items-center gap-3 group ml-2">
            <div 
              style={{ borderColor: config.secondaryColor }}
              className="relative w-10 h-10 overflow-hidden border-2 rounded-full group-hover:scale-105 transition-transform"
            >
              <img 
                src={config.profileImage} 
                alt="Home" 
                className="w-full h-full bg-gray-800 object-cover"
              />
            </div>
          </Link>

          {/* Botão invisível/discreto para configurações */}
          <Link to="/settings" className="p-2 text-white/20 hover:text-white transition-colors">
            <Settings className="w-4 h-4" />
          </Link>
        </div>

        {/* Contact Link */}
        <a 
          href={`mailto:${config.email}`}
          style={{ 
            backgroundColor: config.secondaryColor,
            borderColor: `${config.secondaryColor}99`
          }}
          className="text-white text-[8px] px-6 py-2 border-b-4 border-r-4 rounded-full active:border-0 active:translate-y-[2px] active:translate-x-[2px] transition-all uppercase hover:brightness-110 mr-2"
        >
          Contact
        </a>
      </div>
    </nav>
  );
};

export default Navbar;