"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
  updateLocalConfig: (newConfig: Partial<ConfigData>) => void;
  saveConfigToDb: () => Promise<boolean>;
  resetConfig: () => void;
  isLoading: boolean;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'pixel_profile_draft';

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<ConfigData>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        return saved ? JSON.parse(saved) : defaultConfig;
      } catch (e) {
        return defaultConfig;
      }
    }
    return defaultConfig;
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data, error } = await supabase
          .from('portfolio_config')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          const loadedConfig = {
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
          };
          
          setConfig(loadedConfig);
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(loadedConfig));
          } catch (e) {}
          document.body.style.backgroundColor = loadedConfig.backgroundColor;
        }
      } catch (error) {
        console.error('Error fetching config:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.warn("LocalStorage quota exceeded. Draft not saved locally.");
    }
    if (config.backgroundColor) {
      document.body.style.backgroundColor = config.backgroundColor;
    }
  }, [config]);

  const updateLocalConfig = (newConfig: Partial<ConfigData>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const saveConfigToDb = async () => {
    try {
      const dbPayload = {
        profile_name: config.profileName,
        description: config.description,
        profile_image: config.profileImage,
        primary_color: config.primaryColor,
        secondary_color: config.secondaryColor,
        background_color: config.backgroundColor,
        card_color: config.cardColor || '#111111',
        twitter_url: config.twitterUrl,
        discord_url: config.discordUrl,
        email: config.email,
        clients: config.clients,
        featured_videos: config.featuredVideos,
        shorts_videos: config.shortsVideos,
        updated_at: new Date().toISOString()
      };

      let result;
      if (config.id) {
        result = await supabase
          .from('portfolio_config')
          .update(dbPayload)
          .eq('id', config.id);
      } else {
        result = await supabase
          .from('portfolio_config')
          .insert([dbPayload])
          .select()
          .single();
      }

      if (result.error) {
        console.error('Supabase error:', result.error);
        throw result.error;
      }
      
      if (!config.id && 'data' in result && result.data) {
        setConfig(prev => ({ ...prev, id: result.data.id }));
      }
      
      return true;
    } catch (error) {
      console.error('Error saving config:', error);
      return false;
    }
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  return (
    <ConfigContext.Provider value={{ 
      config, 
      updateLocalConfig, 
      saveConfigToDb,
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