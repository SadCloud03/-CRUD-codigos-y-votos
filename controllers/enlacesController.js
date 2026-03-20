const initDB = require('../models/db');

// --- 1. CREAR ENLACE (POST /temas/:id_tema/enlaces) ---
const createEnlace = async (req, res) => {
    try {
        const db = await initDB();
        const { id_tema } = req.params;
        const { enlace_url, enlace_descripcion } = req.body;

        const result = await db.run(
            'INSERT INTO enlaces (id_tema, enlace_url, enlace_descripcion) VALUES (?, ?, ?)',
            [id_tema, enlace_url, enlace_descripcion]
        );

        res.status(201).json({
            id_enlace: result.lastID,
            id_tema: parseInt(id_tema),
            enlace_url,
            enlace_descripcion
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- 2. LISTAR ENLACES POR TEMA (GET /temas/:id_tema/enlaces) ---
const getEnlacesByTema = async (req, res) => {
    try {
        const db = await initDB();
        const { id_tema } = req.params;

        const enlaces = await db.all('SELECT * FROM enlaces WHERE id_tema = ?', [id_tema]);
        res.json(enlaces);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- 3. ELIMINAR ENLACE (DELETE /temas/enlaces/:id_enlace) ---
const deleteEnlace = async (req, res) => {
    try {
        const db = await initDB();
        const { id_enlace } = req.params;

        const result = await db.run('DELETE FROM enlaces WHERE id_enlace = ?', [id_enlace]);
        if (result.changes === 0) return res.status(404).json({ error: "Enlace no encontrado" });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- 4. EXPORTACIÓN ---
module.exports = {
    createEnlace,
    getEnlacesByTema,
    deleteEnlace
};