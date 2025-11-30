import { Router } from "express";
import {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
} from "../controllers/notification.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

// All routes require authentication
router.use(verifyJWT);

router.route("/").get(getNotifications);
router.route("/:notificationId/read").patch(markAsRead);
router.route("/read-all").patch(markAllAsRead);
router.route("/:notificationId").delete(deleteNotification);

export default router;
