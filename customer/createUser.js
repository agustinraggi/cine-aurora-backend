import { Customer } from "../models/classes/customer.entity";
import { AppDataSource } from "../../app";

const express = require("express");
const router = express.Router();
<<<<<<< Updated upstream:customer/createUser.js
// const mysql = require("mysql");
=======
>>>>>>> Stashed changes:user/createUser.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { getRepository } = require("typeorm");
const Customer = require("../entity/customer/customer");
const { authenticateToken } = require('../middleware');
const { CustomerController } = require("./controller/customer.controller");
repository = AppDataSource.getRepository(Customer)
// Configuración de JWT
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION;

<<<<<<< Updated upstream:customer/createUser.js
// Conexión a la base de datos cine-aurora
// const db = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
// });

db.connect((err) => {
    if (err) {
        console.error(err);
        return;
    }
});

=======
>>>>>>> Stashed changes:user/createUser.js
// Función para calcular la edad
const calculateAge = (birthdate) => {
    const birthDate = new Date(birthdate);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
};

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

// Registro de usuario
router.post("/create", async (req, res) => {
    const { mail, name, surname, dni, date, password, tips = 'cliente' } = req.body;
    const age = calculateAge(date);
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const customerRepository = getRepository(Customer);
        const newCustomer = customerRepository.create({
            mail,
            name,
            surname,
            dni,
            date,
            age,
            password: hashedPassword,
            tips
        });
        await customerRepository.save(newCustomer);
        res.send("¡Cliente registrado con ÉXITO!");
    } catch (error) {
        console.error("Error al encriptar la contraseña:", error);
        res.status(500).send("Error al registrar cliente");
    }
});

// Leer todos los usuarios con paginación
router.get("/allCustomer", async (req, res) => {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 5; 
    const offset = (page - 1) * limit; 

    const customerRepository = getRepository(Customer);

    try {
        const [customers, total] = await customerRepository.createQueryBuilder("customer")
            .skip(offset)
            .take(limit)
            .getManyAndCount();

        const totalPages = Math.ceil(total / limit);

        res.send({
            total,
            totalPages,
            page,
            users: customers
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al obtener datos");
    }
});

// Actualizar usuario
router.put("/update", authenticateToken, async (req, res) => {
    const { idUser, mail, name, surname, dni, date, password, tips } = req.body;
    const age = calculateAge(date);
    try {
        const customerRepository = getRepository(Customer);
        const customer = await customerRepository.findOne(idUser);

        if (!customer) {
            return res.status(404).send("Cliente no encontrado");
        }

        if (password) {
            customer.password = await bcrypt.hash(password, 10);
        }

        customer.mail = mail;
        customer.name = name;
        customer.surname = surname;
        customer.dni = dni;
        customer.date = date;
        customer.age = age;
        customer.tips = tips;

        await customerRepository.save(customer);
        res.send("¡Cliente actualizado con ÉXITO!");
    } catch (error) {
        console.error("Error al encriptar la contraseña:", error);
        res.status(500).send("Error al actualizar cliente");
    }
});

// Eliminar usuario
router.delete("/delete/:idUser", authenticateToken, async (req, res) => {
    const idUser = req.params.idUser;
    try {
        const customerRepository = getRepository(Customer);
        const result = await customerRepository.delete(idUser);

        if (result.affected === 0) {
            return res.status(404).send("Cliente no encontrado");
        }

        res.send({ success: true, message: "Cliente eliminado con éxito" });
    } catch (err) {
        console.error(err);
        res.status(500).send({ success: false, message: "Error al eliminar cliente" });
    }
});

// Leer un usuario por ID
router.get("/allCustomer/:idUser", authenticateToken, async (req, res) => {
    const idUser = req.params.idUser;
    try {
        const customerRepository = getRepository(Customer);
        const customer = await customerRepository.findOne(idUser);

        if (!customer) {
            return res.status(404).send("Cliente no encontrado");
        }

        res.send(customer);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al obtener datos del cliente");
    }
});

//nuevo
// Leer un usuario por ID

router.get("/:idUser", (req, res) => {
    const idUser = req.params.idUser;
    return this.repository.findOneByOrFail({where: {idUser:id}})
});

// const customerController = new CustomerController();
// router.get('/:idUser', (req, res) => customerController.getById(req, res));

// Inicio de sesión
router.post("/login", async (req, res) => {
    const { mailOrDni, password } = req.body;
    
    try {
        const customerRepository = getRepository(Customer);
        const user = await customerRepository.createQueryBuilder("customer")
            .where("customer.mail = :mailOrDni OR customer.dni = :mailOrDni", { mailOrDni })
            .getOne();

        if (!user) {
            return res.status(400).send("Correo, DNI o contraseña incorrectos");
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).send("Correo, DNI o contraseña incorrectos");
        }

        // Generar un token JWT
        const token = jwt.sign({
            id: user.idUser,
            mail: user.mail,
            dni: user.dni,
            name: user.name,
            tips: user.tips
        }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

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

// Ruta para solicitar recuperación de contraseña
router.post('/recover-password', async (req, res) => {
    const { email } = req.body;
    
    try {
        const customerRepository = getRepository(Customer);
        const user = await customerRepository.findOne({ mail: email });

        if (!user) {
            return res.status(400).send({ message: 'Usuario no encontrado' });
        }

        // Generar token de recuperación de contraseña
        const token = jwt.sign({ id: user.idUser, email: user.mail }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

        // Enlace de recuperación
        const link = `http://localhost:3000/reset-password/${token}`;

        // Enviar correo
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Recuperación de Contraseña',
            text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${link}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).send({ message: 'Error al enviar el correo' });
            }
            res.send({ message: 'Correo de recuperación enviado con éxito' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Error al procesar la solicitud' });
    }
});

// Ruta para restablecer la contraseña
router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        // Verificar token
        const decoded = jwt.verify(token, JWT_SECRET);
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Actualizar la contraseña en la base de datos
        const customerRepository = getRepository(Customer);
        await customerRepository.update(decoded.id, { password: hashedPassword });

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

module.exports = router;
