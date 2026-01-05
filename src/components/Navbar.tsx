"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { useConfig } from '@/context/ConfigContext';

const Navbar = () => {
  const { config } = useConfig();

  return (
    <nav className="fixed top-8 left-0 w-full z-50 px-6 flex justify-center animate-in slide-in-from-top-full duration-1000 delay-300 fill-mode-backwards pointer-events-none">
      <div 
        style={{ 
          backgroundColor: `${config.cardColor}e6`, 
          borderColor: config.primaryColor,
          boxShadow: `0px 5px 0px 0px ${config.primaryColor}4d`
        }}
        className="w-full max-w-3xl backdrop-blur-md border-4 flex items-center justify-between p-4 rounded-full pointer-events-auto"
      >
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-4 group ml-3">
            <div 
              style={{ borderColor: config.secondaryColor }}
              className="relative w-12 h-12 overflow-hidden border-2 rounded-full group-hover:scale-105 transition-transform"
            >
              <img 
                src={config.profileImage} 
                alt="Home" 
                className="w-full h-full bg-gray-800 object-cover"
              />
            </div>
          </Link>
        </div>

        <a 
          href={`mailto:${config.email}`}
          style={{ 
            backgroundColor: config.secondaryColor,
            borderColor: `${config.secondaryColor}99`
          }}
          className="text-white text-[10px] px-8 py-3 border-b-4 border-r-4 rounded-full active:border-0 active:translate-y-[2px] active:translate-x-[2px] transition-all uppercase hover:brightness-110 mr-3"
        >
          Contact
        </a>
      </div>
    </nav>
  );
};

export default Navbar;