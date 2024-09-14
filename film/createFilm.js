const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const { authenticateToken } = require('../middleware');
const axios = require('axios');

// Conexión a la base de datos cine-aurora
// const db = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
// });

db.connect((err) => {
    if (err) {
        console.error(err);
        return;
    }
});

// Leer todas las películas
router.get("/allFilm", async (req, res) => {
    try {
        db.query("SELECT * FROM film", async (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Error al obtener datos");
            } else {
                const apiKey = process.env.TMDB_API_KEY;
                const moviePosters = await Promise.all(
                    result.map(async (dbMovie) => {
                        try {
                            const movieResponse = await axios.get(`https://api.themoviedb.org/3/movie/${dbMovie.codeFilm}`, {
                                params: {
                                    api_key: apiKey,
                                    language: "es-MX"
                                }
                            });
                            const movieData = movieResponse.data;
                            return {
                                ...dbMovie,
                                posterPath: movieData.poster_path,
                                id: movieData.id,
                                nameFilm: movieData.title 
                            };
                        } catch (error) {
                            console.error("Error fetching movie data:", error);
                            return {
                                ...dbMovie,
                                posterPath: null,
                                id: null,
                                nameFilm: dbMovie.nameFilm
                            };
                        }
                    })
                );
                res.send(moviePosters.filter(movie => movie.posterPath !== null));
            }
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("Error fetching data");
    }
});

// Registro de película
router.post("/createFilm", authenticateToken, (req, res) => {
    const { codeFilm, nameFilm } = req.body;
    db.query('INSERT INTO film (codeFilm, nameFilm) VALUES (?, ?)', 
        [codeFilm, nameFilm],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Error al registrar película");
            } else {
                console.log("¡Película registrada con ÉXITO!", {codeFilm}, {nameFilm});
                res.send("¡Película registrada con ÉXITO!");
            }
        }
    );
});

// Eliminar película por ID
router.delete("/deleteFilm/:idFilm", authenticateToken, (req, res) => {
    const idFilm = req.params.idFilm;
    db.query("DELETE FROM film WHERE idFilm = ?", [idFilm], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error al eliminar película");
        } else {
            console.log("¡Película eliminada con ÉXITO!", {idFilm});
            res.send("¡Película eliminada con ÉXITO!");
        }
    });
});

// Obtener detalles de la película desde TMDB
router.get("/movie/:codeFilm", async (req, res) => {
    const { codeFilm } = req.params;
    const apiKey = process.env.TMDB_API_KEY;

    try {
        // Realizar la llamada a TMDB desde el backend
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${codeFilm}?api_key=${apiKey}&language=es-MX`);
        res.send(response.data);
    } catch (error) {
        console.error("Error al obtener datos de la película:", error);
        res.status(500).send("Error al obtener datos de la película");
    }
});

// Obtener funciones de películas
router.get("/film/:codeFilm", authenticateToken, async (req, res) => {
    const { codeFilm } = req.params;

    try {
        db.query("SELECT * FROM movieFunctions WHERE codeFilm = ?", [codeFilm], (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Error al obtener funciones de la película");
            } else {
                res.send(result);
            }
        });
    } catch (error) {
        console.error("Error fetching movie functions:", error);
        res.status(500).send("Error fetching movie functions");
    }
});

// Obtener videos de la película desde TMDB
router.get("/movie/videos/:codeFilm", async (req, res) => {
    const { codeFilm } = req.params;
    const apiKey = process.env.TMDB_API_KEY;

    try {
        // Realizar la llamada a TMDB desde el backend
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${codeFilm}/videos?api_key=${apiKey}&language=es-MX`);
        res.send(response.data);
    } catch (error) {
        console.error("Error al obtener videos de la película:", error);
        res.status(500).send("Error al obtener videos de la película");
    }
});


// Ruta para obtener información del usuario autenticado
router.get('/tokenUser', authenticateToken, (req, res) => {
    res.send(req.user);
});


module.exports = router;
