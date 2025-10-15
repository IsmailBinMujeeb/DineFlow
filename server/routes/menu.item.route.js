import { Router } from "express";
import { addItem, getAllItems, getItem, removeItem, updateItem } from "../controllers/menu.item.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import multerMiddleware from "../middlewares/multer.middleware.js";

const router = Router();

router.post('/add', authMiddleware, multerMiddleware.single('file'), addItem);
router.get('/', authMiddleware, getAllItems);
router.get('/:_id', authMiddleware, getItem);
router.put('/:_id', authMiddleware, updateItem)
router.delete('/:_id', authMiddleware, removeItem)

export default router;