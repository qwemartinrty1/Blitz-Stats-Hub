import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { tournamentsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

async function seedTournamentsIfEmpty() {
  const existing = await db.select().from(tournamentsTable).limit(1);
  if (existing.length > 0) return;

  await db.insert(tournamentsTable).values([
    {
      title: "European Championship — Spring 2026",
      description: "The premier competitive event for top European players. Battle it out in 7v7 format across 10 epic maps to claim the championship title and prize pool.",
      status: "active",
      start_date: "2026-03-01",
      end_date: "2026-03-31",
      prize_pool: "$10,000",
      max_participants: 128,
      current_participants: 96,
      format: "7v7 Team Battle",
      tier_requirement: 10,
    },
    {
      title: "Blitz Grand Prix — Season 4",
      description: "Weekly grand prix tournament for solo players. Earn points across 5 rounds to qualify for the final championship event.",
      status: "upcoming",
      start_date: "2026-04-05",
      end_date: "2026-04-20",
      prize_pool: "$5,000",
      max_participants: 256,
      current_participants: 45,
      format: "Solo Ranked",
      tier_requirement: 8,
    },
    {
      title: "Blitz Open — February 2026",
      description: "Open community tournament for all skill levels. No tier restriction. Great for new players to experience competitive play.",
      status: "completed",
      start_date: "2026-02-01",
      end_date: "2026-02-28",
      prize_pool: "$2,500",
      max_participants: 512,
      current_participants: 512,
      format: "1v1 Duel",
      tier_requirement: null,
    },
    {
      title: "Clan Wars: Spring Offensive",
      description: "Clan vs. clan warfare. Gather your 15-player clan and fight for territorial supremacy on the global map. Top 3 clans win exclusive rewards.",
      status: "upcoming",
      start_date: "2026-04-15",
      end_date: "2026-05-15",
      prize_pool: "$15,000",
      max_participants: 64,
      current_participants: 22,
      format: "15v15 Clan Battle",
      tier_requirement: 10,
    },
    {
      title: "Steel Thunder Weekend Cup",
      description: "A weekend-long rapid-fire tournament with 3-minute battles. High intensity, fast rewards. Limited to Tier VII-IX vehicles.",
      status: "upcoming",
      start_date: "2026-04-12",
      end_date: "2026-04-13",
      prize_pool: "$1,000",
      max_participants: 200,
      current_participants: 80,
      format: "3v3 Sprint",
      tier_requirement: 9,
    },
  ]);
}

router.get("/", async (req, res) => {
  try {
    await seedTournamentsIfEmpty();
    const { status, page = "1", limit = "20" } = req.query as { status?: string; page?: string; limit?: string };

    let query = db.select().from(tournamentsTable);
    const allRows = await query;

    const filtered = status ? allRows.filter(t => t.status === status) : allRows;
    const total = filtered.length;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const paginated = filtered.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    res.json({
      tournaments: paginated.map(t => ({
        ...t,
        participants: null,
        created_at: t.created_at.toISOString(),
      })),
      total,
      page: pageNum,
      limit: limitNum,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error", message: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, start_date, end_date, format, prize_pool, max_participants, tier_requirement } = req.body;

    if (!title || !description || !start_date || !end_date || !format) {
      res.status(400).json({ error: "bad_request", message: "Missing required fields" });
      return;
    }

    const [created] = await db.insert(tournamentsTable).values({
      title,
      description,
      start_date,
      end_date,
      format,
      prize_pool: prize_pool || null,
      max_participants: max_participants || null,
      tier_requirement: tier_requirement || null,
      status: "upcoming",
      current_participants: 0,
    }).returning();

    res.status(201).json({
      ...created,
      participants: null,
      created_at: created.created_at.toISOString(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error", message: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    await seedTournamentsIfEmpty();
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ error: "bad_request", message: "Invalid tournament ID" });
      return;
    }

    const [tournament] = await db.select().from(tournamentsTable).where(eq(tournamentsTable.id, id));

    if (!tournament) {
      res.status(404).json({ error: "not_found", message: "Tournament not found" });
      return;
    }

    const mockParticipants = Array.from({ length: Math.min(20, tournament.current_participants) }, (_, i) => ({
      account_id: 10000 + i,
      nickname: `Player_${i + 1}`,
      score: Math.floor(Math.random() * 5000) + 1000,
      rank: i + 1,
    })).sort((a, b) => b.score - a.score).map((p, i) => ({ ...p, rank: i + 1 }));

    res.json({
      ...tournament,
      participants: mockParticipants,
      created_at: tournament.created_at.toISOString(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error", message: "Internal server error" });
  }
});

export default router;
