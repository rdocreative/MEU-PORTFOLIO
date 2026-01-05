"use client";

import React from 'react';
import ProfileHeader from '@/components/ProfileHeader';
import FeaturedVideos from '@/components/FeaturedVideos';
import ShortsSection from '@/components/ShortsSection';
import ClientsSection from '@/components/ClientsSection';
import Footer from '@/components/Footer';
import { useConfig } from '@/context/ConfigContext';

const Index = () => {
  const { config } = useConfig();

  return (
    <div 
      className="min-h-screen flex flex-col items-center px-4 py-8 md:py-16 gap-16 md:gap-24 transition-colors duration-500"
      style={{ backgroundColor: config.backgroundColor || '#0a0a0a' }}
    >
      <ProfileHeader />
      
      <main className="w-full flex flex-col items-center gap-20 md:gap-32">
        <FeaturedVideos />
        
        <div className="w-full flex flex-col items-center -mt-12 md:-mt-20">
          <ClientsSection />
        </div>

        <ShortsSection />
      </main>

      <Footer />
    </div>
  );
};

export default Index;