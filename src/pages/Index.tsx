import ProfileCard from "@/components/ProfileCard";
import Navbar from "@/components/Navbar";
import StarsBackground from "@/components/StarsBackground";
import ClientsSection from "@/components/ClientsSection";
import VideoSection from "@/components/VideoSection";
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

      {/* Main Content */}
      <main className="z-10 w-full flex flex-col items-center mt-32 mb-20">
        <ProfileCard />
        <VideoSection />
        <ClientsSection />
      </main>

      <footer className="mt-auto pb-8 z-10 opacity-30 hover:opacity-100 transition-opacity">
        <MadeWithDyad />
      </footer>
    </div>
  );
};

export default Index;