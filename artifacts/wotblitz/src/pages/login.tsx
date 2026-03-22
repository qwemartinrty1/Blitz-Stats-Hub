import { useState } from "react";
import { TacCard, TacButton, cn } from "@/components/ui/tactical";

// ---------------------------------------------------------------------------
// Wargaming application_id
// Register your app at https://developers.wargaming.net/ and set:
//   VITE_WG_APP_ID=your_application_id
// The app must have the callback URL whitelisted in the WG developer portal.
// ---------------------------------------------------------------------------
const WG_APP_ID = import.meta.env.VITE_WG_APP_ID ?? "demo";

type Region = "eu" | "com" | "asia";

const REGIONS: { id: Region; label: string; host: string; flag: string }[] = [
  { id: "eu",   label: "Europe",    host: "api.wotblitz.eu",   flag: "🇪🇺" },
  { id: "com",  label: "North America", host: "api.wotblitz.com",  flag: "🇺🇸" },
  { id: "asia", label: "Asia",      host: "api.wotblitz.asia", flag: "🌏" },
];

function buildLoginUrl(region: Region): string {
  const host = REGIONS.find((r) => r.id === region)!.host;
  const base = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";
  const redirectUri = `${window.location.origin}${base}/auth/callback`;
  const params = new URLSearchParams({
    application_id: WG_APP_ID,
    redirect_uri:   redirectUri,
    display:        "page",
  });
  return `https://${host}/wotb/auth/login/?${params.toString()}`;
}

export default function LoginPage() {
  const [region, setRegion] = useState<Region>("eu");

  function handleLogin() {
    // Store chosen region so the callback can restore it
    localStorage.setItem("blitznet_pending_region", region);
    window.location.href = buildLoginUrl(region);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4">
      {/* Grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Logo / brand */}
      <div className="mb-10 text-center relative z-10">
        <div className="inline-flex items-center gap-2 mb-3">
          <div className="w-2 h-8 bg-[#FF6B00]" />
          <span className="text-3xl font-black tracking-[0.2em] uppercase text-white">
            BLITZNET
          </span>
        </div>
        <p className="text-[#666] text-sm tracking-widest uppercase">
          World of Tanks Blitz Community
        </p>
      </div>

      {/* Login card */}
      <TacCard className="w-full max-w-sm p-8 relative z-10">
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#FF6B00]" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#FF6B00]" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#FF6B00]" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#FF6B00]" />

        <h2 className="text-white font-bold tracking-widest uppercase text-center mb-1 text-lg">
          Sign In
        </h2>
        <p className="text-[#555] text-xs tracking-wider uppercase text-center mb-8">
          via Wargaming OpenID
        </p>

        {/* Region selector */}
        <div className="mb-6">
          <label className="block text-[#888] text-xs tracking-widest uppercase mb-3">
            Select Region
          </label>
          <div className="grid grid-cols-3 gap-2">
            {REGIONS.map((r) => (
              <button
                key={r.id}
                onClick={() => setRegion(r.id)}
                className={cn(
                  "flex flex-col items-center gap-1 py-3 px-2 border text-xs tracking-wider uppercase transition-all",
                  region === r.id
                    ? "border-[#FF6B00] bg-[#FF6B00]/10 text-[#FF6B00]"
                    : "border-[#333] bg-[#111] text-[#666] hover:border-[#555] hover:text-[#999]"
                )}
              >
                <span className="text-xl">{r.flag}</span>
                <span className="font-bold">{r.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Login button */}
        <TacButton
          onClick={handleLogin}
          className="w-full py-4 text-sm tracking-widest"
        >
          <svg
            className="w-5 h-5 mr-2 inline-block"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
          </svg>
          Continue with Wargaming
        </TacButton>

        <p className="mt-6 text-[#444] text-xs text-center leading-relaxed">
          You will be redirected to the official Wargaming.net login page.
          <br />
          BLITZNET never sees your password.
        </p>
      </TacCard>

      {/* Dev note shown only when APP_ID is missing */}
      {WG_APP_ID === "demo" && (
        <div className="mt-6 max-w-sm w-full relative z-10 border border-yellow-600/50 bg-yellow-900/10 p-4 text-yellow-500 text-xs leading-relaxed">
          <strong className="block uppercase tracking-widest mb-1">
            ⚠ Dev mode — no WG App ID set
          </strong>
          Set <code className="bg-black/50 px-1">VITE_WG_APP_ID</code> in your
          environment to a real Wargaming application_id.
          <br />
          Register at{" "}
          <a
            href="https://developers.wargaming.net/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            developers.wargaming.net
          </a>
        </div>
      )}
    </div>
  );
}
