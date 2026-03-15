import { useState } from "react";
import { Layout } from "@/components/layout";
import { TacButton, TacCard, FadeIn } from "@/components/ui/tactical";
import { Search as SearchIcon, ChevronRight, Server, ShieldAlert } from "lucide-react";
import { Link } from "wouter";

interface Player {
  account_id: number;
  nickname: string;
  clan_tag: string | null;
  battles: number;
  win_rate: number;
  last_active: string;
}

const ALL_MOCK_PLAYERS: Player[] = [
  { account_id: 1001, nickname: "TankAce_2024", clan_tag: "ELITE", battles: 8142, win_rate: 60.1, last_active: "Today" },
  { account_id: 1002, nickname: "BlitzMaster", clan_tag: "PRO", battles: 12540, win_rate: 57.8, last_active: "Today" },
  { account_id: 1003, nickname: "SteelWarrior", clan_tag: null, battles: 5200, win_rate: 53.4, last_active: "Yesterday" },
  { account_id: 1004, nickname: "ProTanker_EU", clan_tag: "CLAN", battles: 7842, win_rate: 56.2, last_active: "2 days ago" },
  { account_id: 1005, nickname: "IronCommander", clan_tag: "IRON", battles: 9300, win_rate: 51.0, last_active: "Today" },
  { account_id: 1006, nickname: "TankHunter99", clan_tag: null, battles: 3400, win_rate: 48.5, last_active: "3 days ago" },
  { account_id: 1007, nickname: "ArmoredFist_EU", clan_tag: "FIST", battles: 15600, win_rate: 62.3, last_active: "Today" },
  { account_id: 1008, nickname: "Destroyer_X", clan_tag: "DEX", battles: 6100, win_rate: 55.1, last_active: "Yesterday" },
  { account_id: 1009, nickname: "NightRaider", clan_tag: null, battles: 2800, win_rate: 49.0, last_active: "1 week ago" },
  { account_id: 1010, nickname: "GunnerPro", clan_tag: "GPR", battles: 11200, win_rate: 58.7, last_active: "Today" },
];

function getStatColor(winRate: number) {
  if (winRate >= 60) return "text-[#c64cff]";
  if (winRate >= 55) return "text-tactical-green";
  if (winRate >= 50) return "text-tactical-yellow";
  return "text-tactical-red";
}

function Avatar({ name }: { name: string }) {
  const hash = name.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
  const hue = hash % 360;
  return (
    <div
      className="w-full h-full flex items-center justify-center font-display font-bold text-lg"
      style={{ backgroundColor: `hsl(${hue}, 55%, 18%)`, color: `hsl(${hue}, 80%, 65%)` }}
    >
      {name.substring(0, 2).toUpperCase()}
    </div>
  );
}

export default function Search() {
  const [query, setQuery] = useState("");
  const [server, setServer] = useState<"eu" | "com" | "asia">("eu");
  const [submitted, setSubmitted] = useState(false);

  const results = submitted && query.length >= 2
    ? ALL_MOCK_PLAYERS.filter((p) =>
        p.nickname.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.length >= 2) setSubmitted(true);
  };

  const handleChange = (v: string) => {
    setQuery(v);
    setSubmitted(false);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto w-full space-y-8">
        <FadeIn>
          <header className="text-center mb-2">
            <h1 className="text-4xl md:text-5xl text-glow mb-1 uppercase tracking-widest">Target Search</h1>
            <p className="text-muted-foreground font-sans text-sm">Query global database for commander service records.</p>
          </header>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="p-6 md:p-8 bg-black/40 border border-primary/30">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Enter commander alias..."
                  value={query}
                  onChange={(e) => handleChange(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-input border border-border text-foreground focus:outline-none focus:border-primary font-sans text-base transition-colors"
                />
              </div>
              <div className="flex gap-3">
                <div className="relative w-36">
                  <Server className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 z-10 pointer-events-none" />
                  <select
                    value={server}
                    onChange={(e) => setServer(e.target.value as "eu" | "com" | "asia")}
                    className="w-full h-14 pl-10 pr-4 bg-input border border-border text-foreground appearance-none focus:outline-none focus:border-primary font-display tracking-widest uppercase text-sm"
                  >
                    <option value="eu">EU Cluster</option>
                    <option value="com">NA Cluster</option>
                    <option value="asia">ASIA Cluster</option>
                  </select>
                </div>
                <TacButton type="submit" size="lg" className="h-14 px-8">
                  Scan
                </TacButton>
              </div>
            </form>
          </div>
        </FadeIn>

        {submitted && query.length >= 2 && (
          <div className="space-y-3">
            {results.length === 0 ? (
              <FadeIn>
                <div className="text-center py-16 text-muted-foreground font-display tracking-widest uppercase border border-dashed border-white/10 bg-black/20">
                  <ShieldAlert className="w-12 h-12 mx-auto mb-4 opacity-40" />
                  No commanders matching "{query}" found on {server.toUpperCase()} cluster.
                </div>
              </FadeIn>
            ) : (
              <>
                <FadeIn>
                  <div className="text-sm font-display tracking-widest uppercase text-muted-foreground">
                    {results.length} target{results.length !== 1 ? "s" : ""} acquired
                  </div>
                </FadeIn>
                <div className="grid gap-3">
                  {results.map((player, i) => (
                    <FadeIn key={player.account_id} delay={i * 0.06}>
                      <Link href={`/players/${player.account_id}`}>
                        <TacCard className="p-4 flex items-center justify-between hover:bg-white/5 cursor-pointer group hover:border-primary/50 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-secondary border border-white/10 flex-shrink-0 overflow-hidden">
                              <Avatar name={player.nickname} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-lg font-sans group-hover:text-primary transition-colors">
                                  {player.nickname}
                                </span>
                                {player.clan_tag && (
                                  <span className="text-primary font-display text-xs tracking-widest">[{player.clan_tag}]</span>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-xs font-display tracking-widest text-muted-foreground uppercase mt-0.5">
                                <span>ID: {player.account_id}</span>
                                <span>{player.battles.toLocaleString()} battles</span>
                                <span className={getStatColor(player.win_rate)}>{player.win_rate.toFixed(1)}% WR</span>
                                <span>Active: {player.last_active}</span>
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
                        </TacCard>
                      </Link>
                    </FadeIn>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {!submitted && (
          <FadeIn delay={0.2}>
            <div className="py-8">
              <p className="text-center text-xs font-display tracking-widest uppercase text-muted-foreground mb-4">
                Recently viewed commanders
              </p>
              <div className="grid gap-2">
                {ALL_MOCK_PLAYERS.slice(0, 3).map((player, i) => (
                  <FadeIn key={player.account_id} delay={i * 0.06}>
                    <Link href={`/players/${player.account_id}`}>
                      <TacCard className="p-3 flex items-center justify-between hover:bg-white/5 cursor-pointer group hover:border-primary/30 transition-all border-dashed border-white/10">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-secondary border border-white/10 flex-shrink-0 overflow-hidden">
                            <Avatar name={player.nickname} />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-sans font-medium group-hover:text-primary transition-colors">{player.nickname}</span>
                            {player.clan_tag && (
                              <span className="text-primary font-display text-xs">[{player.clan_tag}]</span>
                            )}
                          </div>
                        </div>
                        <span className={`text-xs font-display tracking-widest ${getStatColor(player.win_rate)}`}>
                          {player.win_rate.toFixed(1)}% WR
                        </span>
                      </TacCard>
                    </Link>
                  </FadeIn>
                ))}
              </div>
            </div>
          </FadeIn>
        )}
      </div>
    </Layout>
  );
}
