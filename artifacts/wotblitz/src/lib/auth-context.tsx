import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface WGUser {
  account_id: number;
  nickname: string;
  access_token: string;
  expires_at: number; // unix timestamp (seconds)
  region: "eu" | "com" | "asia";
}

interface AuthContextValue {
  user: WGUser | null;
  isLoading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  logout: () => {},
});

const STORAGE_KEY = "blitznet_wg_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<WGUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: WGUser = JSON.parse(raw);
        // Discard if token has expired
        if (parsed.expires_at > Math.floor(Date.now() / 1000)) {
          setUser(parsed);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }

  // Exposed so the callback page can store the authenticated user
  ;(AuthProvider as any)._setUser = (u: WGUser) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    setUser(u);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// Called from the callback page after a successful WG redirect
export function saveWGUser(u: WGUser) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  // Force a page reload so React re-reads from localStorage
  window.location.replace(
    window.location.origin + import.meta.env.BASE_URL.replace(/\/$/, "") + "/"
  );
}
