import mongoose from "mongoose";
import v from "validator";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: (value) => v.isEmail(value),
            message: 'Invalid email address',
        }
    },

    password: {
        type: String,
        required: true,
        minLength: [8, 'Password must be 8 characters long.'],
    },

    role: {
        type: String,
        enum: ['admin', 'staff'],
        default: 'staff',
    },

    refreshToken: {
        type: String,
        default: ''
    }
}, { timestamps: true });

export default mongoose.model('User', userSchema);