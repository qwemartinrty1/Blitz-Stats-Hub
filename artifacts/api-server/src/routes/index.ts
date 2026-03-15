import { Router, type IRouter } from "express";
import healthRouter from "./health";
import playersRouter from "./players";
import tournamentsRouter from "./tournaments";
import postsRouter from "./posts";
import settingsRouter from "./settings";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/players", playersRouter);
router.use("/tournaments", tournamentsRouter);
router.use("/posts", postsRouter);
router.use("/settings", settingsRouter);

export default router;
