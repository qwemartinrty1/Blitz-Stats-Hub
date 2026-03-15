import { useState, useEffect } from "react";
import { Layout } from "@/components/layout";
import { useGetSettings, useUpdateSettings, type UpdateSettingsInput } from "@workspace/api-client-react";
import { TacCard, TacInput, TacButton, FadeIn } from "@/components/ui/tactical";
import { Settings as SettingsIcon, Link2, Shield, Bell, Monitor, Save, CheckCircle } from "lucide-react";

export default function Settings() {
  const { data: settings, isLoading } = useGetSettings();
  const updateMutation = useUpdateSettings();

  const [formData, setFormData] = useState<UpdateSettingsInput>({
    server: "eu",
    theme: "dark",
    notifications_enabled: true,
    privacy_mode: false,
    show_clan_tag: true,
    wg_nickname: "",
    account_id: null,
  });

  const [savedOk, setSavedOk] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        server: settings.server,
        theme: settings.theme,
        notifications_enabled: settings.notifications_enabled,
        privacy_mode: settings.privacy_mode,
        show_clan_tag: settings.show_clan_tag,
        wg_nickname: settings.wg_nickname || "",
        account_id: settings.account_id,
      });
    }
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({ data: formData }, {
      onSuccess: () => {
        setSavedOk(true);
        setTimeout(() => setSavedOk(false), 3000);
      }
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[60vh]">
          <span className="animate-pulse text-primary font-display uppercase tracking-widest text-xl">Loading System Configuration...</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto w-full space-y-8">
        
        <FadeIn>
          <header className="mb-8 border-b border-white/10 pb-6">
            <h1 className="text-4xl md:text-5xl text-glow mb-2 uppercase tracking-widest flex items-center gap-4">
              <SettingsIcon className="w-10 h-10 text-primary" />
              System Config
            </h1>
            <p className="text-muted-foreground font-sans">Modify your terminal interface and network connections.</p>
          </header>
        </FadeIn>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          <FadeIn delay={0.1}>
            <TacCard className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6 pb-2 border-b border-white/5">
                <Link2 className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-display uppercase tracking-widest">Wargaming Link</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-display tracking-widest uppercase text-muted-foreground">Commander Alias (WG Nickname)</label>
                  <TacInput 
                    value={formData.wg_nickname || ""}
                    onChange={(e) => setFormData({...formData, wg_nickname: e.target.value})}
                    placeholder="Enter EXACT in-game name"
                  />
                  <p className="text-xs text-muted-foreground">Used to fetch your statistics for your profile.</p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-display tracking-widest uppercase text-muted-foreground">Server Cluster</label>
                  <select 
                    value={formData.server}
                    onChange={(e) => setFormData({...formData, server: e.target.value as any})}
                    className="w-full h-11 px-4 bg-input border border-border text-foreground clip-edges-sm appearance-none focus:outline-none focus:border-primary font-display tracking-widest uppercase"
                  >
                    <option value="eu">Europe</option>
                    <option value="com">North America</option>
                    <option value="asia">Asia</option>
                  </select>
                </div>
              </div>
            </TacCard>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <TacCard className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6 pb-2 border-b border-white/5">
                  <Shield className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-display uppercase tracking-widest">Security & Display</h2>
                </div>
                
                <div className="space-y-6">
                  <label className="flex items-center justify-between cursor-pointer group">
                    <div>
                      <div className="font-bold font-sans group-hover:text-primary transition-colors">Ghost Mode (Privacy)</div>
                      <div className="text-sm text-muted-foreground">Hide your stats from search results.</div>
                    </div>
                    <div className="relative">
                      <input type="checkbox" className="sr-only" checked={formData.privacy_mode} onChange={(e) => setFormData({...formData, privacy_mode: e.target.checked})} />
                      <div className={`w-12 h-6 clip-edges-sm transition-colors ${formData.privacy_mode ? 'bg-primary' : 'bg-white/10'}`}>
                        <div className={`w-4 h-4 bg-white m-1 transition-transform ${formData.privacy_mode ? 'translate-x-6' : 'translate-x-0'}`} />
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer group">
                    <div>
                      <div className="font-bold font-sans group-hover:text-primary transition-colors">Show Clan Tag</div>
                      <div className="text-sm text-muted-foreground">Display clan affiliation on feed.</div>
                    </div>
                    <div className="relative">
                      <input type="checkbox" className="sr-only" checked={formData.show_clan_tag} onChange={(e) => setFormData({...formData, show_clan_tag: e.target.checked})} />
                      <div className={`w-12 h-6 clip-edges-sm transition-colors ${formData.show_clan_tag ? 'bg-primary' : 'bg-white/10'}`}>
                        <div className={`w-4 h-4 bg-white m-1 transition-transform ${formData.show_clan_tag ? 'translate-x-6' : 'translate-x-0'}`} />
                      </div>
                    </div>
                  </label>
                </div>
              </TacCard>

              <TacCard className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6 pb-2 border-b border-white/5">
                  <Bell className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-display uppercase tracking-widest">Interface</h2>
                </div>
                
                <div className="space-y-6">
                  <label className="flex items-center justify-between cursor-pointer group">
                    <div>
                      <div className="font-bold font-sans group-hover:text-primary transition-colors">Network Notifications</div>
                      <div className="text-sm text-muted-foreground">Alerts for operation updates.</div>
                    </div>
                    <div className="relative">
                      <input type="checkbox" className="sr-only" checked={formData.notifications_enabled} onChange={(e) => setFormData({...formData, notifications_enabled: e.target.checked})} />
                      <div className={`w-12 h-6 clip-edges-sm transition-colors ${formData.notifications_enabled ? 'bg-primary' : 'bg-white/10'}`}>
                        <div className={`w-4 h-4 bg-white m-1 transition-transform ${formData.notifications_enabled ? 'translate-x-6' : 'translate-x-0'}`} />
                      </div>
                    </div>
                  </label>

                  <div className="space-y-2 pt-2">
                    <label className="text-sm font-display tracking-widest uppercase text-muted-foreground">Color Scheme (Terminal Override Active)</label>
                    <select 
                      disabled
                      value="dark"
                      className="w-full h-11 px-4 bg-input/50 border border-border/50 text-muted-foreground clip-edges-sm appearance-none cursor-not-allowed font-display tracking-widest uppercase"
                    >
                      <option value="dark">Tactical Dark Mode (Enforced)</option>
                    </select>
                  </div>
                </div>
              </TacCard>

            </div>
          </FadeIn>

          <FadeIn delay={0.3} className="flex items-center justify-end gap-4 pt-4 border-t border-white/10">
            {savedOk && (
              <span className="text-tactical-green font-display uppercase tracking-widest flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
                <CheckCircle className="w-5 h-5" /> Config Saved
              </span>
            )}
            <TacButton type="submit" size="lg" isLoading={updateMutation.isPending}>
              <Save className="w-5 h-5 mr-2" /> Commit Changes
            </TacButton>
          </FadeIn>

        </form>
      </div>
    </Layout>
  );
}
