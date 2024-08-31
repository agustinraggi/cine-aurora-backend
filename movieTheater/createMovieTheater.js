const express = require("express");
const router = express.Router();
const mysql = require("mysql");

// Conexión a la base de datos cine-aurora
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error(err);
        return;
    }
});

// Registro de funcion
router.post("/createMovieTheater", (req, res) => {
    const {nameFilm, codeFilm, date, time, typeOfFunction, language, price } = req.body;
    db.query('INSERT INTO movieTheater (nameFilm, codeFilm, date, time, typeOfFunction, language, price) VALUES (?, ?, ?, ?, ?, ?, ?)', 
        [nameFilm, codeFilm, date, time, typeOfFunction, language, price ],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Error al registrar funcion");
            } else {
                console.log("¡Funcion Registrada con Exito!",{nameFilm},{date},{time})
                res.send("¡Funcion Registrada con Exito!");
            }
        }
    );
});

// Obtener funciones por código de película
router.get("/movieFunctions/:codeFilm", (req, res) => {
    const codeFilm = req.params.codeFilm;
    db.query("SELECT date, time, typeOfFunction, language FROM movieTheater WHERE codeFilm = ?", [codeFilm], (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error al obtener las funciones de la película");
        } else {
            res.json(results);
        }
    });
});
// Obtener precio según parámetros
router.get("/getPrice", (req, res) => {
    const { codeFilm, date, time, typeOfFunction, language } = req.query;

    const query = `
        SELECT price 
        FROM movieTheater 
        WHERE codeFilm = ? AND date = ? AND time = ? AND typeOfFunction = ? AND language = ?
    `;

    db.query(query, [codeFilm, date, time, typeOfFunction, language], (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error al obtener el precio");
        } else {
            if (results.length > 0) {
                res.json({ price: results[0].price });
            } else {
                res.status(404).send("Precio no encontrado");
            }
        }
    });
});

// Eliminar funcion por ID
router.delete("/deleteMovieTheater/:idMovieTheater", (req, res) => {
    const idMovieTheater = req.params.idMovieTheater;
    db.query("DELETE FROM movieTheater WHERE idMovieTheater = ?", [idMovieTheater], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error al eliminar Funcion");
        } else {
            console.log("Funcion eliminada con ÉXITO!",{idMovieTheater})
            res.send("¡Funcion eliminada con ÉXITO!");
        }
    });
});

module.exports = router;
