import { useLocation } from "wouter";
import { Layout } from "@/components/layout";
import { useGetSettings, useGetPlayerProfile, useGetPlayerTanks } from "@workspace/api-client-react";
import { TacCard, StatBox, FadeIn, TacButton, TacBadge, cn } from "@/components/ui/tactical";
import { Crosshair, Shield, Target, Award, Clock, Link2, UserCheck, ExternalLink, Star } from "lucide-react";
import { format } from "date-fns";

const getStatColor = (type: "winrate" | "damage", value: number) => {
  if (type === "winrate") {
    if (value >= 60) return "text-[#c64cff]";
    if (value >= 55) return "text-tactical-green";
    if (value >= 50) return "text-tactical-yellow";
    return "text-tactical-red";
  }
  if (type === "damage") {
    if (value >= 2500) return "text-[#c64cff]";
    if (value >= 1800) return "text-tactical-green";
    if (value >= 1200) return "text-tactical-yellow";
    return "text-tactical-red";
  }
  return "text-foreground";
};

const DEMO_PLAYER = {
  account_id: 0,
  nickname: "Commander_Demo",
  created_at: Math.floor(Date.now() / 1000) - 365 * 24 * 3600 * 3,
  last_battle_time: Math.floor(Date.now() / 1000) - 7200,
  statistics: {
    battles: 7842,
    wins: 4471,
    losses: 3371,
    frags: 6250,
    damage_dealt: 10_840_000,
    damage_received: 9_340_000,
    spotted: 2420,
    hits: 560320,
    shots: 640000,
    survived_battles: 2900,
    xp: 3_530_000,
    win_rate: 57.02,
    avg_damage: 1382,
    avg_frags: 0.80,
  },
  max_frags: 11,
  max_damage: 9540,
  max_xp: 6210,
  clan_tag: "DEMO",
  clan_id: 1,
  is_own_profile: true,
};

const DEMO_TANKS = [
  { tank_id: 5, tank_name: "IS-7", tank_tier: 10, tank_type: "HT", battles: 1200, wins: 720, frags: 900, damage_dealt: 1_800_000, mark_of_mastery: 4, win_rate: 60.0, avg_damage: 1500, last_battle_time: Date.now() / 1000 - 3600 },
  { tank_id: 6, tank_name: "T-62A", tank_tier: 10, tank_type: "MT", battles: 850, wins: 475, frags: 720, damage_dealt: 1_250_000, mark_of_mastery: 3, win_rate: 55.9, avg_damage: 1471, last_battle_time: Date.now() / 1000 - 7200 },
  { tank_id: 7, tank_name: "E 50 Ausf. M", tank_tier: 10, tank_type: "MT", battles: 600, wins: 320, frags: 490, damage_dealt: 900_000, mark_of_mastery: 3, win_rate: 53.3, avg_damage: 1500, last_battle_time: Date.now() / 1000 - 14400 },
  { tank_id: 8, tank_name: "Object 430U", tank_tier: 10, tank_type: "MT", battles: 400, wins: 240, frags: 310, damage_dealt: 640_000, mark_of_mastery: 2, win_rate: 60.0, avg_damage: 1600, last_battle_time: Date.now() / 1000 - 86400 },
  { tank_id: 9, tank_name: "Centurion Action X", tank_tier: 10, tank_type: "MT", battles: 300, wins: 160, frags: 240, damage_dealt: 480_000, mark_of_mastery: 2, win_rate: 53.3, avg_damage: 1600, last_battle_time: Date.now() / 1000 - 172800 },
];

