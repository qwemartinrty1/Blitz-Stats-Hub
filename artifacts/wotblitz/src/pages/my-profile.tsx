import { useLocation } from "wouter";
import { Layout } from "@/components/layout";
import { useGetSettings } from "@workspace/api-client-react";
import PlayerProfile from "./player-profile";
import { TacCard, TacButton, FadeIn } from "@/components/ui/tactical";
import { Link2, AlertTriangle } from "lucide-react";
import { useEffect } from "react";

export default function MyProfile() {
  const [, setLocation] = useLocation();
  const { data: settings, isLoading } = useGetSettings();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[60vh]">
          <span className="animate-pulse text-primary font-display uppercase tracking-widest text-xl">Accessing Secure Records...</span>
        </div>
      </Layout>
    );
  }

  // If no account is linked, show a prominent warning screen
  if (!settings?.account_id) {
    return (
      <Layout>
        <FadeIn className="max-w-2xl mx-auto mt-20">
          <TacCard className="p-10 border-tactical-orange/50 bg-tactical-orange/5 text-center relative overflow-hidden">
            <div className="absolute inset-0 scanlines pointer-events-none opacity-20"></div>
            
            <AlertTriangle className="w-20 h-20 text-tactical-orange mx-auto mb-6" />
            
            <h1 className="text-3xl md:text-4xl font-display uppercase tracking-widest font-bold mb-4 text-glow">
              Service Record Unavailable
            </h1>
            
            <p className="text-muted-foreground font-sans text-lg mb-8 max-w-lg mx-auto">
              Your Wargaming ID has not been linked to this terminal. To access your personal combat statistics and dossier, you must establish a connection.
            </p>
            
            <TacButton size="lg" onClick={() => setLocation("/settings")} className="text-lg">
              <Link2 className="w-5 h-5 mr-3" />
              Configure System Link
            </TacButton>
          </TacCard>
        </FadeIn>
      </Layout>
    );
  }

  // If linked, we trick the router/logic by rendering the PlayerProfile component 
  // but setting window.history to pretend we are on their ID so it reads it correctly.
  // Actually, a better approach for this strict mock is just to redirect to their profile page.
  useEffect(() => {
    if (settings?.account_id) {
       setLocation(`/players/${settings.account_id}?server=${settings.server}`);
    }
  }, [settings, setLocation]);

  return (
    <Layout>
      <div className="flex items-center justify-center h-[60vh]">
        <span className="animate-pulse text-primary font-display uppercase tracking-widest text-xl">Rerouting...</span>
      </div>
    </Layout>
  );
}
