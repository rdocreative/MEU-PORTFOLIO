"use client";

import React from 'react';

interface StatsCardProps {
  label: string;
  value: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value }) => {
  return (
    <div className="bg-white/5 border border-white/10 px-8 py-4 rounded-2xl flex flex-col items-center">
      <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">{label}</span>
      <span className="text-2xl font-black tracking-tighter">{value}</span>
    </div>
  );
};

export default StatsCard;