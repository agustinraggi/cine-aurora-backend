const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const bcrypt = require('bcrypt');

// Conexión a la base de datos cine-aurora
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "cine-aurora"
});

db.connect((err) => {
    if (err) {
        console.error(err);
        return;
    }
});

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
    const age = calculateAge(date);
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.query('INSERT INTO customer (mail, name, surname, dni, date, age, password, tips) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
            [mail, name, surname, dni, date, age, hashedPassword, tips],
            (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500).send("Error al registrar cliente");
                } else {
                    res.send("¡Cliente registrado con ÉXITO!");
                }
            }
        );
    } catch (error) {
        console.error("Error al encriptar la contraseña:", error);
        res.status(500).send("Error al registrar cliente");
    }
});

// Leer todos los usuarios
router.get("/customer", (req, res) => {
    db.query('SELECT * FROM customer', (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error al obtener datos");
        } else {
            res.send(result);
        }
    });
});

// Actualizar usuario
router.put("/update", async (req, res) => {
    const { idUser, mail, name, surname, dni, date, password } = req.body;
    const age = calculateAge(date);
    try {
        let hashedPassword = null;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }
        db.query(
            'UPDATE customer SET mail=?, name=?, surname=?, dni=?, date=?, age=?, password=?, tips="cliente" WHERE idUser=?',
            [mail, name, surname, dni, date, age, hashedPassword, idUser],
            (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send("Error al actualizar cliente");
                }
                res.send("¡Cliente actualizado con ÉXITO!");
            }
        );
    } catch (error) {
        console.error("Error al encriptar la contraseña:", error);
        res.status(500).send("Error al actualizar cliente");
    }
});

// Eliminar usuario
router.delete("/delete/:idUser", (req, res) => {
    const idUser = req.params.idUser;
    db.query('DELETE FROM customer WHERE idUser=?', [idUser],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({ success: false, message: "Error al eliminar cliente" });
            } else {
                res.send({ success: true, message: "Cliente eliminado con éxito" });
            }
        }
    );
});

// Leer un usuario por ID
router.get("/customer/:idUser", (req, res) => {
    const idUser = req.params.idUser;
    db.query('SELECT * FROM customer WHERE idUser = ?', [idUser], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error al obtener datos del cliente");
        } else if (result.length === 0) {
            res.status(404).send("Cliente no encontrado");
        } else {
            res.send(result[0]);
        }
    });
});

// Inicio de sesión
router.post("/login", (req, res) => {
    const { mail, password } = req.body;
    db.query("SELECT * FROM customer WHERE mail = ?", [mail], async (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error en el servidor");
        }
        if (results.length === 0) {
            return res.status(400).send("Correo o contraseña incorrectos");
        }
        const user = results[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).send("Correo o contraseña incorrectos");
        }
        res.send({
            success: true,
            user: {
                id: user.idUser,
                name: user.name,
                email: user.mail,
                tips: user.tips
            }
        });
    });
});


module.exports = router;
