import { useState } from "react";
import { Layout } from "@/components/layout";
import { useSearchPlayers } from "@workspace/api-client-react";
import { TacButton, TacCard, TacInput, FadeIn, cn } from "@/components/ui/tactical";
import { Search as SearchIcon, ChevronRight, Server, ShieldAlert } from "lucide-react";
import { Link } from "wouter";

export default function Search() {
  const [query, setQuery] = useState("");
  const [server, setServer] = useState<"eu" | "com" | "asia">("eu");
  const [submittedQuery, setSubmittedQuery] = useState("");

  const { data, isLoading, isError } = useSearchPlayers(
    { query: submittedQuery, server },
    { query: { enabled: submittedQuery.length > 2 } }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.length > 2) {
      setSubmittedQuery(query);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto w-full space-y-8">
        
        <FadeIn>
          <header className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl text-glow mb-2 uppercase tracking-widest">Target Search</h1>
            <p className="text-muted-foreground font-sans">Query global database for commander service records.</p>
          </header>
        </FadeIn>

        <FadeIn delay={0.1}>
          <TacCard className="p-6 md:p-8 bg-black/40 backdrop-blur-sm border-primary/30">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <TacInput 
                  placeholder="ENTER COMMANDER ALIAS..." 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-12 h-14 text-lg font-sans"
                />
              </div>
              <div className="flex gap-4">
                <div className="relative w-32">
                  <Server className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 z-10" />
                  <select 
                    value={server}
                    onChange={(e) => setServer(e.target.value as any)}
                    className="w-full h-14 pl-10 pr-4 bg-input border border-border text-foreground clip-edges-sm appearance-none focus:outline-none focus:border-primary font-display tracking-widest uppercase relative"
                  >
                    <option value="eu">EU Cluster</option>
                    <option value="com">NA Cluster</option>
                    <option value="asia">ASIA Cluster</option>
                  </select>
                </div>
                <TacButton type="submit" size="lg" className="h-14 px-8 w-full md:w-auto">
                  Scan
                </TacButton>
              </div>
            </form>
          </TacCard>
        </FadeIn>

        <div className="space-y-4 pt-4">
          {isLoading && (
            <div className="text-center py-12 text-primary animate-pulse font-display tracking-widest uppercase">
              Scanning Database...
            </div>
          )}

          {isError && (
            <div className="text-center py-12 text-destructive font-display tracking-widest uppercase border border-destructive/20 bg-destructive/5">
              <ShieldAlert className="w-12 h-12 mx-auto mb-4 opacity-50" />
              Signal Lost. Unable to retrieve target data.
            </div>
          )}

          {data?.players && data.players.length === 0 && (
            <div className="text-center py-12 text-muted-foreground font-display tracking-widest uppercase border border-dashed border-white/10">
              No matching commanders found.
            </div>
          )}

          {data?.players && data.players.length > 0 && (
            <div className="grid gap-3">
              <div className="text-sm font-display tracking-widest uppercase text-muted-foreground mb-2">
                {data.count} Targets Acquired
              </div>
              {data.players.map((player, i) => (
                <FadeIn key={player.account_id} delay={i * 0.05}>
                  <Link href={`/players/${player.account_id}?server=${server}`}>
                    <TacCard className="p-4 flex items-center justify-between hover:bg-white/5 cursor-pointer group hover:border-primary/50 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-secondary border border-white/10 clip-edges-sm flex items-center justify-center font-display text-xl font-bold">
                          {player.nickname.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-xl font-sans group-hover:text-primary transition-colors">{player.nickname}</div>
                          <div className="text-xs font-display tracking-widest text-muted-foreground uppercase">
                            ID: {player.account_id}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
                    </TacCard>
                  </Link>
                </FadeIn>
              ))}
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
}
