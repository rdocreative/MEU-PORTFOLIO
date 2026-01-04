import ProfileCard from "@/components/ProfileCard";
import Navbar from "@/components/Navbar";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { useConfig } from "@/context/ConfigContext";

const Index = () => {
  const { config } = useConfig();

  return (
    <div 
      style={{ backgroundColor: config.backgroundColor }}
      className="min-h-screen flex flex-col items-center p-4 font-['Press_Start_2P'] relative overflow-hidden transition-colors duration-500"
    >
      {/* Navbar */}
      <Navbar />

      {/* Background decoration elements */}
      <div style={{ backgroundColor: `${config.primaryColor}33` }} className="absolute top-24 left-10 w-4 h-4 animate-pulse"></div>
      <div style={{ borderColor: `${config.secondaryColor}33` }} className="absolute bottom-20 right-20 w-8 h-8 border-2 rotate-45"></div>
      <div className="absolute top-1/3 right-10 w-2 h-2 bg-white/10 rounded-full"></div>
      
      {/* Main Content */}
      <main className="z-10 w-full flex justify-center mt-32 mb-12">
        <ProfileCard />
      </main>

      <footer className="mt-auto pb-8 z-10 opacity-50 hover:opacity-100 transition-opacity">
        <MadeWithDyad />
      </footer>
    </div>
  );
};

export default Index;