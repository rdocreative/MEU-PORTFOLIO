"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface VideoData {
  id: string;
  title: string;
  url: string;
  customVideoUrl?: string;
}

export interface Client {
  id: string;
  name: string;
  image: string;
}

interface PortfolioConfig {
  profileName: string;
  description: string;
  subscribers: string;
  profileImage: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  cardColor: string;
  twitterUrl: string;
  discordUrl: string;
  email: string;
  clients: Client[];
  featuredVideos: VideoData[];
}

interface ConfigContextType {
  config: PortfolioConfig;
  updateLocalConfig: (updates: Partial<PortfolioConfig>) => void;
  saveConfigToDb: () => Promise<boolean>;
  isLoading: boolean;
}

const defaultConfig: PortfolioConfig = {
  profileName: 'RDO CREATIVE',
  description: 'ESPECIALISTA EM EDIÇÃO DE VÍDEO',
  subscribers: '1.2M+',
  profileImage: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop',
  primaryColor: '#FFFFFF',
  secondaryColor: '#A1A1AA',
  backgroundColor: '#000000',
  cardColor: '#0A0A0A',
  twitterUrl: '',
  discordUrl: '',
  email: '',
  clients: [],
  featuredVideos: [
    { id: '1', title: 'FEATURED_PROJECT_01', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    { id: '2', title: 'FEATURED_PROJECT_02', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
  ]
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<PortfolioConfig>(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data, error } = await supabase
          .from('portfolio_config')
          .select('*')
          .maybeSingle();

        if (data) {
          setConfig({
            profileName: data.profile_name || defaultConfig.profileName,
            description: data.description || defaultConfig.description,
            subscribers: data.subscribers || defaultConfig.subscribers,
            profileImage: data.profile_image || defaultConfig.profileImage,
            primaryColor: data.primary_color || defaultConfig.primaryColor,
            secondaryColor: data.secondary_color || defaultConfig.secondaryColor,
            backgroundColor: data.background_color || defaultConfig.backgroundColor,
            cardColor: data.card_color || defaultConfig.cardColor,
            twitterUrl: data.twitter_url || defaultConfig.twitterUrl,
            discordUrl: data.discord_url || defaultConfig.discordUrl,
            email: data.email || defaultConfig.email,
            clients: data.clients || defaultConfig.clients,
            featuredVideos: data.featured_videos || defaultConfig.featuredVideos,
          });
        }
      } catch (error) {
        console.error('Error fetching config:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const updateLocalConfig = (updates: Partial<PortfolioConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const saveConfigToDb = async () => {
    try {
      const { data: existing } = await supabase.from('portfolio_config').select('id').maybeSingle();
      
      const dbData = {
        profile_name: config.profileName,
        description: config.description,
        subscribers: config.subscribers,
        profile_image: config.profileImage,
        primary_color: config.primaryColor,
        secondary_color: config.secondaryColor,
        background_color: config.backgroundColor,
        card_color: config.cardColor,
        twitter_url: config.twitterUrl,
        discord_url: config.discordUrl,
        email: config.email,
        clients: config.clients,
        featured_videos: config.featuredVideos,
        updated_at: new Date().toISOString(),
      };

      if (existing) {
        const { error } = await supabase.from('portfolio_config').update(dbData).eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('portfolio_config').insert([dbData]);
        if (error) throw error;
      }
      return true;
    } catch (error) {
      console.error('Error saving config:', error);
      return false;
    }
  };

  return (
    <ConfigContext.Provider value={{ config, updateLocalConfig, saveConfigToDb, isLoading }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};