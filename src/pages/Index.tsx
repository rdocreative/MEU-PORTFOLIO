import ProfileCard from "@/components/ProfileCard";
import Navbar from "@/components/Navbar";
import StarsBackground from "@/components/StarsBackground";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { useConfig } from "@/context/ConfigContext";

const Index = () => {
  const { config } = useConfig();

  return (
    <div 
      style={{ backgroundColor: config.backgroundColor }}
      className="min-h-screen flex flex-col items-center p-4 font-['Press_Start_2P'] relative overflow-hidden transition-colors duration-500"
    >
      {/* Estrelas de Fundo */}
      <StarsBackground />

      {/* Navbar */}
      <Navbar />

      {/* Background decoration elements (ajustados para P&B) */}
      <div style={{ backgroundColor: `${config.primaryColor}22` }} className="absolute top-24 left-10 w-4 h-4 animate-bounce"></div>
      <div style={{ borderColor: `${config.secondaryColor}22` }} className="absolute bottom-20 right-20 w-8 h-8 border-2 rotate-45"></div>
      
      {/* Main Content */}
      <main className="z-10 w-full flex justify-center mt-32 mb-12">
        <ProfileCard />
      </main>

      <footer className="mt-auto pb-8 z-10 opacity-30 hover:opacity-100 transition-opacity">
        <MadeWithDyad />
      </footer>
    </div>
  );
};

export default Index;