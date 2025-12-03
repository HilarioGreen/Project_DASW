const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
    obtenerPerfil,
    actualizarPerfil,
    cambiarPassword,
    obtenerUsuario
} = require('../controllers/userController');

// GET /api/users/me - Obtener mi perfil
router.get('/me', auth, obtenerPerfil);

// PUT /api/users/me - Actualizar mi perfil
router.put('/me', auth, actualizarPerfil);

// PUT /api/users/me/password - Cambiar contraseña
router.put('/me/password', auth, cambiarPassword);

// GET /api/users/:id - Obtener usuario por ID
router.get('/:id', auth, obtenerUsuario);

module.exports = router;
