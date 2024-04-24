import { getAllLeads, updateLeadById } from "../dao/leadDAO.js";

export const getAll = async (req, res) => {
    try {
        const leads = await getAllLeads();

        if (!leads || leads.length === 0) {
            return res.status(404).json({ message: 'No se encontraron leads' });
        }

        res.status(200).json(leads);
    } catch (error) {
        console.error('Error al obtener todos los leads:', error.message);
        res.status(500).json({ error: 'Error al obtener los leads' });
    }
};

 export const updateLead = async (req, res) => {
    const leadId = req.params.id;
    const newData = req.body;

    try {
        const updatedLead = await updateLeadById(leadId, newData);

        if (!updatedLead) {
            return res.status(404).json({ message: 'Lead no encontrado' });
        }

        res.status(200).json(updatedLead);
    } catch (error) {
        console.error('Error al actualizar lead por ID:', error.message);
        res.status(500).json({ error: 'Error al actualizar el lead' });
    }
};