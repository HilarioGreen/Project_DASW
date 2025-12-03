const Project = require('../models/Project');
const Team = require('../models/Team');

// Obtener todos los proyectos (con filtros)
const obtenerProyectos = async (req, res) => {
    try {
        const { categoria, search, estado } = req.query;

        // Construir filtro
        let filtro = {};

        if (categoria && categoria !== 'todos') {
            filtro.categoria = categoria;
        }

        if (estado) {
            filtro.estado = estado;
        }

        if (search) {
            filtro.$or = [
                { titulo: { $regex: search, $options: 'i' } },
                { descripcion: { $regex: search, $options: 'i' } },
                { habilidadesRequeridas: { $regex: search, $options: 'i' } }
            ];
        }

        const proyectos = await Project.find(filtro)
            .populate('owner', 'nombre carrera')
            .sort({ fechaPublicacion: -1 });

        res.json({
            success: true,
            count: proyectos.length,
            data: proyectos
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener proyectos'
        });
    }
};

// Obtener proyecto por ID
const obtenerProyecto = async (req, res) => {
    try {
        const proyecto = await Project.findById(req.params.id)
            .populate('owner', 'nombre email carrera');

        if (!proyecto) {
            return res.status(404).json({
                success: false,
                error: 'Proyecto no encontrado'
            });
        }

        // Obtener miembros del equipo
        const equipo = await Team.find({ proyecto: proyecto._id })
            .populate('usuario', 'nombre carrera');

        res.json({
            success: true,
            data: {
                ...proyecto.toObject(),
                equipo
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener proyecto'
        });
    }
};

// Crear proyecto
const crearProyecto = async (req, res) => {
    try {
        const { titulo, descripcion, categoria, habilidadesRequeridas, tamanoEquipo } = req.body;

        // Crear proyecto
        const proyecto = await Project.create({
            titulo,
            descripcion,
            categoria,
            habilidadesRequeridas,
            tamanoEquipo,
            owner: req.usuario._id
        });

        // Agregar creador al equipo
        await Team.create({
            proyecto: proyecto._id,
            usuario: req.usuario._id,
            rol: 'lider'
        });

        res.status(201).json({
            success: true,
            data: proyecto
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Error al crear proyecto'
        });
    }
};

// Actualizar proyecto
const actualizarProyecto = async (req, res) => {
    try {
        let proyecto = await Project.findById(req.params.id);

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
                error: 'No tienes permiso para editar este proyecto'
            });
        }

        proyecto = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            data: proyecto
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Error al actualizar proyecto'
        });
    }
};

// Eliminar proyecto
const eliminarProyecto = async (req, res) => {
    try {
        const proyecto = await Project.findById(req.params.id);

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
                error: 'No tienes permiso para eliminar este proyecto'
            });
        }

        await proyecto.deleteOne();

        // Eliminar equipo asociado
        await Team.deleteMany({ proyecto: req.params.id });

        res.json({
            success: true,
            message: 'Proyecto eliminado'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Error al eliminar proyecto'
        });
    }
};

// Obtener mis proyectos (creados por mi)
const misProyectos = async (req, res) => {
    try {
        const proyectos = await Project.find({ owner: req.usuario._id })
            .sort({ fechaPublicacion: -1 });

        res.json({
            success: true,
            count: proyectos.length,
            data: proyectos
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener mis proyectos'
        });
    }
};

// Obtener proyectos donde colaboro
const misColaboraciones = async (req, res) => {
    try {
        // Buscar en el equipo donde participo
        const equipos = await Team.find({ usuario: req.usuario._id })
            .populate({
                path: 'proyecto',
                populate: { path: 'owner', select: 'nombre' }
            });

        // Filtrar proyectos donde no soy el owner
        const colaboraciones = equipos
            .filter(e => e.proyecto && e.proyecto.owner._id.toString() !== req.usuario._id.toString())
            .map(e => e.proyecto);

        res.json({
            success: true,
            count: colaboraciones.length,
            data: colaboraciones
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener colaboraciones'
        });
    }
};

module.exports = {
    obtenerProyectos,
    obtenerProyecto,
    crearProyecto,
    actualizarProyecto,
    eliminarProyecto,
    misProyectos,
    misColaboraciones
};
