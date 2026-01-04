"use client";

import React, { useRef, useEffect } from 'react';
import { useConfig, VideoData } from '@/context/ConfigContext';
import { useNavigate } from 'react-router-dom';
import { Save, RotateCcw, ArrowLeft, Upload, Video, Zap, Trash2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { showSuccess, showError } from '@/utils/toast';
import { supabase } from '@/integrations/supabase/client';

const Settings = () => {
  const { config, updateConfig, resetConfig, isAdmin, isLoading } = useConfig();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate('/login');
    }
  }, [isAdmin, isLoading, navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

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

  const handleVideoUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit placeholder
        showError("VÍDEO MUITO GRANDE! LIMITE DE 5MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const newList = [...config.featuredVideos];
        newList[index] = { ...newList[index], customVideoUrl: event.target?.result as string };
        updateConfig({ featuredVideos: newList });
        showSuccess("VÍDEO CARREGADO! CLIQUE EM SALVAR.");
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCustomVideo = (index: number) => {
    const newList = [...config.featuredVideos];
    newList[index] = { ...newList[index], customVideoUrl: "" };
    updateConfig({ featuredVideos: newList });
    showSuccess("VÍDEO REMOVIDO!");
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

  if (isLoading) return <div className="min-h-screen bg-black flex items-center justify-center text-white font-['Press_Start_2P']">LOADING...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-8 font-['Press_Start_2P'] pb-24">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex items-center justify-between border-b-4 border-white pb-6">
          <button onClick={() => navigate('/')} className="hover:opacity-50 transition-opacity">
            <ArrowLeft className="w-10 h-10" />
          </button>
          <h1 className="text-lg">ADMIN_TERMINAL</h1>
          <button onClick={handleLogout} className="text-red-500 hover:text-red-400 text-[10px] flex items-center gap-2">
            <LogOut className="w-4 h-4" /> LOGOUT
          </button>
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

          {/* Configs de Cores e Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t-2 border-zinc-900 pt-6">
             <div className="space-y-2">
                <Label className="text-[10px]">COR DE FUNDO</Label>
                <div className="flex gap-2">
                  <div className="w-10 h-10 rounded border" style={{background: config.backgroundColor}}></div>
                  <Input name="backgroundColor" value={config.backgroundColor} onChange={handleChange} className="bg-black border-zinc-800" />
                </div>
             </div>
             <div className="space-y-2">
                <Label className="text-[10px]">COR PRIMÁRIA (TEXTOS/BORDAS)</Label>
                <div className="flex gap-2">
                  <div className="w-10 h-10 rounded border" style={{background: config.primaryColor}}></div>
                  <Input name="primaryColor" value={config.primaryColor} onChange={handleChange} className="bg-black border-zinc-800" />
                </div>
             </div>
          </div>

          {/* Featured Videos */}
          <div className="space-y-6 border-t-2 border-zinc-900 pt-10">
            <h2 className="text-white text-[12px] uppercase flex items-center gap-4">
              <Video className="w-5 h-5" /> Featured_Content (6 Slots)
            </h2>
            <p className="text-[8px] text-zinc-500 uppercase">Use links do YouTube ou faça upload de vídeos curtos (max 5MB) para preview.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {config.featuredVideos.map((video, index) => (
                <div key={video.id} className="p-6 border-2 border-zinc-800 rounded-3xl space-y-4 bg-black/30">
                  <div className="flex justify-between items-center">
                    <Label className="text-[8px] text-zinc-500 uppercase">Video #{index + 1}</Label>
                    {video.customVideoUrl && (
                      <button onClick={() => removeCustomVideo(index)} className="text-red-500 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <Input value={video.title} onChange={(e) => handleVideoChange(index, 'title', e.target.value, 'featured')} className="bg-black border-zinc-800 text-[8px] h-10" placeholder="TITLE" />
                  <Input value={video.url} onChange={(e) => handleVideoChange(index, 'url', e.target.value, 'featured')} className="bg-black border-zinc-800 text-[8px] h-10" placeholder="YOUTUBE URL" />
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => videoInputRefs.current[index]?.click()} 
                      className="bg-zinc-800 hover:bg-zinc-700 text-[7px] flex-1 h-10 rounded-xl"
                    >
                      {video.customVideoUrl ? "VIDEO_UPLOADED" : "UPLOAD_PREVIEW"}
                    </Button>
                    <input 
                      type="file" 
                      ref={el => videoInputRefs.current[index] = el} 
                      onChange={(e) => handleVideoUpload(index, e)} 
                      accept="video/*" 
                      className="hidden" 
                    />
                  </div>

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
          <Button onClick={() => { showSuccess("CONFIG_SAVED_TO_CLOUD!"); navigate('/'); }} className="flex-1 bg-white text-black hover:bg-zinc-300 text-[10px] h-16 rounded-full border-b-8 border-r-8 border-zinc-400">
            <Save className="mr-3 w-5 h-5" /> SAVE_CHANGES
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;