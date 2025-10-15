import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const itemSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem',
        required: true,
    },

    quantity: {
        type: Number,
        default: 1,
    },

    total: {
        type: Number,
    }
});

const orderSchema = new mongoose.Schema({

    items: [itemSchema],

    tableNumber: {
        type: Number,
        required: true,
    },

    tax: {
        type: Number,
        required: true,
    },

    subTotal: {
        type: Number,
        required: true,
    },

    grandTotal: {
        type: Number,
        required: true,
    },

    status: {
        type: String,
        enum: ['pending', 'served', 'complete', 'cancel'],
        default: 'pending',
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });

orderSchema.plugin(mongoosePaginate);

export default mongoose.model('Order', orderSchema);