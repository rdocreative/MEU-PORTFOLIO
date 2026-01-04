"use client";

import React, { useState } from 'react';
import ProfileCard from "@/components/ProfileCard";
import Navbar from "@/components/Navbar";
import StarsBackground from "@/components/StarsBackground";
import ClientsSection from "@/components/ClientsSection";
import VideoSection from "@/components/VideoSection";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { useConfig } from "@/context/ConfigContext";
import { ArrowLeft } from 'lucide-react';

const Index = () => {
  const { config } = useConfig();
  const [activeTab, setActiveTab] = useState<'home' | 'videos'>('home');

  return (
    <div 
      style={{ backgroundColor: config.backgroundColor }}
      className="min-h-screen flex flex-col items-center p-4 font-['Press_Start_2P'] relative overflow-hidden transition-colors duration-500"
    >
      {/* Estrelas de Fundo */}
      <StarsBackground />

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="z-10 w-full flex flex-col items-center mt-32 mb-20 max-w-4xl">
        {activeTab === 'home' ? (
          <div className="w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
            <ProfileCard onLongFormClick={() => setActiveTab('videos')} />
            <ClientsSection />
          </div>
        ) : (
          <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-500">
            <button 
              onClick={() => setActiveTab('home')}
              style={{ 
                color: config.primaryColor, 
                borderColor: config.primaryColor,
                backgroundColor: `${config.cardColor}cc`
              }}
              className="mb-12 flex items-center gap-4 text-[10px] uppercase hover:scale-105 transition-all self-start ml-4 border-4 p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]"
            >
              <ArrowLeft className="w-4 h-4" /> Back_To_Profile
            </button>
            
            <div className="w-full flex flex-col items-center gap-4 mb-10">
              <h2 style={{ color: config.primaryColor }} className="text-xl uppercase tracking-tighter">
                Long_Form_Content
              </h2>
              <div style={{ backgroundColor: config.secondaryColor }} className="w-20 h-1 opacity-30"></div>
            </div>

            <VideoSection />
          </div>
        )}
      </main>

      <footer className="mt-auto pb-8 z-10 opacity-30 hover:opacity-100 transition-opacity">
        <MadeWithDyad />
      </footer>
    </div>
  );
};

export default Index;