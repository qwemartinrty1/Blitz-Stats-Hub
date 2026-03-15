import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { settingsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

function getSessionId(req: any): string {
  return req.cookies?.session_id || req.headers["x-session-id"] || "default-session";
}

const defaultSettings = {
  account_id: null,
  wg_nickname: null,
  server: "eu" as const,
  notifications_enabled: true,
  theme: "dark" as const,
  language: "en",
  show_clan_tag: true,
  privacy_mode: false,
  linked_account: false,
};

router.get("/", async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const [settings] = await db.select().from(settingsTable).where(eq(settingsTable.session_id, sessionId));

    if (!settings) {
      res.json({ ...defaultSettings });
      return;
    }

    res.json({
      account_id: settings.account_id,
      wg_nickname: settings.wg_nickname,
      server: settings.server,
      notifications_enabled: settings.notifications_enabled,
      theme: settings.theme,
      language: settings.language,
      show_clan_tag: settings.show_clan_tag,
      privacy_mode: settings.privacy_mode,
      linked_account: !!settings.wg_nickname,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error", message: "Internal server error" });
  }
});

router.put("/", async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const { account_id, wg_nickname, server, notifications_enabled, theme, language, show_clan_tag, privacy_mode } = req.body;

    const [existing] = await db.select().from(settingsTable).where(eq(settingsTable.session_id, sessionId));

    if (existing) {
      const [updated] = await db.update(settingsTable).set({
        account_id: account_id !== undefined ? account_id : existing.account_id,
        wg_nickname: wg_nickname !== undefined ? wg_nickname : existing.wg_nickname,
        server: server !== undefined ? server : existing.server,
        notifications_enabled: notifications_enabled !== undefined ? notifications_enabled : existing.notifications_enabled,
        theme: theme !== undefined ? theme : existing.theme,
        language: language !== undefined ? language : existing.language,
        show_clan_tag: show_clan_tag !== undefined ? show_clan_tag : existing.show_clan_tag,
        privacy_mode: privacy_mode !== undefined ? privacy_mode : existing.privacy_mode,
        updated_at: new Date(),
      }).where(eq(settingsTable.session_id, sessionId)).returning();

      res.json({
        account_id: updated.account_id,
        wg_nickname: updated.wg_nickname,
        server: updated.server,
        notifications_enabled: updated.notifications_enabled,
        theme: updated.theme,
        language: updated.language,
        show_clan_tag: updated.show_clan_tag,
        privacy_mode: updated.privacy_mode,
        linked_account: !!updated.wg_nickname,
      });
    } else {
      const [created] = await db.insert(settingsTable).values({
        session_id: sessionId,
        account_id: account_id || null,
        wg_nickname: wg_nickname || null,
        server: server || "eu",
        notifications_enabled: notifications_enabled !== undefined ? notifications_enabled : true,
        theme: theme || "dark",
        language: language || "en",
        show_clan_tag: show_clan_tag !== undefined ? show_clan_tag : true,
        privacy_mode: privacy_mode !== undefined ? privacy_mode : false,
      }).returning();

      res.json({
        account_id: created.account_id,
        wg_nickname: created.wg_nickname,
        server: created.server,
        notifications_enabled: created.notifications_enabled,
        theme: created.theme,
        language: created.language,
        show_clan_tag: created.show_clan_tag,
        privacy_mode: created.privacy_mode,
        linked_account: !!created.wg_nickname,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error", message: "Internal server error" });
  }
});

export default router;
