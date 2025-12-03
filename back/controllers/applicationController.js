const Application = require('../models/Application');
const Project = require('../models/Project');
const Team = require('../models/Team');

// Postularse a un proyecto
const postularse = async (req, res) => {
    try {
        const { proyectoId, mensaje } = req.body;

        // Verificar que el proyecto existe
        const proyecto = await Project.findById(proyectoId);
        if (!proyecto) {
            return res.status(404).json({
                success: false,
                error: 'Proyecto no encontrado'
            });
        }

        // Verificar que no es el dueño
        if (proyecto.owner.toString() === req.usuario._id.toString()) {
            return res.status(400).json({
                success: false,
                error: 'No puedes postularte a tu propio proyecto'
            });
        }

        // Verificar que no se ha postulado antes
        const postulacionExistente = await Application.findOne({
            proyecto: proyectoId,
            usuario: req.usuario._id
        });

        if (postulacionExistente) {
            return res.status(400).json({
                success: false,
                error: 'Ya te postulaste a este proyecto'
            });
        }

        // Verificar que hay espacio en el equipo
        if (proyecto.miembrosActuales >= proyecto.tamanoEquipo) {
            return res.status(400).json({
                success: false,
                error: 'El equipo ya esta completo'
            });
        }

        // Crear postulacion
        const postulacion = await Application.create({
            proyecto: proyectoId,
            usuario: req.usuario._id,
            mensaje
        });

        res.status(201).json({
            success: true,
            data: postulacion
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Error al postularse'
        });
    }
};

// Obtener postulaciones de un proyecto
const obtenerPostulaciones = async (req, res) => {
    try {
        const proyecto = await Project.findById(req.params.proyectoId);

        if (!proyecto) {
            return res.status(404).json({
                success: false,
                error: 'Proyecto no encontrado'
            });
        }

        // Verificar que es el dueño
        if (proyecto.owner.toString() !== req.usuario._id.toString()) {
            return res.status(403).json({
                success: false,
                error: 'No tienes permiso para ver las postulaciones'
            });
        }

        const postulaciones = await Application.find({ proyecto: req.params.proyectoId })
            .populate('usuario', 'nombre email carrera habilidades');

        res.json({
            success: true,
            count: postulaciones.length,
            data: postulaciones
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener postulaciones'
        });
    }
};

// Aceptar postulacion
const aceptarPostulacion = async (req, res) => {
    try {
        const postulacion = await Application.findById(req.params.id)
            .populate('proyecto');

        if (!postulacion) {
            return res.status(404).json({
                success: false,
                error: 'Postulacion no encontrada'
            });
        }

        // Verificar que es el dueño del proyecto
        if (postulacion.proyecto.owner.toString() !== req.usuario._id.toString()) {
            return res.status(403).json({
                success: false,
                error: 'No tienes permiso'
            });
        }

        // Cambiar estado
        postulacion.estado = 'aceptado';
        await postulacion.save();

        // Agregar al equipo
        await Team.create({
            proyecto: postulacion.proyecto._id,
            usuario: postulacion.usuario,
            rol: 'miembro'
        });

        // Incrementar miembros
        await Project.findByIdAndUpdate(postulacion.proyecto._id, {
            $inc: { miembrosActuales: 1 }
        });

        res.json({
            success: true,
            message: 'Postulacion aceptada'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Error al aceptar postulacion'
        });
    }
};

// Rechazar postulacion
const rechazarPostulacion = async (req, res) => {
    try {
        const postulacion = await Application.findById(req.params.id)
            .populate('proyecto');

        if (!postulacion) {
            return res.status(404).json({
                success: false,
                error: 'Postulacion no encontrada'
            });
        }

        // Verificar que es el dueño del proyecto
        if (postulacion.proyecto.owner.toString() !== req.usuario._id.toString()) {
            return res.status(403).json({
                success: false,
                error: 'No tienes permiso'
            });
        }

        // Cambiar estado
        postulacion.estado = 'rechazado';
        await postulacion.save();

        res.json({
            success: true,
            message: 'Postulacion rechazada'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Error al rechazar postulacion'
        });
    }
};

// Mis postulaciones
const misPostulaciones = async (req, res) => {
    try {
        const postulaciones = await Application.find({ usuario: req.usuario._id })
            .populate('proyecto', 'titulo estado');

        res.json({
            success: true,
            count: postulaciones.length,
            data: postulaciones
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener postulaciones'
        });
    }
};

module.exports = {
    postularse,
    obtenerPostulaciones,
    aceptarPostulacion,
    rechazarPostulacion,
    misPostulaciones
};
