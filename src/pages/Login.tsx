import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useConfig } from '@/context/ConfigContext';

const Login = () => {
  const navigate = useNavigate();
  const { session } = useConfig();

  useEffect(() => {
    if (session) {
      navigate('/settings');
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4 font-['Press_Start_2P']">
      <div className="w-full max-w-md bg-[#111] border-2 border-white p-8 rounded-2xl shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]">
        <h1 className="text-white text-center mb-8 text-xl">SYSTEM_ACCESS</h1>
        <div className="font-sans">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#ffffff',
                    brandAccent: '#a1a1aa',
                    inputBackground: '#000000',
                    inputText: '#ffffff',
                    inputBorder: '#333333',
                  },
                },
              },
            }}
            providers={[]}
            theme="dark"
          />
        </div>
        <div className="mt-6 text-center">
          <button 
            onClick={() => navigate('/')}
            className="text-[10px] text-zinc-500 hover:text-white transition-colors"
          >
            ← BACK_TO_HOME
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;