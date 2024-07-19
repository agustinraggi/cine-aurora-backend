const express = require("express");
const router = express.Router();
const mysql = require("mysql");

// Conexión a la base de datos cine-aurora
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "cine-aurora"
});

db.connect((err) => {
    if (err) {
        console.error("Error al conectar a la base de datos cine-aurora:", err);
        return;
    }
});

// Registro de ticket
router.post("/createTicket", (req, res) => {
    const { nameFilm, chair, finalPrice, voucher, idUser } = req.body;
    const purchaseDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const chairString = JSON.stringify(chair);

    const insertQuery = 'INSERT INTO ticket (nameFilm, chair, finalPrice, voucher, purchaseDate, idUser) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [nameFilm, chairString, finalPrice, voucher, purchaseDate, idUser];

    db.query(insertQuery, values, (err, result) => {
        if (err) {
            console.error("Error al registrar ticket:", err);
            res.status(500).send("Error al registrar ticket");
        } else {
            console.log("¡Ticket registrado con éxito!");
            res.send("¡Ticket registrado con éxito!");
        }
    });
});

// Leer todas los tickets
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
    db.query('SELECT * FROM ticket WHERE idUser = ?', [idUser], (err, result) => {
        if (err) {
            console.error("Error al obtener tickets del usuario:", err);
            res.status(500).send("Error al obtener datos del usuario");
        } else if (result.length === 0) {
            res.status(404).send("No se encontraron tickets para este usuario");
        } else {
            res.send(result);
        }
    });
});

module.exports = router;

module.exports = router;
