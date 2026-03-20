const express = require('express');
const router = express.Router();
const temasController = require('../controllers/temasController');


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


module.exports = router; 