import { isValidObjectId } from "mongoose";
import billModel from "../models/bill.model.js";
import orderModel from "../models/order.model.js";

export const createBill = async (req, res) => {
    try {
        const { total, amountPaid = 0, status = 'unpaid', paymentMethod } = req.body;
        const createdBy = req.user._id;
        const orderId = req.params._id;

        if (typeof total !== 'number') return res.status(400).json({ message: 'invalid total value' });
        if (!paymentMethod || !['cash', 'upi', 'card'].includes(paymentMethod.toLowerCase().trim())) return res.status(400).json({ message: `invalid payment method ${paymentMethod}` });
        if (!['paid', 'unpaid'].includes(status.toLowerCase().trim())) return res.status(400).json({ message: `invalid status ${status}` });

        if (!isValidObjectId(orderId)) return res.status(400).json({ message: 'invalid order id' });

        const isOrderExist = await orderModel.exists({ _id: orderId });

        if (!isOrderExist) return res.status(404).json({ message: 'order not found' });

        const generatedBill = await billModel.create({
            amountPaid,
            createdBy,
            orderId,
            paymentMethod,
            status,
            total,
        })

        return res.status(201).json({ message: 'bill generated', success: true, bill: generatedBill })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `${error.message || `Internal Server Error`}` })
    }
}