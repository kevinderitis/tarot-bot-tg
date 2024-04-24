import { notifyPayment } from "../bot/telegram-bot.js";

export const webhook = async (req, res) => {
    await notifyPayment('1635640964');
    res.send('ok');

    // const evento = req.body;
    // const sig = req.headers['stripe-signature'];
    // try {
    //     const eventoValido = stripeClient.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    //     if (eventoValido.type === 'checkout.session.completed') {
    //         const session = eventoValido.data.object;
    //         const chatId = session.client_reference_id;
    //         await notifyPayment(chatId);
    //     }
    //     res.json({ received: true });
    // } catch (err) {
    //     console.error('Firma inválida:', err.message);
    //     res.status(400).send(`Firma inválida: ${err.message}`);
    // }
};