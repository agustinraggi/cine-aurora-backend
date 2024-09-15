<<<<<<< Updated upstream
// const express = require("express");
// const router = express.Router();
// const mysql = require("mysql");
// const { authenticateToken } = require('../middleware');

// // Conexión a la base de datos cine-aurora
// // const db = mysql.createConnection({
// //     host: process.env.DB_HOST,
// //     user: process.env.DB_USER,
// //     password: process.env.DB_PASSWORD,
// //     database: process.env.DB_NAME
// // });

// db.connect((err) => {
//     if (err) {
//         console.error(err);
//         return;
//     }
// });

// // Registro de funcion
// router.post("/createMovieTheater", authenticateToken, (req, res) => {
//     const {nameFilm, codeFilm, date, time, typeOfFunction, language, price } = req.body;
//     db.query('INSERT INTO movieTheater (nameFilm, codeFilm, date, time, typeOfFunction, language, price) VALUES (?, ?, ?, ?, ?, ?, ?)', 
//         [nameFilm, codeFilm, date, time, typeOfFunction, language, price ],
//         (err, result) => {
//             if (err) {
//                 console.log(err);
//                 res.status(500).send("Error al registrar funcion");
//             } else {
//                 console.log("¡Funcion Registrada con Exito!",{nameFilm},{date},{time})
//                 res.send("¡Funcion Registrada con Exito!");
//             }
//         }
//     );
// });

// // Obtener funciones por código de película
// router.get("/movieFunctions/:codeFilm", authenticateToken, (req, res) => {
//     const codeFilm = req.params.codeFilm;
//     db.query("SELECT date, time, typeOfFunction, language FROM movieTheater WHERE codeFilm = ?", [codeFilm], (err, results) => {
//         if (err) {
//             console.log(err);
//             res.status(500).send("Error al obtener las funciones de la película");
//         } else {
//             res.json(results);
//         }
//     });
// });
// // Obtener precio según parámetros
// router.get("/getPrice", authenticateToken, (req, res) => {
//     const { codeFilm, date, time, typeOfFunction, language } = req.query;

//     const query = `
//         SELECT price 
//         FROM movieTheater 
//         WHERE codeFilm = ? AND date = ? AND time = ? AND typeOfFunction = ? AND language = ?
//     `;

//     db.query(query, [codeFilm, date, time, typeOfFunction, language], (err, results) => {
//         if (err) {
//             console.log(err);
//             res.status(500).send("Error al obtener el precio");
//         } else {
//             if (results.length > 0) {
//                 res.json({ price: results[0].price });
//             } else {
//                 res.status(404).send("Precio no encontrado");
//             }
//         }
//     });
// });

// // Eliminar funcion por ID
// router.delete("/deleteMovieTheater/:idMovieTheater", authenticateToken, (req, res) => {
//     const idMovieTheater = req.params.idMovieTheater;
//     db.query("DELETE FROM movieTheater WHERE idMovieTheater = ?", [idMovieTheater], (err, result) => {
//         if (err) {
//             console.log(err);
//             res.status(500).send("Error al eliminar Funcion");
//         } else {
//             console.log("Funcion eliminada con ÉXITO!",{idMovieTheater})
//             res.send("¡Funcion eliminada con ÉXITO!");
//         }
//     });
// });
=======
const express = require("express");
const router = express.Router();
const { authenticateToken } = require('../middleware');
const { getRepository } = require("typeorm");
const { MovieTheater } = require("../entity/movie_theater/MovieTheater");

// Registro de función
router.post("/createMovieTheater", authenticateToken, async (req, res) => {
    const { nameFilm, codeFilm, date, time, typeOfFunction, language, price } = req.body;
    try {
        const movieTheaterRepository = getRepository(MovieTheater);
        const movieTheater = new MovieTheater();
        movieTheater.nameFilm = nameFilm;
        movieTheater.codeFilm = codeFilm;
        movieTheater.date = date;
        movieTheater.time = time;
        movieTheater.typeOfFunction = typeOfFunction;
        movieTheater.language = language;
        movieTheater.price = price;

        await movieTheaterRepository.save(movieTheater);
        console.log("¡Función Registrada con Éxito!", { nameFilm }, { date }, { time });
        res.send("¡Función Registrada con Éxito!");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al registrar función");
    }
});

// Obtener funciones por código de película
router.get("/movieFunctions/:codeFilm", authenticateToken, async (req, res) => {
    const codeFilm = req.params.codeFilm;
    try {
        const movieTheaterRepository = getRepository(MovieTheater);
        const functions = await movieTheaterRepository.find({ where: { codeFilm }, select: ["date", "time", "typeOfFunction", "language"] });
        res.json(functions);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener las funciones de la película");
    }
});

// Obtener precio según parámetros
router.get("/getPrice", authenticateToken, async (req, res) => {
    const { codeFilm, date, time, typeOfFunction, language } = req.query;

    try {
        const movieTheaterRepository = getRepository(MovieTheater);
        const price = await movieTheaterRepository.findOne({ 
            where: { 
                codeFilm, 
                date, 
                time, 
                typeOfFunction, 
                language 
            }, 
            select: ["price"] 
        });
        if (price) {
            res.json({ price: price.price });
        } else {
            res.status(404).send("Precio no encontrado");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener el precio");
    }
});

// Eliminar función por ID
router.delete("/deleteMovieTheater/:idMovieTheater", authenticateToken, async (req, res) => {
    const idMovieTheater = parseInt(req.params.idMovieTheater);
    try {
        const movieTheaterRepository = getRepository(MovieTheater);
        const result = await movieTheaterRepository.delete(idMovieTheater);
        if (result.affected === 0) {
            res.status(404).send("Función no encontrada");
        } else {
            console.log("¡Función eliminada con Éxito!", { idMovieTheater });
            res.send("¡Función eliminada con Éxito!");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al eliminar función");
    }
});
>>>>>>> Stashed changes

// // Ruta para obtener información del usuario autenticado
// router.get('/tokenUser', authenticateToken, (req, res) => {
//     res.send(req.user);
// });

// module.exports = router;
