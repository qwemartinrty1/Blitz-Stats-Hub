import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { postsTable, postLikesTable } from "@workspace/db/schema";
import { eq, and, desc } from "drizzle-orm";

const router: IRouter = Router();

function getSessionId(req: any): string {
  return req.cookies?.session_id || req.headers["x-session-id"] || "anonymous";
}

async function seedPostsIfEmpty() {
  const existing = await db.select().from(postsTable).limit(1);
  if (existing.length > 0) return;

  await db.insert(postsTable).values([
    {
      author_id: 1001,
      author_nickname: "TankAce_2024",
      author_clan_tag: "ELITE",
      content: "Just hit 60% winrate across 8,000 battles! Feels good. IS-7 is carrying me hard lately.",
      post_type: "text",
      likes_count: 42,
      comments_count: 8,
    },
    {
      author_id: 1002,
      author_nickname: "BlitzMaster",
      author_clan_tag: "PRO",
      content: "What a game on Black Goldville! Triple MOE on the T-62A achieved!",
      post_type: "battle_result",
      likes_count: 87,
      comments_count: 15,
      battle_result_tank: "T-62A",
      battle_result_damage: 6847,
      battle_result_frags: 5,
      battle_result_xp: 4230,
      battle_result_outcome: "win",
      battle_result_map: "Black Goldville",
    },
    {
      author_id: 1003,
      author_nickname: "SteelWarrior",
      author_clan_tag: null,
      content: "Object 430U review: This tank is absolutely disgusting in the right hands. Great armor, great DPM, great gun. Easy 9/10.",
      post_type: "tank_review",
      likes_count: 31,
      comments_count: 12,
    },
    {
      author_id: 1004,
      author_nickname: "ProTanker_EU",
      author_clan_tag: "CLAN",
      content: "Finally unlocked the IS-7 after months of grinding! 3,000 battles in IS-3 paid off.",
      post_type: "achievement",
      likes_count: 55,
      comments_count: 6,
    },
    {
      author_id: 1005,
      author_nickname: "IronCommander",
      author_clan_tag: "IRON",
      content: "Horrible loss streak today. 7 defeats in a row. Teammates keep yoloing into the enemy. Taking a break.",
      post_type: "text",
      likes_count: 19,
      comments_count: 22,
    },
    {
      author_id: 1006,
      author_nickname: "TankHunter99",
      author_clan_tag: null,
      content: "Desert Sands is the worst map in the game, change my mind.",
      post_type: "text",
      likes_count: 134,
      comments_count: 47,
    },
    {
      author_id: 1007,
      author_nickname: "ArmoredFist_EU",
      author_clan_tag: "FIST",
      content: "Crazy clutch battle! Down to 1v3 and we pulled through somehow. Is-7 bounced everything.",
      post_type: "battle_result",
      likes_count: 201,
      comments_count: 33,
      battle_result_tank: "IS-7",
      battle_result_damage: 8124,
      battle_result_frags: 3,
      battle_result_xp: 5671,
      battle_result_outcome: "win",
      battle_result_map: "Fort Despair",
    },
  ]);
}

router.get("/", async (req, res) => {
  try {
    await seedPostsIfEmpty();
    const { page = "1", limit = "20" } = req.query as { page?: string; limit?: string };
    const sessionId = getSessionId(req);

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const allPosts = await db.select().from(postsTable).orderBy(desc(postsTable.created_at));
    const total = allPosts.length;
    const paginated = allPosts.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    const userLikes = await db.select().from(postLikesTable).where(eq(postLikesTable.user_session, sessionId));
    const likedPostIds = new Set(userLikes.map(l => l.post_id));

    const posts = paginated.map(p => ({
      id: p.id,
      author_id: p.author_id,
      author_nickname: p.author_nickname,
      author_clan_tag: p.author_clan_tag,
      content: p.content,
      image_url: p.image_url,
      likes_count: p.likes_count,
      comments_count: p.comments_count,
      is_liked: likedPostIds.has(p.id),
      post_type: p.post_type,
      battle_result: p.battle_result_tank ? {
        tank_name: p.battle_result_tank,
        damage_dealt: p.battle_result_damage || 0,
        frags: p.battle_result_frags || 0,
        xp: p.battle_result_xp || 0,
        result: p.battle_result_outcome || "win",
        map_name: p.battle_result_map || "",
      } : null,
      created_at: p.created_at.toISOString(),
    }));

    res.json({ posts, total, page: pageNum, limit: limitNum });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error", message: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { content, post_type = "text", image_url } = req.body;

    if (!content || content.trim().length === 0) {
      res.status(400).json({ error: "bad_request", message: "Content is required" });
      return;
    }

    const [created] = await db.insert(postsTable).values({
      author_id: 9999,
      author_nickname: "You",
      author_clan_tag: null,
      content: content.trim(),
      post_type: post_type || "text",
      image_url: image_url || null,
    }).returning();

    res.status(201).json({
      id: created.id,
      author_id: created.author_id,
      author_nickname: created.author_nickname,
      author_clan_tag: created.author_clan_tag,
      content: created.content,
      image_url: created.image_url,
      likes_count: 0,
      comments_count: 0,
      is_liked: false,
      post_type: created.post_type,
      battle_result: null,
      created_at: created.created_at.toISOString(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error", message: "Internal server error" });
  }
});

router.post("/:postId/like", async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);
    const sessionId = getSessionId(req);

    if (isNaN(postId)) {
      res.status(400).json({ error: "bad_request", message: "Invalid post ID" });
      return;
    }

    const existingLike = await db.select().from(postLikesTable)
      .where(and(eq(postLikesTable.post_id, postId), eq(postLikesTable.user_session, sessionId)));

    const [post] = await db.select().from(postsTable).where(eq(postsTable.id, postId));
    if (!post) {
      res.status(404).json({ error: "not_found", message: "Post not found" });
      return;
    }

    let liked: boolean;
    let newCount: number;

    if (existingLike.length > 0) {
      await db.delete(postLikesTable).where(and(eq(postLikesTable.post_id, postId), eq(postLikesTable.user_session, sessionId)));
      newCount = Math.max(0, post.likes_count - 1);
      liked = false;
    } else {
      await db.insert(postLikesTable).values({ post_id: postId, user_session: sessionId });
      newCount = post.likes_count + 1;
      liked = true;
    }

    await db.update(postsTable).set({ likes_count: newCount }).where(eq(postsTable.id, postId));

    res.json({ liked, likes_count: newCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error", message: "Internal server error" });
  }
});

export default router;
