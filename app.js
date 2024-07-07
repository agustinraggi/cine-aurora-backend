const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const userRoutes = require("./user/createUser");
const initDatabaseUser = require("./user/init-bd-user");
const filmRoutes = require("./film/createFilm");
const initDatabaseFilm = require("./film/init-bd-film");

const app = express();

app.use(cors());
app.use(express.json());

// Conexión principal a MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: ""
});

// Conectar a MySQL
db.connect((err) => {
    if (err) {
        console.error("Error al conectar a MySQL:", err);
        return;
    }
    console.log("Conectado a MySQL");

    // Crear la base de datos cine-aurora si no existe
    db.query("CREATE DATABASE IF NOT EXISTS `cine-aurora`", (err, result) => {
        if (err) {
            console.error("Error al crear la base de datos cine-aurora:", err);
            db.end();
            return;
        }
        console.log("Base de datos cine-aurora creada o ya existía.");

        initDatabaseUser();
        initDatabaseFilm();

        const dbCineAurora = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "cine-aurora"
        });

        dbCineAurora.connect((err) => {
            if (err) {
                console.error("Error al conectar a la base de datos cine-aurora:", err);
                db.end(); 
                return;
            }
            console.log("Conectado a la base de datos cine-aurora");
            app.use(userRoutes);
            app.use(filmRoutes);

            const PORT = process.env.PORT || 3001;
            app.listen(PORT, () => {
                console.log(`Servidor corriendo en el puerto ${PORT}`);
            });
        });
    });
});
