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
  subscribers: "0"
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
            ...data,
            // Garantindo que campos JSON sejam arrays se vierem nulos
            clients: data.clients || [],
            featuredVideos: data.featured_videos || [],
            shortsVideos: data.shorts_videos || [],
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
      const { error } = await supabase
        .from('portfolio_config')
        .update({
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
          subscribers: config.subscribers
        })
        .eq('id', (await supabase.from('portfolio_config').select('id').single()).data?.id);

      return !error;
    } catch (err) {
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