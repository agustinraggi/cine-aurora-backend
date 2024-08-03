const express = require("express");
const { MercadoPagoConfig, Preference } = require("mercadopago");
const router = express.Router();

// Configuración de Mercado Pago
const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN,
});

// Ruta para crear una preferencia
router.post("/create_preference", async (req, res) => {
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

module.exports = router;
