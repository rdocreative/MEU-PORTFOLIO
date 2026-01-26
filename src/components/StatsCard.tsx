"use client";

import React from 'react';

interface StatsCardProps {
  label: string;
  value: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value }) => {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 px-6 py-2 rounded-full flex items-center gap-3 shadow-lg">
      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      <div className="flex items-baseline gap-2">
        <span className="text-sm font-bold tracking-tight text-white">{value}</span>
        <span className="text-[8px] font-black uppercase tracking-widest opacity-40">{label}</span>
      </div>
    </div>
  );
};

export default StatsCard;