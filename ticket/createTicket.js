const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const moment = require('moment-timezone');

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
router.post("/createTicket", (req, res) => {
    const { nameFilm, chair, finalPrice, date, time, typeOfFunction, language, voucher, idUser } = req.body;

    // Obtén la hora actual en la zona horaria deseada
    const purchaseDate = moment().tz('America/New_York').format('YYYY-MM-DD HH:mm:ss');

    const chairString = JSON.stringify(chair);

    const insertQuery = 'INSERT INTO ticket (nameFilm, chair, finalPrice, date, time, typeOfFunction, language, voucher, purchaseDate, idUser) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [nameFilm, chairString, finalPrice, date, time, typeOfFunction, language, voucher, purchaseDate, idUser];

    db.query(insertQuery, values, (err, result) => {
        if (err) {
            console.error("Error al registrar ticket:", err);
            res.status(500).send("Error al registrar ticket");
        } else {
            console.log("¡Ticket registrado con éxito esta en estado en pendiente!", {idUser}, {nameFilm});
            res.send("¡Ticket registrado con éxito!");
        }
    });
});


// Leer todos los tickets
router.get("/allTicket", (req, res) => {
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
router.get("/ticketUser/:idUser", (req, res) => {
    const idUser = req.params.idUser;
    db.query('SELECT * FROM ticket WHERE idUser = ? AND status = ?', [idUser, 'paid'], (err, result) => {
        if (err) {
            console.error("Error al obtener tickets del usuario:", err);
            res.status(500).send("Error al obtener datos del usuario");
        } else if (result.length === 0) {
            console.log("No se encontraron tickets pagos para este usuario", {idUser})
            res.status(404).send("No se encontraron tickets pagos para este usuario");
        } else {
            res.send(result);
        }
    });
});

// Actualizar el estado del ticket
router.post("/updateTicketStatus", (req, res) => {
    const { preference_id, status, nameFilm } = req.body;

    if (status !== 'paid' && status !== 'pending') {
        return res.status(400).send("Estado no válido.");
    }

    const updateQuery = 'UPDATE ticket SET status = ? WHERE voucher = ?';
    db.query(updateQuery, [status, preference_id,nameFilm], (err, result) => {
        if (err) {
            console.error("Error al actualizar el estado del ticket:", err);
            res.status(500).send("Error al actualizar el estado del ticket.");
        } else {
            console.log("El ticket fue pagado con Exito.",{status});
            res.send("Estado del ticket actualizado con éxito.");
        }
    });
});

module.exports = router;
