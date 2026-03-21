import { Router } from "express";
import { supabase } from "../lib/supabase";

const router = Router();

// GET /api/posts?page=1&limit=20&author_id=xxx
router.get("/", async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page  as string) || 1);
    const limit = Math.min(50, parseInt(req.query.limit as string) || 20);
    const authorId = req.query.author_id as string | undefined;
    const userId   = req.headers["x-user-id"] as string | undefined;
    const from = (page - 1) * limit;
    const to   = from + limit - 1;

    let query = supabase
      .from("posts")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (authorId) query = query.eq("author_id", authorId);

    const { data: posts, error, count } = await query;
    if (error) throw error;

    let likedIds = new Set<string>();
    if (userId && posts?.length) {
      const { data: likes } = await supabase
        .from("post_likes")
        .select("post_id")
        .eq("user_id", userId)
        .in("post_id", posts.map((p) => p.id));
      if (likes) likedIds = new Set(likes.map((l) => l.post_id));
    }

    res.json({
      posts: (posts ?? []).map((p) => ({
        ...p,
        is_liked: likedIds.has(p.id),
        is_own:   p.author_id === userId,
      })),
      total:    count ?? 0,
      page,
      limit,
      has_more: (count ?? 0) > to + 1,
    });
  } catch (err: any) {
    console.error("[GET /posts]", err);
    res.status(500).json({ error: "server_error", message: err.message });
  }
});

// GET /api/posts/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userId  = req.headers["x-user-id"] as string | undefined;

    const { data: post, error } = await supabase.from("posts").select("*").eq("id", id).single();
    if (error || !post) { res.status(404).json({ error: "not_found", message: "Post not found" }); return; }

    let isLiked = false;
    if (userId) {
      const { data: like } = await supabase
        .from("post_likes").select("id").eq("post_id", id).eq("user_id", userId).maybeSingle();
      isLiked = !!like;
    }

    res.json({ ...post, is_liked: isLiked, is_own: post.author_id === userId });
  } catch (err: any) {
    console.error("[GET /posts/:id]", err);
    res.status(500).json({ error: "server_error", message: err.message });
  }
});

// POST /api/posts
router.post("/", async (req, res) => {
  try {
    const { author_id, author_nickname, author_clan_tag, content, post_type = "text", battle_result = null, media_url = null, media_type = null } = req.body;

    if (!author_id || !author_nickname || !content?.trim()) {
      res.status(400).json({ error: "validation", message: "author_id, author_nickname and content are required" });
      return;
    }

    const { data: post, error } = await supabase
      .from("posts")
      .insert({ author_id, author_nickname, author_clan_tag: author_clan_tag ?? null, content: content.trim(), post_type, battle_result, media_url, media_type })
      .select().single();

    if (error) throw error;
    res.status(201).json({ ...post, is_liked: false, is_own: true });
  } catch (err: any) {
    console.error("[POST /posts]", err);
    res.status(500).json({ error: "server_error", message: err.message });
  }
});

// PATCH /api/posts/:id
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userId  = req.headers["x-user-id"] as string | undefined;

    const { data: existing } = await supabase.from("posts").select("author_id").eq("id", id).single();
    if (!existing) { res.status(404).json({ error: "not_found", message: "Post not found" }); return; }
    if (userId && existing.author_id !== userId) { res.status(403).json({ error: "forbidden", message: "Not your post" }); return; }

    const { content, post_type, battle_result, media_url, media_type } = req.body;
    const { data: post, error } = await supabase
      .from("posts")
      .update({ content, post_type, battle_result, media_url, media_type, updated_at: new Date().toISOString() })
      .eq("id", id).select().single();

    if (error) throw error;
    res.json({ ...post, is_own: true });
  } catch (err: any) {
    console.error("[PATCH /posts/:id]", err);
    res.status(500).json({ error: "server_error", message: err.message });
  }
});

// DELETE /api/posts/:id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userId  = req.headers["x-user-id"] as string | undefined;

    const { data: existing } = await supabase.from("posts").select("author_id").eq("id", id).single();
    if (!existing) { res.status(404).json({ error: "not_found", message: "Post not found" }); return; }
    if (userId && existing.author_id !== userId) { res.status(403).json({ error: "forbidden", message: "Not your post" }); return; }

    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err: any) {
    console.error("[DELETE /posts/:id]", err);
    res.status(500).json({ error: "server_error", message: err.message });
  }
});

// POST /api/posts/:id/like  — toggles like on/off
router.post("/:id/like", async (req, res) => {
  try {
    const { id: postId } = req.params;
    const { user_id } = req.body;
    if (!user_id) { res.status(400).json({ error: "validation", message: "user_id is required" }); return; }

    const { data: existing } = await supabase
      .from("post_likes").select("id").eq("post_id", postId).eq("user_id", user_id).maybeSingle();

    let liked: boolean;
    let delta: number;

    if (existing) {
      await supabase.from("post_likes").delete().eq("id", existing.id);
      liked = false; delta = -1;
    } else {
      await supabase.from("post_likes").insert({ post_id: postId, user_id });
      liked = true; delta = 1;
    }

    const { data: post } = await supabase.from("posts").select("likes_count").eq("id", postId).single();
    const newCount = Math.max(0, (post?.likes_count ?? 0) + delta);
    await supabase.from("posts").update({ likes_count: newCount }).eq("id", postId);

    res.json({ liked, likes_count: newCount });
  } catch (err: any) {
    console.error("[POST /posts/:id/like]", err);
    res.status(500).json({ error: "server_error", message: err.message });
  }
});

export default router;
