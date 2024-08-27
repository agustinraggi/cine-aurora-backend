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
    const {nameFilm, codeFilm, date, time, typeOfFunction, language } = req.body;
    db.query('INSERT INTO movieTheater (nameFilm, codeFilm, date, time, typeOfFunction, language) VALUES (?, ?, ?, ?, ?, ?)', 
        [nameFilm, codeFilm, date, time, typeOfFunction, language ],
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

// Leer todas las funciones
router.get("/allMovieTheater", (req, res) => {
    db.query("SELECT * FROM movieTheater", (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error al obtener datos");
        } else {
            res.send(result);
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
