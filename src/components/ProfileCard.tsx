"use client";

import React from 'react';
import { Twitter, Mail, MessageSquare, ChevronRight } from 'lucide-react';

const ProfileCard = () => {
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md">
      {/* Profile Section */}
      <div className="bg-[#1a1a2e]/80 backdrop-blur-md border-4 border-[#4d4dff] p-10 rounded-[40px] w-full flex flex-col items-center shadow-[8px_8px_0px_0px_rgba(77,77,255,0.3)]">
        <div className="relative w-24 h-24 mb-4">
          <div className="absolute inset-0 border-4 border-[#ff4d4d] rounded-full"></div>
          <img 
            src="https://api.dicebear.com/7.x/pixel-art/svg?seed=pixel" 
            alt="Profile" 
            className="w-full h-full p-1 bg-gray-800 rounded-full object-cover"
          />
        </div>
        
        <h1 className="text-[#ff4d4d] text-lg mb-2 font-['Press_Start_2P'] uppercase">Pixel User</h1>
        <p className="text-gray-400 text-[10px] text-center mb-6 leading-relaxed px-4">
          welcome to my space. here you can find my work and socials.
        </p>

        <div className="flex gap-4">
          <a href="#" className="p-3 bg-[#2d2d5f] hover:bg-[#3d3d7f] transition-colors border-2 border-[#4d4dff] rounded-full">
            <Twitter className="w-5 h-5 text-white" />
          </a>
          <a href="#" className="p-3 bg-[#2d2d5f] hover:bg-[#3d3d7f] transition-colors border-2 border-[#4d4dff] rounded-full">
            <MessageSquare className="w-5 h-5 text-white" />
          </a>
          <a href="#" className="p-3 bg-[#2d2d5f] hover:bg-[#3d3d7f] transition-colors border-2 border-[#4d4dff] rounded-full">
            <Mail className="w-5 h-5 text-white" />
          </a>
        </div>
      </div>

      {/* Action Sections */}
      <div className="grid grid-cols-1 gap-4 w-full px-2">
        <button className="flex items-center justify-between bg-[#1a1a2e]/80 border-4 border-[#4d4dff] py-4 px-8 rounded-full group hover:bg-[#2d2d5f] transition-all shadow-[6px_6px_0px_0px_rgba(77,77,255,0.2)]">
          <span className="text-white text-[10px] font-['Press_Start_2P'] group-hover:translate-x-1 transition-transform uppercase">Long-Form</span>
          <div className="bg-[#ff4d4d] p-1 rounded-full">
            <ChevronRight className="w-4 h-4 text-white" />
          </div>
        </button>
        
        <button className="flex items-center justify-between bg-[#1a1a2e]/80 border-4 border-[#4d4dff] py-4 px-8 rounded-full group hover:bg-[#2d2d5f] transition-all shadow-[6px_6px_0px_0px_rgba(77,77,255,0.2)]">
          <span className="text-white text-[10px] font-['Press_Start_2P'] group-hover:translate-x-1 transition-transform uppercase">Short-Form</span>
          <div className="bg-[#ff4d4d] p-1 rounded-full">
            <ChevronRight className="w-4 h-4 text-white" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;