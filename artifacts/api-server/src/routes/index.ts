import { Router } from "express";
import healthRouter    from "./health";
import postsRouter     from "./posts";
import commentsRouter  from "./comments";
import usersRouter     from "./users";
import uploadRouter    from "./upload";

const router = Router();

router.use(healthRouter);
router.use("/posts",   postsRouter);
router.use("/posts/:postId/comments", commentsRouter);
router.use("/users",  usersRouter);
router.use("/upload", uploadRouter);

export default router;
