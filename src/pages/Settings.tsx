"use client";

import React, { useRef } from 'react';
import { useConfig, Client, VideoData } from '@/context/ConfigContext';
import { useNavigate } from 'react-router-dom';
import { Save, RotateCcw, ArrowLeft, Upload, Plus, Trash2, Link as LinkIcon, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { showSuccess, showError } from '@/utils/toast';

const Settings = () => {
  const { config, updateConfig, resetConfig } = useConfig();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const clientInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateConfig({ [name]: value });
  };

  const handleVideoChange = (index: number, field: keyof VideoData, value: string) => {
    const newVideos = [...config.videos];
    newVideos[index] = { ...newVideos[index], [field]: value };
    updateConfig({ videos: newVideos });
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

  const handleAddClient = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newClient: Client = {
          id: Date.now().toString(),
          name: 'New Client',
          image: event.target?.result as string
        };
        updateConfig({ clients: [...(config.clients || []), newClient] });
        showSuccess("CLIENTE ADICIONADO!");
      };
      reader.readAsDataURL(file);
    }
  };

  const removeClient = (id: string) => {
    updateConfig({ clients: config.clients.filter(c => c.id !== id) });
    showSuccess("CLIENTE REMOVIDO.");
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-['Press_Start_2P'] pb-24">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="flex items-center justify-between border-b-4 border-white pb-6">
          <button onClick={() => navigate('/')} className="hover:opacity-50 transition-opacity">
            <ArrowLeft className="w-10 h-10" />
          </button>
          <h1 className="text-lg">TERMINAL_CONFIG</h1>
          <div className="w-10"></div>
        </div>

        <div className="space-y-10 bg-[#0a0a0a] p-10 border-4 border-white rounded-[30px]">
          {/* Profile Section */}
          <div className="space-y-6">
            <h2 className="text-zinc-500 text-[12px] uppercase flex items-center gap-2">
              <div className="w-2 h-2 bg-white animate-pulse"></div> Profile_Info
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col items-center gap-6 p-6 border-2 border-dashed border-zinc-700 rounded-2xl bg-black/50">
                <img src={config.profileImage} className="w-24 h-24 rounded-full border-2 border-white object-cover" alt="Preview" />
                <Button onClick={() => fileInputRef.current?.click()} className="bg-white text-black hover:bg-zinc-300 text-[8px] w-full h-10">
                  <Upload className="mr-2 w-4 h-4" /> UPLOAD_IMAGE
                </Button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              </div>
              <div className="space-y-4">
                <Input name="profileName" value={config.profileName} onChange={handleChange} className="bg-black border-zinc-800 text-[10px]" placeholder="NAME" />
                <Textarea name="description" value={config.description} onChange={handleChange} className="bg-black border-zinc-800 text-[10px] min-h-[80px]" placeholder="DESCRIPTION" />
              </div>
            </div>
          </div>

          {/* Videos Section */}
          <div className="space-y-6 border-t-2 border-zinc-900 pt-8">
            <h2 className="text-zinc-500 text-[12px] uppercase flex items-center gap-2">
              <Video className="w-4 h-4" /> Long_Form_Videos (6 Slots)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {config.videos.map((video, index) => (
                <div key={video.id} className="p-5 border-2 border-zinc-800 rounded-2xl space-y-3 bg-black/30">
                  <Label className="text-[8px] text-zinc-500 uppercase">Video #{index + 1}</Label>
                  <Input 
                    value={video.title} 
                    onChange={(e) => handleVideoChange(index, 'title', e.target.value)}
                    className="bg-black border-zinc-800 text-[10px]" 
                    placeholder="VIDEO TITLE" 
                  />
                  <Input 
                    value={video.url} 
                    onChange={(e) => handleVideoChange(index, 'url', e.target.value)}
                    className="bg-black border-zinc-800 text-[10px]" 
                    placeholder="YOUTUBE URL" 
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Rest of the settings... */}
          <div className="space-y-6 border-t-2 border-zinc-900 pt-8">
            <h2 className="text-zinc-500 text-[12px] uppercase">Client_Logos</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {config.clients?.map((client) => (
                <div key={client.id} className="relative group">
                  <div className="w-full aspect-square bg-zinc-900 border-2 border-zinc-800 rounded-xl flex items-center justify-center p-4">
                    <img src={client.image} alt={client.name} className="max-w-full max-h-full object-contain" />
                  </div>
                  <button onClick={() => removeClient(client.id)} className="absolute -top-2 -right-2 bg-red-600 p-1.5 rounded-full hover:bg-red-700 transition-colors">
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
              <button onClick={() => clientInputRef.current?.click()} className="aspect-square bg-zinc-900 border-2 border-dashed border-zinc-700 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-zinc-800 transition-all text-zinc-500 hover:text-white">
                <Plus className="w-6 h-6" />
                <span className="text-[8px]">ADD_NEW</span>
              </button>
              <input type="file" ref={clientInputRef} onChange={handleAddClient} accept="image/*" className="hidden" />
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          <Button onClick={() => navigate('/')} className="flex-1 bg-white text-black hover:bg-zinc-300 text-[10px] h-16 rounded-full border-b-4 border-r-4 border-zinc-400">
            <Save className="mr-3 w-5 h-5" /> SAVE_CHANGES
          </Button>
          <Button onClick={resetConfig} className="bg-zinc-900 text-white hover:bg-zinc-800 text-[10px] h-16 rounded-full border-b-4 border-r-4 border-black">
            <RotateCcw className="mr-3 w-5 h-5" /> FACTORY_RESET
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;