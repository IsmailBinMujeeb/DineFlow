import orderModel from "../models/order.model.js";

export const dailyAnalytics = async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied: admin only' });

        const now = new Date();

        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date(now);
        endOfToday.setHours(23, 59, 59, 999);

        const startOfYesterday = new Date(startOfToday);
        startOfYesterday.setDate(startOfYesterday.getDate() - 1);

        const endOfYesterday = new Date(endOfToday);
        endOfYesterday.setDate(endOfYesterday.getDate() - 1);

        const todayOrders = await orderModel.find({
            createdAt: { $gte: startOfToday, $lte: endOfToday }
        });

        const yesterdayOrders = await orderModel.find({
            createdAt: { $gte: startOfYesterday, $lte: endOfYesterday }
        });

        if (!todayOrders.length) return res.status(404).json({ message: 'No orders today.' });

        return res.status(200).json({
            message: 'ok',
            success: true,
            data: todayOrders,
            prev: yesterdayOrders
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
};

export const salesAnalytics = async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied: admin only' });

        const { daysAgo = 7 } = req.query;

        const today = new Date();
        const XDaysAgo = new Date();
        XDaysAgo.setDate(today.getDate() - (daysAgo - 1));

        const revenueData = await orderModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: XDaysAgo, $lte: today }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    totalRevenue: { $sum: "$grandTotal" }
                }
            },
            { $sort: { _id: 1 } },
            {
                $project: {
                    _id: 0,
                    date: "$_id",
                    totalRevenue: 1
                }
            }
        ]);

        const revenueMap = new Map(
            revenueData.map(item => [item.date, item.totalRevenue])
        );

        // Fill in missing dates
        const filledData = [];
        const currentDate = new Date(XDaysAgo);

        for (let i = 0; i < daysAgo; i++) {
            const dateStr = currentDate.toISOString().split('T')[0];

            filledData.push({
                date: dateStr,
                totalRevenue: revenueMap.get(dateStr) || 0
            });

            currentDate.setDate(currentDate.getDate() + 1);
        }

        return res.status(200).json({
            message: 'ok',
            success: true,
            revenue: filledData
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `${error.message || `Internal Server Error`}` })
    }
}

export const topMenuItems = async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied: admin only' });

        const { limit = 5 } = req.query;

        const topItems = await orderModel.aggregate([
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.item",
                    totalSold: { $sum: "$items.quantity" }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: limit },
            {
                $lookup: {
                    from: "menuitems",
                    localField: "_id",
                    foreignField: "_id",
                    as: "itemDetails"
                }
            },
            { $unwind: "$itemDetails" },
            {
                $project: {
                    _id: 0,
                    name: "$itemDetails.itemName",
                    totalSold: 1
                }
            }
        ]);

        if (!topItems.length) return res.status(404).json({ message: 'items not found' });

        return res.status(200).json({ message: 'ok', success: true, items: topItems });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `${error.message || `Internal Server Error`}` })
    }
}