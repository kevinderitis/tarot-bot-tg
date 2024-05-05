import cron from 'node-cron';
import config from '../config.js';
import { updateManyPayments } from '../../dao/leadDAO.js';

const executePaymentsCron = async () => {
    try {
        const now = new Date();
        const twelveHoursAgo = new Date(now - 12 * 60 * 60 * 1000);

        let result = await updateManyPayments(twelveHoursAgo);

        console.log(`Se actualizaron ${result.modifiedCount} leads`);

    } catch (error) {
        console.error('Error al ejecutar la tarea:', error);
    }
};

export const startPaymentsCron = () => {
    cron.schedule(config.PAYMENTS_CRON, executePaymentsCron);
    console.log(`Started cron: ${config.PAYMENTS_CRON}`)
};