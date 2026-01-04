"use client";

import React, { useRef } from 'react';
import { useConfig } from '@/context/ConfigContext';
import { useNavigate } from 'react-router-dom';
import { Save, RotateCcw, ArrowLeft, Upload, Image as ImageIcon } from 'lucide-react';
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

  const optimizeAndUploadImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 400; // Tamanho máximo otimizado
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Converte para base64 com qualidade reduzida para otimização
        const optimizedBase64 = canvas.toDataURL('image/jpeg', 0.8);
        updateConfig({ profileImage: optimizedBase64 });
        showSuccess("Foto otimizada e carregada!");
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => showError("Erro ao ler o arquivo.");
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showError("Por favor, selecione uma imagem válida.");
        return;
      }
      optimizeAndUploadImage(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-6 font-['Press_Start_2P'] pb-20">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b-4 border-[#4d4dff] pb-4">
          <button onClick={() => navigate('/')} className="hover:text-[#ff4d4d]">
            <ArrowLeft className="w-8 h-8" />
          </button>
          <h1 className="text-sm sm:text-lg">Configurações</h1>
          <div className="w-8"></div>
        </div>

        <div className="space-y-6 bg-[#1a1a2e] p-6 border-4 border-[#4d4dff] rounded-[20px]">
          {/* Perfil */}
          <div className="space-y-4">
            <h2 className="text-[#ff4d4d] text-[10px]">Informações Básicas</h2>
            
            <div className="space-y-4">
              <Label className="text-[8px]">Foto de Perfil</Label>
              <div className="flex flex-col items-center gap-4 p-4 border-2 border-dashed border-[#4d4dff] rounded-xl bg-[#0f0f1a]">
                <img 
                  src={config.profileImage} 
                  alt="Preview" 
                  className="w-20 h-20 rounded-full border-2 border-[#ff4d4d] object-cover"
                />
                <div className="flex gap-2 w-full">
                  <Button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 bg-[#4d4dff] hover:bg-[#3d3dff] text-[8px] h-10 border-b-2 border-r-2 border-[#2d2dbf]"
                  >
                    <Upload className="mr-2 w-4 h-4" /> UPLOAD FOTO
                  </Button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>
                <p className="text-[6px] text-gray-500 uppercase">Ou cole uma URL abaixo:</p>
                <Input 
                  name="profileImage" 
                  placeholder="URL da imagem..."
                  value={config.profileImage.startsWith('data:') ? '' : config.profileImage} 
                  onChange={handleChange} 
                  className="bg-[#0f0f1a] border-[#4d4dff] text-[10px]" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[8px]">Nome do Perfil</Label>
              <Input name="profileName" value={config.profileName} onChange={handleChange} className="bg-[#0f0f1a] border-[#4d4dff] text-[10px]" />
            </div>
            
            <div className="space-y-2">
              <Label className="text-[8px]">Descrição</Label>
              <Textarea name="description" value={config.description} onChange={handleChange} className="bg-[#0f0f1a] border-[#4d4dff] text-[10px] min-h-[100px]" />
            </div>
          </div>

          {/* Cores */}
          <div className="space-y-4 pt-4 border-t-2 border-[#4d4dff]/20">
            <h2 className="text-[#ff4d4d] text-[10px]">Cores e Estilo</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[8px]">Cor Primária (Bordas)</Label>
                <Input type="color" name="primaryColor" value={config.primaryColor} onChange={handleChange} className="h-10 bg-[#0f0f1a] border-[#4d4dff]" />
              </div>
              <div className="space-y-2">
                <Label className="text-[8px]">Cor Secundária (Destaques)</Label>
                <Input type="color" name="secondaryColor" value={config.secondaryColor} onChange={handleChange} className="h-10 bg-[#0f0f1a] border-[#4d4dff]" />
              </div>
              <div className="space-y-2">
                <Label className="text-[8px]">Fundo do Site</Label>
                <Input type="color" name="backgroundColor" value={config.backgroundColor} onChange={handleChange} className="h-10 bg-[#0f0f1a] border-[#4d4dff]" />
              </div>
              <div className="space-y-2">
                <Label className="text-[8px]">Cor dos Cards</Label>
                <Input type="color" name="cardColor" value={config.cardColor} onChange={handleChange} className="h-10 bg-[#0f0f1a] border-[#4d4dff]" />
              </div>
            </div>
          </div>

          {/* Links e Botões */}
          <div className="space-y-4 pt-4 border-t-2 border-[#4d4dff]/20">
            <h2 className="text-[#ff4d4d] text-[10px]">Links e Botões</h2>
            <div className="space-y-2">
              <Label className="text-[8px]">Texto Botão 1</Label>
              <Input name="longFormText" value={config.longFormText} onChange={handleChange} className="bg-[#0f0f1a] border-[#4d4dff] text-[10px]" />
            </div>
            <div className="space-y-2">
              <Label className="text-[8px]">Texto Botão 2</Label>
              <Input name="shortFormText" value={config.shortFormText} onChange={handleChange} className="bg-[#0f0f1a] border-[#4d4dff] text-[10px]" />
            </div>
            <div className="space-y-2">
              <Label className="text-[8px]">Email de Contato</Label>
              <Input name="email" value={config.email} onChange={handleChange} className="bg-[#0f0f1a] border-[#4d4dff] text-[10px]" />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={() => navigate('/')} className="flex-1 bg-[#4d4dff] hover:bg-[#3d3dff] text-[8px] h-12 rounded-full border-b-4 border-r-4 border-[#2d2dbf]">
            <Save className="mr-2 w-4 h-4" /> SALVAR E VOLTAR
          </Button>
          <Button onClick={resetConfig} variant="destructive" className="bg-[#ff4d4d] hover:bg-[#ff3333] text-[8px] h-12 rounded-full border-b-4 border-r-4 border-[#992d2d]">
            <RotateCcw className="mr-2 w-4 h-4" /> RESETAR
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;