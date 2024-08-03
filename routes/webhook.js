// const express = require("express");
// const mysql = require("mysql");
// const router = express.Router();

// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "cine-aurora"
// });

// db.connect((err) => {
//     if (err) {
//         console.error("Error al conectar a la base de datos cine-aurora:", err);
//         return;
//     }
//     console.log("Conectado a la base de datos cine-aurora");
// });

// router.post("/webhook", (req, res) => {
//     const payment = req.body;

//     if (payment.status === "approved") {
//         const { id, status, payment_type, transaction_amount, description } = payment;
//         registerTicket(id, status, payment_type, transaction_amount, description);
//     }

//     res.status(200).send("Notification received");
// });

// function registerTicket(paymentId, status, paymentType, amount, description) {
//     const insertQuery = 'INSERT INTO ticket (voucher, status, finalPrice, description) VALUES (?, ?, ?, ?)';
//     const values = [paymentId, status, amount, description];

//     db.query(insertQuery, values, (err, result) => {
//         if (err) {
//             console.error("Error al registrar el ticket:", err);
//         } else {
//             console.log("¡Ticket registrado con éxito!");
//         }
//     });
// }

// module.exports = router;
