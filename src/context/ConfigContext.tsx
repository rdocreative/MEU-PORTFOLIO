"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Client {
  id: string;
  image: string;
  name: string;
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
  shortFormText: string;
  clients: Client[];
}

const defaultConfig: ConfigData = {
  profileName: "PIXEL OBSERVER",
  description: "lost in the digital void. searching for bits and stars.",
  profileImage: "https://api.dicebear.com/7.x/pixel-art/svg?seed=void",
  primaryColor: "#ffffff", 
  secondaryColor: "#a1a1aa", 
  backgroundColor: "#000000", 
  cardColor: "#0a0a0a", 
  twitterUrl: "#",
  discordUrl: "#",
  email: "void@example.com",
  longFormText: "LOG_ENTRY",
  shortFormText: "SIGNAL_LOST",
  clients: [
    { id: '1', name: 'Client 1', image: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=1' },
    { id: '2', name: 'Client 2', image: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=2' },
  ],
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
    return saved ? JSON.parse(saved) : defaultConfig;
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