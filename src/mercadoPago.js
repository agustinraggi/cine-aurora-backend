import express from "express";
import { MercadoPagoConfig, Preference } from "mercadopago";

const router = express.Router();

// Configuración de Mercado Pago
const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN,
});

router.post("/create_preference", async (req, res) => {
    try {
        const { title, quantity, price, idUser } = req.body;
        if (!title || !quantity || !price || !idUser) {
            return res.status(400).json({
                error: "Faltan datos necesarios para crear la preferencia.",
            });
        }

        const body = {
            items: [
                {
                    title: title,
                    quantity: 1,
                    unit_price: Number(price),
                    currency_id: "ARS",
                },
            ],
            back_urls: {
                success: `http://localhost:3000/userActive/idUser=${idUser}?status=approved`,
                failure: `http://localhost:3000/userActive/idUser=${idUser}?status=failed`,
                pending: `http://localhost:3000/userActive/idUser=${idUser}?status=pending`,
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
