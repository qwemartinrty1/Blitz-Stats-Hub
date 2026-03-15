import { useRoute, useLocation } from "wouter";
import { Layout } from "@/components/layout";
import { TacCard, TacBadge, StatBox, FadeIn, TacButton, cn } from "@/components/ui/tactical";
import { Trophy, Calendar as CalendarIcon, Users, Swords, Award, ArrowLeft, UserPlus } from "lucide-react";

interface Participant {
  account_id: number;
  nickname: string;
  clan_tag: string | null;
  score: number;
  rank: number;
}

interface Tournament {
  id: number;
  title: string;
  description: string;
  status: "active" | "upcoming" | "completed";
  start_date: string;
  end_date: string;
  prize_pool: string | null;
  max_participants: number | null;
  current_participants: number;
  format: string;
  tier_requirement: number | null;
  rules: string[];
  participants: Participant[];
}

const MOCK_TOURNAMENTS: Record<number, Tournament> = {
  1: {
    id: 1,
    title: "European Championship — Spring 2026",
    description: "The premier competitive event for top European players. Battle it out in 7v7 format across 10 epic maps to claim the championship title and prize pool. All matches are refereed and replays are recorded.",
    status: "active",
    start_date: "Mar 1, 2026",
    end_date: "Mar 31, 2026",
    prize_pool: "$10,000",
    max_participants: 128,
    current_participants: 96,
    format: "7v7 Team Battle",
    tier_requirement: 10,
    rules: [
      "All participants must be on the EU server.",
      "Only Tier X vehicles are permitted.",
      "Teams must consist of exactly 7 players.",
      "No premium consumables (Large Kits, etc.).",
      "Matches are best of 3 — finals are best of 5.",
      "Disconnects within the first 30 seconds allow a restart.",
    ],
    participants: [
      { account_id: 1007, nickname: "ArmoredFist_EU", clan_tag: "FIST", score: 4820, rank: 1 },
      { account_id: 1001, nickname: "TankAce_2024", clan_tag: "ELITE", score: 4610, rank: 2 },
      { account_id: 1002, nickname: "BlitzMaster", clan_tag: "PRO", score: 4380, rank: 3 },
      { account_id: 1010, nickname: "GunnerPro", clan_tag: "GPR", score: 4100, rank: 4 },
      { account_id: 1004, nickname: "ProTanker_EU", clan_tag: "CLAN", score: 3940, rank: 5 },
      { account_id: 1008, nickname: "Destroyer_X", clan_tag: "DEX", score: 3720, rank: 6 },
      { account_id: 1005, nickname: "IronCommander", clan_tag: "IRON", score: 3510, rank: 7 },
      { account_id: 1003, nickname: "SteelWarrior", clan_tag: null, score: 3290, rank: 8 },
      { account_id: 1006, nickname: "TankHunter99", clan_tag: null, score: 3100, rank: 9 },
      { account_id: 1009, nickname: "NightRaider", clan_tag: null, score: 2880, rank: 10 },
    ],
  },
  2: {
    id: 2,
    title: "Blitz Grand Prix — Season 4",
    description: "Weekly grand prix tournament for solo players. Earn points across 5 rounds to qualify for the final championship event and top the seasonal leaderboard.",
    status: "upcoming",
    start_date: "Apr 5, 2026",
    end_date: "Apr 20, 2026",
    prize_pool: "$5,000",
    max_participants: 256,
    current_participants: 45,
    format: "Solo Ranked",
    tier_requirement: 8,
    rules: [
      "Solo registration only — no team sign-ups.",
      "Tier VIII, IX, or X vehicles allowed.",
      "5 rounds total, best cumulative score wins.",
      "Players must complete all 5 rounds to qualify.",
    ],
    participants: [
      { account_id: 1010, nickname: "GunnerPro", clan_tag: "GPR", score: 1100, rank: 1 },
      { account_id: 1001, nickname: "TankAce_2024", clan_tag: "ELITE", score: 980, rank: 2 },
      { account_id: 1007, nickname: "ArmoredFist_EU", clan_tag: "FIST", score: 870, rank: 3 },
    ],
  },
  3: {
    id: 3,
    title: "Steel Thunder Weekend Cup",
    description: "A weekend-long rapid-fire tournament with 3-minute battles. High intensity, fast rewards. Limited to Tier VII–IX vehicles.",
    status: "upcoming",
    start_date: "Apr 12, 2026",
    end_date: "Apr 13, 2026",
    prize_pool: "$1,000",
    max_participants: 200,
    current_participants: 80,
    format: "3v3 Sprint",
    tier_requirement: 9,
    rules: [
      "3v3 teams, Tier VII–IX only.",
      "Each battle is capped at 3 minutes.",
      "Double elimination bracket.",
    ],
    participants: [],
  },
  4: {
    id: 4,
    title: "Clan Wars: Spring Offensive",
    description: "Clan vs. clan warfare. Gather your 15-player clan and fight for territorial supremacy on the global map.",
    status: "upcoming",
    start_date: "Apr 15, 2026",
    end_date: "May 15, 2026",
    prize_pool: "$15,000",
    max_participants: 64,
    current_participants: 22,
    format: "15v15 Clan Battle",
    tier_requirement: 10,
    rules: [
      "Clans must have at least 15 active members.",
      "All vehicles must be Tier X.",
      "Clan commander must be registered by Apr 10.",
    ],
    participants: [],
  },
  5: {
    id: 5,
    title: "Blitz Open — February 2026",
    description: "Open community tournament for all skill levels. No tier restriction — great for new players to experience competitive play.",
    status: "completed",
    start_date: "Feb 1, 2026",
    end_date: "Feb 28, 2026",
    prize_pool: "$2,500",
    max_participants: 512,
    current_participants: 512,
    format: "1v1 Duel",
    tier_requirement: null,
    rules: [
      "Open to all players regardless of tier.",
      "Single elimination bracket.",
      "Player's choice of vehicle.",
    ],
    participants: [
      { account_id: 1002, nickname: "BlitzMaster", clan_tag: "PRO", score: 9, rank: 1 },
      { account_id: 1003, nickname: "SteelWarrior", clan_tag: null, score: 7, rank: 2 },
      { account_id: 1005, nickname: "IronCommander", clan_tag: "IRON", score: 6, rank: 3 },
    ],
  },
  6: {
    id: 6,
    title: "Tier X Masters — Winter 2025",
    description: "An exclusive end-of-year tournament reserved for the top 64 players globally. Only the elite are invited.",
    status: "completed",
    start_date: "Dec 15, 2025",
    end_date: "Dec 31, 2025",
    prize_pool: "$20,000",
    max_participants: 64,
    current_participants: 64,
    format: "7v7 Double Elimination",
    tier_requirement: 10,
    rules: [
      "Invitation-only based on global WN8 ranking.",
      "Tier X vehicles only.",
      "Double elimination bracket with best-of-5 finals.",
    ],
    participants: [
      { account_id: 1007, nickname: "ArmoredFist_EU", clan_tag: "FIST", score: 12400, rank: 1 },
      { account_id: 1010, nickname: "GunnerPro", clan_tag: "GPR", score: 11200, rank: 2 },
      { account_id: 1001, nickname: "TankAce_2024", clan_tag: "ELITE", score: 10800, rank: 3 },
    ],
  },
};

