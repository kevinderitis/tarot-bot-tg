import dotenv from 'dotenv';
dotenv.config();

const config = {
    OPEN_AI_API_KEY: process.env.OPEN_AI_API_KEY,
    ASSISTANT_ID: process.env.ASSISTANT_ID,
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,
    API_KEY_TELEGRAM: process.env.API_KEY_TELEGRAM,
    MAIN_API_KEY_TELEGRAM: process.env.MAIN_API_KEY_TELEGRAM,
    MAIN_ASSISTANT_ID: process.env.MAIN_ASSISTANT_ID,
    STRIPE_API_KEY: process.env.STRIPE_API_KEY,
    MERCADOPAGO_ACCESS_TOKEN: process.env.MERCADOPAGO_ACCESS_TOKEN,
    APP_DOMAIN: process.env.APP_DOMAIN,
    PAYMENTS_CRON: process.env.PAYMENTS_CRON
};

export default config;
