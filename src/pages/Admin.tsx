"use client";

import React, { useRef, useState } from 'react';
import { useConfig, VideoData, Client, ReviewImage } from '@/context/ConfigContext';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Video as VideoIcon, Trash2, Loader2, UploadCloud, Users, Plus, X, Globe, Mail, MessageSquare, UserCheck, Star, Smartphone, FileVideo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { showSuccess, showError } from '@/utils/toast';
import { supabase } from '@/integrations/supabase/client';

const Admin = () => {
  const { config, updateLocalConfig, saveConfigToDb, isLoading } = useConfig();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const uploadToStorage = async (file: File | Blob, path: string): Promise<string | null> => {
    const fileName = `${Date.now()}_${path}`;
    const { data, error } = await supabase.storage.from('portfolio').upload(fileName, file);
    if (error) return null;
    const { data: { publicUrl } } = supabase.storage.from('portfolio').getPublicUrl(fileName);
    return publicUrl;
  };

  const handleVideoUpload = async (file: File, index: number, type: 'featured' | 'shorts') => {
    setIsUploading(`${type}_${index}`);
    const url = await uploadToStorage(file, `${type}_video_${index}.mp4`);
    if (url) {
      if (type === 'featured') {
        const newList = [...config.featuredVideos];
        newList[index] = { ...newList[index], url, isDirectUpload: true };
        updateLocalConfig({ featuredVideos: newList });
      } else {
        const newList = [...(config.shortsVideos || [])];
        newList[index] = { ...newList[index], url, isDirectUpload: true };
        updateLocalConfig({ shortsVideos: newList });
      }
      showSuccess("VIDEO UPLOADED!");
    } else {
      showError("UPLOAD FAILED");
    }
    setIsUploading(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateLocalConfig({ [e.target.name]: e.target.value });
  };

  const handleVideoChange = (index: number, field: keyof VideoData, value: string) => {
    const newList = [...config.featuredVideos];
    newList[index] = { ...newList[index], [field]: value, isDirectUpload: false };
    updateLocalConfig({ featuredVideos: newList });
  };

  const handleShortChange = (index: number, field: keyof VideoData, value: string) => {
    const newList = [...(config.shortsVideos || [])];
    newList[index] = { ...newList[index], [field]: value, isDirectUpload: false };
    updateLocalConfig({ shortsVideos: newList });
  };

  const addShort = () => {
    const newShort = { id: crypto.randomUUID(), title: 'NEW SHORT', url: '' };
    updateLocalConfig({ shortsVideos: [...(config.shortsVideos || []), newShort] });
  };

  const removeShort = (index: number) => {
    const newList = [...(config.shortsVideos || [])];
    newList.splice(index, 1);
    updateLocalConfig({ shortsVideos: newList });
  };

  const handleSave = async () => {
    setIsSaving(true);
    const success = await saveConfigToDb();
    if (success) {
      showSuccess("SAVED!");
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
          <Button disabled={isSaving} onClick={handleSave} className="bg-white text-black text-[10px] h-12 px-8 rounded-full">
            {isSaving ? "SAVING..." : "SAVE"}
          </Button>
        </div>

        <div className="space-y-10 bg-[#0a0a0a] p-10 border-4 border-white rounded-[40px]">
          {/* Perfil */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="flex flex-col items-center gap-6">
                <img src={config.profileImage} className="w-32 h-32 rounded-full border-4 border-white object-cover" />
                <Button onClick={() => avatarInputRef.current?.click()} className="bg-white text-black text-[8px] w-full rounded-full">CHANGE_AVATAR</Button>
                <input type="file" ref={avatarInputRef} onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = await uploadToStorage(file, 'avatar.png');
                    if (url) updateLocalConfig({ profileImage: url });
                  }
                }} className="hidden" />
              </div>
              <div className="lg:col-span-2 space-y-6">
                <div className="space-y-2">
                  <Label className="text-[8px]">PROFILE_NAME</Label>
                  <Input name="profileName" value={config.profileName} onChange={handleChange} className="bg-black border-zinc-800" placeholder="NAME" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[8px]">BIO_DESCRIPTION</Label>
                  <Textarea name="description" value={config.description} onChange={handleChange} className="bg-black border-zinc-800 min-h-[100px]" placeholder="DESCRIPTION" />
                </div>
              </div>
          </div>

          {/* Vídeos Longos */}
          <div className="space-y-6 border-t-2 border-zinc-900 pt-10">
            <h2 className="text-[12px] uppercase flex items-center gap-4"><VideoIcon className="w-5 h-5" /> Featured_Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {config.featuredVideos.map((video, index) => (
                <div key={video.id} className="p-6 border-2 border-zinc-800 rounded-3xl space-y-4 bg-black/30">
                  <div className="space-y-2">
                    <Label className="text-[8px]">TITLE</Label>
                    <Input value={video.title} onChange={(e) => handleVideoChange(index, 'title', e.target.value)} className="bg-black border-zinc-800 text-[10px]" placeholder="TITLE" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[8px]">YOUTUBE_URL OR UPLOAD</Label>
                    <div className="flex gap-2">
                      <Input value={video.isDirectUpload ? "Uploaded File" : video.url} disabled={video.isDirectUpload} onChange={(e) => handleVideoChange(index, 'url', e.target.value)} className="bg-black border-zinc-800 text-[10px] flex-1" placeholder="YOUTUBE URL" />
                      <label className="cursor-pointer bg-zinc-800 p-2 rounded-lg hover:bg-zinc-700 transition-colors">
                        {isUploading === `featured_${index}` ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
                        <input type="file" accept="video/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleVideoUpload(e.target.files[0], index, 'featured')} />
                      </label>
                      {video.isDirectUpload && (
                        <Button variant="destructive" size="sm" onClick={() => handleVideoChange(index, 'url', '')} className="p-2"><X className="w-4 h-4" /></Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shorts Videos */}
          <div className="space-y-6 border-t-2 border-zinc-900 pt-10">
            <div className="flex justify-between items-center">
              <h2 className="text-[12px] uppercase flex items-center gap-4"><Smartphone className="w-5 h-5" /> Shorts_Content</h2>
              <Button onClick={addShort} variant="outline" className="text-[8px] h-8 border-white">ADD_SHORT</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(config.shortsVideos || []).map((short, index) => (
                <div key={short.id} className="p-6 border-2 border-zinc-800 rounded-3xl space-y-4 bg-black/30 relative group">
                   <button onClick={() => removeShort(index)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
                  <div className="space-y-2">
                    <Label className="text-[8px]">TITLE</Label>
                    <Input value={short.title} onChange={(e) => handleShortChange(index, 'title', e.target.value)} className="bg-black border-zinc-800 text-[10px]" placeholder="TITLE" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[8px]">URL OR UPLOAD</Label>
                    <div className="flex gap-2">
                      <Input value={short.isDirectUpload ? "Uploaded File" : short.url} disabled={short.isDirectUpload} onChange={(e) => handleShortChange(index, 'url', e.target.value)} className="bg-black border-zinc-800 text-[10px] flex-1" placeholder="SHORTS URL" />
                      <label className="cursor-pointer bg-zinc-800 p-2 rounded-lg hover:bg-zinc-700 transition-colors">
                        {isUploading === `shorts_${index}` ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
                        <input type="file" accept="video/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleVideoUpload(e.target.files[0], index, 'shorts')} />
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;