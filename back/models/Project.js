const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: [true, 'El titulo es obligatorio'],
        trim: true
    },
    descripcion: {
        type: String,
        required: [true, 'La descripcion es obligatoria']
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    categoria: {
        type: String,
        enum: ['tecnologia', 'startup', 'diseno', 'ingenieria', 'marketing', 'negocios'],
        required: [true, 'La categoria es obligatoria']
    },
    habilidadesRequeridas: [{
        type: String
    }],
    carrerasRelacionadas: [{
        type: String
    }],
    tamanoEquipo: {
        type: Number,
        default: 5
    },
    miembrosActuales: {
        type: Number,
        default: 1
    },
    estado: {
        type: String,
        enum: ['activo', 'pausado', 'completado', 'cerrado'],
        default: 'activo'
    },
    progreso: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    fechaPublicacion: {
        type: Date,
        default: Date.now
    },
    fechaActualizacion: {
        type: Date,
        default: Date.now
    }
});

// Actualizar fecha de actualizacion antes de guardar
projectSchema.pre('save', function() {
    this.fechaActualizacion = Date.now();
});

module.exports = mongoose.model('Project', projectSchema);
