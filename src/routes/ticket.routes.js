import express from 'express';
import moment from 'moment-timezone';
import { authenticateToken } from '../jwt/middleware.js';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Registro de ticket
router.post('/createTicket', authenticateToken, async (req, res) => {
    const { nameFilm, chair, finalPrice, date, time, typeOfFunction, language, voucher, idUser, idMovieTheater } = req.body;
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
        return res.status(400).send("Fecha inválida.");
    }
    const purchaseDate = moment().tz('America/New_York').toDate();
    try {
        await prisma.ticket.create({
            data: {
                nameFilm,
                chair: JSON.stringify(chair),
                finalPrice: parseFloat(finalPrice),
                date: parsedDate.toISOString(), 
                time,
                typeOfFunction,
                language,
                voucher,
                purchaseDate,
                idUser,
                status: 'pending',
                idMovieTheater,
            }
        });
        console.log("¡Ticket registrado con éxito y en estado pendiente!", { idUser }, { nameFilm });
        res.send("¡Ticket registrado con éxito!");
    } catch (error) {
        console.error("Error al registrar ticket:", error);
        res.status(500).send("Error al registrar ticket");
    }
});

// Leer todos los tickets
router.get('/allTicket', authenticateToken, async (req, res) => {
    try {
        const tickets = await prisma.ticket.findMany();
        res.send(tickets);
    } catch (error) {
        console.error("Error al obtener todos los tickets:", error);
        res.status(500).send("Error al obtener datos");
    }
});

// Leer un ticket por el id del usuario
router.get('/ticketUser/:idUser', authenticateToken, async (req, res) => {
    const idUser = parseInt(req.params.idUser);
    try {
        const tickets = await prisma.ticket.findMany({
            where: { idUser }
        });
        if (tickets.length === 0) {
            console.log("No se encontraron tickets para este usuario", { idUser });
            res.status(404).send("No se encontraron tickets para este usuario");
        } else {
            res.send(tickets);
        }
    } catch (error) {
        console.error("Error al obtener tickets del usuario:", error);
        res.status(500).send("Error al obtener datos del usuario");
    }
});

// Actualizar el estado del ticket
router.post('/updateTicketStatus', authenticateToken, async (req, res) => {
    const { preference_id, status } = req.body;
    if (status !== 'paid' && status !== 'pending') {
        return res.status(400).send("Estado no válido.");
    }
    try {
        await prisma.ticket.updateMany({
            where: { voucher: preference_id },
            data: { status }
        });
        console.log("El estado del ticket se actualizó con éxito.", { status });
        res.send("Estado del ticket actualizado con éxito.");
    } catch (error) {
        console.error("Error al actualizar el estado del ticket:", error);
        res.status(500).send("Error al actualizar el estado del ticket.");
    }
});

// Actualizar el estado del ticket a "used"
router.post('/useTicket', authenticateToken, async (req, res) => {
    const { idTicket } = req.body;
    try {
        await prisma.ticket.update({
            where: { idTicket: idTicket },
            data: { status: 'used' }
        });
        console.log("El ticket ha sido marcado como 'used'.");
        res.send("El ticket ha sido usado con éxito.");
    } catch (error) {
        console.error("Error al usar el ticket:", error);
        res.status(500).send("Error al actualizar el ticket.");
    }
});

// Ruta para buscar películas por nombre
router.get('/searchMovies', authenticateToken, async (req, res) => {
    const { name } = req.query;
    if (!name) {
        return res.status(400).send("El nombre de la película es obligatorio.");
    }
    try {
        const tickets = await prisma.ticket.findMany({
            where: {
                nameFilm: {
                    contains: name,
                    mode: 'insensitive' 
                }
            }
        });
        res.send(tickets);
    } catch (error) {
        console.error("Error al buscar películas:", error);
        res.status(500).send("Error al buscar películas.");
    }
});

// Ruta para obtener información del usuario autenticado
router.get('/tokenUser', authenticateToken, (req, res) => {
    res.send(req.user);
});

export default router;
