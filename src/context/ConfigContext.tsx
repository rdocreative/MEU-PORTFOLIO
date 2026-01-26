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
          .single();

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
            clients: data.clients || [],
            featuredVideos: data.featured_videos || [],
            shortsVideos: data.shorts_videos || [],
            subscribers: data.subscribers || "0",
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
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return false;

      // Primeiro verifica se existe um registro
      const { data: existingData } = await supabase
        .from('portfolio_config')
        .select('id')
        .single();

      let error;
      
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

      if (existingData) {
        const result = await supabase
          .from('portfolio_config')
          .update(payload)
          .eq('id', existingData.id);
        error = result.error;
      } else {
        const result = await supabase
          .from('portfolio_config')
          .insert([payload]);
        error = result.error;
      }

      if (error) {
        console.error("Error saving:", error);
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