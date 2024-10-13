import express from "express";
import cors from 'cors';

import customerRoutes from "./routes/customer.routes.js";
import filmRoutes from "./routes/film.routes.js";
import soonFilmRouter from "./routes/soonFilm.routes.js"
import movieTheaterRoutes from "./routes/movieTheare.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";
import seatsRoutes from "./routes/seats.routes.js"
import mercadoPagoRoutes from "./mercadoPago.js"

// crear usuario admin
import {createAdmin}  from "../src/createUser/createAdmin.js"


const app = express();

// Configuración de CORS
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use(customerRoutes);
app.use(filmRoutes);
app.use(soonFilmRouter);
app.use(movieTheaterRoutes);
app.use(ticketRoutes);
app.use(seatsRoutes);
app.use(mercadoPagoRoutes);

const startServer = async () => {
    try {
        // Inicializar la base de datos
        await createAdmin();
        // Iniciar el servidor después de la inicialización de la base de datos
        app.listen(process.env.PORT_BACK_URL, () => {
            console.log("Server on port", process.env.PORT_BACK_URL);
        });
    } catch (error) {
        console.error("Error al iniciar el servidor:", error);
        process.exit(1);
    }
};

startServer();
