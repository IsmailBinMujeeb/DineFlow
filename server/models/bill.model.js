import mongoose from "mongoose";

const billSchema = new mongoose.Schema({
    total: {
        type: Number,
        required: true,
    },

    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    amountPaid: {
        type: Number,
        default: 0,
    },

    status: {
        type: String,
        enum: ['paid', 'unpaid'],
        default: 'unpaid',
    },

    paymentMethod: {
        type: String,
        enum: ['cash', 'upi', 'card'],
        require: true,
    },
}, { timestamps: true });

export default mongoose.model('Bill', billSchema);