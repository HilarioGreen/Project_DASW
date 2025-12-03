const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        // Obtener token del header
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'No hay token, acceso denegado'
            });
        }

        // Verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Buscar usuario
        const usuario = await User.findById(decoded.id).select('-password');

        if (!usuario) {
            return res.status(401).json({
                success: false,
                error: 'Token no valido'
            });
        }

        req.usuario = usuario;
        next();

    } catch (error) {
        res.status(401).json({
            success: false,
            error: 'Token no valido'
        });
    }
};

module.exports = auth;
