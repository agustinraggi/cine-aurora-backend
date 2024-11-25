import express from "express";
import { authenticateToken } from '../jwt/middleware.js';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();


// Leer todas las películas
router.get("/allFilmSoon", async (req, res) => {
    try {
        const films = await prisma.soonFilm.findMany();
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
router.post("/createSoonFilm", authenticateToken, async (req, res) => {
    const { codeFilm, nameFilm } = req.body;
    try {
        await prisma.soonFilm.create({
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
router.delete("/deleteSoonFilm/:idSoonFilm", authenticateToken, async (req, res) => {
    const idSoonFilm = parseInt(req.params.idSoonFilm);
    try {
        await prisma.soonFilm.delete({
            where: { idSoonFilm }
        });
        console.log("¡Película eliminada con ÉXITO!", { idSoonFilm });
        res.send("¡Película eliminada con ÉXITO!");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al eliminar película");
    }
});

// busqueda de peliculas cuando se agrega se empieza a buscar a partir de escribir 3 letras
router.get("/search/movie", async (req, res) => {
    const { query } = req.query;
    const apiKey = process.env.TMDB_API_KEY;
    if (query && query.length >= 3) {
        try {
            const { data } = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
                params: {
                    api_key: apiKey,
                    query: query,
                    language: "es-MX"
                }
            });
            const searchResults = data.results.map(movie => ({
                id: movie.id,
                nameFilm: movie.title,
                posterPath: movie.poster_path
            }));
            res.send(searchResults);
        } catch (error) {
            console.error("Error fetching movie data:", error);
            res.status(500).send("Error fetching movie data");
        }
    } else {
        res.status(400).send("El término de búsqueda debe tener al menos 3 caracteres.");
    }
});

// Ruta para obtener información del usuario autenticado
router.get('/tokenUser', authenticateToken, (req, res) => {
    res.send(req.user);
});

export default router;