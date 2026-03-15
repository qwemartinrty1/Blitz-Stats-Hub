import { Router, type IRouter } from "express";

const router: IRouter = Router();

const WG_API_BASES: Record<string, string> = {
  eu: "https://api.wotblitz.eu",
  com: "https://api.wotblitz.com",
  asia: "https://api.wotblitz.asia",
};

const TANK_NAMES: Record<number, { name: string; tier: number; type: string }> = {
  1: { name: "T1 Cunningham", tier: 1, type: "LT" },
  2: { name: "M2 Light Tank", tier: 2, type: "LT" },
  3: { name: "M2 Medium Tank", tier: 3, type: "MT" },
  4: { name: "T-34", tier: 5, type: "MT" },
  5: { name: "IS-7", tier: 10, type: "HT" },
  6: { name: "T-62A", tier: 10, type: "MT" },
  7: { name: "E 50 Ausf. M", tier: 10, type: "MT" },
  8: { name: "Object 430U", tier: 10, type: "MT" },
  9: { name: "Centurion Action X", tier: 10, type: "MT" },
  10: { name: "T110E5", tier: 10, type: "HT" },
};

function getMockPlayer(accountId: number, nickname: string) {
  const battles = 5000 + Math.floor(Math.random() * 10000);
  const wins = Math.floor(battles * (0.48 + Math.random() * 0.15));
  const losses = battles - wins;
  const frags = Math.floor(battles * 0.8 + Math.random() * 500);
  const damage_dealt = Math.floor(battles * 1200 + Math.random() * 200000);

  return {
    account_id: accountId,
    nickname,
    created_at: Math.floor(Date.now() / 1000) - 365 * 24 * 3600 * 5,
    last_battle_time: Math.floor(Date.now() / 1000) - 3600,
    statistics: {
      battles,
      wins,
      losses,
      frags,
      damage_dealt,
      damage_received: Math.floor(damage_dealt * 0.9),
      spotted: Math.floor(battles * 0.3),
      hits: Math.floor(battles * 70),
      shots: Math.floor(battles * 80),
      survived_battles: Math.floor(battles * 0.35),
      xp: Math.floor(battles * 450),
      win_rate: parseFloat(((wins / battles) * 100).toFixed(2)),
      avg_damage: parseFloat((damage_dealt / battles).toFixed(0)),
      avg_frags: parseFloat((frags / battles).toFixed(2)),
    },
    max_frags: 6 + Math.floor(Math.random() * 8),
    max_damage: 5000 + Math.floor(Math.random() * 10000),
    max_xp: 3000 + Math.floor(Math.random() * 5000),
    clan_tag: Math.random() > 0.5 ? "CLAN" : null,
    clan_id: Math.random() > 0.5 ? 12345 : null,
    is_own_profile: false,
  };
}

router.get("/search", async (req, res) => {
  const { query, server = "eu" } = req.query as { query: string; server?: string };

  if (!query || query.length < 2) {
    res.status(400).json({ error: "bad_request", message: "Query must be at least 2 characters" });
    return;
  }

  const apiKey = process.env.WG_API_KEY;

  if (apiKey) {
    try {
      const base = WG_API_BASES[server] || WG_API_BASES.eu;
      const url = `${base}/wotb/account/list/?application_id=${apiKey}&search=${encodeURIComponent(query as string)}&limit=20`;
      const resp = await fetch(url);
      const data = await resp.json() as any;

      if (data.status === "ok") {
        res.json({ players: data.data || [], count: data.meta?.count || 0 });
        return;
      }
    } catch (err) {
      console.error("WG API error:", err);
    }
  }

  const mockPlayers = [
    { account_id: 1001, nickname: `${query}_Player` },
    { account_id: 1002, nickname: `${query}_Tank` },
    { account_id: 1003, nickname: `${query}Blitz` },
    { account_id: 1004, nickname: `Pro_${query}` },
    { account_id: 1005, nickname: `${query}_EU` },
  ].filter(p => p.nickname.toLowerCase().includes((query as string).toLowerCase()));

  res.json({ players: mockPlayers, count: mockPlayers.length });
});

