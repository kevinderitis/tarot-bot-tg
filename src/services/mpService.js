import { MercadoPagoConfig, Preference } from 'mercadopago';
import axios from 'axios';
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
                external_reference: chatId,
                notification_url: 'https://webhook.site/4220f566-1089-41d4-ad5d-244d47d39851'
            }
        });

        return createdPref.sandbox_init_point;
    } catch (error) {
        console.error('Error al crear la preferencia de pago:', error);
        throw new Error('Error al procesar la solicitud');
    }
};

export const getPaymentByReference = async paymentId => {
    const url = `https://api.mercadopago.com/v1/payments/${paymentId}?access_token=${config.MERCADOPAGO_ACCESS_TOKEN}`;
    try {
        let response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.log(error);
        return null
    }
}