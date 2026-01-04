"use client";

import React, { useRef, useState, useEffect } from 'react';
import { useConfig, VideoData } from '@/context/ConfigContext';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Video, Zap, Trash2, Loader2, Wand2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

const Settings = () => {
  const { config, updateLocalConfig, saveConfigToDb, isLoading } = useConfig();
  const [isSaving, setIsSaving] = useState(false);
  
  const [processingIndex, setProcessingIndex] = useState<number | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [ffmpegError, setFfmpegError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const ffmpegRef = useRef(new FFmpeg());
  const isLoadedRef = useRef(false);

  // Verifica compatibilidade ao carregar
  useEffect(() => {
    if (!window.crossOriginIsolated) {
      console.warn("SharedArrayBuffer is not available. Video processing might fail or be slow.");
      // Não bloqueamos totalmente, pois alguns navegadores podem ter polyfills ou comportamentos diferentes
    }
  }, []);

  const load = async () => {
    if (isLoadedRef.current) return true;
    
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
      setFfmpegError(null);
      return true;
    } catch (error) {
      console.error("FFmpeg load failed:", error);
      const msg = !window.crossOriginIsolated 
        ? "Erro de segurança do navegador (CORS/SharedArrayBuffer). Tente usar o Chrome/Edge desktop." 
        : "Falha ao carregar motor de vídeo.";
      setFfmpegError(msg);
      showError(msg);
      return false;
    }
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

  const processVideo = async (file: File): Promise<string | null> => {
    const ffmpeg = ffmpegRef.current;
    
    // Tenta carregar sob demanda se não estiver carregado
    if (!ffmpeg.loaded) {
      const loaded = await load();
      if (!loaded) return null;
    }

    try {
      const inputName = 'input.mp4';
      const outputName = 'output.mp4';

      // Escreve o arquivo na memória virtual
      await ffmpeg.writeFile(inputName, await fetchFile(file));

      // Executa o comando de otimização
      // -vf scale=-2:240 (Mantém aspect ratio, altura 240px, largura par)
      await ffmpeg.exec([
        '-i', inputName,
        '-t', '15',
        '-vf', 'scale=-2:240',
        '-r', '12',
        '-c:v', 'libx264',
        '-b:v', '400k', // Bitrate fixo baixo para garantir tamanho pequeno
        '-preset', 'ultrafast',
        '-an',
        outputName
      ]);

      // Lê o resultado
      const data = await ffmpeg.readFile(outputName);
      
      // Limpeza
      try {
        await ffmpeg.deleteFile(inputName);
        await ffmpeg.deleteFile(outputName);
      } catch (e) {
        // Ignora erro de limpeza
      }

      // Cria Blob de forma segura (verificando se data é Uint8Array)
      const buffer = data instanceof Uint8Array ? data : new Uint8Array(data as any);
      const blob = new Blob([buffer], { type: 'video/mp4' });

      // Converte para Base64 para salvar no JSON/LocalStorage
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });

    } catch (error) {
      console.error("Transcode error:", error);
      showError("Erro ao processar. Tente um vídeo mais curto/leve.");
      return null;
    }
  };

  const handleVideoUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      showError("Arquivo muito grande! Máximo 50MB para otimização no navegador.");
      return;
    }

    setProcessingIndex(index);
    setProcessingProgress(0);
    const toastId = showLoading("OTIMIZANDO (AGUARDE)...");

    try {
      // Timeout aumentado para 2 minutos
      const timeoutPromise = new Promise<null>((_, reject) => 
        setTimeout(() => reject(new Error("TIMEOUT")), 120000)
      );

      const processedVideoDataUrl = await Promise.race([
        processVideo(file),
        timeoutPromise
      ]);

      if (processedVideoDataUrl) {
        const newList = [...config.featuredVideos];
        newList[index] = { ...newList[index], customVideoUrl: processedVideoDataUrl };
        updateLocalConfig({ featuredVideos: newList });
        dismissToast(toastId);
        showSuccess("SUCESSO! VÍDEO COMPRIMIDO.");
      } else {
        dismissToast(toastId);
      }
    } catch (err) {
      dismissToast(toastId);
      console.error(err);
      if ((err as Error).message === "TIMEOUT") {
        showError("O processamento demorou demais.");
      } else {
        showError("Erro no processamento.");
      }
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateLocalConfig({ profileImage: event.target?.result as string });
        showSuccess("FOTO CARREGADA!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const success = await saveConfigToDb();
    setIsSaving(false);
    if (success) {
      showSuccess("CONFIG_SAVED_GLOBALLY!");
      navigate('/');
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
          {ffmpegError && (
            <div className="text-[8px] text-red-400 flex items-center gap-2 border border-red-500 p-2 rounded max-w-md">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {ffmpegError}
            </div>
          )}
        </div>

        <div className="space-y-10 bg-[#0a0a0a] p-10 border-4 border-white rounded-[40px]">
          {/* Header Profile Info */}
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
                      disabled={processingIndex !== null} 
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
                        video.customVideoUrl ? "PREVIEW_ACTIVE" : "UPLOAD_AUTO_OPTIMIZE"
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
                  <p className="text-[7px] text-zinc-600 text-center">
                    *Auto: 15s, No Audio, 240p
                  </p>
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
            {isSaving ? (
              <Loader2 className="mr-3 w-5 h-5 animate-spin" />
            ) : (
              <Save className="mr-3 w-5 h-5" />
            )}
            {isSaving ? "SAVING..." : "SAVE_CHANGES"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;