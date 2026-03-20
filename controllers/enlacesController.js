const initDB = require('../models/db');

const enlacesController = {
    // POST /temas/:id_tema/enlaces
    createEnlace: async (req, res) => {
        try {
            const db = await initDB();
            const { id_tema } = req.params;
            const { enlace_url, enlace_descripcion } = req.body;

            // Insertamos el enlace vinculado al tema
            const result = await db.run(
                'INSERT INTO enlaces (id_tema, enlace_url, enlace_descripcion) VALUES (?, ?, ?)',
                [id_tema, enlace_url, enlace_descripcion]
            );

            // Respuesta 201 Created como en tu diseño
            res.status(201).json({
                id_enlace: result.lastID,
                id_tema: parseInt(id_tema),
                enlace_url,
                enlace_descripcion
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // GET /temas/:id_tema/enlaces
    getEnlacesByTema: async (req, res) => {
        try {
            const db = await initDB();
            const { id_tema } = req.params;

            const enlaces = await db.all('SELECT * FROM enlaces WHERE id_tema = ?', [id_tema]);
            res.json(enlaces);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Eliminar un enlace (DELETE)
    deleteEnlace: async (req, res) => {
        try {
            const db = await initDB();
            const { id_enlace } = req.params;

            const result = await db.run('DELETE FROM enlaces WHERE id_enlace = ?', [id_enlace]);

            if (result.changes === 0) {
                return res.status(404).json({ error: "No se encontró el enlace" });
            }

            res.status(204).send(); // Status 204 como en tu diseño
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Editar un enlace (PATCH)
    updateEnlace: async (req, res) => {
        try {
            const db = await initDB();
            const { id_enlace } = req.params;
            const { enlace_url, enlace_descripcion } = req.body;

            const enlaceExistente = await db.get('SELECT * FROM enlaces WHERE id_enlace = ?', [id_enlace]);
            if (!enlaceExistente) {
                return res.status(404).json({ error: "Enlace no encontrado" });
            }

            const nuevaUrl = enlace_url || enlaceExistente.enlace_url;
            const nuevaDesc = enlace_descripcion || enlaceExistente.enlace_descripcion;

            await db.run(
                'UPDATE enlaces SET enlace_url = ?, enlace_descripcion = ? WHERE id_enlace = ?',
                [nuevaUrl, nuevaDesc, id_enlace]
            );

            res.json({ message: "Enlace actualizado", id_enlace });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = enlacesController;