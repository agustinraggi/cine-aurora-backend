const express = require("express");
const router = express.Router();
const moment = require('moment-timezone');
const { authenticateToken } = require("../middleware");
<<<<<<< Updated upstream

// Conexión a la base de datos cine-aurora
// const db = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
// });

db.connect((err) => {
    if (err) {
        console.error("Error al conectar a la base de datos cine-aurora:", err);
        return;
    }
});
=======
const { getRepository } = require("typeorm");
const { Ticket } = require("../entity/ticket/ticket_user");
>>>>>>> Stashed changes

// Registro de ticket
router.post("/createTicket", authenticateToken, async (req, res) => {
    const { nameFilm, chair, finalPrice, date, time, typeOfFunction, language, voucher, idUser } = req.body;

    // Obtén la hora actual en la zona horaria deseada
    const purchaseDate = moment().tz('America/New_York').toDate();

    const chairString = JSON.stringify(chair);

    try {
        const ticketRepository = getRepository(Ticket);
        const ticket = new Ticket();
        ticket.nameFilm = nameFilm;
        ticket.chair = chairString;
        ticket.finalPrice = finalPrice;
        ticket.date = date;
        ticket.time = time;
        ticket.typeOfFunction = typeOfFunction;
        ticket.language = language;
        ticket.voucher = voucher;
        ticket.purchaseDate = purchaseDate;
        ticket.idUser = idUser;
        ticket.status = 'pending';

        await ticketRepository.save(ticket);
        console.log("¡Ticket registrado con éxito y en estado pendiente!", { idUser }, { nameFilm });
        res.send("¡Ticket registrado con éxito!");
    } catch (error) {
        console.error("Error al registrar ticket:", error);
        res.status(500).send("Error al registrar ticket");
    }
});

// Leer todos los tickets
router.get("/allTicket", authenticateToken, async (req, res) => {
    try {
        const ticketRepository = getRepository(Ticket);
        const tickets = await ticketRepository.find();
        res.send(tickets);
    } catch (error) {
        console.error("Error al obtener todos los tickets:", error);
        res.status(500).send("Error al obtener datos");
    }
});

// Leer un ticket por el id del usuario
router.get("/ticketUser/:idUser", authenticateToken, async (req, res) => {
    const idUser = parseInt(req.params.idUser);
    try {
        const ticketRepository = getRepository(Ticket);
        const tickets = await ticketRepository.find({ where: { idUser } });
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
router.post("/updateTicketStatus", authenticateToken, async (req, res) => {
    const { preference_id, status } = req.body;

    if (status !== 'paid' && status !== 'pending') {
        return res.status(400).send("Estado no válido.");
    }

    try {
        const ticketRepository = getRepository(Ticket);
        const result = await ticketRepository.update({ voucher: preference_id }, { status });
        if (result.affected === 0) {
            res.status(404).send("Ticket no encontrado");
        } else {
            console.log("El estado del ticket se actualizó con éxito.", { status });
            res.send("Estado del ticket actualizado con éxito.");
        }
    } catch (error) {
        console.error("Error al actualizar el estado del ticket:", error);
        res.status(500).send("Error al actualizar el estado del ticket.");
    }
});

// Ruta para buscar películas por nombre
router.get('/searchMovies', authenticateToken, async (req, res) => {
    const { name } = req.query;

    if (!name) {
        return res.status(400).send("El nombre de la película es obligatorio.");
    }

    try {
        const ticketRepository = getRepository(Ticket);
        const tickets = await ticketRepository.createQueryBuilder('ticket')
            .where('ticket.nameFilm LIKE :name', { name: `%${name}%` })
            .getMany();
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

module.exports = router;
