/**
 * RESUMEN DEL ARCHIVO:
 * 
 * Este archivo define y exporta el router `usersRouter`, encargado de manejar las rutas
 * relacionadas con los usuarios del sistema LABFI.
 * 
 * Funcionalidades:
 * - GET `/api/users`     → Listar todos los usuarios (incluyendo sus prácticas registradas).
 * - POST `/api/users`    → Registrar un nuevo usuario (con validaciones y hash de contraseña).
 * 
 * Se utiliza `bcrypt` para el encriptado de contraseñas y `Mongoose` para interactuar con MongoDB.
 */

const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

// Obtener todos los usuarios (con sus prácticas asociadas)
usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
        .populate('practicas', { nombrePractica: 1, fecha: 1, estado: 1 }) // Mostrar info básica de las prácticas
    response.json(users)
})

// Registrar un nuevo usuario
usersRouter.post('/', async (request, response, next) => {
    try {
        const { username, password, name, rol } = request.body

        // Validación básica
        if (!username || !password || !name || !rol) {
            return response.status(400).json({ error: 'All fields are required.' })
        }

        if (password.length < 3) {
            return response.status(400).json({ error: 'Password must be at least 3 characters long.' })
        }

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ username })
        if (existingUser) {
            return response.status(400).json({ error: 'Username already exists.' })
        }

        // Encriptar la contraseña
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)

        // Crear nuevo usuario
        const user = new User({
            username,
            passwordHash,
            name,
            rol,
        })

        const savedUser = await user.save()

        // No devolvemos el hash al cliente
        const { passwordHash: _, ...userWithoutPassword } = savedUser.toObject()

        response.status(201).json(userWithoutPassword)
    } catch (error) {
        next(error)
    }
})

module.exports = usersRouter
