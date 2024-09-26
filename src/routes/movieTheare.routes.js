import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../jwt/middleware.js';


const router = express.Router();
const prisma = new PrismaClient();

// Registro de función
router.post("/createMovieTheater", authenticateToken, async (req, res) => {
    const { nameFilm, codeFilm, date, time, typeOfFunction, language, price } = req.body;
    
    // Validación de la fecha
    const formattedDate = date.split('T')[0];
    if (!formattedDate) {
        return res.status(400).send("Fecha inválida");
    }

    try {
        await prisma.movieTheater.create({
            data: {
                nameFilm,
                codeFilm: parseInt(codeFilm),
                date: formattedDate,
                time,
                typeOfFunction,
                language,
                price: parseFloat(price)
            }
        });
        console.log("¡Función Registrada con Éxito!", { nameFilm }, { date: formattedDate }, { time });
        res.send("¡Función Registrada con Éxito!");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al registrar función");
    }
});

// Obtener funciones por código de película
router.get("/movieFunctions/:codeFilm", authenticateToken, async (req, res) => {
    const codeFilm = parseInt(req.params.codeFilm);
    try {
        const results = await prisma.movieTheater.findMany({
            where: { codeFilm },
            select: {
                date: true,
                time: true,
                typeOfFunction: true,
                language: true
            }
        });
        res.json(results);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al obtener las funciones de la película");
    }
});

// Obtener precio según parámetros
router.get("/getPrice", authenticateToken, async (req, res) => {
    const { codeFilm, date, time, typeOfFunction, language } = req.query;
    const formattedDate = date.split('T')[0]; 
    try {
        const result = await prisma.movieTheater.findFirst({
            where: {
                codeFilm: parseInt(codeFilm),
                date: formattedDate,
                time,
                typeOfFunction,
                language
            },
            select: {
                idMovieTheater: true,
                price: true
            }
        });
        if (result) {
            res.json({ id: result.idMovieTheater, price: result.price });
        } else {
            res.status(404).send("Precio no encontrado");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al obtener el precio");
    }
});

// Obtener todas las funciones de películas
router.get("/allMovieTheater", authenticateToken, async (req, res) => {
    try {
        const results = await prisma.movieTheater.findMany();
        res.json(results);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al obtener las funciones de películas");
    }
});

// Eliminar función por ID
router.delete("/deleteMovieTheater/:idMovieTheater", authenticateToken, async (req, res) => {
    const idMovieTheater = parseInt(req.params.idMovieTheater);
    try {
        await prisma.movieTheater.delete({
            where: { idMovieTheater }
        });
        console.log("Función eliminada con Éxito!", { idMovieTheater });
        res.send("¡Función eliminada con Éxito!");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al eliminar función");
    }
});

// Ruta para obtener información del usuario autenticado
router.get('/tokenUser', authenticateToken, (req, res) => {
    res.send(req.user);
});

export default router;
