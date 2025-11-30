import { Router } from 'express';
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment,
} from "../controllers/comment.controller.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js"

const router = Router();

router.route("/:videoId").get(getVideoComments);

router.use(verifyJWT); // Apply verifyJWT middleware to all routes below

router.route("/:videoId").post(addComment);
router.route("/c/:commentId").delete(deleteComment).patch(updateComment);

export default router