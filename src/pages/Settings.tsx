"use client";

import React, { useRef } from 'react';
import { useConfig, VideoData } from '@/context/ConfigContext';
import { useNavigate } from 'react-router-dom';
import { Save, RotateCcw, ArrowLeft, Upload, Video, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { showSuccess } from '@/utils/toast';

const Settings = () => {
  const { config, updateConfig, resetConfig } = useConfig();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateConfig({ [name]: value });
  };

  const handleVideoChange = (index: number, field: keyof VideoData, value: string, type: 'featured' | 'shorts') => {
    const listKey = type === 'featured' ? 'featuredVideos' : 'shortsVideos';
    const newList = [...config[listKey]];
    newList[index] = { ...newList[index], [field]: value };
    updateConfig({ [listKey]: newList });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateConfig({ profileImage: event.target?.result as string });
        showSuccess("FOTO CARREGADA!");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-['Press_Start_2P'] pb-24">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="flex items-center justify-between border-b-4 border-white pb-6">
          <button onClick={() => navigate('/')} className="hover:opacity-50 transition-opacity">
            <ArrowLeft className="w-10 h-10" />
          </button>
          <h1 className="text-lg">TERMINAL_CONFIG_V2</h1>
          <div className="w-10"></div>
        </div>

        <div className="space-y-10 bg-[#0a0a0a] p-10 border-4 border-white rounded-[40px]">
          {/* Profile Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
             <div className="flex flex-col items-center gap-6 p-8 border-2 border-dashed border-zinc-800 rounded-[30px] bg-black/50">
                <img src={config.profileImage} className="w-32 h-32 rounded-full border-4 border-white object-cover" alt="Preview" />
                <Button onClick={() => fileInputRef.current?.click()} className="bg-white text-black hover:bg-zinc-300 text-[8px] w-full h-12 rounded-full">
                   UPLOAD_IMAGE
                </Button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              </div>
              <div className="lg:col-span-2 space-y-6">
                <Input name="profileName" value={config.profileName} onChange={handleChange} className="bg-black border-zinc-800 text-[10px] h-14 rounded-2xl" placeholder="NAME" />
                <Textarea name="description" value={config.description} onChange={handleChange} className="bg-black border-zinc-800 text-[10px] min-h-[120px] rounded-2xl" placeholder="DESCRIPTION" />
              </div>
          </div>

          {/* Featured Videos */}
          <div className="space-y-6 border-t-2 border-zinc-900 pt-10">
            <h2 className="text-white text-[12px] uppercase flex items-center gap-4">
              <Video className="w-5 h-5" /> Featured_Content (3 Slots)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {config.featuredVideos.map((video, index) => (
                <div key={video.id} className="p-6 border-2 border-zinc-800 rounded-3xl space-y-4 bg-black/30">
                  <Label className="text-[8px] text-zinc-500 uppercase">Video #{index + 1}</Label>
                  <Input value={video.title} onChange={(e) => handleVideoChange(index, 'title', e.target.value, 'featured')} className="bg-black border-zinc-800 text-[8px] h-10" placeholder="TITLE" />
                  <Input value={video.url} onChange={(e) => handleVideoChange(index, 'url', e.target.value, 'featured')} className="bg-black border-zinc-800 text-[8px] h-10" placeholder="YOUTUBE URL" />
                  <div className="grid grid-cols-2 gap-2">
                    <Input value={video.views} onChange={(e) => handleVideoChange(index, 'views', e.target.value, 'featured')} className="bg-black border-zinc-800 text-[8px]" placeholder="VIEWS" />
                    <Input value={video.editTime} onChange={(e) => handleVideoChange(index, 'editTime', e.target.value, 'featured')} className="bg-black border-zinc-800 text-[8px]" placeholder="EDIT TIME" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shorts Videos */}
          <div className="space-y-6 border-t-2 border-zinc-900 pt-10">
            <h2 className="text-white text-[12px] uppercase flex items-center gap-4">
              <Zap className="w-5 h-5 fill-yellow-400 text-yellow-400" /> Shorts_Marquee
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {config.shortsVideos.map((video, index) => (
                <div key={video.id} className="p-4 border border-zinc-800 rounded-2xl bg-black/20 flex gap-4 items-center">
                  <span className="text-[8px] text-zinc-600">#{index+1}</span>
                  <Input value={video.url} onChange={(e) => handleVideoChange(index, 'url', e.target.value, 'shorts')} className="bg-black border-zinc-800 text-[8px] h-10" placeholder="YOUTUBE URL" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          <Button onClick={() => { showSuccess("CONFIG_SAVED!"); navigate('/'); }} className="flex-1 bg-white text-black hover:bg-zinc-300 text-[10px] h-16 rounded-full border-b-8 border-r-8 border-zinc-400">
            <Save className="mr-3 w-5 h-5" /> SAVE_CHANGES
          </Button>
          <Button onClick={resetConfig} className="bg-zinc-900 text-white hover:bg-zinc-800 text-[10px] h-16 rounded-full border-b-8 border-r-8 border-black">
            <RotateCcw className="mr-3 w-5 h-5" /> FACTORY_RESET
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;