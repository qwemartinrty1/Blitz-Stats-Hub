import { useRoute, useLocation } from "wouter";
import { Layout } from "@/components/layout";
import { TacCard, StatBox, FadeIn, TacButton, TacBadge, cn } from "@/components/ui/tactical";
import { Crosshair, Target, Award, Clock, Shield, Users, ArrowLeft, ExternalLink } from "lucide-react";

interface TankStat {
  tank_id: number;
  tank_name: string;
  tank_tier: number;
  tank_type: string;
  battles: number;
  wins: number;
  mark_of_mastery: number;
  win_rate: number;
  avg_damage: number;
}

interface PlayerData {
  account_id: number;
  nickname: string;
  clan_tag: string | null;
  server: string;
  created_at: string;
  last_battle: string;
  statistics: {
    battles: number;
    wins: number;
    losses: number;
    frags: number;
    damage_dealt: number;
    damage_received: number;
    spotted: number;
    hits: number;
    shots: number;
    survived_battles: number;
    xp: number;
    win_rate: number;
    avg_damage: number;
    avg_frags: number;
  };
  max_frags: number;
  max_damage: number;
  max_xp: number;
  tanks: TankStat[];
}

const MOCK_PLAYERS: Record<number, PlayerData> = {
  1001: {
    account_id: 1001,
    nickname: "TankAce_2024",
    clan_tag: "ELITE",
    server: "EU",
    created_at: "Mar 5, 2020",
    last_battle: "Today, 12:10",
    statistics: { battles: 8142, wins: 4893, losses: 3249, frags: 6820, damage_dealt: 12_400_000, damage_received: 10_800_000, spotted: 2610, hits: 585_000, shots: 670_000, survived_battles: 3100, xp: 4_020_000, win_rate: 60.1, avg_damage: 1523, avg_frags: 0.84 },
    max_frags: 13, max_damage: 11_200, max_xp: 7100,
    tanks: [
      { tank_id: 1, tank_name: "IS-7", tank_tier: 10, tank_type: "HT", battles: 2100, wins: 1323, mark_of_mastery: 4, win_rate: 63.0, avg_damage: 1620 },
      { tank_id: 2, tank_name: "T-62A", tank_tier: 10, tank_type: "MT", battles: 1200, wins: 716, mark_of_mastery: 4, win_rate: 59.7, avg_damage: 1540 },
      { tank_id: 3, tank_name: "Object 277", tank_tier: 10, tank_type: "HT", battles: 900, wins: 558, mark_of_mastery: 3, win_rate: 62.0, avg_damage: 1680 },
      { tank_id: 4, tank_name: "AMX 50B", tank_tier: 10, tank_type: "HT", battles: 600, wins: 348, mark_of_mastery: 3, win_rate: 58.0, avg_damage: 1590 },
      { tank_id: 5, tank_name: "IS-3", tank_tier: 8, tank_type: "HT", battles: 1500, wins: 825, mark_of_mastery: 4, win_rate: 55.0, avg_damage: 1180 },
    ],
  },
  1002: {
    account_id: 1002,
    nickname: "BlitzMaster",
    clan_tag: "PRO",
    server: "EU",
    created_at: "Jun 22, 2019",
    last_battle: "Today, 16:55",
    statistics: { battles: 12540, wins: 7248, losses: 5292, frags: 10_200, damage_dealt: 18_900_000, damage_received: 15_600_000, spotted: 4100, hits: 900_000, shots: 1_050_000, survived_battles: 4800, xp: 6_200_000, win_rate: 57.8, avg_damage: 1508, avg_frags: 0.81 },
    max_frags: 14, max_damage: 12_800, max_xp: 8200,
    tanks: [
      { tank_id: 1, tank_name: "T-62A", tank_tier: 10, tank_type: "MT", battles: 3200, wins: 1920, mark_of_mastery: 4, win_rate: 60.0, avg_damage: 1620 },
      { tank_id: 2, tank_name: "Object 430U", tank_tier: 10, tank_type: "MT", battles: 2100, wins: 1197, mark_of_mastery: 4, win_rate: 57.0, avg_damage: 1700 },
      { tank_id: 3, tank_name: "IS-7", tank_tier: 10, tank_type: "HT", battles: 1800, wins: 1026, mark_of_mastery: 3, win_rate: 57.0, avg_damage: 1530 },
      { tank_id: 4, tank_name: "E 50 Ausf. M", tank_tier: 10, tank_type: "MT", battles: 1400, wins: 798, mark_of_mastery: 3, win_rate: 57.0, avg_damage: 1490 },
    ],
  },
  1003: {
    account_id: 1003,
    nickname: "SteelWarrior",
    clan_tag: null,
    server: "EU",
    created_at: "Sep 10, 2021",
    last_battle: "Yesterday, 20:30",
    statistics: { battles: 5200, wins: 2777, losses: 2423, frags: 4100, damage_dealt: 7_200_000, damage_received: 6_500_000, spotted: 1800, hits: 375_000, shots: 440_000, survived_battles: 1820, xp: 2_400_000, win_rate: 53.4, avg_damage: 1385, avg_frags: 0.79 },
    max_frags: 9, max_damage: 8400, max_xp: 5200,
    tanks: [
      { tank_id: 1, tank_name: "Object 430U", tank_tier: 10, tank_type: "MT", battles: 1100, wins: 594, mark_of_mastery: 3, win_rate: 54.0, avg_damage: 1540 },
      { tank_id: 2, tank_name: "IS-3", tank_tier: 8, tank_type: "HT", battles: 900, wins: 477, mark_of_mastery: 3, win_rate: 53.0, avg_damage: 1200 },
      { tank_id: 3, tank_name: "T-44", tank_tier: 8, tank_type: "MT", battles: 700, wins: 378, mark_of_mastery: 2, win_rate: 54.0, avg_damage: 1100 },
    ],
  },
};

