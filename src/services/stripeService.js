import stripe from 'stripe';
import config from '../config/config.js';

const stripeClient = new stripe(config.STRIPE_API_KEY);

export async function createPaymentPreference(chatId) {
    try {
        const preferenciaPago = await stripeClient.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Tirada tarot',
                    },
                    unit_amount: 500,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: 'https://web.telegram.org/k/#@TarotEgicpioBot',
            cancel_url: 'https://web.telegram.org/k/#@TarotEgicpioBot',
            client_reference_id: chatId
        });
        return preferenciaPago;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