router.get("/:accountId", async (req, res) => {
  const accountId = parseInt(req.params.accountId);
  const { server = "eu" } = req.query as { server?: string };

  if (isNaN(accountId)) {
    res.status(400).json({ error: "bad_request", message: "Invalid account ID" });
    return;
  }

  const apiKey = process.env.WG_API_KEY;

  if (apiKey) {
    try {
      const base = WG_API_BASES[server] || WG_API_BASES.eu;
      const url = `${base}/wotb/account/info/?application_id=${apiKey}&account_id=${accountId}&extra=statistics.rating`;
      const resp = await fetch(url);
      const data = await resp.json() as any;

      if (data.status === "ok" && data.data && data.data[accountId]) {
        const p = data.data[accountId];
        const stats = p.statistics?.all || {};
        const battles = stats.battles || 1;
        const wins = stats.wins || 0;
        const frags = stats.frags || 0;
        const damage = stats.damage_dealt || 0;

        res.json({
          player: {
            account_id: accountId,
            nickname: p.nickname,
            created_at: p.created_at,
            last_battle_time: p.last_battle_time,
            statistics: {
              battles,
              wins,
              losses: stats.losses || 0,
              frags,
              damage_dealt: damage,
              damage_received: stats.damage_received || 0,
              spotted: stats.spotted || 0,
              hits: stats.hits || 0,
              shots: stats.shots || 0,
              survived_battles: stats.survived_battles || 0,
              xp: stats.xp || 0,
              win_rate: parseFloat(((wins / battles) * 100).toFixed(2)),
              avg_damage: parseFloat((damage / battles).toFixed(0)),
              avg_frags: parseFloat((frags / battles).toFixed(2)),
            },
            max_frags: p.statistics?.max_frags || 0,
            max_damage: p.statistics?.max_damage || 0,
            max_xp: p.statistics?.max_xp || 0,
            clan_tag: null,
            clan_id: null,
            is_own_profile: false,
          },
        });
        return;
      }
    } catch (err) {
      console.error("WG API error:", err);
    }
  }

  const mockNicknames: Record<number, string> = {
    1001: "TankAce_2024",
    1002: "BlitzMaster",
    1003: "SteelWarrior",
    1004: "ProTanker_EU",
    1005: "IronCommander",
  };

  const nickname = mockNicknames[accountId] || `Player_${accountId}`;
  res.json({ player: getMockPlayer(accountId, nickname) });
});

router.get("/:accountId/tanks", async (req, res) => {
  const accountId = parseInt(req.params.accountId);
  const { server = "eu" } = req.query as { server?: string };

  if (isNaN(accountId)) {
    res.status(400).json({ error: "bad_request", message: "Invalid account ID" });
    return;
  }

  const apiKey = process.env.WG_API_KEY;

  if (apiKey) {
    try {
      const base = WG_API_BASES[server] || WG_API_BASES.eu;
      const url = `${base}/wotb/tanks/stats/?application_id=${apiKey}&account_id=${accountId}`;
      const resp = await fetch(url);
      const data = await resp.json() as any;

      if (data.status === "ok" && data.data && data.data[accountId]) {
        const tanks = (data.data[accountId] || []).map((t: any) => ({
          tank_id: t.tank_id,
          tank_name: `Tank #${t.tank_id}`,
          tank_tier: 1,
          tank_type: "MT",
          battles: t.all?.battles || 0,
          wins: t.all?.wins || 0,
          frags: t.all?.frags || 0,
          damage_dealt: t.all?.damage_dealt || 0,
          mark_of_mastery: t.mark_of_mastery || 0,
          win_rate: t.all?.battles ? parseFloat(((t.all.wins / t.all.battles) * 100).toFixed(2)) : 0,
          avg_damage: t.all?.battles ? parseFloat((t.all.damage_dealt / t.all.battles).toFixed(0)) : 0,
          last_battle_time: t.last_battle_time || 0,
        }));
        res.json({ tanks, count: tanks.length });
        return;
      }
    } catch (err) {
      console.error("WG API error:", err);
    }
  }

  const mockTanks = [
    { tank_id: 5, tank_name: "IS-7", tank_tier: 10, tank_type: "HT", battles: 1200, wins: 720, frags: 900, damage_dealt: 1_800_000, mark_of_mastery: 4, win_rate: 60.0, avg_damage: 1500, last_battle_time: Date.now() / 1000 - 3600 },
    { tank_id: 6, tank_name: "T-62A", tank_tier: 10, tank_type: "MT", battles: 850, wins: 475, frags: 720, damage_dealt: 1_250_000, mark_of_mastery: 3, win_rate: 55.9, avg_damage: 1471, last_battle_time: Date.now() / 1000 - 7200 },
    { tank_id: 7, tank_name: "E 50 Ausf. M", tank_tier: 10, tank_type: "MT", battles: 600, wins: 320, frags: 490, damage_dealt: 900_000, mark_of_mastery: 3, win_rate: 53.3, avg_damage: 1500, last_battle_time: Date.now() / 1000 - 14400 },
    { tank_id: 8, tank_name: "Object 430U", tank_tier: 10, tank_type: "MT", battles: 400, wins: 240, frags: 310, damage_dealt: 640_000, mark_of_mastery: 2, win_rate: 60.0, avg_damage: 1600, last_battle_time: Date.now() / 1000 - 86400 },
    { tank_id: 9, tank_name: "Centurion Action X", tank_tier: 10, tank_type: "MT", battles: 300, wins: 160, frags: 240, damage_dealt: 480_000, mark_of_mastery: 2, win_rate: 53.3, avg_damage: 1600, last_battle_time: Date.now() / 1000 - 172800 },
  ];

  res.json({ tanks: mockTanks, count: mockTanks.length });
});

export default router;
