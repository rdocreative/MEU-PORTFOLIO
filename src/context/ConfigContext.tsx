"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface VideoData {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
}

export interface Client {
  id: string;
  name: string;
  image: string;
  subscribers?: string;
}

export interface ReviewImage {
  id: string;
  url: string;
}

export interface PortfolioConfig {
  profileName: string;
  description: string;
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
  shortsVideos: VideoData[]; // Adicionado campo para Shorts
  subscribers: string;
  reviews: ReviewImage[];
}

interface ConfigContextType {
  config: PortfolioConfig;
  updateLocalConfig: (updates: Partial<PortfolioConfig>) => void;
  saveConfigToDb: () => Promise<boolean>;
  isLoading: boolean;
}

const defaultConfig: PortfolioConfig = {
  profileName: "EDITOR_NAME",
  description: "Specialized in high-retention video editing for top-tier creators.",
  profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop",
  primaryColor: "#ffffff",
  secondaryColor: "#71717a",
  backgroundColor: "#000000",
  cardColor: "#09090b",
  twitterUrl: "",
  discordUrl: "",
  email: "",
  clients: [],
  featuredVideos: [
    { id: '1', title: 'FEATURED_01', url: '' },
    { id: '2', title: 'FEATURED_02', url: '' }
  ],
  shortsVideos: [ // Inicializando com 3 slots vazios
    { id: 's1', title: 'SHORT_01', url: '' },
    { id: 's2', title: 'SHORT_02', url: '' },
    { id: 's3', title: 'SHORT_03', url: '' }
  ],
  subscribers: "0",
  reviews: []
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: ({ children }: { children: React.ReactNode }) => React.JSX.Element = ({ children }) => {
  const [config, setConfig] = useState<PortfolioConfig>(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data, error } = await supabase
          .from('portfolio_config')
          .select('*')
          .single();

        if (data && !error) {
          setConfig({
            ...defaultConfig,
            ...data,
            clients: data.clients || [],
            featuredVideos: data.featured_videos || defaultConfig.featuredVideos,
            shortsVideos: data.shorts_videos || defaultConfig.shortsVideos,
            reviews: data.reviews || []
          });
        }
      } catch (err) {
        console.error("Error fetching config:", err);
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
      const dbData = {
        profile_name: config.profileName,
        description: config.description,
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
        shorts_videos: config.shortsVideos,
        reviews: config.reviews,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('portfolio_config')
        .update(dbData)
        .eq('id', '61d9a56c-0f9c-4e8a-861c-8e4040578672'); // ID fixo para este portfólio

      if (error) throw error;
      return true;
    } catch (err) {
      console.error("Error saving config:", err);
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
  if (!context) throw new Error("useConfig must be used within ConfigProvider");
  return context;
};