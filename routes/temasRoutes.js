const express = require('express');
const router = express.Router();
const temasController = require('../controllers/temasController');
const enlacesController = require('../controllers/enlacesController');
const votosController = require('../controllers/votosController');


// Ruta para listar (GET)
router.get('/', temasController.getTemas);
// Ruta para crear (POST) 
router.post('/', temasController.createTema);
// Ruta para obtener por id_tema (GET)
router.get('/:id_tema', temasController.getTemaById);
// Ruta para actualizar un tema por id_tema (PATCH)
router.patch('/:id_tema', temasController.updateTema);
// Eliminar tema por id_tema (DELETE)
router.delete('/:id_tema', temasController.deleteTema);

// Manejo de enlaces:
// Ruta para obtener todos los enlaces de un tema (GET)
router.get('/:id_tema/enlaces', enlacesController.getEnlacesByTema);
// Ruta para agregar enlace a tema (POST)
router.post('/:id_tema/enlaces', enlacesController.createEnlace);
// Ruta para actualizar un enlace en especifico por id_enlace (PATCH)
router.patch('/enlaces/:id_enlace', enlacesController.updateEnlace);
// Ruta para eliminar un enlace en especifico por id_enlace (DELETE)
router.delete('/enlaces/:id_enlace', enlacesController.deleteEnlace);

// Manejo de votos:
// Ruta para hacer un voto a algun tema por id_tema (POST)
router.post('/:id_tema/votos', votosController.votarTema);

module.exports = router; 