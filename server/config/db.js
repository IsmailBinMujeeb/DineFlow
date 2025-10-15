import mongoose from "mongoose";
import env from "./env.js";

export default async () => {
    try {
        console.log('Connecting... Database');
        await mongoose.connect(env.DB_URI);
        console.log('Database connected');
    } catch (error) {

        console.log(`Database Connection Error: ${error.message || 'Failed to connect database'}`)
        process.exit(1);
    }
}