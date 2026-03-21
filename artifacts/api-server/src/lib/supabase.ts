import { createClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Set these as environment variables before starting the server:
//   SUPABASE_URL         → your project URL, e.g. https://xxxx.supabase.co
//   SUPABASE_SERVICE_KEY → service_role key (Dashboard → Settings → API)
//
// To regenerate strict TypeScript types from your project run:
//   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/database.types.ts
// ---------------------------------------------------------------------------
// Using a dummy URL so the server starts even before credentials are configured.
// Replace with your real project URL via the SUPABASE_URL env var.
const SUPABASE_URL = process.env.SUPABASE_URL ?? "https://your-project.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY ?? "YOUR_SUPABASE_SERVICE_ROLE_KEY";

if (
  SUPABASE_URL === "https://your-project.supabase.co" ||
  SUPABASE_SERVICE_KEY === "YOUR_SUPABASE_SERVICE_ROLE_KEY"
) {
  console.warn(
    "[supabase] WARNING: SUPABASE_URL or SUPABASE_SERVICE_KEY is not set. " +
    "Set them as environment variables before running in production."
  );
}

// The service-role client bypasses Row Level Security — keep it server-side only.
// We intentionally omit the Database generic here; once you have your project set up
// you can regenerate database.types.ts and add it: createClient<Database>(...)
export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Storage bucket name for post media (images / videos)
export const MEDIA_BUCKET = "post-media";
