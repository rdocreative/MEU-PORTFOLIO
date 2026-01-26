"use client";

import React, { useRef, useState } from 'react';
import { useConfig, VideoData, Client } from '@/context/ConfigContext';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Video, Trash2, Plus, X, Globe, Mail, MessageSquare, UserCheck, Star, Smartphone, UploadCloud, Eye, EyeOff, Users, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { showSuccess, showError } from '@/utils/toast';
import { supabase } from '@/integrations/supabase/client';

const Admin = () => {
  const { config, updateLocalConfig, saveConfigToDb, isLoading } = useConfig();
  const [isSaving, setIsSaving] = useState(false);
  
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

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

  const handleShortChange = (index: number, field: keyof VideoData, value: string) => {
    const newList = [...(config.shortsVideos || [])];
    newList[index] = { ...newList[index], [field]: value };
    updateLocalConfig({ shortsVideos: newList });
  };

  const handleClientChange = (index: number, field: keyof Client, value: string) => {
    const newList = [...config.clients];
    newList[index] = { ...newList[index], [field]: value };
    updateLocalConfig({ clients: newList });
  };

  const addClient = () => {
    const newClient: Client = { 
      id: crypto.randomUUID(), 
      name: 'NEW CREATOR', 
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
      subscribers: '0'
    };
    updateLocalConfig({ clients: [...config.clients, newClient] });
  };

  const removeClient = (id: string) => {
    updateLocalConfig({ clients: config.clients.filter(c => c.id !== id) });
  };

  const handleReviewUpload = async (file: File, index: number) => {
    const url = await uploadToStorage(file, `review_${index}.png`);
    if (url) {
      const newReviews = [...(config.reviews || [])];
      while (newReviews.length <= index) {
        newReviews.push({ id: crypto.randomUUID(), url: '' });
      }
      newReviews[index] = { id: newReviews[index]?.id || crypto.randomUUID(), url };
      updateLocalConfig({ reviews: newReviews });
    }
  };

  const removeReview = (index: number) => {
    const newReviews = [...(config.reviews || [])];
    if (newReviews[index]) {
      newReviews[index] = { ...newReviews[index], url: '' };
    }
    updateLocalConfig({ reviews: newReviews });
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

  const VisibilityToggle = ({ isVisible, onToggle, label }: { isVisible: boolean, onToggle: () => void, label: string }) => (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={onToggle}
      className={`gap-2 text-[10px] ${isVisible ? 'text-green-400 hover:text-green-300' : 'text-red-400 hover:text-red-300'}`}
    >
      {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
      {isVisible ? 'VISIBLE' : 'HIDDEN'}
    </Button>
  );

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
                <div className="relative group">
                  {config.profileVideo ? (
                    <video src={config.profileVideo} className="w-32 h-32 rounded-full border-4 border-white object-cover" autoPlay loop muted />
                  ) : (
                    <img src={config.profileImage} className="w-32 h-32 rounded-full border-4 border-white object-cover" />
                  )}
                  {config.profileVideo && (
                    <button 
                      onClick={() => updateLocalConfig({ profileVideo: undefined })}
                      className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600 transition-colors"
                      title="Remove Video"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-3 w-full">
                  <Button onClick={() => fileInputRef.current?.click()} className="bg-white text-black text-[8px] w-full rounded-full">CHANGE_IMAGE</Button>
                  <Button onClick={() => videoInputRef.current?.click()} className="bg-zinc-800 text-white text-[8px] w-full rounded-full flex items-center gap-2 justify-center">
                    <Film className="w-3 h-3" />
                    {config.profileVideo ? 'CHANGE_VIDEO' : 'UPLOAD_VIDEO'}
                  </Button>
                </div>

                <input type="file" ref={fileInputRef} accept="image/*" onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = await uploadToStorage(file, 'avatar.png');
                    if (url) updateLocalConfig({ profileImage: url, profileVideo: undefined });
                  }
                }} className="hidden" />

                <input type="file" ref={videoInputRef} accept="video/mp4,video/webm" onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = await uploadToStorage(file, 'avatar_video.mp4');
                    if (url) updateLocalConfig({ profileVideo: url });
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

          {/* Background Reviews */}
          <div className={`space-y-6 border-t-2 border-zinc-900 pt-10 ${!config.showReviews ? 'opacity-50 grayscale' : ''}`}>
            <div className="flex items-center justify-between">
              <h2 className="text-[12px] uppercase flex items-center gap-4"><Star className="w-5 h-5" /> Background_Reviews</h2>
              <VisibilityToggle 
                isVisible={config.showReviews} 
                onToggle={() => updateLocalConfig({ showReviews: !config.showReviews })} 
                label="Reviews"
              />
            </div>
            <p className="text-[8px] text-zinc-500">Upload up to 6 prints. (335x88)</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[0, 1, 2, 3, 4, 5].map((index) => {
                const review = config.reviews?.[index];
                const hasUrl = review && review.url && review.url !== '';
                
                return (
                  <div key={index} className="aspect-[335/88] border-2 border-zinc-800 border-dashed rounded-lg flex items-center justify-center relative bg-black/30 overflow-hidden group">
                    {hasUrl ? (
                      <>
                        <img src={review.url} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => removeReview(index)}
                            className="h-8 w-8 p-0 rounded-full"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center gap-2 text-zinc-500 hover:text-white transition-colors">
                        <Plus className="w-6 h-6" />
                        <span className="text-[8px]">SLOT {index + 1}</span>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleReviewUpload(file, index);
                          }}
                        />
                      </label>
                    )}
                  </div>
                );
              })}
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

          {/* Criadores (CLIENTS) */}
          <div className={`space-y-6 border-t-2 border-zinc-900 pt-10 ${!config.showClients ? 'opacity-50 grayscale' : ''}`}>
            <div className="flex items-center justify-between">
              <h2 className="text-[12px] uppercase flex items-center gap-4"><Users className="w-5 h-5" /> Creators_Worked_With</h2>
              <div className="flex items-center gap-2">
                <VisibilityToggle 
                  isVisible={config.showClients} 
                  onToggle={() => updateLocalConfig({ showClients: !config.showClients })} 
                  label="Clients"
                />
                <Button onClick={addClient} className="bg-white text-black text-[8px] h-8 rounded-full flex items-center gap-2">
                  <Plus className="w-3 h-3" /> ADD
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {config.clients.map((client, index) => (
                <div key={client.id} className="p-4 border-2 border-zinc-800 rounded-3xl space-y-4 bg-black/30 relative group">
                  <button 
                    onClick={() => removeClient(client.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <div className="flex items-center gap-4">
                    <div className="relative group/avatar">
                      <img src={client.image} className="w-12 h-12 rounded-full object-cover border-2 border-zinc-700" />
                      <label className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover/avatar:opacity-100 cursor-pointer">
                        <UploadCloud className="w-4 h-4" />
                        <input type="file" className="hidden" onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await uploadToStorage(file, `client_${index}.png`);
                            if (url) handleClientChange(index, 'image', url);
                          }
                        }} />
                      </label>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="space-y-1">
                        <Label className="text-[6px] text-zinc-500">NAME</Label>
                        <Input 
                          value={client.name} 
                          onChange={(e) => handleClientChange(index, 'name', e.target.value)} 
                          className="bg-black border-zinc-800 text-[8px] h-8" 
                          placeholder="NAME" 
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[6px] text-zinc-500 flex items-center gap-1"><UserCheck className="w-2 h-2"/> SUBS</Label>
                        <Input 
                          value={client.subscribers || ''} 
                          onChange={(e) => handleClientChange(index, 'subscribers', e.target.value)} 
                          className="bg-black border-zinc-800 text-[8px] h-8" 
                          placeholder="EX: 1M" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vídeos Longos */}
          <div className={`space-y-6 border-t-2 border-zinc-900 pt-10 ${!config.showFeaturedVideos ? 'opacity-50 grayscale' : ''}`}>
            <div className="flex items-center justify-between">
              <h2 className="text-[12px] uppercase flex items-center gap-4"><Video className="w-5 h-5" /> Featured_Videos</h2>
              <VisibilityToggle 
                isVisible={config.showFeaturedVideos} 
                onToggle={() => updateLocalConfig({ showFeaturedVideos: !config.showFeaturedVideos })} 
                label="Videos"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {config.featuredVideos.map((video, index) => (
                <div key={video.id} className="p-6 border-2 border-zinc-800 rounded-3xl space-y-4 bg-black/30">
                  <div className="space-y-2">
                    <Label className="text-[8px]">TITLE</Label>
                    <Input value={video.title} onChange={(e) => handleVideoChange(index, 'title', e.target.value)} className="bg-black border-zinc-800 text-[10px]" placeholder="TITLE" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[8px]">YOUTUBE_URL</Label>
                    <Input value={video.url} onChange={(e) => handleVideoChange(index, 'url', e.target.value)} className="bg-black border-zinc-800 text-[10px]" placeholder="YOUTUBE URL" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shorts Videos */}
          <div className={`space-y-6 border-t-2 border-zinc-900 pt-10 ${!config.showShorts ? 'opacity-50 grayscale' : ''}`}>
             <div className="flex items-center justify-between">
              <h2 className="text-[12px] uppercase flex items-center gap-4"><Smartphone className="w-5 h-5" /> Shorts_Content</h2>
              <VisibilityToggle 
                isVisible={config.showShorts} 
                onToggle={() => updateLocalConfig({ showShorts: !config.showShorts })} 
                label="Shorts"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(config.shortsVideos || []).map((short, index) => (
                <div key={short.id} className="p-6 border-2 border-zinc-800 rounded-3xl space-y-4 bg-black/30">
                  <div className="space-y-2">
                    <Label className="text-[8px]">SHORT_TITLE</Label>
                    <Input value={short.title} onChange={(e) => handleShortChange(index, 'title', e.target.value)} className="bg-black border-zinc-800 text-[10px]" placeholder="TITLE" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[8px]">URL (Shorts)</Label>
                    <Input value={short.url} onChange={(e) => handleShortChange(index, 'url', e.target.value)} className="bg-black border-zinc-800 text-[10px]" placeholder="https://youtube.com/shorts/..." />
                  </div>
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

export default Admin;