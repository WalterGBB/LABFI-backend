/**
 * RESUMEN DEL ARCHIVO:
 * 
 * Este archivo define el **esquema y modelo de Mongoose** para los documentos de tipo `Practica`.
 * Cada práctica corresponde a una solicitud de materiales y equipos para una sesión experimental
 * registrada en el sistema LABFI.
 * 
 * Campos principales:
 * - `nombrePractica`, `asignatura`, `grupo`, `escuelaProfesional`, `fecha`, `horaInicio`,
 *   `horaFin`, `ambiente`, `docente` son **obligatorios**.
 * - `materiales` es un **arreglo de objetos**, cada uno con `descripcion` y `cantidad`.
 * - `observaciones` es opcional.
 * - `estado` indica si la práctica está pendiente o completada.
 * - `user` referencia al usuario que creó la solicitud.
 */

const mongoose = require('mongoose')

// Definición del esquema de la práctica
const PracticaSchema = new mongoose.Schema({
    nombrePractica: { type: String, required: true }, // Ej: "Medición y Cálculo de Errores"
    asignatura: { type: String, required: true },     // Ej: "Física I"
    grupo: { type: String, required: true },          // Ej: "B1"
    escuela: { type: String, required: true }, // Ej: "Ingeniería de Sistemas"
    fecha: { type: Date, required: true },            // Fecha programada de la práctica
    horaInicio: { type: String, required: true },     // Ej: "7am"
    horaFin: { type: String, required: true },        // Ej: "9am"
    ambiente: { type: String, required: true },       // Ej: "1E-103"
    docente: { type: String, required: true },        // Ej: "Eduardo Ccahua Benites"
    materiales: [                                     // Lista de materiales solicitados
        {
            descripcion: { type: String, required: true }, // Ej: "Micrómetro"
            cantidad: { type: Number, required: true }     // Ej: 2
        }
    ],

    observaciones: { type: String, default: '' },     // Campo libre para observaciones
    estado: { type: Boolean, default: false },        // false = Pendiente, true = Completada

    // user: {                                           // Usuario que registró la práctica
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User'
    // }
})

// Campo virtual para devolver la fecha formateada
PracticaSchema.virtual('fechaFormateada').get(function () {
    if (!this.fecha) return ''
    const f = new Date(this.fecha)
    const dia = String(f.getDate()).padStart(2, '0')
    const mes = String(f.getMonth() + 1).padStart(2, '0')
    const anio = String(f.getFullYear()).slice(-2)
    return `${dia}/${mes}/${anio}`
})

// Personalización al convertir a JSON
PracticaSchema.set('toJSON', {
    virtuals: true,
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

// Exportar el modelo 'Practica'
module.exports = mongoose.model('Practica', PracticaSchema)
