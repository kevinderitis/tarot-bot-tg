import config from '../config/config.js';
import { telegramBotMsg } from '../services/gptService.js';
import { mainTelegramBotMsg } from '../services/gptMainService.js';
import TelegramBot from 'node-telegram-bot-api';
import { prepareCardName } from './cards/cards.js';
// import { createPaymentPreference } from '../services/stripeService.js';
import { createPaymentPreference } from '../services/mpService.js';
import path from 'path';
import fs from 'fs';
import { getLeadByChatId } from '../dao/leadDAO.js';

const token = config.API_KEY_TELEGRAM;
const mainToken = config.MAIN_API_KEY_TELEGRAM;

const bot = new TelegramBot(token, { polling: true });
const mainBot = new TelegramBot(mainToken, { polling: true });

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

const welcomeMessage = `
🌟🔮 ¡Bienvenido al Espacio de Luz y Claridad! 🔮🌟

Querido buscador de senderos luminosos y almas despiertas,

Me complace darte la más cálida bienvenida a este santuario virtual, donde los secretos antiguos se entrelazan con las energías del presente para brindarte la guía que necesitas. Soy Olga Membrides, tarotista y guía espiritual con años de experiencia en el misterioso y poderoso Tarot Egipcio.

Aquí, en esta sagrada comunión de almas, te invito a sumergirte en un viaje de autoexploración y revelación. Las cartas del Tarot Egipcio son más que simples herramientas; son portales hacia el conocimiento ancestral y reflejos de las estrellas que guían nuestros destinos.

En este espacio, encontrarás respuestas a las preguntas que pesan en tu corazón, luces que iluminan las encrucijadas de tu camino y un refugio para tu ser espiritual. Permítete abrir las puertas de la percepción y permitir que la magia del Tarot Egipcio te muestre la belleza de tu propio ser.

Recuerda, cada carta es un tesoro de sabiduría, cada lectura es una danza cósmica entre el pasado, el presente y el futuro. Aquí, en la compañía de antiguos dioses y sabios faraones, te espero con los brazos abiertos para explorar juntos los caminos de la vida, la luz y el despertar espiritual.

Siéntete libre de sumergirte en las profundidades del Tarot Egipcio, de plantear tus preguntas con el corazón abierto y de permitir que la magia del universo te sorprenda. Estoy aquí para acompañarte en este viaje, para interpretar las señales del cosmos y para compartir contigo la sabiduría de los tiempos.

¡Que la luz del sol ilumine tu sendero y las estrellas guíen tu espíritu en esta hermosa danza de la vida!

Con amor y luz,
Olga Membrides 🌟✨
`;

const verifyLink = async (text, chatId) => {
    const pattern = /https:\/\/www\.linkdepago\.com\/pagar/;

    if (text.match(pattern)) {
        let paymentPreference = await createPaymentPreference(chatId);
        return `¡Perfecto! Para proceder con el pago y realizar la tirada de cartas de tarot, puedes hacerlo a través del siguiente enlace de pago seguro: ${paymentPreference}. Una vez realizada la transacción, avísame para verificar la confirmación del pago y así proceder con la tirada de cartas de tarot. Estoy aquí para brindarte orientación y claridad en este momento. ¿Hay alguna otra pregunta o aclaración que necesites antes de continuar?`;
    } else {
        return text;
    }
}

export const notifyPayment = async chatId => {
    try {
        let msg = 'Ya recibimos tu pago. Comunicate con Olga para tu tirada de cartas: @OlgaMembridesTarbot'
        await mainBot.sendMessage(chatId, msg);
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        throw error;
    }
};


export const initBot = () => {

    mainBot.on('message', async (msg) => {
        const chatId = msg.chat.id;
        const messageText = msg.text;
        const name = `${msg.chat.first_name} ${msg.chat.last_name}`;
        let response;
        try {
            response = await mainTelegramBotMsg(name, messageText, chatId)
            let msgText = await verifyLink(response, chatId);
            mainBot.sendMessage(chatId, msgText);
        } catch (error) {
            console.log(error)
        }
    });

    bot.on('message', async (msg) => {
        const chatId = msg.chat.id;
        const messageText = msg.text;

        if (!messageText.startsWith('/start')) {
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
        } else {
            bot.sendMessage(chatId, welcomeMessage, {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Comenzar',
                                callback_data: 'aceptar'
                            }
                        ]
                    ],
                },
            });
        }

    });


    bot.on('callback_query', (callbackQuery) => {
        const chatId = callbackQuery.message.chat.id;
        const action = callbackQuery.data;

        if (action === 'aceptar') {
            setTimeout(() => {
                bot.sendMessage(chatId, 'Bienvenido querido consultante! Mi nombre es Olga, estoy aquí para brindarte orientación a través de las cartas del tarot. ¿Tienes alguna pregunta específica o situación sobre la cual te gustaría obtener información? Tu confianza en compartir lo que necesitas es fundamental para poder ayudarte.');
            }, 5000);

        }
    });
};

