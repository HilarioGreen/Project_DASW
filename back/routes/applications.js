const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
    postularse,
    obtenerPostulaciones,
    aceptarPostulacion,
    rechazarPostulacion,
    misPostulaciones
} = require('../controllers/applicationController');

// POST /api/applications - Postularse a proyecto
router.post('/', auth, postularse);

// GET /api/applications/my-applications - Mis postulaciones
router.get('/my-applications', auth, misPostulaciones);

// GET /api/applications/project/:proyectoId - Postulaciones de un proyecto
router.get('/project/:proyectoId', auth, obtenerPostulaciones);

// PUT /api/applications/:id/accept - Aceptar postulacion
router.put('/:id/accept', auth, aceptarPostulacion);

// PUT /api/applications/:id/reject - Rechazar postulacion
router.put('/:id/reject', auth, rechazarPostulacion);

module.exports = router;
