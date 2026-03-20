const initDB = require('../models/db');

// --- 1. FUNCIÓN PARA EL RANKING (GET /) ---
const getTemas = async (req, res) => {
    try {
        const db = await initDB();
        const temas = await db.all(`
            SELECT t.*, COUNT(v.id_voto) as votos_tema
            FROM temas t
            LEFT JOIN votos v ON t.id_tema = v.id_tema
            GROUP BY t.id_tema
            ORDER BY votos_tema DESC
        `);
        const countResult = await db.get('SELECT COUNT(*) as total FROM temas');
        const total = countResult ? countResult.total : 0;

        res.render('index', { temas, total_temas: total });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error en el servidor");
    }
};

// --- 2. OBTENER TEMA POR ID (GET /temas/:id) ---
const getTemaById = async (req, res) => {
    try {
        const db = await initDB();
        const tema = await db.get('SELECT * FROM temas WHERE id_tema = ?', [req.params.id_tema]);
        if (!tema) return res.status(404).json({ error: "No encontrado" });
        res.json(tema);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- 3. CREAR TEMA (POST /temas) ---
const createTema = async (req, res) => {
    try {
        const db = await initDB();
        const { nombre_tema, descripcion_tema, autor_tema } = req.body;
        const result = await db.run(
            'INSERT INTO temas (nombre_tema, descripcion_tema, autor_tema) VALUES (?, ?, ?)',
            [nombre_tema, descripcion_tema, autor_tema]
        );
        res.status(201).json({ id_tema: result.lastID });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- 4. EDITAR TEMA (PATCH /temas/:id) ---
const updateTema = async (req, res) => {
    try {
        const db = await initDB();
        const { nombre_tema, descripcion_tema, autor_tema } = req.body;
        await db.run(
            'UPDATE temas SET nombre_tema = ?, descripcion_tema = ?, autor_tema = ? WHERE id_tema = ?',
            [nombre_tema, descripcion_tema, autor_tema, req.params.id_tema]
        );
        res.json({ message: "Actualizado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- 5. ELIMINAR TEMA (DELETE /temas/:id) ---
const deleteTema = async (req, res) => {
    try {
        const db = await initDB();
        await db.run('DELETE FROM temas WHERE id_tema = ?', [req.params.id_tema]);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- 6. EXPORTACIÓN ÚNICA (AQUÍ ESTABA EL ERROR) ---
module.exports = {
    getTemas,
    getTemaById,
    createTema,
    updateTema,
    deleteTema
};