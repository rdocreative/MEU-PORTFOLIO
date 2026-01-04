"use client";

import React, { useRef } from 'react';
import { useConfig } from '@/context/ConfigContext';
import { useNavigate } from 'react-router-dom';
import { Save, RotateCcw, ArrowLeft, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { showSuccess, showError } from '@/utils/toast';

const Settings = () => {
  const { config, updateConfig, resetConfig } = useConfig();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateConfig({ [name]: value });
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
    } else {
      showError("SELECIONE UMA IMAGEM.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 font-['Press_Start_2P'] pb-20">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b-4 border-white pb-4">
          <button onClick={() => navigate('/')} className="hover:opacity-50 transition-opacity">
            <ArrowLeft className="w-8 h-8" />
          </button>
          <h1 className="text-sm">TERMINAL_CONFIG</h1>
          <div className="w-8"></div>
        </div>

        <div className="space-y-8 bg-[#0a0a0a] p-8 border-4 border-white rounded-[20px]">
          <div className="space-y-4">
            <h2 className="text-zinc-500 text-[10px] uppercase">Profile_Info</h2>
            <div className="flex flex-col items-center gap-4 p-4 border-2 border-dashed border-zinc-700 rounded-xl">
              <img src={config.profileImage} className="w-20 h-20 rounded-full border-2 border-white object-cover" alt="Preview" />
              <Button onClick={() => fileInputRef.current?.click()} className="bg-white text-black hover:bg-zinc-300 text-[8px] w-full">
                <Upload className="mr-2 w-4 h-4" /> UPLOAD_IMG
              </Button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            </div>
            <Input name="profileName" value={config.profileName} onChange={handleChange} className="bg-black border-zinc-800 text-[10px]" placeholder="NAME" />
            <Textarea name="description" value={config.description} onChange={handleChange} className="bg-black border-zinc-800 text-[10px] min-h-[80px]" placeholder="BIO" />
          </div>

          <div className="space-y-4 border-t-2 border-zinc-900 pt-6">
            <h2 className="text-zinc-500 text-[10px] uppercase">Style_Palette</h2>
            <div className="grid grid-cols-2 gap-4">
              {['primaryColor', 'secondaryColor', 'backgroundColor', 'cardColor'].map((key) => (
                <div key={key} className="space-y-2">
                  <Label className="text-[6px] uppercase">{key.replace('Color', '')}</Label>
                  <Input type="color" name={key} value={(config as any)[key]} onChange={handleChange} className="h-10 bg-black border-zinc-800" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 border-t-2 border-zinc-900 pt-6">
            <h2 className="text-zinc-500 text-[10px] uppercase">Action_Links</h2>
            <Input name="longFormText" value={config.longFormText} onChange={handleChange} className="bg-black border-zinc-800 text-[10px]" />
            <Input name="shortFormText" value={config.shortFormText} onChange={handleChange} className="bg-black border-zinc-800 text-[10px]" />
            <Input name="email" value={config.email} onChange={handleChange} className="bg-black border-zinc-800 text-[10px]" />
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={() => navigate('/')} className="flex-1 bg-white text-black hover:bg-zinc-300 text-[8px] h-14 rounded-full border-b-4 border-r-4 border-zinc-400">
            <Save className="mr-2 w-4 h-4" /> SAVE_CHANGES
          </Button>
          <Button onClick={resetConfig} className="bg-zinc-900 text-white hover:bg-zinc-800 text-[8px] h-14 rounded-full border-b-4 border-r-4 border-black">
            <RotateCcw className="mr-2 w-4 h-4" /> FACTORY_RESET
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;