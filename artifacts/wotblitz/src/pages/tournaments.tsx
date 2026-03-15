import { useState } from "react";
import { Layout } from "@/components/layout";
import { TacCard, TacBadge, FadeIn, TacButton } from "@/components/ui/tactical";
import { Trophy, Users, Calendar as CalendarIcon, Swords, Award, ArrowRight } from "lucide-react";
import { Link } from "wouter";

type TournamentStatus = "active" | "upcoming" | "completed";

interface Tournament {
  id: number;
  title: string;
  description: string;
  status: TournamentStatus;
  start_date: string;
  end_date: string;
  prize_pool: string | null;
  max_participants: number | null;
  current_participants: number;
  format: string;
  tier_requirement: number | null;
}

const MOCK_TOURNAMENTS: Tournament[] = [
  {
    id: 1,
    title: "European Championship — Spring 2026",
    description: "The premier competitive event for top European players. Battle it out in 7v7 format across 10 epic maps to claim the championship title and prize pool.",
    status: "active",
    start_date: "Mar 1, 2026",
    end_date: "Mar 31, 2026",
    prize_pool: "$10,000",
    max_participants: 128,
    current_participants: 96,
    format: "7v7 Team Battle",
    tier_requirement: 10,
  },
  {
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
  },
  {
    id: 3,
    title: "Steel Thunder Weekend Cup",
    description: "A weekend-long rapid-fire tournament with 3-minute battles. High intensity, fast rewards. Limited to Tier VII–IX vehicles only.",
    status: "upcoming",
    start_date: "Apr 12, 2026",
    end_date: "Apr 13, 2026",
    prize_pool: "$1,000",
    max_participants: 200,
    current_participants: 80,
    format: "3v3 Sprint",
    tier_requirement: 9,
  },
  {
    id: 4,
    title: "Clan Wars: Spring Offensive",
    description: "Clan vs. clan warfare. Gather your 15-player clan and fight for territorial supremacy on the global map. Top 3 clans win exclusive in-game rewards.",
    status: "upcoming",
    start_date: "Apr 15, 2026",
    end_date: "May 15, 2026",
    prize_pool: "$15,000",
    max_participants: 64,
    current_participants: 22,
    format: "15v15 Clan Battle",
    tier_requirement: 10,
  },
  {
    id: 5,
    title: "Blitz Open — February 2026",
    description: "Open community tournament for all skill levels. No tier restriction — great for new players to experience competitive play in a friendly environment.",
    status: "completed",
    start_date: "Feb 1, 2026",
    end_date: "Feb 28, 2026",
    prize_pool: "$2,500",
    max_participants: 512,
    current_participants: 512,
    format: "1v1 Duel",
    tier_requirement: null,
  },
  {
    id: 6,
    title: "Tier X Masters — Winter 2025",
    description: "An exclusive end-of-year tournament reserved for the top 64 players globally ranked by WN8 rating. Only the elite are invited.",
    status: "completed",
    start_date: "Dec 15, 2025",
    end_date: "Dec 31, 2025",
    prize_pool: "$20,000",
    max_participants: 64,
    current_participants: 64,
    format: "7v7 Double Elimination",
    tier_requirement: 10,
  },
];

function TournamentCard({ tournament }: { tournament: Tournament }) {
  return (
    <TacCard className="flex flex-col h-full hover:border-primary/50 transition-colors group">
      <div className="p-6 border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-2 right-2 opacity-5 group-hover:opacity-10 transition-opacity">
          <Trophy className="w-28 h-28" />
        </div>
        <div className="relative z-10 flex justify-between items-start mb-3">
          <TacBadge variant={tournament.status === "active" ? "success" : tournament.status === "upcoming" ? "warning" : "default"}>
            {tournament.status}
          </TacBadge>
          {tournament.tier_requirement && (
            <span className="font-display font-bold text-primary border border-primary px-2 py-0.5 text-xs bg-black/50">
              TIER {tournament.tier_requirement}
            </span>
          )}
        </div>
        <h3 className="text-xl font-bold font-sans tracking-tight mb-2 relative z-10 group-hover:text-primary transition-colors leading-snug">
          {tournament.title}
        </h3>
        <p className="text-muted-foreground font-sans text-sm line-clamp-2 relative z-10">{tournament.description}</p>
      </div>

      <div className="p-6 bg-black/20 flex-1 flex flex-col justify-between">
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="flex items-center gap-2 text-sm">
            <CalendarIcon className="w-4 h-4 text-primary flex-shrink-0" />
            <div>
              <div className="text-[10px] text-muted-foreground uppercase font-display tracking-widest">Start Date</div>
              <div className="font-sans text-sm">{tournament.start_date}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Swords className="w-4 h-4 text-primary flex-shrink-0" />
            <div>
              <div className="text-[10px] text-muted-foreground uppercase font-display tracking-widest">Format</div>
              <div className="font-sans text-sm">{tournament.format}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-primary flex-shrink-0" />
            <div>
              <div className="text-[10px] text-muted-foreground uppercase font-display tracking-widest">Enlisted</div>
              <div className="font-sans text-sm">{tournament.current_participants} / {tournament.max_participants ?? "∞"}</div>
            </div>
          </div>
          {tournament.prize_pool && (
            <div className="flex items-center gap-2 text-sm">
              <Award className="w-4 h-4 text-tactical-yellow flex-shrink-0" />
              <div>
                <div className="text-[10px] text-muted-foreground uppercase font-display tracking-widest">Prize Pool</div>
                <div className="font-sans text-sm font-bold text-tactical-yellow">{tournament.prize_pool}</div>
              </div>
            </div>
          )}
        </div>

        <Link href={`/tournaments/${tournament.id}`}>
          <TacButton variant="outline" className="w-full group-hover:bg-primary group-hover:text-black transition-all">
            View Directive <ArrowRight className="w-4 h-4 ml-2 opacity-60 group-hover:opacity-100" />
          </TacButton>
        </Link>
      </div>
    </TacCard>
  );
}

export default function Tournaments() {
  const [status, setStatus] = useState<TournamentStatus | "all">("all");

  const filtered = status === "all"
    ? MOCK_TOURNAMENTS
    : MOCK_TOURNAMENTS.filter((t) => t.status === status);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto w-full space-y-8">
        <FadeIn>
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2">
            <div>
              <h1 className="text-4xl md:text-5xl text-glow mb-1 uppercase tracking-widest flex items-center gap-4">
                <Trophy className="w-9 h-9 text-primary" />
                Operations
              </h1>
              <p className="text-muted-foreground font-sans text-sm">Official organized combat events and tournaments.</p>
            </div>
            <div className="flex bg-black/40 border border-white/10 p-1">
              {(["all", "active", "upcoming", "completed"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatus(tab)}
                  className={`px-5 py-2 font-display uppercase tracking-widest text-xs transition-colors ${
                    status === tab ? "bg-primary text-black font-bold" : "text-muted-foreground hover:text-white hover:bg-white/5"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </header>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-20 text-muted-foreground border border-dashed border-white/10 bg-black/20">
              <p className="font-display text-xl uppercase tracking-widest">No {status} operations found.</p>
            </div>
          ) : (
            filtered.map((t, i) => (
              <FadeIn key={t.id} delay={i * 0.08}>
                <TournamentCard tournament={t} />
              </FadeIn>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
