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
    }
};

module.exports = temasController;