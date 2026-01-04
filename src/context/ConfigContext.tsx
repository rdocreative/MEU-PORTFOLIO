"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Client {
  id: string;
  image: string;
  name: string;
}

export interface VideoData {
  id: string;
  title: string;
  url: string;
  views?: string;
  editTime?: string;
  deliveryTime?: string;
}

interface ConfigData {
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

const defaultFeatured: VideoData[] = Array.from({ length: 3 }).map((_, i) => ({
  id: `f${i + 1}`,
  title: "PROJECT_NAME",
  url: "",
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
  updateConfig: (newConfig: Partial<ConfigData>) => void;
  resetConfig: () => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<ConfigData>(() => {
    const saved = localStorage.getItem('pixel-site-config-v2');
    return saved ? JSON.parse(saved) : defaultConfig;
  });

  useEffect(() => {
    localStorage.setItem('pixel-site-config-v2', JSON.stringify(config));
    document.body.style.backgroundColor = config.backgroundColor;
  }, [config]);

  const updateConfig = (newConfig: Partial<ConfigData>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
  };

  return (
    <ConfigContext.Provider value={{ config, updateConfig, resetConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) throw new Error("useConfig must be used within ConfigProvider");
  return context;
};