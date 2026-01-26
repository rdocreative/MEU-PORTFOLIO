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

interface Config {
  profileName: string;
  description: string;
  profileImage: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  card_color: string;
  twitterUrl: string;
  discordUrl: string;
  email: string;
  clients: Client[];
  featuredVideos: VideoData[];
  reviews: string[]; // Novo campo para os prints
}

interface ConfigContextType {
  config: Config;
  updateLocalConfig: (updates: Partial<Config>) => void;
  saveConfigToDb: () => Promise<boolean>;
  isLoading: boolean;
}

const defaultConfig: Config = {
  profileName: "EDITOR NAME",
  description: "High-end video editor for creators.",
  profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop",
  primaryColor: "#ffffff",
  secondaryColor: "#71717a",
  backgroundColor: "#000000",
  card_color: "#0a0a0a",
  twitterUrl: "",
  discordUrl: "",
  email: "",
  clients: [],
  featuredVideos: [],
  reviews: ["", "", "", "", "", ""] // 6 slots vazios
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
  const [config, setConfig] = useState<Config>(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      const { data, error } = await supabase
        .from('portfolio_config')
        .select('*')
        .single();

      if (data && !error) {
        // Garante que reviews tenha sempre 6 posições
        const reviews = Array.isArray(data.reviews) ? data.reviews : [];
        while (reviews.length < 6) reviews.push("");
        
        setConfig({
          ...data,
          profileName: data.profile_name || defaultConfig.profileName,
          clients: data.clients || [],
          featuredVideos: data.featured_videos || [],
          reviews: reviews.slice(0, 6)
        });
      }
      setIsLoading(false);
    };

    fetchConfig();
  }, []);

  const updateLocalConfig = (updates: Partial<Config>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const saveConfigToDb = async () => {
    const { error } = await supabase
      .from('portfolio_config')
      .update({
        profile_name: config.profileName,
        description: config.description,
        profile_image: config.profileImage,
        primary_color: config.primaryColor,
        secondary_color: config.secondaryColor,
        background_color: config.backgroundColor,
        card_color: config.card_color,
        twitter_url: config.twitterUrl,
        discord_url: config.discordUrl,
        email: config.email,
        clients: config.clients,
        featured_videos: config.featuredVideos,
        reviews: config.reviews
      })
      .eq('id', (await supabase.from('portfolio_config').select('id').single()).data?.id);

    return !error;
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