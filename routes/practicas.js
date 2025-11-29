/**
 * RESUMEN DEL ARCHIVO:
 * 
 * Este archivo define y exporta el router `practicasRouter`, encargado de manejar las rutas
 * relacionadas con las prácticas registradas en el sistema LABFI.
 * 
 * Funcionalidades:
 * - GET `/api/practicas`        → Obtener todas las prácticas.
 * - GET `/api/practicas/:id`    → Obtener una práctica específica.
 * - POST `/api/practicas`       → Registrar una nueva práctica.
 * - DELETE `/api/practicas/:id` → Eliminar una práctica.
 * - PUT `/api/practicas/:id`    → Cambiar el estado (pendiente/completada).
 */

const practicasRouter = require('express').Router()
const Practica = require('../models/practica')

// ✅ Obtener todas las prácticas
practicasRouter.get('/', async (request, response, next) => {
    try {
        const practicas = await Practica.find({}).sort({ fecha: -1 })
        response.json(practicas)
    } catch (error) {
        next(error)
    }
})

// ✅ Obtener una práctica por ID
practicasRouter.get('/:id', async (request, response, next) => {
    try {
        const practica = await Practica.findById(request.params.id)
        if (!practica) {
            return response.status(404).json({ error: 'Práctica no encontrada' })
        }
        response.json(practica)
    } catch (error) {
        next(error)
    }
})

// ✅ Crear una nueva práctica (sin autenticación)
practicasRouter.post('/', async (request, response, next) => {
    try {
        const {
            nombrePractica,
            asignatura,
            grupo,
            escuela,
            fecha,
            horaInicio,
            horaFin,
            ambiente,
            docente,
            materiales,
            observaciones
        } = request.body

        // Validar campos requeridos
        if (
            !nombrePractica ||
            !asignatura ||
            !grupo ||
            !escuela ||
            !fecha ||
            !horaInicio ||
            !horaFin ||
            !ambiente ||
            !docente
        ) {
            return response.status(400).json({ error: 'Faltan campos obligatorios' })
        }

        // Crear nueva práctica
        const practica = new Practica({
            nombrePractica,
            asignatura,
            grupo,
            escuela,
            fecha,
            horaInicio,
            horaFin,
            ambiente,
            docente,
            materiales,
            observaciones
        })

        const savedPractica = await practica.save()
        response.status(201).json(savedPractica)
    } catch (error) {
        next(error)
    }
})

// ✅ Eliminar una práctica (sin autenticación por ahora)
practicasRouter.delete('/:id', async (request, response, next) => {
    try {
        const practica = await Practica.findById(request.params.id)
        if (!practica) {
            return response.status(404).json({ error: 'Práctica no encontrada' })
        }

        await Practica.findByIdAndDelete(request.params.id)
        response.status(204).end()
    } catch (error) {
        next(error)
    }
})

// ✅ Alternar el estado de la práctica (pendiente ↔ completada)
practicasRouter.put('/:id', async (request, response, next) => {
    try {
        const practica = await Practica.findById(request.params.id)
        if (!practica) {
            return response.status(404).json({ error: 'Práctica no encontrada' })
        }

        practica.estado = !practica.estado
        const updatedPractica = await practica.save()

        response.status(200).json(updatedPractica)
    } catch (error) {
        next(error)
    }
})

module.exports = practicasRouter
