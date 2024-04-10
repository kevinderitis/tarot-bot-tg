import config from '../config/config.js';
import { telegramBotMsg } from '../services/gptService.js';
import TelegramBot from 'node-telegram-bot-api';
import { prepareCardName } from './cards/cards.js';
import path from 'path';
import fs from 'fs';

const token = config.API_KEY_TELEGRAM;

const bot = new TelegramBot(token, { polling: true });

const cwd = process.cwd();

const rutaImagenes = path.join(cwd, 'public', 'images');

const prepareCards = texto => {
    let resultado = [];

    let indiceCarta1 = texto.indexOf('Carta1:');
    if (indiceCarta1 === -1) {
        let indiceCarta2 = texto.indexOf('Carta2:');
        if (indiceCarta2 === -1) {
            let indiceCarta3 = texto.indexOf('Carta3:');
            if (indiceCarta3 === -1) {
                resultado.push({ texto });
                return resultado;
            } else {
                indiceCarta1 = indiceCarta3;
            }
        } else {
            indiceCarta1 = indiceCarta2;
        }
    }

    let textoAntesCartas = texto.substring(0, (indiceCarta1 - 2)).trim();
    resultado.push({ texto: textoAntesCartas });

    for (let i = 1; i <= 3; i++) {
        let cartaKey = `Carta${i}:`;
        let descKey = `Descripcion${i}:`;

        let indiceCarta = texto.indexOf(cartaKey, indiceCarta1);
        let indiceDesc = texto.indexOf(descKey, indiceCarta);

        if (indiceDesc === -1) {
            let descKey = `Descripción${i}:`;
            indiceDesc = texto.indexOf(descKey, indiceCarta);
        };

        if (indiceCarta !== -1 && indiceDesc !== -1) {
            let carta = texto.substring(indiceCarta + cartaKey.length, (indiceDesc - 1)).trim();
            let desc = texto.substring(indiceDesc + descKey.length).trim();

            resultado.push({ carta, texto: desc });
        }
    }

    return resultado;
};

const sendMultipleMessages = (chatId, bot, mensajes, tiempoDeEspera) => {
    mensajes.forEach((mensaje, index) => {
        setTimeout(async () => {
            if (mensaje.carta) {
                let cardName = prepareCardName(mensaje.carta);
                const imageName = cardName ? `${cardName}.jpg` : 'defaultCard.jpg';
                const imagePath = path.join(rutaImagenes, imageName);
                try {
                    let newImagePath = imagePath.replace(/\\/g, '/');
                    const image = await fs.promises.readFile(newImagePath);
                    bot.sendPhoto(chatId, image, { caption: mensaje.carta });
                    setTimeout(() => {
                        bot.sendMessage(chatId, mensaje.texto)
                    }, 5000);
                } catch (error) {
                    console.log(error);
                }

            } else {
                let msg = mensaje.carta ? `La carta es: ${mensaje.carta} ${mensaje.texto}` : mensaje.texto;
                bot.sendMessage(chatId, msg);
            }
        }, tiempoDeEspera * index);
        bot.sendChatAction(chatId, 'typing');
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

        bot.sendChatAction(chatId, 'typing');
        let cards = prepareCards(response);
        let delay = 20000;

        if (cards.length > 1) {
            sendMultipleMessages(chatId, bot, cards, delay)
        } else {
            setTimeout(() => {
                bot.sendMessage(chatId, response);
            }, 8000);
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

