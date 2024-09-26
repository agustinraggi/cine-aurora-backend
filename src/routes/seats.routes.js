import { authenticateToken } from '../jwt/middleware.js';
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Ruta para cambiar el estado de una silla
router.post('/updateSeats', async (req, res) => {
    const {chair, idMovieTheater } = req.body;
    try {
        await prisma.seats.create({
            data: {
                chair: JSON.stringify(chair),
                idMovieTheater,
                statuSeats: "buys"
            }
        });
        console.log("silla registrado con éxito ");
        res.send("silla registrado con éxito!");
    } catch (error) {
        console.error("Error al registrar silla:", error);
        res.status(500).send("Error al registrar silla");
    }
});

// Ruta para obtener información del usuario autenticado
router.get('/tokenUser', authenticateToken, (req, res) => {
    res.send(req.user);
});

export default router;
