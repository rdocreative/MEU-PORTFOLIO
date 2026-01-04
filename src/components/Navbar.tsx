"use client";

import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed top-6 left-0 w-full z-50 px-4 flex justify-center">
      <div className="w-full max-w-2xl bg-[#1a1a2e]/90 backdrop-blur-md border-4 border-[#4d4dff] flex items-center justify-between p-3 rounded-full shadow-[0px_4px_0px_0px_rgba(77,77,255,0.3)]">
        {/* Logo/Profile Image Link */}
        <Link to="/" className="flex items-center gap-3 group ml-2">
          <div className="relative w-10 h-10 overflow-hidden border-2 border-[#ff4d4d] rounded-full group-hover:scale-105 transition-transform">
            <img 
              src="https://api.dicebear.com/7.x/pixel-art/svg?seed=pixel" 
              alt="Home" 
              className="w-full h-full bg-gray-800"
            />
          </div>
          <span className="text-white text-[8px] uppercase group-hover:text-[#ff4d4d] transition-colors hidden sm:block">
            Pixel Home
          </span>
        </Link>

        {/* Contact Link */}
        <a 
          href="mailto:contact@example.com" 
          className="bg-[#ff4d4d] text-white text-[8px] px-6 py-2 border-b-4 border-r-4 border-[#992d2d] rounded-full active:border-0 active:translate-y-[2px] active:translate-x-[2px] transition-all uppercase hover:bg-[#ff6666] mr-2"
        >
          Contact
        </a>
      </div>
    </nav>
  );
};

export default Navbar;