"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface ConfigData {
  profileName: string;
  description: string;
  profileImage: string;
  primaryColor: string; // Ex: #4d4dff
  secondaryColor: string; // Ex: #ff4d4d
  backgroundColor: string; // Ex: #0f0f1a
  cardColor: string; // Ex: #1a1a2e
  twitterUrl: string;
  discordUrl: string;
  email: string;
  longFormText: string;
  shortFormText: string;
}

const defaultConfig: ConfigData = {
  profileName: "Pixel User",
  description: "welcome to my space. here you can find my work and socials.",
  profileImage: "https://api.dicebear.com/7.x/pixel-art/svg?seed=pixel",
  primaryColor: "#4d4dff",
  secondaryColor: "#ff4d4d",
  backgroundColor: "#0f0f1a",
  cardColor: "#1a1a2e",
  twitterUrl: "#",
  discordUrl: "#",
  email: "contact@example.com",
  longFormText: "Long-Form",
  shortFormText: "Short-Form",
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
    // Aplicar cor de fundo ao body
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