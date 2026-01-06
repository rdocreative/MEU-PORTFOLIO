import { useMutation } from "@tanstack/react-query";
import { supabase } from "./client";
import { toast } from "react-hot-toast";

interface PortfolioConfigUpdate {
  profile_name?: string;
  description?: string;
  profile_image?: string;
  primary_color?: string;
  secondary_color?: string;
  background_color?: string;
  card_color?: string;
  twitter_url?: string;
  discord_url?: string;
  email?: string;
  clients?: any;
  featured_videos?: any;
  shorts_videos?: any;
}

// Hardcoded ID for the single configuration row
const CONFIG_ID = "00000000-0000-0000-0000-000000000000"; 

export const useUpdatePortfolioConfig = () => {
  return useMutation({
    mutationFn: async (data: PortfolioConfigUpdate) => {
      const { error } = await supabase
        .from('portfolio_config')
        .update(data)
        .eq('id', CONFIG_ID);

      if (error) {
        console.error("[useUpdatePortfolioConfig] Error updating config:", error);
        throw new Error("Failed to update portfolio configuration.");
      }
      return true;
    },
    onSuccess: () => {
      toast.success("Configuração atualizada com sucesso!");
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao atualizar a configuração.");
    },
  });
};