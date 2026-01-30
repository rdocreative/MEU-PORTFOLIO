export const getYouTubeId = (url: string) => {
  if (!url) return null;
  const cleanUrl = url.trim();
  
  // Regex permissivo que pega qualquer ID após os prefixos comuns
  const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|live\/|&v=)([^#&?]*).*/;
  const match = cleanUrl.match(regExp);
  
  // Retorna o ID se encontrado, independente do tamanho exato (embora geralmente seja 11)
  // Isso previne erros onde o ID vinha com caracteres ocultos ou novos formatos
  return (match && match[1]) ? match[1] : null;
};