export default function TournamentDetail() {
  const [match, params] = useRoute("/tournaments/:id");
  const [, setLocation] = useLocation();
  const tournamentId = match ? parseInt(params.id) : 0;
  const tournament = MOCK_TOURNAMENTS[tournamentId];

  if (!tournament) {
    return (
      <Layout>
        <div className="text-center py-24 border border-destructive/20 bg-destructive/5 max-w-2xl mx-auto mt-10">
          <Trophy className="w-16 h-16 text-destructive mx-auto mb-4 opacity-50" />
          <h1 className="text-3xl text-destructive font-display uppercase tracking-widest mb-2">Operation Not Found</h1>
          <p className="text-muted-foreground mb-6">The requested directive has been redacted or does not exist.</p>
          <TacButton onClick={() => setLocation("/tournaments")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Operations
          </TacButton>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto w-full space-y-8">

        <FadeIn>
          <button
            onClick={() => setLocation("/tournaments")}
            className="flex items-center gap-2 text-sm font-display tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> All Operations
          </button>
        </FadeIn>

        {/* Hero */}
        <FadeIn>
          <div className="relative w-full overflow-hidden border border-white/10 bg-card p-8 md:p-12">
            <div className="absolute inset-0 z-0">
              <img
                src={`${import.meta.env.BASE_URL}images/tactical-map.png`}
                alt=""
                className="w-full h-full object-cover opacity-15 mix-blend-screen"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div className="flex-1">
                <TacBadge
                  variant={tournament.status === "active" ? "success" : tournament.status === "upcoming" ? "warning" : "default"}
                  className="mb-4"
                >
                  STATUS: {tournament.status}
                </TacBadge>
                <h1 className="text-3xl md:text-5xl font-bold font-sans tracking-tight leading-tight text-glow uppercase mb-3">
                  {tournament.title}
                </h1>
                <p className="text-muted-foreground max-w-2xl font-sans text-sm leading-relaxed">{tournament.description}</p>
              </div>
              {tournament.prize_pool && (
                <div className="bg-black/60 border border-tactical-yellow/30 p-5 text-center flex-shrink-0 backdrop-blur-sm">
                  <Award className="w-10 h-10 text-tactical-yellow mx-auto mb-1" />
                  <div className="text-[10px] text-tactical-yellow uppercase font-display tracking-widest">Prize Pool</div>
                  <div className="text-3xl font-bold text-white mt-1">{tournament.prize_pool}</div>
                </div>
              )}
            </div>
          </div>
        </FadeIn>

        {/* Stats bar */}
        <FadeIn delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <TacCard className="p-0">
              <StatBox label="Start Date" value={tournament.start_date} colorClass="text-xl" />
            </TacCard>
            <TacCard className="p-0">
              <StatBox label="End Date" value={tournament.end_date} colorClass="text-xl" />
            </TacCard>
            <TacCard className="p-0">
              <StatBox label="Format" value={tournament.format} colorClass="text-lg uppercase" />
            </TacCard>
            <TacCard className="p-0 border-l-4 border-l-primary">
              <StatBox
                label="Participants"
                value={`${tournament.current_participants} / ${tournament.max_participants ?? "∞"}`}
                colorClass="text-xl"
              />
            </TacCard>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Rules */}
          <FadeIn delay={0.15}>
            <TacCard className="p-6 h-full">
              <h2 className="text-lg font-display uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
                <Swords className="w-5 h-5 text-primary" /> Rules of Engagement
              </h2>
              <ul className="space-y-3">
                {tournament.rules.map((rule, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm font-sans text-muted-foreground">
                    <span className="font-display text-primary font-bold mt-0.5 flex-shrink-0">{String(i + 1).padStart(2, "0")}.</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
              {tournament.status === "upcoming" && (
                <TacButton className="w-full mt-6">
                  <UserPlus className="w-4 h-4 mr-2" /> Enlist Now
                </TacButton>
              )}
            </TacCard>
          </FadeIn>

          {/* Leaderboard */}
          <FadeIn delay={0.2} className="md:col-span-2">
            <TacCard className="overflow-hidden h-full">
              <div className="p-5 border-b border-white/5 bg-black/40">
                <h2 className="text-lg font-display uppercase tracking-widest flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  {tournament.status === "completed" ? "Final Standings" : "Current Leaderboard"}
                </h2>
              </div>

              {tournament.participants.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground font-display tracking-widest uppercase">
                  <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  No commanders enlisted yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-sans text-sm whitespace-nowrap">
                    <thead>
                      <tr className="border-b border-white/10 bg-black/20 font-display tracking-widest uppercase text-muted-foreground text-xs">
                        <th className="p-4 w-16 text-center font-normal">Rank</th>
                        <th className="p-4 font-normal">Commander</th>
                        <th className="p-4 text-right font-normal">Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {tournament.participants.map((p, i) => (
                        <tr key={p.account_id} className={cn("hover:bg-white/5 transition-colors", i < 3 && "bg-primary/5")}>
                          <td className="p-4 text-center">
                            {i === 0 ? <Trophy className="w-5 h-5 text-tactical-yellow mx-auto" /> :
                             i === 1 ? <Trophy className="w-5 h-5 text-gray-300 mx-auto" /> :
                             i === 2 ? <Trophy className="w-5 h-5 text-amber-600 mx-auto" /> :
                             <span className="font-display text-muted-foreground">{p.rank}</span>}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className="font-bold">{p.nickname}</span>
                              {p.clan_tag && (
                                <span className="text-primary font-display text-xs tracking-widest">[{p.clan_tag}]</span>
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-right font-display text-lg font-bold text-primary">
                            {p.score.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TacCard>
          </FadeIn>
        </div>

      </div>
    </Layout>
  );
}
