import { useRoute, useLocation } from "wouter";
import { Layout } from "@/components/layout";
import { useGetPlayerProfile, useGetPlayerTanks } from "@workspace/api-client-react";
import { TacCard, StatBox, FadeIn, TacBadge, TacButton, cn } from "@/components/ui/tactical";
import { Crosshair, Shield, Target, Award, Clock, ArrowLeft, ExternalLink, Users } from "lucide-react";
import { format } from "date-fns";

// Color coding helper based on Wot Blitz standard colors
const getStatColor = (type: 'winrate' | 'damage', value: number) => {
  if (type === 'winrate') {
    if (value >= 60) return "text-[#c64cff]"; // Super Unicum
    if (value >= 55) return "text-tactical-green"; // Great
    if (value >= 50) return "text-tactical-yellow"; // Average
    return "text-tactical-red"; // Bad
  }
  if (type === 'damage') {
    if (value >= 2500) return "text-[#c64cff]";
    if (value >= 1800) return "text-tactical-green";
    if (value >= 1200) return "text-tactical-yellow";
    return "text-tactical-red";
  }
  return "text-foreground";
};

export default function PlayerProfile() {
  const [match, params] = useRoute("/players/:id");
  const [, setLocation] = useLocation();
  const accountId = match ? parseInt(params.id) : 0;
  
  // Extract server from query params if exists, default to eu
  const searchParams = new URLSearchParams(window.location.search);
  const server = (searchParams.get("server") as "eu" | "com" | "asia") || "eu";

  const { data: profileRes, isLoading: profileLoading } = useGetPlayerProfile(accountId, { server }, { query: { enabled: !!accountId } });
  const { data: tanksRes, isLoading: tanksLoading } = useGetPlayerTanks(accountId, { server }, { query: { enabled: !!accountId } });

  if (profileLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full min-h-[60vh]">
          <div className="text-primary animate-pulse font-display tracking-widest text-2xl uppercase">Downloading Dossier...</div>
        </div>
      </Layout>
    );
  }

  if (!profileRes?.player) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h1 className="text-3xl text-destructive font-display uppercase tracking-widest">Dossier Not Found</h1>
          <button onClick={() => setLocation("/search")} className="mt-4 text-primary hover:underline font-sans">Return to Search</button>
        </div>
      </Layout>
    );
  }

  const player = profileRes.player;
  const stats = player.statistics;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto w-full space-y-6">

        {/* Back + viewing-another-player banner */}
        <FadeIn>
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => window.history.length > 1 ? window.history.back() : setLocation("/search")}
              className="flex items-center gap-2 text-sm font-display tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="flex items-center gap-2 text-xs font-display tracking-widest uppercase text-muted-foreground bg-white/5 border border-white/10 px-3 py-1.5 rounded-sm">
              <Users className="w-4 h-4 text-primary" />
              Viewing Player Profile
            </div>
          </div>
        </FadeIn>

        {/* Header/Hero Section */}
        <FadeIn>
          <div className="relative w-full rounded-sm overflow-hidden border border-white/10 bg-card">
            <div className="absolute inset-0 z-0">
              <img src={`${import.meta.env.BASE_URL}images/tank-hero.png`} alt="Hero" className="w-full h-full object-cover opacity-30 mix-blend-overlay" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
            </div>
            
            <div className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row items-end md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-secondary border-2 border-primary/50 clip-edges-sm flex items-center justify-center text-4xl font-display font-bold shadow-[0_0_30px_rgba(255,107,0,0.3)]">
                  {player.nickname.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-4xl md:text-6xl font-bold font-sans tracking-tight leading-none text-glow">
                      {player.nickname}
                    </h1>
                    {player.clan_tag && (
                      <span className="text-2xl md:text-3xl text-primary font-display tracking-widest bg-primary/10 px-3 py-1 border border-primary/30">
                        [{player.clan_tag}]
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm font-display tracking-widest uppercase text-muted-foreground">
                    <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> ID: {player.account_id}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Active: {format(new Date(player.last_battle_time * 1000), "MMM d, yyyy")}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex md:flex-col gap-3 w-full md:w-auto">
                <a href={`https://blitzstars.com/player/${server}/${player.nickname}`} target="_blank" rel="noreferrer" 
                   className="flex-1 text-center bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 font-display uppercase tracking-widest text-sm transition-colors flex items-center justify-center gap-2">
                  <ExternalLink className="w-4 h-4" /> BlitzStars
                </a>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Core Metrics Grid */}
        <FadeIn delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <TacCard className="p-0 border-l-4 border-l-primary">
              <StatBox label="Battles Fought" value={stats.battles.toLocaleString()} colorClass="text-3xl" />
            </TacCard>
            <TacCard className="p-0">
              <StatBox 
                label="Win Rate" 
                value={`${stats.win_rate.toFixed(2)}%`} 
                colorClass={cn("text-3xl", getStatColor('winrate', stats.win_rate))} 
              />
            </TacCard>
            <TacCard className="p-0">
              <StatBox 
                label="Avg Damage" 
                value={Math.round(stats.avg_damage).toLocaleString()} 
                colorClass={cn("text-3xl", getStatColor('damage', stats.avg_damage))} 
              />
            </TacCard>
            <TacCard className="p-0">
              <StatBox label="Avg Frags" value={stats.avg_frags.toFixed(2)} colorClass="text-3xl text-tactical-yellow" />
            </TacCard>
          </div>
        </FadeIn>

        {/* Detailed Stats */}
        <FadeIn delay={0.2}>
          <h2 className="text-2xl font-display uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Combat Records</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <TacCard className="p-6 space-y-4">
              <h3 className="text-lg font-display uppercase tracking-widest text-primary flex items-center gap-2 mb-4"><Crosshair className="w-5 h-5"/> Efficiency</h3>
              <div className="space-y-3">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-muted-foreground font-sans">Damage Dealt</span>
                  <span className="font-bold">{stats.damage_dealt.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-muted-foreground font-sans">Damage Received</span>
                  <span className="font-bold">{stats.damage_received.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-muted-foreground font-sans">Damage Ratio</span>
                  <span className="font-bold text-tactical-green">{(stats.damage_dealt / Math.max(1, stats.damage_received)).toFixed(2)}</span>
                </div>
              </div>
            </TacCard>

            <TacCard className="p-6 space-y-4">
              <h3 className="text-lg font-display uppercase tracking-widest text-primary flex items-center gap-2 mb-4"><Target className="w-5 h-5"/> Accuracy</h3>
              <div className="space-y-3">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-muted-foreground font-sans">Shots Fired</span>
                  <span className="font-bold">{stats.shots.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-muted-foreground font-sans">Hits</span>
                  <span className="font-bold">{stats.hits.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-muted-foreground font-sans">Hit Rate</span>
                  <span className="font-bold text-tactical-yellow">{((stats.hits / Math.max(1, stats.shots)) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </TacCard>

            <TacCard className="p-6 space-y-4">
              <h3 className="text-lg font-display uppercase tracking-widest text-primary flex items-center gap-2 mb-4"><Award className="w-5 h-5"/> Maximums</h3>
              <div className="space-y-3">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-muted-foreground font-sans">Max Damage</span>
                  <span className="font-bold text-[#c64cff]">{player.max_damage.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-muted-foreground font-sans">Max Frags</span>
                  <span className="font-bold text-tactical-orange">{player.max_frags}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-muted-foreground font-sans">Max XP</span>
                  <span className="font-bold text-tactical-green">{player.max_xp.toLocaleString()}</span>
                </div>
              </div>
            </TacCard>

          </div>
        </FadeIn>

        {/* Top Vehicles */}
        <FadeIn delay={0.3}>
          <h2 className="text-2xl font-display uppercase tracking-widest mb-4 mt-8 border-b border-white/10 pb-2">Vehicle Performance</h2>
          {tanksLoading ? (
             <div className="h-32 bg-white/5 animate-pulse border border-white/10" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-sm whitespace-nowrap">
                <thead>
                  <tr className="border-b border-white/10 bg-black/40 font-display tracking-widest uppercase text-muted-foreground">
                    <th className="p-4 font-normal">Vehicle</th>
                    <th className="p-4 font-normal text-center">Tier</th>
                    <th className="p-4 font-normal text-right">Battles</th>
                    <th className="p-4 font-normal text-right">Win Rate</th>
                    <th className="p-4 font-normal text-right">Avg Dmg</th>
                    <th className="p-4 font-normal text-center">Mastery</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {tanksRes?.tanks?.slice(0, 10).map((tank) => (
                    <tr key={tank.tank_id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-bold">{tank.tank_name}</td>
                      <td className="p-4 text-center text-primary font-display font-bold">{tank.tank_tier}</td>
                      <td className="p-4 text-right">{tank.battles.toLocaleString()}</td>
                      <td className={cn("p-4 text-right font-bold", getStatColor('winrate', tank.win_rate))}>
                        {tank.win_rate.toFixed(2)}%
                      </td>
                      <td className={cn("p-4 text-right font-bold", getStatColor('damage', tank.avg_damage))}>
                        {Math.round(tank.avg_damage).toLocaleString()}
                      </td>
                      <td className="p-4 text-center">
                        {tank.mark_of_mastery > 0 ? (
                          <span className="inline-block w-6 h-6 bg-tactical-yellow text-black font-display font-bold clip-edges-sm leading-6">
                            {tank.mark_of_mastery === 4 ? 'M' : tank.mark_of_mastery}
                          </span>
                        ) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </FadeIn>

      </div>
    </Layout>
  );
}
