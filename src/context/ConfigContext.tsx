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
  longFormText: string;
  longFormUrl: string;
  shortFormText: string;
  shortFormUrl: string;
  clients: Client[];
  videos: VideoData[];
}

const defaultVideos: VideoData[] = Array.from({ length: 6 }).map((_, i) => ({
  id: `${i + 1}`,
  title: `VIDEO_SIGNAL_0${i + 1}`,
  url: ""
}));

const defaultConfig: ConfigData = {
  profileName: "PIXEL OBSERVER",
  description: "lost in the digital void. searching for bits and stars.",
  profileImage: "https://api.dicebear.com/7.x/pixel-art/svg?seed=void",
  primaryColor: "#ffffff", 
  secondaryColor: "#a1a1aa", 
  backgroundColor: "#000000", 
  cardColor: "#0a0a0a", 
  twitterUrl: "https://twitter.com",
  discordUrl: "https://discord.com",
  email: "void@example.com",
  longFormText: "PORTFOLIO",
  longFormUrl: "#videos",
  shortFormText: "COMMISSIONS",
  shortFormUrl: "#",
  clients: [],
  videos: defaultVideos,
};

interface ConfigContextType {
  config: ConfigData;
  updateConfig: (newConfig: Partial<ConfigData>) => void;
  resetConfig: () => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<ConfigData>(() => {
    const saved = localStorage.getItem('pixel-site-config');
    const parsed = saved ? JSON.parse(saved) : defaultConfig;
    // Garante que sempre existam 6 slots de vídeo
    if (parsed.videos?.length !== 6) parsed.videos = defaultVideos;
    return parsed;
  });

  useEffect(() => {
    localStorage.setItem('pixel-site-config', JSON.stringify(config));
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