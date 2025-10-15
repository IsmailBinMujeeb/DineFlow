import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import env from "./config/env.js";

import userRouter from "./routes/user.route.js";
import orderRouter from "./routes/order.route.js";
import menuItemsRouter from "./routes/menu.item.route.js";
import billRouter from "./routes/bill.route.js";
import analyticRouter from "./routes/analytics.route.js";

const app = express();
const PORT = env.PORT;

app.set('port', PORT);

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGINS, credentials: true }));
app.use(cookieParser());

app.use('/api/user', userRouter);
app.use('/api/order', orderRouter);
app.use('/api/menu-item', menuItemsRouter);
app.use('/api/bill', billRouter);
app.use('/api/analytics', analyticRouter);

app.get('/api/health', (_, res) => {
    return res.status(200).json({ message: 'Server is healthy' });
});

export default app;