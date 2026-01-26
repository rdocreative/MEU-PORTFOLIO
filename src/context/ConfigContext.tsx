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
  subscribers?: string;
}

export interface ReviewImage {
  id: string;
  url: string;
}

interface PortfolioConfig {
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
  shortsVideos: VideoData[];
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
  description: "HIGH PERFORMANCE VIDEO EDITOR",
  profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop",
  primaryColor: "#ffffff",
  secondaryColor: "#71717a",
  backgroundColor: "#000000",
  cardColor: "#0a0a0a",
  twitterUrl: "",
  discordUrl: "",
  email: "",
  clients: [],
  featuredVideos: [],
  shortsVideos: [],
  subscribers: "0",
  reviews: []
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
          .limit(1)
          .maybeSingle();

        if (data) {
          setConfig({
            ...defaultConfig,
            profileName: data.profile_name || defaultConfig.profileName,
            description: data.description || defaultConfig.description,
            profileImage: data.profile_image || defaultConfig.profileImage,
            primaryColor: data.primary_color || defaultConfig.primaryColor,
            secondaryColor: data.secondary_color || defaultConfig.secondaryColor,
            backgroundColor: data.background_color || defaultConfig.backgroundColor,
            cardColor: data.card_color || defaultConfig.cardColor,
            twitterUrl: data.twitter_url || defaultConfig.twitterUrl,
            discordUrl: data.discord_url || defaultConfig.discordUrl,
            email: data.email || defaultConfig.email,
            clients: (data.clients as unknown as Client[]) || [],
            featuredVideos: (data.featured_videos as unknown as VideoData[]) || [],
            shortsVideos: (data.shorts_videos as unknown as VideoData[]) || [],
            subscribers: data.subscribers || "0",
            reviews: (data.reviews as unknown as ReviewImage[]) || []
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
      // Verifica se existe algum registro
      const { data: existingData, error: fetchError } = await supabase
        .from('portfolio_config')
        .select('id')
        .limit(1)
        .maybeSingle();

      if (fetchError) {
        console.error("Error fetching existing config:", fetchError);
        return false;
      }
      
      const payload = {
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
        subscribers: config.subscribers,
        reviews: config.reviews
      };

      let error;

      if (existingData?.id) {
        // Atualiza
        const result = await supabase
          .from('portfolio_config')
          .update(payload)
          .eq('id', existingData.id);
        error = result.error;
      } else {
        // Insere novo
        const result = await supabase
          .from('portfolio_config')
          .insert([payload]);
        error = result.error;
      }

      if (error) {
        console.error("Error saving to DB:", error);
        return false;
      }

      return true;
    } catch (err) {
      console.error("Exception saving:", err);
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