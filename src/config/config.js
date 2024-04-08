import dotenv from 'dotenv';
dotenv.config();

const config = {
    OPEN_AI_API_KEY: process.env.OPEN_AI_API_KEY,
    ASSISTANT_ID: process.env.ASSISTANT_ID,
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,
    API_KEY_TELEGRAM: process.env.API_KEY_TELEGRAM
};

export default config;
