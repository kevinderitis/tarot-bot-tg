import { getPaymentByReference } from '../services/mpService.js';
import { notifyPayment } from '../bot/telegram-bot.js';
import { updateLeadPaymentByChatId } from '../dao/leadDAO.js';

export const webhook = async (req, res) => {
    let data = req.query;
    let paymentId = data['data.id'];

    if (!paymentId) {
        console.log('No se proporcionó paymentId en la solicitud.');
        return res.status(400).send('Falta el parámetro paymentId en la solicitud.');
    }

    try {
        let payment = await getPaymentByReference(paymentId);
        if (payment && payment.status === 'approved') {
            let chatId = payment.external_reference;
            if (chatId) {
                await notifyPayment(chatId);
                await updateLeadPaymentByChatId(chatId, true);
            }
        }
        console.log(payment);
    } catch (error) {
        console.log(error);
        throw error;
    }

    res.send('ok');
};