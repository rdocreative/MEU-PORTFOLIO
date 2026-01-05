"use client";

import React, { useRef, useState, useEffect } from 'react';
import { useConfig, VideoData, Client } from '@/context/ConfigContext';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Video, Zap, Trash2, Loader2, Wand2, AlertTriangle, UploadCloud, Users, Plus } from 'lucide-react';
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
      ffmpeg.on('log', ({ message }) => console.log("[FFmpeg]", message));
      ffmpeg.on('progress', ({ progress }) => setProcessingProgress(Math.round(progress * 100)));

      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      
      isLoadedRef.current = true;
      return true;
    } catch (error) {
      console.error("FFmpeg load failed:", error);
      return false;
    }
  };

  const uploadToStorage = async (file: File | Blob, path: string): Promise<string | null> => {
    const fileName = `${Date.now()}_${path}`;
    const { data, error } = await supabase.storage
      .from('portfolio')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error("Upload error:", error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('portfolio')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateLocalConfig({ [name]: value });
  };

  const handleVideoChange = (index: number, field: keyof VideoData, value: string, type: 'featured' | 'shorts') => {
    const listKey = type === 'featured' ? 'featuredVideos' : 'shortsVideos';
    const newList = [...config[listKey]];
    newList[index] = { ...newList[index], [field]: value };
    updateLocalConfig({ [listKey]: newList });
  };

  const processVideo = async (file: File): Promise<Blob | null> => {
    const ffmpeg = ffmpegRef.current;
    if (!ffmpeg.loaded) {
      const loaded = await loadFFmpeg();
      if (!loaded) return null;
    }

    try {
      const inputName = 'input.mp4';
      const outputName = 'output.mp4';
      await ffmpeg.writeFile(inputName, await fetchFile(file));

      await ffmpeg.exec([
        '-i', inputName,
        '-t', '15',                // Corta o vídeo para 15 segundos
        '-vf', 'scale=-2:360',     // Redimensiona para 360p de altura, mantendo a proporção
        '-r', '15',                // Define a taxa de quadros para 15 FPS para maior fluidez
        '-c:v', 'libx264',
        '-b:v', '600k',            // Aumenta o bitrate para melhor qualidade de imagem
        '-preset', 'superfast',    // Usa uma predefinição de codificação mais eficiente
        '-movflags', '+faststart', // Otimiza o vídeo para streaming na web (carregamento rápido)
        '-an',                     // Remove a faixa de áudio para reduzir o tamanho
        outputName
      ]);

      const data = await ffmpeg.readFile(outputName);
      return new Blob([data as any], { type: 'video/mp4' });
    } catch (error) {
      console.error("Transcode error:", error);
      return null;
    }
  };

  const handleVideoUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProcessingIndex(index);
    setProcessingProgress(0);
    const currentToastId = showLoading("PROCESSANDO E ENVIANDO VÍDEO...");

    try {
      let finalFile: File | Blob = file;
      let usedOptimization = false;

      if (window.crossOriginIsolated) {
        const optimized = await processVideo(file);
        if (optimized) {
          finalFile = optimized;
          usedOptimization = true;
        }
      }

      const publicUrl = await uploadToStorage(finalFile, 'video.mp4');
      
      if (publicUrl) {
        const newList = [...config.featuredVideos];
        newList[index] = { ...newList[index], customVideoUrl: publicUrl };
        updateLocalConfig({ featuredVideos: newList });
        
        dismissToast(currentToastId);
        showSuccess(usedOptimization ? "VÍDEO OTIMIZADO E SALVO!" : "VÍDEO SALVO NO SERVIDOR!");
      } else {
        throw new Error("Falha no upload");
      }
      
    } catch (err) {
      dismissToast(currentToastId);
      showError("Erro ao enviar vídeo para o servidor.");
    } finally {
      setProcessingIndex(null);
      setProcessingProgress(0);
      if (videoInputRefs.current[index]) {
        videoInputRefs.current[index]!.value = '';
      }
    }
  };

  const removeCustomVideo = (index: number) => {
    const newList = [...config.featuredVideos];
    newList[index] = { ...newList[index], customVideoUrl: "" };
    updateLocalConfig({ featuredVideos: newList });
    showSuccess("VÍDEO REMOVIDO!");
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const toastId = showLoading("ENVIANDO IMAGEM...");
      const publicUrl = await uploadToStorage(file, 'avatar.png');
      
      dismissToast(toastId);
      if (publicUrl) {
        updateLocalConfig({ profileImage: publicUrl });
        showSuccess("FOTO CARREGADA!");
      } else {
        showError("Erro no upload da foto.");
      }
    }
  };

  const handleClientUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = showLoading("ADICIONANDO CLIENTE...");
    const publicUrl = await uploadToStorage(file, `client_${Date.now()}.png`);

    dismissToast(toastId);

    if (publicUrl) {
        const newClient: Client = {
            id: Date.now().toString(),
            name: file.name.split('.')[0],
            image: publicUrl
        };
        updateLocalConfig({ clients: [...config.clients, newClient] });
        showSuccess("CLIENTE ADICIONADO!");
    } else {
        showError("ERRO NO UPLOAD");
    }
    
    // Reset input
    if (clientInputRef.current) clientInputRef.current.value = '';
  };

  const removeClient = (clientId: string) => {
      updateLocalConfig({
          clients: config.clients.filter(c => c.id !== clientId)
      });
  };

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    const toastId = showLoading("SALVANDO CONFIGURAÇÕES...");
    
    try {
      const success = await saveConfigToDb();
      dismissToast(toastId);
      
      if (success) {
        showSuccess("TUDO PRONTO! SALVO COM SUCESSO.");
        setTimeout(() => navigate('/'), 1000);
      } else {
        showError("ERRO AO SALVAR NO BANCO.");
      }
    } catch (error) {
      dismissToast(toastId);
      showError("ERRO DE CONEXÃO.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="min-h-screen bg-black flex items-center justify-center text-white font-['Press_Start_2P']">LOADING...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-8 font-['Press_Start_2P'] pb-24">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex items-center justify-between border-b-4 border-white pb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="hover:opacity-50 transition-opacity">
              <ArrowLeft className="w-10 h-10" />
            </button>
            <h1 className="text-lg">ADMIN_TERMINAL</h1>
          </div>
          {!window.crossOriginIsolated && (
            <div className="text-[8px] text-yellow-400 flex items-center gap-2 border border-yellow-500 p-2 rounded max-w-md bg-yellow-900/20">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              Modo de Compatibilidade Ativo.
            </div>
          )}
        </div>

        <div className="space-y-10 bg-[#0a0a0a] p-10 border-4 border-white rounded-[40px]">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t-2 border-zinc-900 pt-6">
             <div className="space-y-2">
                <Label className="text-[10px]">COR DE FUNDO</Label>
                <div className="flex gap-2">
                  <div className="w-10 h-10 rounded border" style={{background: config.backgroundColor}}></div>
                  <Input name="backgroundColor" value={config.backgroundColor} onChange={handleChange} className="bg-black border-zinc-800" />
                </div>
             </div>
             <div className="space-y-2">
                <Label className="text-[10px]">COR PRIMÁRIA</Label>
                <div className="flex gap-2">
                  <div className="w-10 h-10 rounded border" style={{background: config.primaryColor}}></div>
                  <Input name="primaryColor" value={config.primaryColor} onChange={handleChange} className="bg-black border-zinc-800" />
                </div>
             </div>
          </div>

          <div className="space-y-6 border-t-2 border-zinc-900 pt-10">
            <h2 className="text-white text-[12px] uppercase flex items-center gap-4">
              <Users className="w-5 h-5" /> Trusted_Clients
            </h2>
            <div className="flex flex-wrap gap-4">
              {config.clients.map((client) => (
                <div key={client.id} className="relative group w-24 h-24 bg-black/30 border-2 border-zinc-800 rounded-xl flex items-center justify-center p-2">
                  <img src={client.image} alt={client.name} className="w-full h-full object-contain" />
                  <button 
                    onClick={() => removeClient(client.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              
              <button 
                onClick={() => clientInputRef.current?.click()}
                className="w-24 h-24 border-2 border-dashed border-zinc-700 rounded-xl flex flex-col items-center justify-center gap-2 text-zinc-500 hover:text-white hover:border-white transition-colors"
              >
                <Plus className="w-6 h-6" />
                <span className="text-[8px]">ADD</span>
              </button>
              <input 
                type="file" 
                ref={clientInputRef} 
                onChange={handleClientUpload} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
          </div>

          <div className="space-y-6 border-t-2 border-zinc-900 pt-10">
            <h2 className="text-white text-[12px] uppercase flex items-center gap-4">
              <Video className="w-5 h-5" /> Featured_Content (6 Slots)
            </h2>
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
                  
                  <Input value={video.title} onChange={(e) => handleVideoChange(index, 'title', e.target.value, 'featured')} className="bg-black border-zinc-800 text-[10px] h-10" placeholder="TITLE" />
                  <Input value={video.url} onChange={(e) => handleVideoChange(index, 'url', e.target.value, 'featured')} className="bg-black border-zinc-800 text-[10px] h-10" placeholder="YOUTUBE URL" />
                  
                  <div className="flex gap-2">
                    <Button 
                      disabled={processingIndex !== null || isSaving} 
                      onClick={() => videoInputRefs.current[index]?.click()} 
                      className={`text-[7px] flex-1 h-10 rounded-xl transition-all ${
                        video.customVideoUrl 
                          ? "bg-green-900 text-green-100 hover:bg-green-800" 
                          : "bg-zinc-800 hover:bg-zinc-700"
                      }`}
                    >
                      {processingIndex === index ? (
                        <div className="flex items-center gap-2">
                          <Wand2 className="w-3 h-3 animate-pulse" />
                          <span>{processingProgress}%</span>
                        </div>
                      ) : (
                        video.customVideoUrl ? (
                          <div className="flex items-center gap-2">
                             <span>CLOUD_STORAGE_ACTIVE</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                             {window.crossOriginIsolated ? <Wand2 className="w-3 h-3" /> : <UploadCloud className="w-3 h-3" />}
                             <span>UPLOAD_TO_CLOUD</span>
                          </div>
                        )
                      )}
                    </Button>
                    <input 
                      type="file" 
                      ref={el => videoInputRefs.current[index] = el} 
                      onChange={(e) => handleVideoUpload(index, e)} 
                      accept="video/*" 
                      className="hidden" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6 border-t-2 border-zinc-900 pt-10">
            <h2 className="text-white text-[12px] uppercase flex items-center gap-4">
              <Zap className="w-5 h-5 fill-yellow-400 text-yellow-400" /> Shorts_Marquee
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {config.shortsVideos.map((video, index) => (
                <div key={video.id} className="p-4 border border-zinc-800 rounded-2xl bg-black/20 flex gap-4 items-center">
                  <span className="text-[8px] text-zinc-600">#{index+1}</span>
                  <Input value={video.url} onChange={(e) => handleVideoChange(index, 'url', e.target.value, 'shorts')} className="bg-black border-zinc-800 text-[10px] h-10" placeholder="YOUTUBE URL" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          <Button 
            disabled={isSaving || processingIndex !== null}
            onClick={handleSave} 
            className="flex-1 bg-white text-black hover:bg-zinc-300 text-[10px] h-16 rounded-full border-b-8 border-r-8 border-zinc-400 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="mr-3 w-5 h-5 animate-spin" /> : <Save className="mr-3 w-5 h-5" />}
            {isSaving ? "SAVING..." : "SAVE_CHANGES"}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Ícone X que faltava importar
const X = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M18 6 6 18"/>
    <path d="m6 6 18 18"/>
  </svg>
);

export default Settings;