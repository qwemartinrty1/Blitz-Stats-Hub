import { useLocation } from "wouter";
import { Layout } from "@/components/layout";
import { TacCard, StatBox, FadeIn, TacButton, TacBadge, cn } from "@/components/ui/tactical";
import { Crosshair, Shield, Target, Award, Clock, Star, ExternalLink } from "lucide-react";

const MY_PROFILE = {
  account_id: 581_294_871,
  nickname: "Commander_You",
  clan_tag: "ELITE",
  server: "EU",
  created_at: "Feb 14, 2021",
  last_battle: "Today, 14:32",
  statistics: {
    battles: 7842,
    wins: 4471,
    losses: 3371,
    frags: 6250,
    damage_dealt: 10_840_000,
    damage_received: 9_340_000,
    spotted: 2420,
    hits: 560_320,
    shots: 640_000,
    survived_battles: 2900,
    xp: 3_530_000,
    win_rate: 57.02,
    avg_damage: 1382,
    avg_frags: 0.80,
  },
  max_frags: 11,
  max_damage: 9540,
  max_xp: 6210,
};

const MY_TANKS = [
  { tank_id: 1, tank_name: "IS-7", tank_tier: 10, tank_type: "HT", battles: 1200, wins: 720, frags: 900, mark_of_mastery: 4, win_rate: 60.0, avg_damage: 1500 },
  { tank_id: 2, tank_name: "T-62A", tank_tier: 10, tank_type: "MT", battles: 850, wins: 475, frags: 720, mark_of_mastery: 3, win_rate: 55.9, avg_damage: 1471 },
  { tank_id: 3, tank_name: "E 50 Ausf. M", tank_tier: 10, tank_type: "MT", battles: 600, wins: 320, frags: 490, mark_of_mastery: 3, win_rate: 53.3, avg_damage: 1500 },
  { tank_id: 4, tank_name: "Object 430U", tank_tier: 10, tank_type: "MT", battles: 400, wins: 240, frags: 310, mark_of_mastery: 2, win_rate: 60.0, avg_damage: 1600 },
  { tank_id: 5, tank_name: "Centurion Action X", tank_tier: 10, tank_type: "MT", battles: 300, wins: 160, frags: 240, mark_of_mastery: 2, win_rate: 53.3, avg_damage: 1600 },
  { tank_id: 6, tank_name: "IS-3", tank_tier: 8, tank_type: "HT", battles: 1100, wins: 583, frags: 770, mark_of_mastery: 4, win_rate: 53.0, avg_damage: 1210 },
  { tank_id: 7, tank_name: "T-44", tank_tier: 8, tank_type: "MT", battles: 520, wins: 295, frags: 420, mark_of_mastery: 3, win_rate: 56.7, avg_damage: 1140 },
];

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

export default function MyProfile() {
  const [, setLocation] = useLocation();
  const p = MY_PROFILE;
  const s = p.statistics;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto w-full space-y-6">

        {/* Hero Header */}
        <FadeIn>
          <div className="relative w-full overflow-hidden border border-white/10 bg-card">
            <div className="absolute inset-0 z-0">
              <img
                src={`${import.meta.env.BASE_URL}images/tank-hero.png`}
                alt=""
                className="w-full h-full object-cover opacity-25 mix-blend-overlay"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
            </div>
            <div className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row items-end md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 md:w-28 md:h-28 bg-secondary border-2 border-primary/70 flex items-center justify-center text-3xl font-display font-bold shadow-[0_0_30px_rgba(255,107,0,0.4)]">
                  {p.nickname.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <h1 className="text-3xl md:text-5xl font-bold font-sans tracking-tight leading-none text-glow">
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
                    <span className="flex items-center gap-1">Server: {p.server}</span>
                    <TacBadge variant="default" className="bg-primary/20 text-primary border-primary/40">
                      <Star className="w-3 h-3 mr-1" /> My Profile
                    </TacBadge>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <a
                  href={`https://blitzstars.com/player/eu/${p.nickname}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 font-display uppercase tracking-widest text-xs transition-colors"
                >
                  <ExternalLink className="w-4 h-4" /> BlitzStars
                </a>
                <TacButton variant="outline" size="sm" onClick={() => setLocation("/settings")}>
                  Edit Profile
                </TacButton>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Key Stats */}
        <FadeIn delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <TacCard className="p-0 border-l-4 border-l-primary">
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

        {/* Detailed combat records */}
        <FadeIn delay={0.15}>
          <h2 className="text-xl font-display uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Combat Records</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            <TacCard className="p-5 space-y-3">
              <h3 className="font-display uppercase tracking-widest text-primary flex items-center gap-2 text-sm"><Crosshair className="w-4 h-4" /> Efficiency</h3>
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
              <h3 className="font-display uppercase tracking-widest text-primary flex items-center gap-2 text-sm"><Target className="w-4 h-4" /> Accuracy</h3>
              {[
                ["Shots Fired", s.shots.toLocaleString()],
                ["Hits", s.hits.toLocaleString()],
                ["Hit Rate", `${((s.hits / s.shots) * 100).toFixed(1)}%`, "text-tactical-yellow"],
                ["Enemies Spotted", s.spotted.toLocaleString()],
                ["Total XP Earned", s.xp.toLocaleString()],
              ].map(([label, value, color]) => (
                <div key={label} className="flex justify-between border-b border-white/5 pb-2 text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className={cn("font-bold", color)}>{value}</span>
                </div>
              ))}
            </TacCard>

            <TacCard className="p-5 space-y-3">
              <h3 className="font-display uppercase tracking-widest text-primary flex items-center gap-2 text-sm"><Award className="w-4 h-4" /> Personal Records</h3>
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

        {/* Vehicle table */}
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
                {MY_TANKS.map((tank) => (
                  <tr key={tank.tank_id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold">{tank.tank_name}</td>
                    <td className="p-4 text-center text-primary font-display font-bold">{tank.tank_tier}</td>
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
                        tank.mark_of_mastery === 3 ? "bg-white/20 text-white" :
                        "bg-white/10 text-muted-foreground"
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
