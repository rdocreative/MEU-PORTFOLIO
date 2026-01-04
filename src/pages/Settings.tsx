"use client";

import React, { useRef, useState, useEffect } from 'react';
import { useConfig, VideoData } from '@/context/ConfigContext';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Video, Zap, Trash2, Loader2, Wand2 } from 'lucide-react';
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const ffmpegRef = useRef(new FFmpeg());
  const messageRef = useRef<HTMLParagraphElement | null>(null);

  // Carrega o FFmpeg ao iniciar a página
  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    const ffmpeg = ffmpegRef.current;
    
    // Check if already loaded
    if (ffmpeg.loaded) return;

    try {
      ffmpeg.on('log', ({ message }) => {
        if (messageRef.current) messageRef.current.innerHTML = message;
        console.log(message);
      });

      ffmpeg.on('progress', ({ progress }) => {
        setProcessingProgress(Math.round(progress * 100));
      });

      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
    } catch (error) {
      console.error("FFmpeg load error:", error);
      // Não mostramos erro para o usuário aqui, apenas falha silenciosa
      // Se falhar, o upload funcionará sem otimização ou falhará no processamento
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
    
    if (!ffmpeg.loaded) {
      await load(); // Tenta carregar novamente se não estiver pronto
      if (!ffmpeg.loaded) {
         showError("ERRO: MOTOR DE VÍDEO NÃO CARREGOU.");
         return null;
      }
    }

    try {
      const inputName = 'input.mp4';
      const outputName = 'output.mp4';

      await ffmpeg.writeFile(inputName, await fetchFile(file));

      // COMANDO FFmpeg OTIMIZADO:
      // -t 15: Corta em 15 segundos
      // -vf scale=-2:360: Redimensiona altura para 360p (mantém aspect ratio)
      // -r 15: Reduz para 15 quadros por segundo (estilo GIF leve)
      // -an: Remove áudio (remove peso drasticamente)
      // -c:v libx264: Codec padrão
      // -crf 32: Compressão agressiva (menor qualidade, menor arquivo)
      // -preset ultrafast: Processamento rápido
      await ffmpeg.exec([
        '-i', inputName,
        '-t', '15',
        '-vf', 'scale=-2:360',
        '-r', '15',
        '-c:v', 'libx264',
        '-crf', '32',
        '-preset', 'ultrafast',
        '-an',
        outputName
      ]);

      const data = await ffmpeg.readFile(outputName);
      
      // Limpeza
      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);

      // Converte para Base64
      const blob = new Blob([data], { type: 'video/mp4' });
      
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });

    } catch (error) {
      console.error("Transcode error:", error);
      showError("FALHA AO PROCESSAR VÍDEO");
      return null;
    }
  };

  const handleVideoUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limite removido, mas avisamos se for absurdo
    if (file.size > 200 * 1024 * 1024) {
      showError("ARQUIVO GIGANTE! NAVEGADOR PODE TRAVAR.");
    }

    setIsProcessing(true);
    setProcessingProgress(0);
    const toastId = showLoading("OTIMIZANDO VÍDEO (15s)...");

    try {
      const processedVideoDataUrl = await processVideo(file);

      if (processedVideoDataUrl) {
        const newList = [...config.featuredVideos];
        newList[index] = { ...newList[index], customVideoUrl: processedVideoDataUrl };
        updateLocalConfig({ featuredVideos: newList });
        dismissToast(toastId);
        showSuccess("VÍDEO COMPRIMIDO & CARREGADO!");
      } else {
        dismissToast(toastId);
      }
    } catch (err) {
      dismissToast(toastId);
      showError("ERRO DESCONHECIDO");
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
      // Limpa o input para permitir re-upload do mesmo arquivo
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
          <button onClick={() => navigate('/')} className="hover:opacity-50 transition-opacity">
            <ArrowLeft className="w-10 h-10" />
          </button>
          <h1 className="text-lg">ADMIN_TERMINAL</h1>
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
                      disabled={isProcessing}
                      onClick={() => videoInputRefs.current[index]?.click()} 
                      className={`text-[7px] flex-1 h-10 rounded-xl transition-all ${
                        video.customVideoUrl 
                          ? "bg-green-900 text-green-100 hover:bg-green-800" 
                          : "bg-zinc-800 hover:bg-zinc-700"
                      }`}
                    >
                      {isProcessing ? (
                        <div className="flex items-center gap-2">
                          <Wand2 className="w-3 h-3 animate-pulse" />
                          <span>OTIMIZANDO... {processingProgress}%</span>
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
                    *Automático: Trim 15s, No Audio, 360p
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
            disabled={isSaving || isProcessing}
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