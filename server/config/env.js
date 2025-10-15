import { config } from "dotenv";

config();

export default {
    PORT: process.env.PORT,
    DB_URI: process.env.DB_URI,
    CORS_ORIGINS: process.env.CORS_ORIGINS?.split(',') || [],
    NODE_ENV: process.env.NODE_ENV,
    IS_DEV: process.env.NODE_ENV === 'dev',

    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,

    CLOUD_NAME: process.env.CLOUD_NAME,
    CLOUD_API_KEY: process.env.CLOUD_API_KEY,
    CLOUD_API_SECRET: process.env.CLOUD_API_SECRET,
}