const FALLBACK_PLAYER: PlayerData = {
  account_id: 9999,
  nickname: "Unknown_Commander",
  clan_tag: null,
  server: "EU",
  created_at: "Jan 1, 2023",
  last_battle: "Unknown",
  statistics: { battles: 2100, wins: 1029, losses: 1071, frags: 1680, damage_dealt: 2_800_000, damage_received: 2_600_000, spotted: 730, hits: 152_000, shots: 180_000, survived_battles: 735, xp: 930_000, win_rate: 49.0, avg_damage: 1333, avg_frags: 0.80 },
  max_frags: 7, max_damage: 5800, max_xp: 4100,
  tanks: [
    { tank_id: 1, tank_name: "T-34-85M", tank_tier: 6, tank_type: "MT", battles: 420, wins: 210, mark_of_mastery: 2, win_rate: 50.0, avg_damage: 890 },
    { tank_id: 2, tank_name: "KV-1S", tank_tier: 5, tank_type: "HT", battles: 310, wins: 152, mark_of_mastery: 2, win_rate: 49.0, avg_damage: 720 },
  ],
};

function getStatColor(type: "winrate" | "damage", value: number) {
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
  return "";
}

export default function PlayerProfile() {
  const [match, params] = useRoute("/players/:id");
  const [, setLocation] = useLocation();
  const accountId = match ? parseInt(params.id) : 0;
  const p = MOCK_PLAYERS[accountId] ?? { ...FALLBACK_PLAYER, account_id: accountId };
  const s = p.statistics;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto w-full space-y-6">

        {/* Nav bar */}
        <FadeIn>
          <div className="flex items-center justify-between">
            <button
              onClick={() => (window.history.length > 1 ? window.history.back() : setLocation("/search"))}
              className="flex items-center gap-2 text-sm font-display tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="flex items-center gap-2 text-xs font-display tracking-widest uppercase text-muted-foreground bg-white/5 border border-white/10 px-3 py-1.5">
              <Users className="w-4 h-4 text-primary" /> Viewing Player Profile
            </div>
          </div>
        </FadeIn>

        {/* Hero */}
        <FadeIn>
          <div className="relative w-full overflow-hidden border border-white/10 bg-card">
            <div className="absolute inset-0 z-0">
              <img
                src={`${import.meta.env.BASE_URL}images/tank-hero.png`}
                alt=""
                className="w-full h-full object-cover opacity-20 mix-blend-overlay"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
            </div>
            <div className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row items-end md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 md:w-28 md:h-28 bg-secondary border-2 border-white/20 flex items-center justify-center text-3xl font-display font-bold">
                  {p.nickname.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <h1 className="text-3xl md:text-5xl font-bold font-sans tracking-tight leading-none">
                      {p.nickname}
                    </h1>
                    {p.clan_tag && (
                      <span className="text-xl md:text-2xl text-primary font-display tracking-widest bg-primary/10 px-2 py-0.5 border border-primary/30">
                        [{p.clan_tag}]
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-display tracking-widest uppercase text-muted-foreground mt-2">
                    <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> ID: {p.account_id.toLocaleString()}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Last Battle: {p.last_battle}</span>
                    <span>Server: {p.server}</span>
                  </div>
                </div>
              </div>
              <a
                href={`https://blitzstars.com/player/eu/${p.nickname}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 font-display uppercase tracking-widest text-xs transition-colors"
              >
                <ExternalLink className="w-4 h-4" /> BlitzStars
              </a>
            </div>
          </div>
        </FadeIn>

        {/* Key stats */}
        <FadeIn delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <TacCard className="p-0 border-l-4 border-l-white/30">
              <StatBox label="Battles Fought" value={s.battles.toLocaleString()} colorClass="text-3xl" />
            </TacCard>
            <TacCard className="p-0">
              <StatBox label="Win Rate" value={`${s.win_rate.toFixed(2)}%`} colorClass={cn("text-3xl", getStatColor("winrate", s.win_rate))} />
            </TacCard>
            <TacCard className="p-0">
              <StatBox label="Avg Damage" value={s.avg_damage.toLocaleString()} colorClass={cn("text-3xl", getStatColor("damage", s.avg_damage))} />
            </TacCard>
            <TacCard className="p-0">
              <StatBox label="Avg Frags" value={s.avg_frags.toFixed(2)} colorClass="text-3xl text-tactical-yellow" />
            </TacCard>
          </div>
        </FadeIn>

        {/* Combat details */}
        <FadeIn delay={0.15}>
          <h2 className="text-xl font-display uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Combat Records</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <TacCard className="p-5 space-y-3">
              <h3 className="font-display uppercase tracking-widest text-muted-foreground flex items-center gap-2 text-sm"><Crosshair className="w-4 h-4" /> Efficiency</h3>
              {[
                ["Damage Dealt", s.damage_dealt.toLocaleString()],
                ["Damage Received", s.damage_received.toLocaleString()],
                ["Damage Ratio", (s.damage_dealt / s.damage_received).toFixed(2), "text-tactical-green"],
                ["Survival Rate", `${((s.survived_battles / s.battles) * 100).toFixed(1)}%`, "text-tactical-yellow"],
                ["Total Kills", s.frags.toLocaleString()],
              ].map(([label, value, color]) => (
                <div key={label} className="flex justify-between border-b border-white/5 pb-2 text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className={cn("font-bold", color)}>{value}</span>
                </div>
              ))}
            </TacCard>

            <TacCard className="p-5 space-y-3">
              <h3 className="font-display uppercase tracking-widest text-muted-foreground flex items-center gap-2 text-sm"><Target className="w-4 h-4" /> Accuracy</h3>
              {[
                ["Shots Fired", s.shots.toLocaleString()],
                ["Hits", s.hits.toLocaleString()],
                ["Hit Rate", `${((s.hits / s.shots) * 100).toFixed(1)}%`, "text-tactical-yellow"],
                ["Enemies Spotted", s.spotted.toLocaleString()],
                ["Total XP", s.xp.toLocaleString()],
              ].map(([label, value, color]) => (
                <div key={label} className="flex justify-between border-b border-white/5 pb-2 text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className={cn("font-bold", color)}>{value}</span>
                </div>
              ))}
            </TacCard>

            <TacCard className="p-5 space-y-3">
              <h3 className="font-display uppercase tracking-widest text-muted-foreground flex items-center gap-2 text-sm"><Award className="w-4 h-4" /> Personal Records</h3>
              {[
                ["Max Damage", p.max_damage.toLocaleString(), "text-[#c64cff]"],
                ["Max Frags", String(p.max_frags), "text-tactical-orange"],
                ["Max XP", p.max_xp.toLocaleString(), "text-tactical-green"],
                ["Wins", s.wins.toLocaleString()],
                ["Account Created", p.created_at],
              ].map(([label, value, color]) => (
                <div key={label} className="flex justify-between border-b border-white/5 pb-2 text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className={cn("font-bold", color)}>{value}</span>
                </div>
              ))}
            </TacCard>
          </div>
        </FadeIn>

        {/* Tanks */}
        <FadeIn delay={0.2}>
          <h2 className="text-xl font-display uppercase tracking-widest mb-4 mt-4 border-b border-white/10 pb-2">Vehicle Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-white/10 bg-black/40 font-display tracking-widest uppercase text-muted-foreground text-xs">
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
                {p.tanks.map((tank) => (
                  <tr key={tank.tank_id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold">{tank.tank_name}</td>
                    <td className="p-4 text-center text-muted-foreground font-display font-bold">{tank.tank_tier}</td>
                    <td className="p-4 text-center text-muted-foreground font-display text-xs">{tank.tank_type}</td>
                    <td className="p-4 text-right">{tank.battles.toLocaleString()}</td>
                    <td className={cn("p-4 text-right font-bold", getStatColor("winrate", tank.win_rate))}>
                      {tank.win_rate.toFixed(1)}%
                    </td>
                    <td className={cn("p-4 text-right font-bold", getStatColor("damage", tank.avg_damage))}>
                      {tank.avg_damage.toLocaleString()}
                    </td>
                    <td className="p-4 text-center">
                      <span className={cn(
                        "inline-flex items-center justify-center w-6 h-6 text-xs font-display font-bold",
                        tank.mark_of_mastery === 4 ? "bg-tactical-yellow text-black" :
                        tank.mark_of_mastery >= 2 ? "bg-white/20 text-white" : "bg-white/5 text-muted-foreground"
                      )}>
                        {tank.mark_of_mastery === 4 ? "M" : tank.mark_of_mastery > 0 ? tank.mark_of_mastery : "—"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FadeIn>

      </div>
    </Layout>
  );
}
