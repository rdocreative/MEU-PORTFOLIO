"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useConfig } from "@/context/ConfigContext";

const ClientsSection = () => {
  const { config } = useConfig();
  const clients = config.clients || [];

  if (clients.length === 0) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <div className="w-full flex flex-col items-center gap-12">
      <motion.h3 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        style={{ color: config.primaryColor }}
        className="text-xs md:text-sm font-['Press_Start_2P'] uppercase tracking-[0.3em] opacity-40"
      >
        Trusted by
      </motion.h3>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
      >
        {clients.map((client, index) => (
          <motion.div 
            key={index} 
            variants={itemVariants}
            className="flex flex-col items-center gap-4 group cursor-default"
          >
            {client.logo ? (
              <img 
                src={client.logo} 
                alt={client.name} 
                className="h-8 md:h-12 w-auto object-contain transition-all duration-300 group-hover:scale-110 group-hover:filter group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
              />
            ) : (
              <span className="text-white/60 font-bold text-lg md:text-xl tracking-tighter transition-all duration-300 group-hover:text-white group-hover:scale-105">
                {client.name}
              </span>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ClientsSection;