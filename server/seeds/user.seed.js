import mongoose from "mongoose";
import db from "../config/db.js";
import userModel from "../models/user.model.js";
import bcrypt from 'bcrypt';

; (

    async function () {
        const usersData = [
            { _id: new mongoose.Types.ObjectId('68ef22fda58af19c33ce4246'), email: 'admin@dineflow.com', password: await bcrypt.hash('admin12345', 10), role: 'admin' },
            { _id: new mongoose.Types.ObjectId('68ef22fea58af19c33ce4247'), email: 'staff1@dineflow.com', password: await bcrypt.hash('staff112345', 10) },
            { _id: new mongoose.Types.ObjectId('68ef22fea58af19c33ce4248'), email: 'staff2@dineflow.com', password: await bcrypt.hash('staff212345', 10) },
            { _id: new mongoose.Types.ObjectId('68ef22fea58af19c33ce4249'), email: 'staff3@dineflow.com', password: await bcrypt.hash('staff312345', 10) },
        ];

        await db();

        await userModel.deleteMany({})
        console.log('Cleared existing users');
        const users = await userModel.insertMany(usersData);

        console.log(users);
        process.exit(0);
    }
)()