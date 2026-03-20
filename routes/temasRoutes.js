const express = require('express');
const router = express.Router();
const temasController = require('../controllers/temasController');

// Ruta para listar (GET)
// router.get('/', temasController.getTemas);

// Ruta para crear (POST) - La que diseñamos en Figma
router.post('/', temasController.createTema);
router.get('/', temasController.getTemas);

module.exports = router; // <-- ¡Si falta esta línea, la app crashea!