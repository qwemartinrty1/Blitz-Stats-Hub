import { useRoute } from "wouter";
import { Layout } from "@/components/layout";
import { useGetTournament } from "@workspace/api-client-react";
import { TacCard, TacBadge, StatBox, FadeIn, cn } from "@/components/ui/tactical";
import { Trophy, Calendar as CalendarIcon, Users, Swords, ShieldAlert, Award } from "lucide-react";
import { format } from "date-fns";

export default function TournamentDetail() {
  const [match, params] = useRoute("/tournaments/:id");
  const tournamentId = match ? parseInt(params.id) : 0;

  const { data: tournament, isLoading, isError } = useGetTournament(tournamentId, { query: { enabled: !!tournamentId } });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-primary animate-pulse font-display tracking-widest text-2xl uppercase">Decrypting Operation Orders...</div>
        </div>
      </Layout>
    );
  }

  if (isError || !tournament) {
    return (
      <Layout>
        <div className="text-center py-20 border border-destructive/20 bg-destructive/5 m-10">
          <ShieldAlert className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-3xl text-destructive font-display uppercase tracking-widest mb-2">Operation Not Found</h1>
          <p className="text-muted-foreground">The requested directive has been redacted or does not exist.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto w-full space-y-8">
        
        {/* Header Hero */}
        <FadeIn>
          <div className="relative w-full rounded-sm overflow-hidden border border-white/10 bg-card p-8 md:p-12 text-center md:text-left">
            <div className="absolute inset-0 z-0">
              <img src={`${import.meta.env.BASE_URL}images/tactical-map.png`} alt="Tactical Map" className="w-full h-full object-cover opacity-20 mix-blend-screen" />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center md:items-end gap-6">
              <div>
                <TacBadge variant={
                  tournament.status === 'active' ? 'success' : 
                  tournament.status === 'upcoming' ? 'warning' : 'default'
                } className="mb-4">
                  STATUS: {tournament.status}
                </TacBadge>
                <h1 className="text-4xl md:text-6xl font-bold font-sans tracking-tight leading-none text-glow uppercase mb-4">
                  {tournament.title}
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl font-sans">{tournament.description}</p>
              </div>
              
              {tournament.prize_pool && (
                <div className="bg-black/60 border border-tactical-yellow/30 p-6 rounded-sm text-center flex-shrink-0 backdrop-blur-sm shadow-[0_0_20px_rgba(255,204,0,0.1)]">
                  <Award className="w-12 h-12 text-tactical-yellow mx-auto mb-2" />
                  <div className="text-[10px] text-tactical-yellow uppercase font-display tracking-widest">Prize Pool</div>
                  <div className="text-3xl font-bold text-white">{tournament.prize_pool}</div>
                </div>
              )}
            </div>
          </div>
        </FadeIn>

        {/* Details Grid */}
        <FadeIn delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <TacCard className="p-0">
              <StatBox label="Start Date" value={format(new Date(tournament.start_date), "MMM d, yyyy")} colorClass="text-2xl" />
            </TacCard>
            <TacCard className="p-0">
              <StatBox label="End Date" value={format(new Date(tournament.end_date), "MMM d, yyyy")} colorClass="text-2xl" />
            </TacCard>
            <TacCard className="p-0">
              <StatBox label="Format" value={tournament.format} colorClass="text-2xl uppercase" />
            </TacCard>
            <TacCard className="p-0 border-l-4 border-l-primary">
              <StatBox label="Participants" value={`${tournament.current_participants} / ${tournament.max_participants || '∞'}`} colorClass="text-2xl" />
            </TacCard>
          </div>
        </FadeIn>

        {/* Leaderboard / Participants */}
        <FadeIn delay={0.2}>
          <TacCard className="overflow-hidden">
            <div className="p-6 border-b border-white/5 bg-black/40">
              <h2 className="text-2xl font-display uppercase tracking-widest flex items-center gap-3">
                <Users className="w-6 h-6 text-primary" /> Active Combatants
              </h2>
            </div>
            
            {(!tournament.participants || tournament.participants.length === 0) ? (
              <div className="p-12 text-center text-muted-foreground font-display tracking-widest uppercase">
                No commanders enlisted yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-sm whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-white/10 bg-black/20 font-display tracking-widest uppercase text-muted-foreground">
                      <th className="p-4 w-20 text-center font-normal">Rank</th>
                      <th className="p-4 font-normal">Commander</th>
                      <th className="p-4 font-normal text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {tournament.participants.map((p, index) => (
                      <tr key={p.account_id} className={cn(
                        "hover:bg-white/5 transition-colors",
                        index < 3 && "bg-primary/5"
                      )}>
                        <td className="p-4 text-center">
                          {index === 0 ? <Trophy className="w-5 h-5 text-tactical-yellow mx-auto" /> :
                           index === 1 ? <Trophy className="w-5 h-5 text-gray-400 mx-auto" /> :
                           index === 2 ? <Trophy className="w-5 h-5 text-amber-700 mx-auto" /> :
                           <span className="font-display text-lg text-muted-foreground">{p.rank}</span>}
                        </td>
                        <td className="p-4 font-bold text-lg">{p.nickname}</td>
                        <td className="p-4 text-right font-display text-xl font-bold text-primary">{p.score.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TacCard>
        </FadeIn>

      </div>
    </Layout>
  );
}
