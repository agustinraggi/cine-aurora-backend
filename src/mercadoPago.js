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
        const { title, quantity, price } = req.body;
        if (!title || !quantity || !price) {
            return res.status(400).json({
                error: "Faltan datos necesarios para crear la preferencia.",
            });
        }

        const body = {
            items: [
                {
                    title: title,
                    quantity: Number(quantity),
                    unit_price: Number(price),
                    currency_id: "ARS",
                },
            ],
            back_urls: {
                success: "http://localhost:3000/userActive?status=approved",
                failure: "http://localhost:3000/userActive?status=failed",
                pending: "http://localhost:3000/userActive?status=pending",
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
