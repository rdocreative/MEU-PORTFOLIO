"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface VideoData {
  id: string;
  title: string;
  url: string; // YouTube URL
  customVideoUrl?: string; // Direct video file URL (uploaded)
  thumbnail?: string;
}

export interface Client {
  id: string;
  name: string;
  image: string;
  subscribers?: string; // Campo novo para número de inscritos
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
  shortsVideos: VideoData[]; // Keeping for backward compatibility if needed, though we seem to focus on featuredVideos
}

const defaultConfig: PortfolioConfig = {
  profileName: 'RDO',
  description: 'VIDEO EDITOR // VISUAL ARTIST',
  profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
  primaryColor: '#ffffff',
  secondaryColor: '#a1a1aa',
  backgroundColor: '#000000',
  cardColor: '#18181b',
  twitterUrl: '',
  discordUrl: '',
  email: '',
  clients: [
    { id: '1', name: 'CREATOR ONE', image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop', subscribers: '1M' },
    { id: '2', name: 'CREATOR TWO', image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop', subscribers: '500K' },
    { id: '3', name: 'CREATOR THREE', image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&h=200&fit=crop', subscribers: '2.5M' }
  ],
  featuredVideos: [
    { id: '1', title: 'PROJECT ALPHA', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    { id: '2', title: 'PROJECT BETA', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    { id: '3', title: 'PROJECT GAMMA', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    { id: '4', title: 'PROJECT DELTA', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
  ],
  shortsVideos: []
};

interface ConfigContextType {
  config: PortfolioConfig;
  updateLocalConfig: (updates: Partial<PortfolioConfig>) => void;
  saveConfigToDb: () => Promise<boolean>;
  isLoading: boolean;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<PortfolioConfig>(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);
  const [dbId, setDbId] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data, error } = await supabase
          .from('portfolio_config')
          .select('*')
          .single(); // Assuming single user/config for now or modify to filter by user

        if (error) {
          console.error('Error fetching config:', error);
          setIsLoading(false);
          return;
        }

        if (data) {
          setDbId(data.id);
          // Parse JSON fields safely
          const clients = typeof data.clients === 'string' ? JSON.parse(data.clients) : data.clients;
          const featuredVideos = typeof data.featured_videos === 'string' ? JSON.parse(data.featured_videos) : data.featured_videos;
          const shortsVideos = typeof data.shorts_videos === 'string' ? JSON.parse(data.shorts_videos) : data.shorts_videos;

          setConfig({
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
            clients: Array.isArray(clients) ? clients : defaultConfig.clients,
            featuredVideos: Array.isArray(featuredVideos) ? featuredVideos : defaultConfig.featuredVideos,
            shortsVideos: Array.isArray(shortsVideos) ? shortsVideos : defaultConfig.shortsVideos,
          });
        }
      } catch (err) {
        console.error('Unexpected error:', err);
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
      const configToSave = {
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
        clients: config.clients, // Supabase handles JSON automatically
        featured_videos: config.featuredVideos,
        shorts_videos: config.shortsVideos,
        updated_at: new Date().toISOString()
      };

      if (dbId) {
        const { error } = await supabase
          .from('portfolio_config')
          .update(configToSave)
          .eq('id', dbId);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('portfolio_config')
          .insert([configToSave]);
        
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