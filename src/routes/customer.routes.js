import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { authenticateToken } from '../jwt/middleware.js';

const router = express.Router();
const prisma = new PrismaClient();

// Configuración de JWT
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION;

// Función para calcular la edad
const calculateAge = (birthdate) => {
    const birthDate = new Date(birthdate);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
};

// Registro de usuario
router.post("/create", async (req, res) => {
    const { mail, name, surname, dni, date, password, tips = 'cliente' } = req.body;
    const dniInt = parseInt(dni, 10);
    if (isNaN(dniInt)) {
        return res.status(400).send("El DNI debe ser un número válido");
    }
    if (typeof date !== 'string') {
        return res.status(400).send("La fecha debe ser una cadena en formato válido");
    }
    const age = calculateAge(date);
    if (!password) {
        return res.status(400).send("La contraseña es obligatoria");
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.customer.create({
            data: {
                mail,
                name,
                surname,
                dni: dniInt, 
                date, 
                age,
                password: hashedPassword,
                tips
            }
        });
        console.log("¡Cliente registrado con ÉXITO!", { name }, { surname });
        res.send("¡Cliente registrado con ÉXITO!");
    } catch (error) {
        console.error("Error al registrar cliente:", error);
        res.status(500).send("Error al registrar cliente");
    }
});

// Leer todos los usuarios con paginación
router.get("/allCustomer", authenticateToken, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;
    try {
        const total = await prisma.customer.count();
        const totalPages = Math.ceil(total / limit);
        const users = await prisma.customer.findMany({
            skip: offset,
            take: limit
        });
        res.send({
            total,
            totalPages,
            page,
            users
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error al obtener datos");
    }
});

// Actualizar usuario
router.put("/update", authenticateToken, async (req, res) => {
    const { idUser, mail, name, surname, dni, date, tips } = req.body;
    const dniInt = parseInt(dni, 10);
    if (isNaN(dniInt)) {
        return res.status(400).send("DNI debe ser un número entero");
    }
    let formattedDate;
    try {
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            throw new Error("Fecha inválida");
        }
        formattedDate = parsedDate.toISOString().split('T')[0];
    } catch (error) {
        return res.status(400).send("Fecha inválida");
    }
    const age = calculateAge(formattedDate);
    try {
        const user = await prisma.customer.update({
            where: { idUser: Number(idUser) },
            data: {
                mail,
                name,
                surname,
                dni: dniInt,
                date: formattedDate,
                age,
                tips
            }
        });
        console.log("¡Cliente actualizado con ÉXITO!", { name }, { surname });
        res.send("¡Cliente actualizado con ÉXITO!");
    } catch (error) {
        console.error("Error al actualizar cliente:", error);
        res.status(500).send("Error al actualizar cliente");
    }
});


// Actualizar contraseña del usuario
router.put('/changePassword/:idUser', authenticateToken, async (req, res) => {
    const { idUser } = req.params;
    const { newPassword } = req.body;
    try {
        const newHashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.customer.update({
            where: { idUser: parseInt(idUser) },
            data: { password: newHashedPassword }
        });
        res.send("Contraseña actualizada con éxito");
    } catch (err) {
        console.error("Error al actualizar la contraseña:", err);
        res.status(500).send("Error en el servidor");
    }
});

// Eliminar usuario
router.delete("/delete/:idUser", authenticateToken, async (req, res) => {
    const { idUser } = req.params;
    try {
        await prisma.customer.delete({ where: { idUser: parseInt(idUser) } });
        console.log("Cliente eliminado con éxito", { idUser });
        res.send({ success: true, message: "Cliente eliminado con éxito" });
    } catch (err) {
        console.log(err);
        res.status(500).send({ success: false, message: "Error al eliminar cliente" });
    }
});

// Leer un usuario por ID recordar usar aca authenticateToken
router.get("/allCustomer/:idUser",authenticateToken, async (req, res) => {
    const { idUser } = req.params;
    if (!idUser || isNaN(parseInt(idUser))) {
        return res.status(400).send("ID de usuario inválido");
    }
    try {
        const user = await prisma.customer.findUnique({ where: { idUser: parseInt(idUser) } });
        if (!user) {
            return res.status(404).send("Cliente no encontrado");
        }
        res.send(user);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error al obtener datos del cliente");
    }
});

// Inicio de sesión
router.post("/login", async (req, res) => {
    const { mailOrDni, password } = req.body;
    try {
        const mailOrDniInt = parseInt(mailOrDni, 10);
        const user = await prisma.customer.findFirst({
            where: {
                OR: [
                    { mail: mailOrDni },
                    { dni: Number.isNaN(mailOrDniInt) ? undefined : mailOrDniInt }
                ]
            }
        });
        if (!user) {
            return res.status(400).send("Correo o DNI incorrectos");
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).send("Correo o DNI incorrectos");
        }
        const token = jwt.sign({
            id: user.idUser,
            mail: user.mail,
            dni: user.dni,
            name: user.name,
            tips: user.tips
        }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
        res.send({
            success: true,
            token,
            user: {
                id: user.idUser,
                name: user.name,
                email: user.mail,
                dni: user.dni,
                tips: user.tips
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error en el servidor");
    }
});

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Ruta para solicitar recuperación de contraseña
router.post('/recover-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await prisma.customer.findUnique({ where: { mail: email } });
        if (!user) {
            return res.status(400).send({ message: 'Usuario no encontrado' });
        }
        const token = jwt.sign({ id: user.idUser, email: user.mail }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
        // cambiar link y que quede asi ${FRONTEND_URL}/reset-password/${token}
        const link = `http://localhost:3000/reset-password/${token}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Recuperación de Contraseña',
            text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${link}`
        };
        await transporter.sendMail(mailOptions);
        res.send({ message: 'Correo de recuperación enviado con éxito' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error al enviar el correo' });
    }
});

// Ruta para restablecer la contraseña
router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.customer.update({
            where: { idUser: decoded.id },
            data: { password: hashedPassword }
        });
        res.send({ message: 'Contraseña restablecida con éxito' });
    } catch (error) {
        console.error(error);
        res.status(400).send({ message: 'Enlace de restablecimiento inválido o expirado' });
    }
});

// Ruta para obtener información del usuario autenticado
router.get('/tokenUser', authenticateToken, (req, res) => {
    res.send(req.user);
});

export default router;
