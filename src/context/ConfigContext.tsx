"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface VideoData {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
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

export interface PortfolioConfig {
  id?: string; // Adicionado ID para controle interno
  profileName: string;
  description: string;
  profileImage: string;
  profileVideo?: string;
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
  aboutText: string;
  // Visibility Flags
  showShorts: boolean;
  showClients: boolean;
  showFeaturedVideos: boolean;
  showReviews: boolean;
  showAbout: boolean;
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
  shortsVideos: [
    { id: 's1', title: 'SHORT_01', url: '' },
    { id: 's2', title: 'SHORT_02', url: '' },
    { id: 's3', title: 'SHORT_03', url: '' }
  ],
  subscribers: "0",
  reviews: [],
  aboutText: "I turn raw footage into compelling stories. With years of experience working with top creators, I understand the pacing, rhythm, and visual language needed to keep viewers watching until the very end.",
  showShorts: true,
  showClients: true,
  showFeaturedVideos: true,
  showReviews: true,
  showAbout: true
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
          // Ordena pelo ID ou criado em para pegar sempre o mesmo registro se houver mais de um
          .limit(1)
          .single();

        if (data && !error) {
          // Mapeamento explícito de snake_case (DB) para camelCase (App)
          setConfig({
            id: data.id,
            profileName: data.profile_name || defaultConfig.profileName,
            description: data.description || defaultConfig.description,
            profileImage: data.profile_image || defaultConfig.profileImage,
            profileVideo: data.profile_video,
            primaryColor: data.primary_color || defaultConfig.primaryColor,
            secondaryColor: data.secondary_color || defaultConfig.secondaryColor,
            backgroundColor: data.background_color || defaultConfig.backgroundColor,
            cardColor: data.card_color || defaultConfig.cardColor,
            twitterUrl: data.twitter_url || defaultConfig.twitterUrl,
            discordUrl: data.discord_url || defaultConfig.discordUrl,
            email: data.email || defaultConfig.email,
            subscribers: data.subscribers || defaultConfig.subscribers,
            aboutText: data.about_text || defaultConfig.aboutText,
            
            // Arrays e JSON
            clients: data.clients || [],
            featuredVideos: data.featured_videos || defaultConfig.featuredVideos,
            shortsVideos: data.shorts_videos || defaultConfig.shortsVideos,
            reviews: data.reviews || [],
            
            // Flags booleanas (usando ?? para aceitar false)
            showShorts: data.show_shorts ?? true,
            showClients: data.show_clients ?? true,
            showFeaturedVideos: data.show_featured_videos ?? true,
            showReviews: data.show_reviews ?? true,
            showAbout: data.show_about ?? true,
          });
        } else if (error && error.code !== 'PGRST116') {
          // PGRST116 significa que não encontrou nenhum registro (o que é ok, usaremos default)
          console.error("Error fetching config:", error);
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
      // Prepara objeto para o formato do banco (snake_case)
      const dbData = {
        profile_name: config.profileName,
        description: config.description,
        profile_image: config.profileImage,
        profile_video: config.profileVideo,
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
        about_text: config.aboutText,
        show_shorts: config.showShorts,
        show_clients: config.showClients,
        show_featured_videos: config.showFeaturedVideos,
        show_reviews: config.showReviews,
        show_about: config.showAbout,
        updated_at: new Date().toISOString()
      };

      let error;

      if (config.id) {
        // Se já temos um ID, atualizamos esse registro específico
        const result = await supabase
          .from('portfolio_config')
          .update(dbData)
          .eq('id', config.id);
        error = result.error;
      } else {
        // Se não temos ID, criamos um novo registro
        const result = await supabase
          .from('portfolio_config')
          .insert(dbData)
          .select()
          .single();
        
        if (result.data) {
          setConfig(prev => ({ ...prev, id: result.data.id }));
        }
        error = result.error;
      }

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