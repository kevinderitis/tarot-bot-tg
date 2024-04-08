import { sendMessage, OpenAIError } from "../services/gptService.js";

export const chat = async (req, res) => {
    try {
        console.log(`Sending message thread ${req.cookies.threadId}: ${req.body.prompt}`)
        const response = await sendMessage(req.body.prompt, req.cookies.threadId);
        if (!req.cookies.threadId && response.threadId) {
            res.cookie('threadId', response.threadId);
        }
        let message = response.response;

        res.send({ message });
    } catch (error) {
        if (error instanceof OpenAIError) {
            res.status(400).send({ error: error.message });
        } else {
            res.status(500).send({ error: 'Error interno del servidor' });
        }
    }
};

export const refreshChat = (req, res) => {
    res.clearCookie('threadId');
    res.send({ response: 'Cookies borradas' });
};
