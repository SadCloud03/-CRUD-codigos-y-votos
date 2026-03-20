const initDB = require('../models/db');

// --- 1. REGISTRAR VOTO (POST /temas/:id_tema/votos) ---
const votarTema = async (req, res) => {
    try {
        const db = await initDB();
        const { id_tema } = req.params;
        const { id_usuario } = req.body;

        await db.run(
            'INSERT INTO votos (id_tema, id_usuario) VALUES (?, ?)',
            [id_tema, id_usuario]
        );

        res.status(201).json({
            message: "Voto registrado con éxito",
            id_tema: parseInt(id_tema),
            id_usuario
        });
    } catch (error) {
        // Manejo de error por si el tema no existe o hay problema de DB
        res.status(500).json({ error: error.message });
    }
};

// --- 2. EXPORTACIÓN ---
module.exports = {
    votarTema
};