import { Router } from "express";
import { supabase } from "../lib/supabase";

const router = Router();

// GET /api/users/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data: user, error } = await supabase.from("users").select("*").eq("id", id).single();
    if (error || !user) { res.status(404).json({ error: "not_found", message: "User not found" }); return; }

    res.json(user);
  } catch (err: any) {
    console.error("[GET /users/:id]", err);
    res.status(500).json({ error: "server_error", message: err.message });
  }
});

// POST /api/users  — create or upsert by wg_account_id
router.post("/", async (req, res) => {
  try {
    const { wg_account_id, wg_nickname, clan_tag, server = "eu", avatar_url, bio } = req.body;

    if (!wg_nickname) {
      res.status(400).json({ error: "validation", message: "wg_nickname is required" });
      return;
    }

    // Upsert: if wg_account_id already exists, update; otherwise insert
    const { data: user, error } = await supabase
      .from("users")
      .upsert(
        { wg_account_id: wg_account_id ?? null, wg_nickname, clan_tag: clan_tag ?? null, server, avatar_url: avatar_url ?? null, bio: bio ?? null },
        { onConflict: "wg_account_id", ignoreDuplicates: false }
      )
      .select().single();

    if (error) throw error;
    res.status(201).json(user);
  } catch (err: any) {
    console.error("[POST /users]", err);
    res.status(500).json({ error: "server_error", message: err.message });
  }
});

// PATCH /api/users/:id
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers["x-user-id"] as string | undefined;

    if (userId && id !== userId) { res.status(403).json({ error: "forbidden", message: "Cannot edit another user's profile" }); return; }

    const { wg_nickname, clan_tag, server, avatar_url, bio } = req.body;

    const { data: user, error } = await supabase
      .from("users")
      .update({ wg_nickname, clan_tag, server, avatar_url, bio, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select().single();

    if (error) throw error;
    res.json(user);
  } catch (err: any) {
    console.error("[PATCH /users/:id]", err);
    res.status(500).json({ error: "server_error", message: err.message });
  }
});

export default router;
