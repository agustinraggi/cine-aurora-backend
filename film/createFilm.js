const express = require("express");
const { authenticateToken } = require('../middleware');
const axios = require('axios');
const { getRepository } = require("typeorm");
const Film = require("../entity/film/film");

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
        console.error(err);
        return;
    }
});
=======
const router = express.Router();
>>>>>>> Stashed changes

// Leer todas las películas
router.get("/allFilm", async (req, res) => {
    try {
        const filmRepository = getRepository(Film);
        const films = await filmRepository.find();

        const apiKey = process.env.TMDB_API_KEY;
        const moviePosters = await Promise.all(
            films.map(async (dbMovie) => {
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
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("Error fetching data");
    }
});

// Registro de película
router.post("/createFilm", authenticateToken, async (req, res) => {
    const { codeFilm, nameFilm } = req.body;
    try {
        const filmRepository = getRepository(Film);
        const newFilm = filmRepository.create({ codeFilm, nameFilm });
        await filmRepository.save(newFilm);
        res.send("¡Película registrada con ÉXITO!");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al registrar película");
    }
});

// Eliminar película por ID
router.delete("/deleteFilm/:idFilm", authenticateToken, async (req, res) => {
    const idFilm = parseInt(req.params.idFilm);
    try {
        const filmRepository = getRepository(Film);
        await filmRepository.delete(idFilm);
        res.send("¡Película eliminada con ÉXITO!");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al eliminar película");
    }
});

// Obtener detalles de la película desde TMDB
router.get("/movie/:codeFilm", async (req, res) => {
    const { codeFilm } = req.params;
    const apiKey = process.env.TMDB_API_KEY;

    try {
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
        const filmRepository = getRepository(Film);
        const filmFunctions = await filmRepository.query("SELECT * FROM movieFunctions WHERE codeFilm = ?", [codeFilm]);
        res.send(filmFunctions);
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
