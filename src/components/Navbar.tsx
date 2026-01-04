"use client";

import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 p-4 flex justify-center">
      <div className="w-full max-w-4xl bg-[#1a1a2e]/90 backdrop-blur-md border-b-4 border-[#4d4dff] flex items-center justify-between p-4 shadow-[0px_4px_0px_0px_rgba(77,77,255,0.3)]">
        {/* Logo/Profile Image Link */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 overflow-hidden border-2 border-[#ff4d4d] group-hover:scale-105 transition-transform">
            <img 
              src="https://api.dicebear.com/7.x/pixel-art/svg?seed=pixel" 
              alt="Home" 
              className="w-full h-full bg-gray-800"
            />
          </div>
          <span className="text-white text-[8px] sm:text-[10px] uppercase group-hover:text-[#ff4d4d] transition-colors">
            Pixel Home
          </span>
        </Link>

        {/* Contact Link */}
        <a 
          href="mailto:contact@example.com" 
          className="bg-[#ff4d4d] text-white text-[8px] sm:text-[10px] px-4 py-2 border-b-4 border-r-4 border-[#992d2d] active:border-0 active:translate-y-[4px] active:translate-x-[4px] transition-all uppercase hover:bg-[#ff6666]"
        >
          Contact
        </a>
      </div>
    </nav>
  );
};

export default Navbar;