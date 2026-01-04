import ProfileCard from "@/components/ProfileCard";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#0f0f1a] flex flex-col items-center justify-center p-4 font-['Press_Start_2P'] relative overflow-hidden">
      {/* Background decoration elements */}
      <div className="absolute top-10 left-10 w-4 h-4 bg-[#4d4dff]/20 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-8 h-8 border-2 border-[#ff4d4d]/20 rotate-45"></div>
      <div className="absolute top-1/4 right-10 w-2 h-2 bg-white/10 rounded-full"></div>
      
      <main className="z-10 w-full flex justify-center">
        <ProfileCard />
      </main>

      <footer className="mt-12 z-10 opacity-50 hover:opacity-100 transition-opacity">
        <MadeWithDyad />
      </footer>
    </div>
  );
};

export default Index;