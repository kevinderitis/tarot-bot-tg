import { MercadoPagoConfig, Preference } from 'mercadopago';
import config from '../config/config.js';

const client = new MercadoPagoConfig({ accessToken: config.MERCADOPAGO_ACCESS_TOKEN });

export const createPaymentPreference = async chatId => {
    try {
        const preference = new Preference(client);
        const createdPref = await preference.create({
            body: {
                items: [{
                    title: 'Tirada tarot egipcio',
                    unit_price: 3000,
                    quantity: 1
                }],
                payment_methods: {
                    excluded_payment_methods: [
                        { id: 'amex' }
                    ],
                    excluded_payment_types: [
                        { id: 'atm' }
                    ]
                },
                external_reference: chatId,
                notification_url: 'localhost:8080/stripe/webhook'
            }
        });

        return createdPref.sandbox_init_point;
    } catch (error) {
        console.error('Error al crear la preferencia de pago:', error);
        throw new Error('Error al procesar la solicitud');
    }
};
