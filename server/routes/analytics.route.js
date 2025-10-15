import { Router } from "express";
import { dailyAnalytics, topMenuItems, salesAnalytics } from "../controllers/analytics.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.get('/daily', authMiddleware, dailyAnalytics);
router.get('/sales', authMiddleware, salesAnalytics);
router.get('/top-items', authMiddleware, topMenuItems);

export default router;