import { isValidObjectId } from "mongoose";
import orderModel from "../models/order.model.js";
import userModel from "../models/user.model.js";

export const createOrder = async (req, res) => {
    try {
        const { items, tableNumber, tax, subTotal, grandTotal, status } = req.body;
        const createdBy = req.user._id;

        if (!Array.isArray(items) || items.length === 0)
            return res.status(400).json({ message: 'Order items are required' });

        if (!tableNumber && tableNumber !== 0)
            return res.status(400).json({ message: 'Table number is required' });

        if (tax == null || subTotal == null || grandTotal == null)
            return res.status(400).json({ message: 'Tax, subtotal, and total are required' });

        const newOrder = await orderModel.create({
            items,
            createdBy,
            grandTotal,
            tax,
            subTotal,
            tableNumber,
            status: status || 'pending',
        });

        if (!newOrder) return res.status(403).json({ message: 'order creation failed' });

        return res.status(200).json({ message: 'order created', success: true, order: newOrder });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `${error.message || `Internal Server Error`}` })
    }
}

export const getOrdersAdmin = async (req, res) => {
    try {

        const { page = 1, limit = 10 } = req.query;

        const { _id, role } = req.user;

        if (!isValidObjectId(_id)) return res.status(400).json({ message: 'invalid id' });

        if (role !== 'admin') return res.status(403).json({ message: 'Access denied: admin only' });

        const orders = await orderModel.paginate({}, { page, limit, sort: { createdAt: -1 } });

        if (!orders?.docs?.length) return res.status(404).json({ message: 'orders not found', orders });

        return res.status(200).json({ message: 'ok', success: true, data: orders });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `${error.message || `Internal Server Error`}` })
    }
}

export const getOrdersStaff = async (req, res) => {
    try {

        const { page = 1, limit = 10 } = req.query;

        const { _id } = req.user;

        if (!isValidObjectId(_id)) return res.status(400).json({ message: 'invalid id' });

        const isUserExist = await userModel.findById(_id);
        if (!isUserExist) return res.status(404).json({ message: 'user not found' });

        const orders = await orderModel.paginate({ createdBy: _id }, { page, limit, sort: { createdAt: -1 } });

        if (!orders?.docs?.length) return res.status(404).json({ message: 'orders not found', orders });

        return res.status(200).json({ message: 'ok', success: true, data: orders });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `${error.message || `Internal Server Error`}` })
    }
}

export const getOrderById = async (req, res) => {

    try {
        const { _id } = req.params;
        const userId = req.user._id;

        if (!isValidObjectId(_id)) return res.status(400).json({ message: 'invalid order id' });

        const isUserExist = await userModel.findById(userId);

        if (!isUserExist) return res.status(404).json({ message: "user not found" });

        const order = await orderModel.findById(_id);

        if (!order) return res.status(404).json({ message: 'order not found' });

        if (!order.createdBy.equals(isUserExist._id) && isUserExist.role !== 'admin') return res.status(401).json({ message: 'unauthorized user' });

        return res.status(200).json({ message: 'ok', success: true, order });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `${error.message || `Internal Server Error`}` })
    }
}

export const updateOrder = async (req, res) => {
    try {
        const { items, tax, subTotal, grandTotal, status } = req.body;
        const { _id } = req.params;
        const createdBy = req.user._id;

        if (!isValidObjectId(_id)) return res.status(400).json({ message: 'invalid id' })
        if (!Array.isArray(items) || !tax || !subTotal || !grandTotal || !status) return res.status(400).json({ message: 'Missng required fields' });

        const isOrderExist = await orderModel.findById(_id);

        if (!isOrderExist) return res.status(404).json({ message: 'order not found' });

        if (!isOrderExist.createdBy?.equals(createdBy)) return res.status(401).json({ message: 'unauthorized to update order' });

        const updatedOrder = await orderModel.findByIdAndUpdate(_id, {
            items,
            tax,
            subTotal,
            grandTotal,
            status,
        }, { new: true })

        if (!updatedOrder) return res.status(403).json({ message: 'order updation failed' });

        return res.status(200).json({ message: 'order updated', success: true, order: updatedOrder });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `${error.message || `Internal Server Error`}` })
    }
}

