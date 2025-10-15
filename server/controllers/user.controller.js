import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "../config/env.js";
import userModel from "../models/user.model.js"

export const registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email?.trim() || !password?.trim()) return res.status(400).json({ message: 'Missing credentials' });

        const isUserExist = await userModel.exists({ email });

        if (isUserExist) return res.status(409).json({ message: 'user already exist with same email' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await userModel.create({ email, password: hashedPassword });

        if (!newUser) return res.status(403).json({ message: 'user registration failed' });

        const accessToken = await jwt.sign({ _id: newUser._id, email, role: newUser.role }, env.ACCESS_TOKEN_SECRET, { expiresIn: env.ACCESS_TOKEN_EXPIRY });
        const refreshToken = await jwt.sign({ _id: newUser._id, email, role: newUser.role }, env.REFRESH_TOKEN_SECRET, { expiresIn: env.REFRESH_TOKEN_EXPIRY });

        await userModel.findByIdAndUpdate(newUser._id, { refreshToken });

        res.cookie('access-token', accessToken, { maxAge: 9_00_000, httpOnly: true, secure: !env.IS_DEV });
        res.cookie('refresh-token', refreshToken, { maxAge: 60_48_00_000, httpOnly: true, secure: !env.IS_DEV });

        return res.status(201).json({ message: 'user registered', success: true, tokens: { accessToken, refreshToken } });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `${error.message || `Internal Server Error`}` })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email?.trim() || !password?.trim()) return res.status(400).json({ message: 'Missing credentials' });

        const isUserExist = await userModel.findOne({ email });

        if (!isUserExist) return res.status(404).json({ message: 'user not found' });

        const isPasswordValid = await bcrypt.compare(password, isUserExist?.password);

        if (!isPasswordValid) return res.status(401).json({ message: 'invalid credentials' });

        const accessToken = await jwt.sign({ _id: isUserExist._id, email, role: isUserExist.role }, env.ACCESS_TOKEN_SECRET, { expiresIn: env.ACCESS_TOKEN_EXPIRY });
        const refreshToken = await jwt.sign({ _id: isUserExist._id, email, role: isUserExist.role }, env.REFRESH_TOKEN_SECRET, { expiresIn: env.REFRESH_TOKEN_EXPIRY });

        await userModel.findByIdAndUpdate(isUserExist._id, { refreshToken });

        res.cookie('access-token', accessToken, { maxAge: 9_00_000, httpOnly: true, secure: !env.IS_DEV });
        res.cookie('refresh-token', refreshToken, { maxAge: 60_48_00_000, httpOnly: true, secure: !env.IS_DEV });

        res.status(200).json({ message: 'user loggin sucessfuly', success: true, tokens: { accessToken, refreshToken } });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `${error.message || `Internal Server Error`}` })
    }
}

export const getloggedInUser = async (req, res) => {
    try {
        const { _id } = req.user;

        const user = await userModel.findById(_id).select("-password -refreshToken");

        if (!user) return res.status(404).json({ message: 'user not found' });

        return res.status(200).json({ message: 'ok', success: true, user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `${error.message || `Internal Server Error`}` })
    }
}

export const logoutUser = async (req, res) => {
    try {
        const { _id } = req.user;

        const user = await userModel.findById(_id);

        if (!user) return res.status(404).json({ message: 'user not found' });

        await userModel.findByIdAndUpdate(_id, { $set: { refreshToken: null } });

        res.clearCookie('access-token');
        res.clearCookie('refresh-token');

        return res.status(200).json({ message: 'user loggedout successfully', userId: _id });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `${error.message || `Internal Server Error`}` })
    }
}

export const refreshAccessToken = async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies['refresh-token'] || req.headers['authorization']?.split(' ')?.[1];

        if (!incomingRefreshToken) return res.status(401).json({ message: 'missing refresh token' });

        const decoded = await jwt.verify(incomingRefreshToken, env.REFRESH_TOKEN_SECRET);

        if (!decoded?._id) return res.status(400).json({ message: "invalid refresh token" });

        const user = await userModel.findById(decoded._id);

        if (!user) return res.status(404).json({ message: 'user not found' });

        if (!user.refreshToken || user.refreshToken !== incomingRefreshToken) return res.status(401).json({ message: 'token expired or already used' });

        const newAccessToken = await jwt.sign({ _id: user._id, email: user.email, role: user.role }, env.ACCESS_TOKEN_SECRET, { expiresIn: env.ACCESS_TOKEN_EXPIRY });
        const newRefreshToken = await jwt.sign({ _id: user._id, email: user.email, role: user.role }, env.REFRESH_TOKEN_SECRET, { expiresIn: env.REFRESH_TOKEN_EXPIRY });

        await userModel.findByIdAndUpdate(user._id, { $set: { refreshToken: newRefreshToken } });

        res.cookie('access-token', newAccessToken, { maxAge: 9_00_000, httpOnly: true, secure: !env.IS_DEV });
        res.cookie('refresh-token', newRefreshToken, { maxAge: 60_48_00_000, httpOnly: true, secure: !env.IS_DEV });

        return res.status(200).json({ message: 'tokens refrehsed', tokens: { accessToken: newAccessToken, refreshToken: newRefreshToken } });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `${error.message || `Internal Server Error`}` })
    }
}