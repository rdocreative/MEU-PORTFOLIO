"use client";

import React, { useRef, useState } from 'react';
import { useConfig, VideoData, Client } from '@/context/ConfigContext';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Video, Trash2, Loader2, Wand2, AlertTriangle, UploadCloud, Users, Plus, X, Globe, Mail, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { supabase } from '@/integrations/supabase/client';

const Settings = () => {
  const { config, updateLocalConfig, saveConfigToDb, isLoading } = useConfig();
  const [isSaving, setIsSaving] = useState(false);
  const [processingIndex, setProcessingIndex] = useState<number | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const clientInputRef = useRef<HTMLInputElement>(null);
  const videoInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const ffmpegRef = useRef(new FFmpeg());
  const isLoadedRef = useRef(false);

  const loadFFmpeg = async () => {
    if (isLoadedRef.current) return true;
    if (!window.crossOriginIsolated) return false;
    const ffmpeg = ffmpegRef.current;
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    try {
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      isLoadedRef.current = true;
      return true;
    } catch (e) { return false; }
  };

  const uploadToStorage = async (file: File | Blob, path: string): Promise<string | null> => {
    const fileName = `${Date.now()}_${path}`;
    const { data, error } = await supabase.storage.from('portfolio').upload(fileName, file);
    if (error) return null;
    const { data: { publicUrl } } = supabase.storage.from('portfolio').getPublicUrl(fileName);
    return publicUrl;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateLocalConfig({ [e.target.name]: e.target.value });
  };

  const handleVideoChange = (index: number, field: keyof VideoData, value: string) => {
    const newList = [...config.featuredVideos];
    newList[index] = { ...newList[index], [field]: value };
    updateLocalConfig({ featuredVideos: newList });
  };

  const handleSave = async () => {
    setIsSaving(true);
    const success = await saveConfigToDb();
    if (success) {
      showSuccess("SAVED!");
      setTimeout(() => navigate('/'), 1000);
    } else showError("ERROR SAVING");
    setIsSaving(false);
  };

  if (isLoading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">LOADING...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-8 font-['Press_Start_2P'] pb-24">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex items-center justify-between border-b-4 border-white pb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="hover:opacity-50"><ArrowLeft /></button>
            <h1 className="text-lg">ADMIN_TERMINAL</h1>
          </div>
        </div>

        <div className="space-y-10 bg-[#0a0a0a] p-10 border-4 border-white rounded-[40px]">
          {/* Perfil */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="flex flex-col items-center gap-6">
                <img src={config.profileImage} className="w-32 h-32 rounded-full border-4 border-white object-cover" />
                <Button onClick={() => fileInputRef.current?.click()} className="bg-white text-black text-[8px] w-full rounded-full">CHANGE_AVATAR</Button>
                <input type="file" ref={fileInputRef} onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = await uploadToStorage(file, 'avatar.png');
                    if (url) updateLocalConfig({ profileImage: url });
                  }
                }} className="hidden" />
              </div>
              <div className="lg:col-span-2 space-y-6">
                <Input name="profileName" value={config.profileName} onChange={handleChange} className="bg-black border-zinc-800" placeholder="NAME" />
                <Textarea name="description" value={config.description} onChange={handleChange} className="bg-black border-zinc-800" placeholder="DESCRIPTION" />
              </div>
          </div>

          {/* Redes Sociais */}
          <div className="space-y-6 border-t-2 border-zinc-900 pt-10">
            <h2 className="text-[12px] uppercase flex items-center gap-4"><Globe className="w-5 h-5" /> Social_Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-[8px] flex items-center gap-2"><Globe className="w-3 h-3"/> Twitter URL</Label>
                <Input name="twitterUrl" value={config.twitterUrl} onChange={handleChange} className="bg-black border-zinc-800 text-[10px]" placeholder="https://x.com/..." />
              </div>
              <div className="space-y-2">
                <Label className="text-[8px] flex items-center gap-2"><MessageSquare className="w-3 h-3"/> Discord Tag</Label>
                <Input name="discordUrl" value={config.discordUrl} onChange={handleChange} className="bg-black border-zinc-800 text-[10px]" placeholder="user#0000" />
              </div>
              <div className="space-y-2">
                <Label className="text-[8px] flex items-center gap-2"><Mail className="w-3 h-3"/> Contact Email</Label>
                <Input name="email" value={config.email} onChange={handleChange} className="bg-black border-zinc-800 text-[10px]" placeholder="email@example.com" />
              </div>
            </div>
          </div>

          {/* Vídeos */}
          <div className="space-y-6 border-t-2 border-zinc-900 pt-10">
            <h2 className="text-[12px] uppercase flex items-center gap-4"><Video className="w-5 h-5" /> Featured_Content</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {config.featuredVideos.map((video, index) => (
                <div key={video.id} className="p-6 border-2 border-zinc-800 rounded-3xl space-y-4 bg-black/30">
                  <Input value={video.title} onChange={(e) => handleVideoChange(index, 'title', e.target.value)} className="bg-black border-zinc-800 text-[10px]" placeholder="TITLE" />
                  <Input value={video.url} onChange={(e) => handleVideoChange(index, 'url', e.target.value)} className="bg-black border-zinc-800 text-[10px]" placeholder="YOUTUBE URL" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button disabled={isSaving} onClick={handleSave} className="w-full bg-white text-black text-[10px] h-16 rounded-full border-b-8 border-r-8 border-zinc-400">
          {isSaving ? "SAVING..." : "SAVE_ALL_CHANGES"}
        </Button>
      </div>
    </div>
  );
};

export default Settings;