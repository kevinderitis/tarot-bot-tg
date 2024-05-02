import { getPaymentByReference } from '../services/mpService.js';
import { notifyPayment } from '../bot/telegram-bot.js';

export const webhook = async (req, res) => {
    let data = req.query;
    let paymentId = data['data.id'];

    try {
        let payment = await getPaymentByReference(paymentId);
        if (payment && payment.status === 'approved') {
            let chatId = payment.external_reference;
            if (chatId) {
                await notifyPayment(chatId);
            }
        }
        console.log(payment);
    } catch (error) {
        console.log(error);
        throw error;
    }

    res.send('ok');
};