const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Generar JWT
const generarToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// Registrar usuario
const registrar = async (req, res) => {
    try {
        const { nombre, email, password, carrera } = req.body;

        // Verificar si el usuario ya existe
        const usuarioExiste = await User.findOne({ email });
        if (usuarioExiste) {
            return res.status(400).json({
                success: false,
                error: 'El email ya esta registrado'
            });
        }

        // Crear usuario
        const usuario = await User.create({
            nombre,
            email,
            password,
            carrera
        });

        // Generar token
        const token = generarToken(usuario._id);

        res.status(201).json({
            success: true,
            data: {
                _id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                carrera: usuario.carrera,
                rol: usuario.rol,
                token
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Error al registrar usuario'
        });
    }
};

// Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar campos
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Por favor ingresa email y contraseña'
            });
        }

        // Buscar usuario
        const usuario = await User.findOne({ email });
        if (!usuario) {
            return res.status(401).json({
                success: false,
                error: 'Credenciales invalidas'
            });
        }

        // Verificar contraseña
        const passwordCorrecta = await usuario.compararPassword(password);
        if (!passwordCorrecta) {
            return res.status(401).json({
                success: false,
                error: 'Credenciales invalidas'
            });
        }

        // Generar token
        const token = generarToken(usuario._id);

        res.json({
            success: true,
            data: {
                _id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                carrera: usuario.carrera,
                rol: usuario.rol,
                token
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Error al iniciar sesion'
        });
    }
};

// Recuperar contraseña
const recuperarPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Buscar usuario
        const usuario = await User.findOne({ email });
        if (!usuario) {
            return res.status(404).json({
                success: false,
                error: 'No existe usuario con ese email'
            });
        }

        // Generar contraseña temporal
        const passwordTemporal = Math.random().toString(36).slice(-8);

        // Actualizar contraseña
        usuario.password = passwordTemporal;
        await usuario.save();

        // Configurar email
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Enviar email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Recuperacion de contraseña - Proyectos ITESO',
            html: `
                <h2>Recuperacion de contraseña</h2>
                <p>Tu nueva contraseña temporal es: <strong>${passwordTemporal}</strong></p>
                <p>Por favor inicia sesion y cambia tu contraseña.</p>
            `
        });

        res.json({
            success: true,
            message: 'Se envio un email con la contraseña temporal'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Error al recuperar contraseña'
        });
    }
};

module.exports = {
    registrar,
    login,
    recuperarPassword
};
