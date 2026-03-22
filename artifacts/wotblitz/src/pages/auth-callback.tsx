import { useEffect, useState } from "react";
import { saveWGUser, type WGUser } from "@/lib/auth-context";

type Status = "loading" | "success" | "error";

// The region is stored in localStorage before the redirect so we can restore it here
const PENDING_REGION_KEY = "blitznet_pending_region";

export default function AuthCallback() {
  const [status, setStatus] = useState<Status>("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const wgStatus    = params.get("status");
    const accessToken = params.get("access_token");
    const accountId   = params.get("account_id");
    const nickname    = params.get("nickname");
    const expiresAt   = params.get("expires_at");

    if (wgStatus === "error" || !accessToken || !accountId || !nickname || !expiresAt) {
      setErrorMsg(
        params.get("message") ??
        "Wargaming returned an error or missing parameters."
      );
      setStatus("error");
      return;
    }

    // Retrieve the region the user chose before the redirect
    const region = (localStorage.getItem(PENDING_REGION_KEY) ?? "eu") as WGUser["region"];
    localStorage.removeItem(PENDING_REGION_KEY);

    const user: WGUser = {
      account_id:   parseInt(accountId, 10),
      nickname,
      access_token: accessToken,
      expires_at:   parseInt(expiresAt, 10),
      region,
    };

    setStatus("success");

    // Small delay so the user sees the success state before the redirect
    setTimeout(() => saveWGUser(user), 1200);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4 text-center">
      {status === "loading" && (
        <>
          <div className="w-12 h-12 border-2 border-[#FF6B00] border-t-transparent rounded-full animate-spin mb-6" />
          <p className="text-[#888] text-sm tracking-widest uppercase">
            Authenticating with Wargaming…
          </p>
        </>
      )}

      {status === "success" && (
        <>
          <div className="w-14 h-14 flex items-center justify-center border-2 border-[#FF6B00] mb-6">
            <svg className="w-7 h-7 text-[#FF6B00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-white font-bold tracking-widest uppercase mb-2">
            Authentication successful
          </p>
          <p className="text-[#666] text-sm tracking-wider">
            Redirecting to the feed…
          </p>
        </>
      )}

      {status === "error" && (
        <>
          <div className="w-14 h-14 flex items-center justify-center border-2 border-red-500 mb-6">
            <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-red-400 font-bold tracking-widest uppercase mb-2">
            Authentication failed
          </p>
          <p className="text-[#555] text-sm mb-8 max-w-xs">{errorMsg}</p>
          <a
            href={import.meta.env.BASE_URL?.replace(/\/$/, "") + "/login"}
            className="border border-[#FF6B00] text-[#FF6B00] px-6 py-2 text-xs tracking-widest uppercase hover:bg-[#FF6B00]/10 transition-colors"
          >
            Try Again
          </a>
        </>
      )}
    </div>
  );
}
