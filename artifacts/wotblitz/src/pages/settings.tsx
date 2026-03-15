import { useState } from "react";
import { Layout } from "@/components/layout";
import { TacCard, TacButton, FadeIn, cn } from "@/components/ui/tactical";
import { Settings as SettingsIcon, Link2, Shield, Bell, CheckCircle, Save, Globe, Trash2 } from "lucide-react";

interface SettingsState {
  wg_nickname: string;
  account_id: string;
  server: "eu" | "com" | "asia";
  notifications_enabled: boolean;
  tournament_alerts: boolean;
  show_clan_tag: boolean;
  privacy_mode: boolean;
  language: string;
  theme: "dark" | "light" | "system";
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex w-12 h-6 items-center transition-colors focus:outline-none",
        checked ? "bg-primary" : "bg-white/10"
      )}
    >
      <span
        className={cn(
          "inline-block w-4 h-4 bg-white transition-transform mx-1",
          checked ? "translate-x-6" : "translate-x-0"
        )}
      />
    </button>
  );
}

export default function Settings() {
  const [form, setForm] = useState<SettingsState>({
    wg_nickname: "",
    account_id: "",
    server: "eu",
    notifications_enabled: true,
    tournament_alerts: true,
    show_clan_tag: true,
    privacy_mode: false,
    language: "en",
    theme: "dark",
  });

  const [saved, setSaved] = useState(false);
  const [linked, setLinked] = useState(false);

  const set = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.wg_nickname.trim()) setLinked(true);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleUnlink = () => {
    setForm((prev) => ({ ...prev, wg_nickname: "", account_id: "" }));
    setLinked(false);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto w-full space-y-8">
        <FadeIn>
          <header className="border-b border-white/10 pb-6">
            <h1 className="text-4xl md:text-5xl text-glow mb-1 uppercase tracking-widest flex items-center gap-4">
              <SettingsIcon className="w-9 h-9 text-primary" />
              System Config
            </h1>
            <p className="text-muted-foreground font-sans text-sm">
              Modify your terminal interface and network connections.
            </p>
          </header>
        </FadeIn>

        <form onSubmit={handleSave} className="space-y-6">

          {/* Wargaming Account Link */}
          <FadeIn delay={0.05}>
            <TacCard className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6 pb-3 border-b border-white/5">
                <Link2 className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-display uppercase tracking-widest">Wargaming Account</h2>
                {linked && (
                  <span className="ml-auto flex items-center gap-1.5 text-xs font-display uppercase tracking-widest text-tactical-green">
                    <CheckCircle className="w-4 h-4" /> Linked
                  </span>
                )}
              </div>

              {linked ? (
                <div className="flex items-center justify-between bg-tactical-green/5 border border-tactical-green/20 p-4">
                  <div>
                    <div className="font-bold font-sans text-lg">{form.wg_nickname}</div>
                    <div className="text-xs font-display tracking-widest uppercase text-muted-foreground mt-0.5">
                      {form.server.toUpperCase()} Cluster · Account linked
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleUnlink}
                    className="flex items-center gap-2 text-xs font-display uppercase tracking-widest text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Unlink
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-display tracking-widest uppercase text-muted-foreground">
                      Commander Alias (WG Nickname)
                    </label>
                    <input
                      type="text"
                      value={form.wg_nickname}
                      onChange={(e) => set("wg_nickname", e.target.value)}
                      placeholder="Enter exact in-game name"
                      className="w-full h-11 px-4 bg-input border border-border text-foreground focus:outline-none focus:border-primary font-sans text-sm transition-colors"
                    />
                    <p className="text-xs text-muted-foreground">Used to fetch your real statistics on your profile page.</p>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-display tracking-widest uppercase text-muted-foreground">
                      Server Cluster
                    </label>
                    <select
                      value={form.server}
                      onChange={(e) => set("server", e.target.value as SettingsState["server"])}
                      className="w-full h-11 px-4 bg-input border border-border text-foreground appearance-none focus:outline-none focus:border-primary font-display tracking-widest uppercase text-sm"
                    >
                      <option value="eu">Europe (EU)</option>
                      <option value="com">North America (NA)</option>
                      <option value="asia">Asia (ASIA)</option>
                    </select>
                  </div>
                </div>
              )}
            </TacCard>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Privacy & Display */}
            <FadeIn delay={0.1}>
              <TacCard className="p-6 md:p-8 h-full">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-white/5">
                  <Shield className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-display uppercase tracking-widest">Privacy & Display</h2>
                </div>
                <div className="space-y-5">
                  {[
                    {
                      key: "privacy_mode" as const,
                      label: "Ghost Mode",
                      desc: "Hide your stats from public search results",
                    },
                    {
                      key: "show_clan_tag" as const,
                      label: "Show Clan Tag",
                      desc: "Display your clan affiliation on posts and profile",
                    },
                  ].map(({ key, label, desc }) => (
                    <label key={key} className="flex items-center justify-between cursor-pointer group">
                      <div>
                        <div className="font-bold font-sans text-sm group-hover:text-primary transition-colors">{label}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
                      </div>
                      <Toggle checked={form[key] as boolean} onChange={(v) => set(key, v)} />
                    </label>
                  ))}
                </div>
              </TacCard>
            </FadeIn>

            {/* Notifications */}
            <FadeIn delay={0.15}>
              <TacCard className="p-6 md:p-8 h-full">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-white/5">
                  <Bell className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-display uppercase tracking-widest">Notifications</h2>
                </div>
                <div className="space-y-5">
                  {[
                    {
                      key: "notifications_enabled" as const,
                      label: "Network Alerts",
                      desc: "General notifications from the BlitzNet network",
                    },
                    {
                      key: "tournament_alerts" as const,
                      label: "Operation Alerts",
                      desc: "Alerts when new tournaments are announced",
                    },
                  ].map(({ key, label, desc }) => (
                    <label key={key} className="flex items-center justify-between cursor-pointer group">
                      <div>
                        <div className="font-bold font-sans text-sm group-hover:text-primary transition-colors">{label}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
                      </div>
                      <Toggle checked={form[key] as boolean} onChange={(v) => set(key, v)} />
                    </label>
                  ))}
                </div>
              </TacCard>
            </FadeIn>
          </div>

          {/* Language & Theme */}
          <FadeIn delay={0.2}>
            <TacCard className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6 pb-3 border-b border-white/5">
                <Globe className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-display uppercase tracking-widest">Interface</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-display tracking-widest uppercase text-muted-foreground">Language</label>
                  <select
                    value={form.language}
                    onChange={(e) => set("language", e.target.value)}
                    className="w-full h-11 px-4 bg-input border border-border text-foreground appearance-none focus:outline-none focus:border-primary font-display tracking-widest uppercase text-sm"
                  >
                    <option value="en">English</option>
                    <option value="ru">Русский</option>
                    <option value="de">Deutsch</option>
                    <option value="fr">Français</option>
                    <option value="pl">Polski</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-display tracking-widest uppercase text-muted-foreground">Color Scheme</label>
                  <select
                    value={form.theme}
                    onChange={(e) => set("theme", e.target.value as SettingsState["theme"])}
                    className="w-full h-11 px-4 bg-input border border-border text-foreground appearance-none focus:outline-none focus:border-primary font-display tracking-widest uppercase text-sm"
                  >
                    <option value="dark">Tactical Dark</option>
                    <option value="light">Light Mode</option>
                    <option value="system">System Default</option>
                  </select>
                </div>
              </div>
            </TacCard>
          </FadeIn>

          {/* Save */}
          <FadeIn delay={0.25}>
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/10">
              {saved && (
                <span className="flex items-center gap-2 text-tactical-green font-display uppercase tracking-widest text-sm animate-in fade-in slide-in-from-right-4">
                  <CheckCircle className="w-4 h-4" /> Configuration Saved
                </span>
              )}
              <TacButton type="submit" size="lg">
                <Save className="w-5 h-5 mr-2" /> Commit Changes
              </TacButton>
            </div>
          </FadeIn>

        </form>
      </div>
    </Layout>
  );
}