function ProfileView({ player, tanks, isLinked }: { player: typeof DEMO_PLAYER; tanks: typeof DEMO_TANKS; isLinked: boolean }) {
  const [, setLocation] = useLocation();
  const stats = player.statistics;

  return (
    <div className="max-w-6xl mx-auto w-full space-y-6">

      {/* Link account banner if demo */}
      {!isLinked && (
        <FadeIn>
          <div className="flex items-center justify-between gap-4 bg-primary/10 border border-primary/40 rounded-sm px-5 py-3">
            <div className="flex items-center gap-3 text-sm font-display tracking-widest uppercase">
              <Link2 className="w-5 h-5 text-primary shrink-0" />
              <span className="text-muted-foreground">
                This is <span className="text-primary">demo data</span>. Link your Wargaming account to see your real statistics.
              </span>
            </div>
            <TacButton size="sm" onClick={() => setLocation("/settings")} className="shrink-0">
              Link Account
            </TacButton>
          </div>
        </FadeIn>
      )}

      {/* Header */}
      <FadeIn>
        <div className="relative w-full rounded-sm overflow-hidden border border-white/10 bg-card">
          <div className="absolute inset-0 z-0">
            <img src={`${import.meta.env.BASE_URL}images/tank-hero.png`} alt="Hero" className="w-full h-full object-cover opacity-25 mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          </div>
          <div className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row items-end md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-secondary border-2 border-primary/70 flex items-center justify-center text-4xl font-display font-bold shadow-[0_0_30px_rgba(255,107,0,0.4)] relative">
                {player.nickname.substring(0, 2).toUpperCase()}
                {isLinked && (
                  <div className="absolute -bottom-2 -right-2 bg-tactical-green rounded-full p-1">
                    <UserCheck className="w-4 h-4 text-black" />
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <h1 className="text-4xl md:text-5xl font-bold font-sans tracking-tight leading-none text-glow">
                    {player.nickname}
                  </h1>
                  {player.clan_tag && (
                    <span className="text-xl md:text-2xl text-primary font-display tracking-widest bg-primary/10 px-2 py-1 border border-primary/30">
                      [{player.clan_tag}]
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm font-display tracking-widest uppercase text-muted-foreground mt-2">
                  <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> ID: {player.account_id || "—"}</span>
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Last Battle: {format(new Date(player.last_battle_time * 1000), "MMM d, yyyy")}</span>
                  <TacBadge variant="default" className="bg-primary/20 text-primary border-primary/40 text-xs">
                    <Star className="w-3 h-3 mr-1" /> My Profile
                  </TacBadge>
                </div>
              </div>
            </div>
            {isLinked && (
              <a
                href={`https://blitzstars.com/player/eu/${player.nickname}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 font-display uppercase tracking-widest text-sm transition-colors"
              >
                <ExternalLink className="w-4 h-4" /> BlitzStars
              </a>
            )}
          </div>
        </div>
      </FadeIn>

      {/* Core Metrics */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <TacCard className="p-0 border-l-4 border-l-primary">
            <StatBox label="Battles Fought" value={stats.battles.toLocaleString()} colorClass="text-3xl" />
          </TacCard>
          <TacCard className="p-0">
            <StatBox label="Win Rate" value={`${stats.win_rate.toFixed(2)}%`} colorClass={cn("text-3xl", getStatColor("winrate", stats.win_rate))} />
          </TacCard>
          <TacCard className="p-0">
            <StatBox label="Avg Damage" value={Math.round(stats.avg_damage).toLocaleString()} colorClass={cn("text-3xl", getStatColor("damage", stats.avg_damage))} />
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
            <h3 className="text-lg font-display uppercase tracking-widest text-primary flex items-center gap-2 mb-4"><Crosshair className="w-5 h-5" /> Efficiency</h3>
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
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-muted-foreground font-sans">Survival Rate</span>
                <span className="font-bold text-tactical-yellow">{((stats.survived_battles / Math.max(1, stats.battles)) * 100).toFixed(1)}%</span>
              </div>
            </div>
          </TacCard>

          <TacCard className="p-6 space-y-4">
            <h3 className="text-lg font-display uppercase tracking-widest text-primary flex items-center gap-2 mb-4"><Target className="w-5 h-5" /> Accuracy</h3>
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
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-muted-foreground font-sans">Total XP Earned</span>
                <span className="font-bold">{stats.xp.toLocaleString()}</span>
              </div>
            </div>
          </TacCard>

          <TacCard className="p-6 space-y-4">
            <h3 className="text-lg font-display uppercase tracking-widest text-primary flex items-center gap-2 mb-4"><Award className="w-5 h-5" /> Maximums</h3>
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
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-muted-foreground font-sans">Total Kills</span>
                <span className="font-bold">{stats.frags.toLocaleString()}</span>
              </div>
            </div>
          </TacCard>
        </div>
      </FadeIn>

      {/* Vehicle Table */}
      <FadeIn delay={0.3}>
        <h2 className="text-2xl font-display uppercase tracking-widest mb-4 mt-8 border-b border-white/10 pb-2">Vehicle Performance</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-white/10 bg-black/40 font-display tracking-widest uppercase text-muted-foreground">
                <th className="p-4 font-normal">Vehicle</th>
                <th className="p-4 font-normal text-center">Tier</th>
                <th className="p-4 font-normal text-center">Type</th>
                <th className="p-4 font-normal text-right">Battles</th>
                <th className="p-4 font-normal text-right">Win Rate</th>
                <th className="p-4 font-normal text-right">Avg Dmg</th>
                <th className="p-4 font-normal text-center">Mastery</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tanks.map((tank) => (
                <tr key={tank.tank_id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold">{tank.tank_name}</td>
                  <td className="p-4 text-center text-primary font-display font-bold">{tank.tank_tier}</td>
                  <td className="p-4 text-center text-muted-foreground font-display text-xs">{tank.tank_type}</td>
                  <td className="p-4 text-right">{tank.battles.toLocaleString()}</td>
                  <td className={cn("p-4 text-right font-bold", getStatColor("winrate", tank.win_rate))}>
                    {tank.win_rate.toFixed(2)}%
                  </td>
                  <td className={cn("p-4 text-right font-bold", getStatColor("damage", tank.avg_damage))}>
                    {Math.round(tank.avg_damage).toLocaleString()}
                  </td>
                  <td className="p-4 text-center">
                    {tank.mark_of_mastery > 0 ? (
                      <span className="inline-block w-6 h-6 bg-tactical-yellow text-black font-display font-bold text-xs leading-6 text-center">
                        {tank.mark_of_mastery === 4 ? "M" : tank.mark_of_mastery}
                      </span>
                    ) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FadeIn>
    </div>
  );
}

export default function MyProfile() {
  const { data: settings, isLoading: settingsLoading } = useGetSettings();
  const accountId = settings?.account_id ?? 0;
  const server = (settings?.server as "eu" | "com" | "asia") || "eu";
  const isLinked = !!settings?.wg_nickname;

  const { data: profileRes, isLoading: profileLoading } = useGetPlayerProfile(
    accountId,
    { server },
    { query: { enabled: !!accountId } }
  );
  const { data: tanksRes, isLoading: tanksLoading } = useGetPlayerTanks(
    accountId,
    { server },
    { query: { enabled: !!accountId } }
  );

  if (settingsLoading || (isLinked && profileLoading)) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[60vh]">
          <span className="animate-pulse text-primary font-display uppercase tracking-widest text-xl">Accessing Records...</span>
        </div>
      </Layout>
    );
  }

  if (isLinked && profileRes?.player) {
    const realPlayer = {
      ...profileRes.player,
      is_own_profile: true,
    };
    const realTanks = tanksRes?.tanks ?? DEMO_TANKS;
    return (
      <Layout>
        <ProfileView player={realPlayer as typeof DEMO_PLAYER} tanks={realTanks} isLinked={true} />
      </Layout>
    );
  }

  return (
    <Layout>
      <ProfileView player={DEMO_PLAYER} tanks={DEMO_TANKS} isLinked={false} />
    </Layout>
  );
}
