import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const menuItemSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true,
        unique: true,
    },

    price: {
        type: Number,
        required: true,
    },

    imageUrl: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        default: '',
    },
}, { timestamps: true });
menuItemSchema.plugin(mongoosePaginate)

export default mongoose.model('MenuItem', menuItemSchema);