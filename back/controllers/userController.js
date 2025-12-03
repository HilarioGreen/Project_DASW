const User = require('../models/User');

// Obtener perfil del usuario actual
const obtenerPerfil = async (req, res) => {
    try {
        const usuario = await User.findById(req.usuario._id).select('-password');

        res.json({
            success: true,
            data: usuario
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener perfil'
        });
    }
};

// Actualizar perfil
const actualizarPerfil = async (req, res) => {
    try {
        const { nombre, carrera, habilidades, bio } = req.body;

        const usuario = await User.findByIdAndUpdate(
            req.usuario._id,
            { nombre, carrera, habilidades, bio },
            { new: true, runValidators: true }
        ).select('-password');

        res.json({
            success: true,
            data: usuario
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Error al actualizar perfil'
        });
    }
};

// Cambiar contraseña
const cambiarPassword = async (req, res) => {
    try {
        const { passwordActual, passwordNueva } = req.body;

        // Obtener usuario con contraseña
        const usuario = await User.findById(req.usuario._id);

        // Verificar contraseña actual
        const passwordCorrecta = await usuario.compararPassword(passwordActual);
        if (!passwordCorrecta) {
            return res.status(400).json({
                success: false,
                error: 'La contraseña actual es incorrecta'
            });
        }

        // Actualizar contraseña
        usuario.password = passwordNueva;
        await usuario.save();

        res.json({
            success: true,
            message: 'Contraseña actualizada correctamente'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Error al cambiar contraseña'
        });
    }
};

// Obtener usuario por ID
const obtenerUsuario = async (req, res) => {
    try {
        const usuario = await User.findById(req.params.id).select('-password');

        if (!usuario) {
            return res.status(404).json({
                success: false,
                error: 'Usuario no encontrado'
            });
        }

        res.json({
            success: true,
            data: usuario
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener usuario'
        });
    }
};

module.exports = {
    obtenerPerfil,
    actualizarPerfil,
    cambiarPassword,
    obtenerUsuario
};
