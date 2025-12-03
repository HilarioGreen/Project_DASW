const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
    obtenerProyectos,
    obtenerProyecto,
    crearProyecto,
    actualizarProyecto,
    eliminarProyecto,
    misProyectos,
    misColaboraciones
} = require('../controllers/projectController');

// GET /api/projects/my-projects - Mis proyectos creados
router.get('/my-projects', auth, misProyectos);

// GET /api/projects/my-collaborations - Proyectos donde colaboro
router.get('/my-collaborations', auth, misColaboraciones);

// GET /api/projects - Obtener todos los proyectos
router.get('/', auth, obtenerProyectos);

// GET /api/projects/:id - Obtener proyecto por ID
router.get('/:id', auth, obtenerProyecto);

// POST /api/projects - Crear proyecto
router.post('/', auth, crearProyecto);

// PUT /api/projects/:id - Actualizar proyecto
router.put('/:id', auth, actualizarProyecto);

// DELETE /api/projects/:id - Eliminar proyecto
router.delete('/:id', auth, eliminarProyecto);

module.exports = router;
