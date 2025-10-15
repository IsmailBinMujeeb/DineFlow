import { Router } from "express"
import { createOrder, getOrderById, getOrdersAdmin, getOrdersStaff, updateOrder } from "../controllers/order.controller.js"
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.post('/create', authMiddleware, createOrder);
router.get('/:_id', authMiddleware, getOrderById);
router.get('/admin', authMiddleware, getOrdersAdmin);
router.get('/staff', authMiddleware, getOrdersStaff);
router.put('/:_id', authMiddleware, updateOrder);

export default router;