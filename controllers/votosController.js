const initDB = require('../models/db');

const votosController = {
    // POST /temas/:id_tema/votos
    votarTema: async (req, res) => {
        try {
            const db = await initDB();
            const { id_tema } = req.params;
            const { id_usuario } = req.body; // El ID de quien vota

            // 1. Insertamos el voto
            await db.run(
                'INSERT INTO votos (id_tema, id_usuario) VALUES (?, ?)',
                [id_tema, id_usuario]
            );

            // 2. Respondemos con 201 Created
            res.status(201).json({
                message: "Voto registrado con éxito",
                id_tema: parseInt(id_tema),
                id_usuario
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = votosController;