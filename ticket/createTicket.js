const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const moment = require('moment-timezone');
const { authenticateToken } = require("../middleware");

// Conexión a la base de datos cine-aurora
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error("Error al conectar a la base de datos cine-aurora:", err);
        return;
    }
});

// Registro de ticket
router.post("/createTicket", authenticateToken, (req, res) => {
    const { nameFilm, chair, finalPrice, date, time, typeOfFunction, language, voucher, idUser } = req.body;

    // Obtén la hora actual en la zona horaria deseada
    const purchaseDate = moment().tz('America/New_York').format('YYYY-MM-DD HH:mm:ss');

    const chairString = JSON.stringify(chair);

    const insertQuery = 'INSERT INTO ticket (nameFilm, chair, finalPrice, date, time, typeOfFunction, language, voucher, purchaseDate, idUser, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [nameFilm, chairString, finalPrice, date, time, typeOfFunction, language, voucher, purchaseDate, idUser, 'pending'];

    db.query(insertQuery, values, (err, result) => {
        if (err) {
            console.error("Error al registrar ticket:", err);
            res.status(500).send("Error al registrar ticket");
        } else {
            console.log("¡Ticket registrado con éxito y en estado pendiente!", { idUser }, { nameFilm });
            res.send("¡Ticket registrado con éxito!");
        }
    });
});

// Leer todos los tickets
router.get("/allTicket", authenticateToken, (req, res) => {
    db.query("SELECT * FROM ticket", (err, result) => {
        if (err) {
            console.error("Error al obtener todos los tickets:", err);
            res.status(500).send("Error al obtener datos");
        } else {
            res.send(result);
        }
    });
});

// Leer un ticket por el id del usuario
router.get("/ticketUser/:idUser", authenticateToken, (req, res) => {
    const idUser = req.params.idUser;
    db.query('SELECT * FROM ticket WHERE idUser = ?', [idUser], (err, result) => {
        if (err) {
            console.error("Error al obtener tickets del usuario:", err);
            res.status(500).send("Error al obtener datos del usuario");
        } else if (result.length === 0) {
            console.log("No se encontraron tickets para este usuario", { idUser });
            res.status(404).send("No se encontraron tickets para este usuario");
        } else {
            res.send(result);
        }
    });
});

// Actualizar el estado del ticket
router.post("/updateTicketStatus", authenticateToken, (req, res) => {
    const { preference_id, status } = req.body;

    if (status !== 'paid' && status !== 'pending') {
        return res.status(400).send("Estado no válido.");
    }

    const updateQuery = 'UPDATE ticket SET status = ? WHERE voucher = ?';
    db.query(updateQuery, [status, preference_id], (err, result) => {
        if (err) {
            console.error("Error al actualizar el estado del ticket:", err);
            res.status(500).send("Error al actualizar el estado del ticket.");
        } else {
            console.log("El estado del ticket se actualizó con éxito.", { status });
            res.send("Estado del ticket actualizado con éxito.");
        }
    });
});

// // Ruta para buscar películas por nombre
router.get('/searchMovies', authenticateToken, (req, res) => {
    const { name } = req.query;

    if (!name) {
        return res.status(400).send("El nombre de la película es obligatorio.");
    }

    const searchQuery = 'SELECT * FROM ticket WHERE nameFilm LIKE ?';
    const values = [`%${name}%`];

    db.query(searchQuery, values, (err, results) => {
        if (err) {
            console.error("Error al buscar películas:", err);
            res.status(500).send("Error al buscar películas.");
        } else {
            res.send(results);
        }
    });
});

// Ruta para obtener información del usuario autenticado
router.get('/tokenUser', authenticateToken, (req, res) => {
    res.send(req.user);
});

module.exports = router;
