import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { TacCard, TacButton } from "@/components/ui/tactical";
import { ShieldAlert, Home } from "lucide-react";

export default function NotFound() {
  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[70vh]">
        <TacCard className="max-w-md w-full p-10 text-center border-tactical-red/50 bg-tactical-red/5 relative overflow-hidden">
          <div className="absolute inset-0 scanlines opacity-20 pointer-events-none"></div>
          
          <ShieldAlert className="w-24 h-24 text-tactical-red mx-auto mb-6" />
          
          <h1 className="text-4xl font-display uppercase tracking-widest font-bold mb-2 text-glow text-tactical-red">
            Error 404
          </h1>
          <h2 className="text-xl font-display uppercase tracking-widest mb-6">Coordinates Invalid</h2>
          
          <p className="text-muted-foreground font-sans mb-8">
            The navigational sector you are attempting to reach does not exist or has been restricted by command.
          </p>
          
          <Link href="/">
            <TacButton size="lg" className="w-full">
              <Home className="w-5 h-5 mr-2" />
              Return to Base
            </TacButton>
          </Link>
        </TacCard>
      </div>
    </Layout>
  );
}
