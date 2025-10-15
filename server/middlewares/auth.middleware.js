import jwt from 'jsonwebtoken';
import env from '../config/env.js';
export default async (req, res, next) => {

    try {
        const incomingAccessToken = req.cookies['access-token'] || req.headers['authorization']?.split(' ')?.[1];

        if (!incomingAccessToken) return res.status(401).json({ message: 'missing access token' });

        const decoded = jwt.verify(incomingAccessToken, env.ACCESS_TOKEN_SECRET);

        if (!decoded || !decoded._id) return res.status(401).json({ message: 'token invalid or already used' });

        req.user = { _id: decoded._id, email: decoded.email, role: decoded?.role || 'staff' }

        next();
    } catch (error) {
        console.log(error);
        if (error instanceof jwt.TokenExpiredError) return res.status(401).json({ message: 'access token expired' });
        if (error instanceof jwt.JsonWebTokenError) return res.status(400).json({ message: error.message || 'invalid access token' })
        return res.status(500).json({ message: `${error.message || `Internal Server Error`}` })
    }
}