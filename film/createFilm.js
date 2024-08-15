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
        console.error(err);
        return;
    }
});

// Registro de película
router.post("/createFilm", (req, res) => {
    const { codeFilm, nameFilm } = req.body;
    db.query('INSERT INTO film (codeFilm, nameFilm) VALUES (?, ?)', 
        [codeFilm, nameFilm],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Error al registrar película");
            } else {
                console.log("¡Película registrada con ÉXITO!",{codeFilm},{nameFilm})
                res.send("¡Película registrada con ÉXITO!");
            }
        }
    );
});

// Leer todas las películas
router.get("/allFilm", (req, res) => {
    db.query("SELECT * FROM film", (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error al obtener datos");
        } else {
            res.send(result);
        }
    });
});

// Eliminar película por ID
router.delete("/deleteFilm/:idFilm", (req, res) => {
    const idFilm = req.params.idFilm;
    db.query("DELETE FROM film WHERE idFilm = ?", [idFilm], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error al eliminar película");
        } else {
            console.log("¡Película eliminada con ÉXITO!",{idFilm})
            res.send("¡Película eliminada con ÉXITO!");
        }
    });
});

module.exports = router;
