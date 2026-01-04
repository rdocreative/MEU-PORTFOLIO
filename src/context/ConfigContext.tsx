"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Client {
  id: string;
  image: string;
  name: string;
}

export interface VideoData {
  id: string;
  title: string;
  url: string;
  customVideoUrl?: string;
  views?: string;
  editTime?: string;
  deliveryTime?: string;
}

interface ConfigData {
  id?: string;
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
}

const defaultFeatured: VideoData[] = Array.from({ length: 6 }).map((_, i) => ({
  id: `f${i + 1}`,
  title: "PROJECT_NAME",
  url: "",
  customVideoUrl: "",
  views: "1.2M VIEWS",
  editTime: "12H EDIT",
  deliveryTime: "24H DELIVERY"
}));

const defaultShorts: VideoData[] = Array.from({ length: 6 }).map((_, i) => ({
  id: `s${i + 1}`,
  title: "",
  url: ""
}));

const defaultConfig: ConfigData = {
  profileName: "PIXEL OBSERVER",
  description: "lost in the digital void. searching for bits and stars.",
  profileImage: "https://api.dicebear.com/7.x/pixel-art/svg?seed=void",
  primaryColor: "#ffffff", 
  secondaryColor: "#a1a1aa", 
  backgroundColor: "#0a0a0a", 
  cardColor: "#111111", 
  twitterUrl: "https://twitter.com",
  discordUrl: "https://discord.com",
  email: "void@example.com",
  clients: [],
  featuredVideos: defaultFeatured,
  shortsVideos: defaultShorts,
};

interface ConfigContextType {
  config: ConfigData;
  updateConfig: (newConfig: Partial<ConfigData>) => Promise<void>;
  resetConfig: () => void;
  isLoading: boolean;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<ConfigData>(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Config from DB
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data, error } = await supabase
          .from('portfolio_config')
          .select('*')
          .limit(1)
          .single();

        if (error) throw error;

        if (data) {
          setConfig({
            id: data.id,
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
            featuredVideos: (data.featured_videos as unknown as VideoData[]) || defaultFeatured,
            shortsVideos: (data.shorts_videos as unknown as VideoData[]) || defaultShorts,
          });
          document.body.style.backgroundColor = data.background_color || defaultConfig.backgroundColor;
        }
      } catch (error) {
        console.error('Error fetching config:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const updateConfig = async (newConfig: Partial<ConfigData>) => {
    const updatedState = { ...config, ...newConfig };
    setConfig(updatedState);
    document.body.style.backgroundColor = updatedState.backgroundColor;

    try {
      const dbPayload = {
        profile_name: updatedState.profileName,
        description: updatedState.description,
        profile_image: updatedState.profileImage,
        primary_color: updatedState.primaryColor,
        secondary_color: updatedState.secondaryColor,
        background_color: updatedState.backgroundColor,
        card_color: updatedState.cardColor,
        twitter_url: updatedState.twitterUrl,
        discord_url: updatedState.discordUrl,
        email: updatedState.email,
        clients: updatedState.clients,
        featured_videos: updatedState.featured_videos,
        shorts_videos: updatedState.shorts_videos,
      };

      const { error } = await supabase
        .from('portfolio_config')
        .update(dbPayload)
        .eq('id', config.id || '');

      if (error) throw error;
      
    } catch (error) {
      console.error('Error saving config:', error);
      toast.error("Failed to save changes to the server.");
    }
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
  };

  return (
    <ConfigContext.Provider value={{ 
      config, 
      updateConfig, 
      resetConfig, 
      isLoading
    }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) throw new Error("useConfig must be used within ConfigProvider");
  return context;
};