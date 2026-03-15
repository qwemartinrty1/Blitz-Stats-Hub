import { useState } from "react";
import { Layout } from "@/components/layout";
import { useListTournaments, type Tournament } from "@workspace/api-client-react";
import { TacCard, TacBadge, FadeIn, TacButton } from "@/components/ui/tactical";
import { Trophy, Users, Calendar as CalendarIcon, Swords, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";

export default function Tournaments() {
  const [status, setStatus] = useState<"active" | "upcoming" | "completed">("active");
  const { data, isLoading } = useListTournaments({ status });

  return (
    <Layout>
      <div className="max-w-6xl mx-auto w-full space-y-8">
        
        <FadeIn>
          <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl text-glow mb-2 uppercase tracking-widest flex items-center gap-4">
                <Trophy className="w-10 h-10 text-primary" />
                Operations
              </h1>
              <p className="text-muted-foreground font-sans">Official organized combat events and tournaments.</p>
            </div>
            
            <div className="flex bg-black/40 border border-white/10 p-1 clip-edges-sm">
              {(["active", "upcoming", "completed"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setStatus(tab)}
                  className={`px-6 py-2 font-display uppercase tracking-widest text-sm transition-colors ${
                    status === tab 
                      ? "bg-primary text-black font-bold" 
                      : "text-muted-foreground hover:text-white hover:bg-white/5"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </header>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <TacCard key={i} className="h-64 animate-pulse bg-white/5" />
            ))
          ) : data?.tournaments.length === 0 ? (
            <div className="col-span-full text-center py-20 text-muted-foreground border border-dashed border-white/10 bg-black/20">
              <p className="font-display text-xl uppercase tracking-widest">No {status} operations found.</p>
            </div>
          ) : (
            data?.tournaments.map((tournament, i) => (
              <FadeIn key={tournament.id} delay={i * 0.1}>
                <TournamentCard tournament={tournament} />
              </FadeIn>
            ))
          )}
        </div>

      </div>
    </Layout>
  );
}

function TournamentCard({ tournament }: { tournament: Tournament }) {
  const isRegistrationOpen = tournament.status === 'upcoming' || tournament.status === 'active';
  
  return (
    <TacCard className="flex flex-col h-full hover:border-primary/50 transition-colors group">
      <div className="p-6 border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500">
          <Trophy className="w-24 h-24" />
        </div>
        <div className="relative z-10 flex justify-between items-start mb-4">
          <TacBadge variant={
            tournament.status === 'active' ? 'success' : 
            tournament.status === 'upcoming' ? 'warning' : 'default'
          }>
            {tournament.status}
          </TacBadge>
          {tournament.tier_requirement && (
            <span className="font-display font-bold text-primary border border-primary px-2 py-0.5 text-sm bg-black/50">
              TIER {tournament.tier_requirement}
            </span>
          )}
        </div>
        <h3 className="text-2xl font-bold font-sans tracking-tight mb-2 relative z-10 group-hover:text-primary transition-colors">{tournament.title}</h3>
        <p className="text-muted-foreground font-sans text-sm line-clamp-2 relative z-10">{tournament.description}</p>
      </div>
      
      <div className="p-6 bg-black/20 flex-1 flex flex-col justify-between">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-3 text-sm">
            <CalendarIcon className="w-4 h-4 text-primary" />
            <div>
              <div className="text-[10px] text-muted-foreground uppercase font-display tracking-widest">Start Date</div>
              <div className="font-sans">{format(new Date(tournament.start_date), "MMM d, HH:mm")}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Swords className="w-4 h-4 text-primary" />
            <div>
              <div className="text-[10px] text-muted-foreground uppercase font-display tracking-widest">Format</div>
              <div className="font-sans uppercase">{tournament.format}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Users className="w-4 h-4 text-primary" />
            <div>
              <div className="text-[10px] text-muted-foreground uppercase font-display tracking-widest">Enlisted</div>
              <div className="font-sans">{tournament.current_participants} / {tournament.max_participants || '∞'}</div>
            </div>
          </div>
          {tournament.prize_pool && (
            <div className="flex items-center gap-3 text-sm">
              <Award className="w-4 h-4 text-tactical-yellow" />
              <div>
                <div className="text-[10px] text-muted-foreground uppercase font-display tracking-widest">Prize Pool</div>
                <div className="font-sans font-bold text-tactical-yellow">{tournament.prize_pool}</div>
              </div>
            </div>
          )}
        </div>
        
        <Link href={`/tournaments/${tournament.id}`}>
          <TacButton variant="outline" className="w-full group-hover:bg-primary group-hover:text-black transition-all">
            View Directive <ArrowRight className="w-4 h-4 ml-2 opacity-50 group-hover:opacity-100" />
          </TacButton>
        </Link>
      </div>
    </TacCard>
  );
}

// Just importing Award to fix the missing import inside TournamentCard
import { Award } from "lucide-react";
