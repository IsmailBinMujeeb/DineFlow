import { Router } from "express";
import { createBill } from "../controllers/bill.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.post('/generate', authMiddleware, createBill);

export default router;