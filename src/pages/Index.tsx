"use client";

import React, { useEffect } from 'react';
import ProfileCard from '@/components/ProfileCard';
import VideoSection from '@/components/VideoSection';
import ShortsSection from '@/components/ShortsSection';
import SocialLinks from '@/components/SocialLinks';
import { useConfig } from '@/context/ConfigContext';
import { useUpdatePortfolioConfig } from '@/integrations/supabase/mutation';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { config } = useConfig();
  const updateConfig = useUpdatePortfolioConfig();

  // Função para atualizar o link do Twitter
  const handleUpdateTwitter = () => {
    updateConfig.mutate({
      twitter_url: "https://x.com/rdocreative0"
    });
  };

  // Se o link já estiver correto, não mostramos o botão de atualização.
  const isTwitterLinkCorrect = config.twitterUrl === "https://x.com/rdocreative0";

  return (
    <div 
      style={{ backgroundColor: config.backgroundColor }} 
      className="min-h-screen flex flex-col items-center pt-16 md:pt-24 pb-16 relative overflow-hidden"
    >
      <div className="absolute inset-0 z-0 opacity-10" style={{ 
        backgroundImage: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }} />

      <ProfileCard />
      
      <VideoSection />
      
      <ShortsSection />

      <SocialLinks />

      {/* Botão temporário para executar a atualização do link do Twitter */}
      {!isTwitterLinkCorrect && (
        <div className="mt-10 z-50">
          <Button onClick={handleUpdateTwitter} disabled={updateConfig.isPending}>
            {updateConfig.isPending ? 'Atualizando...' : 'Atualizar Link do Twitter para X'}
          </Button>
          <p className="text-xs text-white/50 mt-2">Clique para aplicar a mudança no banco de dados.</p>
        </div>
      )}
    </div>
  );
};

export default Index;