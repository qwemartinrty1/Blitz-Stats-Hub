import { Router } from "express";
import { supabase } from "../lib/supabase";

// Using any for params because mergeParams typing is limited in Express typings
const router = Router({ mergeParams: true }) as any;

// GET /api/posts/:postId/comments
router.get("/", async (req: any, res: any) => {
  try {
    const { postId } = req.params;
    const userId = req.headers["x-user-id"] as string | undefined;

    const { data: comments, error } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    res.json({
      comments: (comments ?? []).map((c) => ({
        ...c,
        is_own: c.author_id === userId,
      })),
    });
  } catch (err: any) {
    console.error("[GET /comments]", err);
    res.status(500).json({ error: "server_error", message: err.message });
  }
});

// POST /api/posts/:postId/comments
router.post("/", async (req: any, res: any) => {
  try {
    const { postId } = req.params;
    const { author_id, author_nickname, author_clan_tag, content } = req.body;

    if (!author_id || !author_nickname || !content?.trim()) {
      res.status(400).json({ error: "validation", message: "author_id, author_nickname and content are required" });
      return;
    }

    const { data: comment, error } = await supabase
      .from("comments")
      .insert({ post_id: postId, author_id, author_nickname, author_clan_tag: author_clan_tag ?? null, content: content.trim() })
      .select().single();

    if (error) throw error;

    // Bump comments_count on the post
    const { data: post } = await supabase.from("posts").select("comments_count").eq("id", postId).single();
    await supabase.from("posts").update({ comments_count: (post?.comments_count ?? 0) + 1 }).eq("id", postId);

    res.status(201).json({ ...comment, is_own: true });
  } catch (err: any) {
    console.error("[POST /comments]", err);
    res.status(500).json({ error: "server_error", message: err.message });
  }
});

// DELETE /api/posts/:postId/comments/:commentId
router.delete("/:commentId", async (req: any, res: any) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.headers["x-user-id"] as string | undefined;

    const { data: existing } = await supabase.from("comments").select("author_id").eq("id", commentId).single();
    if (!existing) { res.status(404).json({ error: "not_found", message: "Comment not found" }); return; }
    if (userId && existing.author_id !== userId) { res.status(403).json({ error: "forbidden", message: "Not your comment" }); return; }

    await supabase.from("comments").delete().eq("id", commentId);

    // Decrement comments_count
    const { data: post } = await supabase.from("posts").select("comments_count").eq("id", postId).single();
    await supabase.from("posts").update({ comments_count: Math.max(0, (post?.comments_count ?? 1) - 1) }).eq("id", postId);

    res.json({ success: true });
  } catch (err: any) {
    console.error("[DELETE /comments/:commentId]", err);
    res.status(500).json({ error: "server_error", message: err.message });
  }
});

export default router;
