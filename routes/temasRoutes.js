const express = require('express');
const router = express.Router();

// Importamos los controladores
const temasController = require('../controllers/temasController');
const enlacesController = require('../controllers/enlacesController');
const votosController = require('../controllers/votosController');

// Rutas de Temas
router.post('/', temasController.createTema);
router.get('/:id_tema', temasController.getTemaById);
router.patch('/:id_tema', temasController.updateTema);
router.delete('/:id_tema', temasController.deleteTema);

// Rutas de Enlaces (Anidadas)
router.post('/:id_tema/enlaces', enlacesController.createEnlace);
router.get('/:id_tema/enlaces', enlacesController.getEnlacesByTema);
router.delete('/enlaces/:id_enlace', enlacesController.deleteEnlace);

// Rutas de Votos
router.post('/:id_tema/votos', votosController.votarTema);

module.exports = router;