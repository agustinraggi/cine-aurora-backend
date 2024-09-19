import express from "express";
import { authenticateToken } from '../jwt/middleware.js';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// Leer todas las películas
router.get("/allFilm", async (req, res) => {
    try {
        const films = await prisma.film.findMany();
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
        await prisma.film.create({
            data: {
                codeFilm,
                nameFilm
            }
        });
        console.log("¡Película registrada con ÉXITO!", { codeFilm }, { nameFilm });
        res.send("¡Película registrada con ÉXITO!");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al registrar película");
    }
});

// Eliminar película por ID
router.delete("/deleteFilm/:idFilm", authenticateToken, async (req, res) => {
    const idFilm = parseInt(req.params.idFilm);
    try {
        await prisma.film.delete({
            where: { idFilm }
        });
        console.log("¡Película eliminada con ÉXITO!", { idFilm });
        res.send("¡Película eliminada con ÉXITO!");
    } catch (error) {
        console.log(error);
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
        const movieFunctions = await prisma.movieFunction.findMany({
            where: { codeFilm }
        });
        res.send(movieFunctions);
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

export default router;