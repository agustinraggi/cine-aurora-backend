const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const { MercadoPagoConfig, Preference } = require("mercadopago");

const userRoutes = require("./user/createUser");
const initDatabaseUser = require("./user/init-bd-user");

const filmRoutes = require("./film/createFilm");
const initDatabaseFilm = require("./film/init-bd-film");

const ticketRoutes = require("./ticket/createTicket")
const initDatabaseTicket = require("./ticket/init-bd-ticket");

const app = express();

app.use(cors());
app.use(express.json());

// Configuración de Mercado Pago
const client = new MercadoPagoConfig({
    accessToken: "APP_USR-8112502912330115-071119-32c5f0d15c4eee6274f9e0a5181b8c07-1896819568",
});

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
        initDatabaseTicket();

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
            app.use(ticketRoutes);

            
            app.post("/create_preference", async (req, res) => {
                try {
                    const body = {
                        items: [
                            {
                                title: req.body.title,
                                quantity: Number(req.body.quantity),
                                unit_price: Number(req.body.price),
                                currency_id: "ARS",
                            },
                        ],
                        payer: {
                            name: req.body.name,
                            surname: req.body.surname,
                            email: req.body.email,
                            phone: {
                                area_code: req.body.area_code,
                                number: req.body.phone_number,
                            },
                            identification: {
                                type: req.body.identification_type,
                                number: req.body.identification_number,
                            },
                            address: {
                                street_name: req.body.street_name,
                                street_number: req.body.street_number,
                                zip_code: req.body.zip_code,
                            },
                        },
                        back_urls: {
                            success: "http://localhost:3000/",
                            failure: "http://localhost:3000/",
                            pending: "http://localhost:3000/",
                        },
                        auto_return: "approved",
                    };
            
                    const preference = new Preference(client);
                    const result = await preference.create({ body });
                    res.json({
                        id: result.id,
                    });
                } catch (error) {
                    console.error("Error al crear la preferencia en Mercado Pago:", error);
                    res.status(500).json({
                        error: "Error al crear la preferencia en Mercado Pago :(",
                    });
                }
            });

            const PORT = process.env.PORT || 3001;
            app.listen(PORT, () => {
                console.log(`Servidor corriendo en el puerto ${PORT}`);
            });
        });
    });
});
