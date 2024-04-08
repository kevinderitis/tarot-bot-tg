import config from '../config/config.js';
import { telegramBotMsg } from '../services/gptService.js';
import TelegramBot from 'node-telegram-bot-api';

const token = config.API_KEY_TELEGRAM;

const bot = new TelegramBot(token, { polling: true });

const prepareCards = texto => {
    let resultado = [];

    const regexCarta1 = /\*Carta1: ([^\*]+)/;
    const regexCarta2 = /\*Carta2: ([^\*]+)/;
    const regexCarta3 = /\*Carta3: ([^\*]+)/;
    const regexDesc1 = /\*Descripcion1: ([^\*]+)/;
    const regexDesc2 = /\*Descripcion2: ([^\*]+)/;
    const regexDesc3 = /\*Descripcion3: ([^\*]+)/;

    const matchCarta1 = texto.match(regexCarta1);
    const matchCarta2 = texto.match(regexCarta2);
    const matchCarta3 = texto.match(regexCarta3);
    const matchDesc1 = texto.match(regexDesc1);
    const matchDesc2 = texto.match(regexDesc2);
    const matchDesc3 = texto.match(regexDesc3);

    if (matchCarta1 || matchCarta2 || matchCarta3 || matchDesc1 || matchDesc2 || matchDesc3) {

        const regexCarta1 = /\*Carta1: ([^\*]+)/;
        const regexCarta2 = /\*Carta2: ([^\*]+)/;
        const regexCarta3 = /\*Carta3: ([^\*]+)/;
        const regexDesc1 = /\*Descripcion1: ([^\*]+)/;
        const regexDesc2 = /\*Descripcion2: ([^\*]+)/;
        const regexDesc3 = /\*Descripcion3: ([^\*]+)/;

        const matchCarta1 = texto.match(regexCarta1);
        const matchCarta2 = texto.match(regexCarta2);
        const matchCarta3 = texto.match(regexCarta3);
        const matchDesc1 = texto.match(regexDesc1);
        const matchDesc2 = texto.match(regexDesc2);
        const matchDesc3 = texto.match(regexDesc3);

        const indiceCarta1 = texto.indexOf('*Carta1');
        const indiceCarta2 = texto.indexOf('*Carta2');
        const indiceCarta3 = texto.indexOf('*Carta3');
        const indiceTexto2 = texto.length;

        const texto1Prov = texto.substring(0, indiceCarta1);
        const texto2Prov = texto.substring(0, indiceCarta2);
        const texto3Prov = texto.substring(0, indiceCarta3);
        let texto2 = '';

        if (matchCarta1) {
            resultado.push({
                texto: texto1Prov.trim()
            });

            resultado.push({
                carta: matchCarta1[1].trim(),
                texto: matchDesc1 ? matchDesc1[1].trim() : ''
            });
        };

        if (matchCarta2) {
            resultado.push({
                texto: texto2Prov.trim()
            });
            resultado.push({
                carta: matchCarta2[1].trim(),
                texto: matchDesc2 ? matchDesc2[1].trim() : ''
            });

        };

        if (matchCarta3) {
            resultado.push({
                texto: texto3Prov.trim()
            });
            resultado.push({
                carta: matchCarta3[1].trim(),
                texto: matchDesc3 ? matchDesc3[1].trim() : ''
            });
        };

    }
    return resultado;
};

const sendMultipleMessages = (chatId, bot, mensajes, tiempoDeEspera) => {
    mensajes.forEach((mensaje, index) => {
        setTimeout(() => {
            let msg = mensaje.carta ? `La carta es: ${mensaje.carta} ${mensaje.texto}` : mensaje.texto;
            bot.sendMessage(chatId, msg);
        }, tiempoDeEspera * index);
    });
};


export const initBot = () => {

    bot.on('message', async (msg) => {
        const chatId = msg.chat.id;
        const messageText = msg.text;
        const name = `${msg.chat.first_name} ${msg.chat.last_name}`;
        let response;
        try {
            response = await telegramBotMsg(name, messageText, chatId)
        } catch (error) {
            console.log(error)
        }

        let cards = prepareCards(response);
        let delay = 10000;

        if (cards.length > 0) {
            sendMultipleMessages(chatId, bot, cards, delay)
        } else {
            bot.sendMessage(chatId, response);
        }


    });

    bot.onText(/\/saludo/, (msg) => {
        const chatId = msg.chat.id;

        bot.sendMessage(chatId, '¡Hola! Soy un bot de Telegram.');
    });

    bot.on('callback_query', (callbackQuery) => {
        const chatId = callbackQuery.message.chat.id;
        const action = callbackQuery.data;

        if (action === 'button_pressed') {
            bot.sendMessage(chatId, '¡Has presionado el botón!');
        }
    });

    console.log('Bot listo para recibir mensajes...');

};