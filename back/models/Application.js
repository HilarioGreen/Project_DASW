const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    proyecto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mensaje: {
        type: String,
        default: ''
    },
    estado: {
        type: String,
        enum: ['pendiente', 'aceptado', 'rechazado'],
        default: 'pendiente'
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Application', applicationSchema);
