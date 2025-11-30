import { Router } from 'express';
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
    getShorts,
    trackWatch
} from "../controllers/video.controller.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js"
import { upload } from "../middlewares/multer.middlewares.js"

const router = Router();

// Public routes
router.route("/").get(getAllVideos);
router.route("/:videoId").get(getVideoById);
router.route("/shorts").get(getShorts); // Public shorts endpoint

// Protected routes
router.use(verifyJWT); // Apply verifyJWT middleware to all routes below

router.route("/").post(
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1,
        },
        {
            name: "thumbnail",
            maxCount: 1,
        },
    ]),
    publishAVideo
);

router
    .route("/:videoId")
    .delete(deleteVideo)
    .patch(upload.single("thumbnail"), updateVideo);

router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

// Watch tracking route (protected)
router.route("/watch/:videoId").post(trackWatch);

export default router