// Usamos el objeto db que inicializamos en app.js (o lo importamos si prefieres)
const initDB = require('../models/db');

const temasController = {
    // 1. Crear un nuevo tema (POST)
    createTema: async (req, res) => {
        try {
            const db = await initDB();
            const { nombre_tema, descripcion_tema, autor_tema } = req.body;

            // Insertamos en la DB
            const result = await db.run(
                'INSERT INTO temas (nombre_tema, descripcion_tema, autor_tema) VALUES (?, ?, ?)',
                [nombre_tema, descripcion_tema, autor_tema]
            );

            // Respondemos con el 201 Created que diseñaste
            res.status(201).json({
                id_tema: result.lastID,
                nombre_tema,
                descripcion_tema,
                autor_tema
            });
        } catch (error) {
            if (error.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ error: "Ese nombre de tema ya existe" });
            }
            res.status(500).json({ error: error.message });
        }
    },


    getTemas: async (req, res) => {
        try {
            const db = await initDB();

            // 1. Obtenemos la lista de temas con sus votos
            const temas = await db.all(`
                SELECT t.*, COUNT(v.id_voto) as votos_tema
                FROM temas t
                LEFT JOIN votos v ON t.id_tema = v.id_tema
                GROUP BY t.id_tema
                ORDER BY votos_tema DESC
            `);

            // 2. Obtenemos el total de temas
            const countResult = await db.get('SELECT COUNT(*) as total FROM temas');

            // 3. Enviamos la respuesta con el formato de tu dibujo
            res.status(200).json({
                temas: temas,
                total_temas: countResult.total
            });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Obtener UN tema específico con sus votos y enlaces
    getTemaById: async (req, res) => {
        try {
            const db = await initDB();
            const { id_tema } = req.params;

            // Buscamos el tema y contamos sus votos
            const tema = await db.get(`
                SELECT t.*, COUNT(v.id_voto) as votos_tema 
                FROM temas t 
                LEFT JOIN votos v ON t.id_tema = v.id_tema 
                WHERE t.id_tema = ?
                GROUP BY t.id_tema`, [id_tema]);

            if (!tema) {
                return res.status(404).json({ error: "Tema no encontrado" });
            }

            // Buscamos los enlaces asociados a este tema
            const enlaces = await db.all('SELECT * FROM enlaces WHERE id_tema = ?', [id_tema]);

            // Retornamos la estructura que dibujaste
            res.json({
                ...tema,
                enlaces_tema: enlaces
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Eliminar un tema (DELETE)
    deleteTema: async (req, res) => {
        try {
            const db = await initDB();
            const { id_tema } = req.params;

            const result = await db.run('DELETE FROM temas WHERE id_tema = ?', [id_tema]);

            if (result.changes === 0) {
                return res.status(404).json({ error: "No se encontró el tema para eliminar" });
            }

            // Respuesta 204 como en tu dibujo (sin cuerpo, pero exitosa)
            res.status(204).send(); 
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    updateTema: async (req, res) => {
        try {
            const db = await initDB();
            const { id_tema } = req.params;
            const { nombre_tema, descripcion_tema, autor_tema } = req.body;

            // 1. Verificamos si el tema existe
            const temaExistente = await db.get('SELECT * FROM temas WHERE id_tema = ?', [id_tema]);
            if (!temaExistente) {
                return res.status(404).json({ error: "No se encontró el tema para actualizar" });
            }

            // 2. Usamos los nuevos valores o mantenemos los antiguos (Lógica Optional)
            const nuevoNombre = nombre_tema || temaExistente.nombre_tema;
            const nuevaDesc = descripcion_tema || temaExistente.descripcion_tema;
            const nuevoAutor = autor_tema || temaExistente.autor_tema;

            // 3. Ejecutamos el UPDATE
            await db.run(
                'UPDATE temas SET nombre_tema = ?, descripcion_tema = ?, autor_tema = ? WHERE id_tema = ?',
                [nuevoNombre, nuevaDesc, nuevoAutor, id_tema]
            );

            res.json({
                message: "Tema actualizado correctamente",
                id_tema,
                nombre_tema: nuevoNombre
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = temasController;