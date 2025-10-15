import { isValidObjectId } from "mongoose";
import menuItemModel from "../models/menu.item.model.js";
import cloudinary from "../utils/cloudinary.js";

export const addItem = async (req, res) => {

    try {
        const { itemName, price, description } = req.body;
        const filePath = req.file?.path;
        const { role } = req.user;

        if (role !== 'admin') return res.status(403).json({ message: 'Access denied: admin only' });

        if (!itemName?.trim() || typeof price !== 'number' || !filePath) return res.status(400).json({ message: 'Invalid or missing fields' });

        const imageUrl = await cloudinary(filePath);

        const newItem = await menuItemModel.create({
            itemName,
            price,
            description,
            imageUrl,
        });

        if (!newItem) return res.status(403).json({ message: 'item creation failed' });

        return res.status(201).json({ message: 'ok', success: true, item: newItem });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `${error.message || `Internal Server Error`}` })
    }
}

export const getAllItems = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const items = await menuItemModel.paginate({}, { page, limit, sort: { createdAt: -1 } });

        if (!items?.docs?.length) return res.status(404).json({ message: 'items not found' });

        return res.status(200).json({ message: 'ok', success: true, data: items });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `${error.message || `Internal Server Error`}` })
    }
}

export const getItem = async (req, res) => {
    try {
        const { _id } = req.params;

        if (!isValidObjectId(_id)) return res.status(400).json({ message: 'invalid id' });

        const item = await menuItemModel.findById(_id);

        if (!item) return res.status(404).json({ message: 'item not found' });

        return res.status(200).json({ message: 'ok', success: true, item });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `${error.message || `Internal Server Error`}` })
    }
}

export const updateItem = async (req, res) => {
    try {
        const { itemName, price, description } = req.body;
        const { role } = req.user;

        const filePath = req.file?.path;
        let imageUrl;

        if (filePath) {
            const uploadRes = await cloudinary.uploader.upload(filePath);
            imageUrl = uploadRes.secure_url;
        }

        if (role !== 'admin') return res.status(403).json({ message: 'Access denied: admin only' });

        if (!itemName?.trim() || typeof price !== 'number') return res.status(400).json({ message: 'Invalid or missing fields' });

        const newItem = await menuItemModel.findByIdAndUpdate(_id, {
            itemName,
            price,
            description,
            imageUrl,
        }, { new: true });

        if (!newItem) return res.status(403).json({ message: 'item updation failed' });

        return res.status(200).json({ message: 'ok', success: true, item: newItem });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `${error.message || `Internal Server Error`}` })
    }
}

export const removeItem = async (req, res) => {
    try {
        const { _id } = req.params;

        if (!isValidObjectId(_id)) return res.status(400).json({ message: 'invalid id' });

        const deletedItem = await menuItemModel.findByIdAndDelete(_id);

        if (!deletedItem) return res.status(403).json({ message: 'item deletion failed' });

        return res.status(200).json({ message: 'ok', success: true, item: deletedItem });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `${error.message || `Internal Server Error`}` })
    }
}