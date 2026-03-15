import { Link, useLocation } from "wouter";
import { 
  Crosshair, 
  Users, 
  Trophy, 
  User, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/components/ui/tactical";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Intel Feed", path: "/", icon: Crosshair },
    { name: "Target Search", path: "/search", icon: Users },
    { name: "Operations", path: "/tournaments", icon: Trophy },
    { name: "My Service Record", path: "/my-profile", icon: User },
    { name: "System Config", path: "/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row selection:bg-primary/30">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary clip-edges-sm flex items-center justify-center">
            <Crosshair className="w-5 h-5 text-black" />
          </div>
          <span className="font-display font-bold text-xl tracking-widest">BLITZ<span className="text-primary">NET</span></span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-muted-foreground hover:text-white">
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <nav className={cn(
        "fixed md:sticky top-0 left-0 h-screen w-64 bg-card/95 backdrop-blur-xl border-r border-white/5 z-40 flex flex-col transition-transform duration-300 ease-in-out",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-6 hidden md:flex items-center gap-3 border-b border-white/5">
          <div className="w-10 h-10 bg-primary clip-edges-sm flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 scanlines opacity-50"></div>
            <Crosshair className="w-6 h-6 text-black relative z-10" />
          </div>
          <span className="font-display font-bold text-2xl tracking-widest text-glow">BLITZ<span className="text-primary">NET</span></span>
        </div>

        <div className="flex-1 py-6 px-4 flex flex-col gap-2 overflow-y-auto">
          <div className="text-[10px] text-primary uppercase font-display tracking-[0.2em] mb-2 px-2">Main Menu</div>
          {navItems.map((item) => {
            const isActive = location === item.path || (item.path !== "/" && location.startsWith(item.path));
            return (
              <Link 
                key={item.path} 
                href={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-none transition-all duration-200 font-display font-semibold uppercase tracking-wider text-sm clip-edges-sm",
                  isActive 
                    ? "bg-primary text-primary-foreground box-glow" 
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-white/5">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all font-display font-semibold uppercase tracking-wider text-sm clip-edges-sm">
            <LogOut className="w-4 h-4" />
            Disconnect
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden flex flex-col min-h-[calc(100vh-65px)] md:min-h-screen">
        <div className="absolute inset-0 scanlines pointer-events-none opacity-20"></div>
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
