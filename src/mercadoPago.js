// En mercadoPago.js
import express from "express";
import { MercadoPagoConfig, Preference } from "mercadopago";

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
            back_urls: {
                success: "http://localhost:3000/userActive",
                failure: "http://localhost:3000/userActive",
                pending: "http://localhost:3000/userActive",
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

export default router;
