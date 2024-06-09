const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require('bcrypt');

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "cine-aurora"
});

db.connect((err) => {
    if (err) {
        console.log("Error al conectar a la base de datos:", err);
        return;
    }
    console.log("Conectado a la base de datos");

    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS customer (
            id INT AUTO_INCREMENT PRIMARY KEY,
            mail VARCHAR(50),
            name VARCHAR(50),
            surname VARCHAR(50),
            dni DECIMAL(10, 2),
            date VARCHAR(25),
            age DECIMAL(10, 2),
            password VARCHAR(255)
        )
    `;

    db.query(createTableQuery, (err, res) => {
        if (err) {
            console.log("Error al crear la tabla:", err);
        } else {
            console.log("Tabla customer fue creada o ya existía.");
        }
    });
});

const calculateAge = (birthdate) => {
    const birthDate = new Date(birthdate);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
};

// Registro de usuario
app.post("/create", async (req, res) => {
    const { mail, name, surname,  dni, date, password } = req.body;
    const age = calculateAge(date);

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.query('INSERT INTO customer (mail, name, surname, dni, date, age, password) VALUES (?, ?, ?, ?, ?, ?, ?)', 
            [mail, name, surname, dni, date, age, hashedPassword],
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
app.get("/customer", (req, res) => {
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
app.put("/update", (req, res) => {
    const { id, mail, name, surname, dni, date, password } = req.body;
    const age = calculateAge(date);

    db.query('UPDATE customer SET mail=?, name=?, surname=?, dni=?, date=?, age=?, password=? WHERE id=?', 
        [mail, name, surname, dni, date, age, password, id],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Error al actualizar cliente");
            } else {
                res.send("¡Cliente actualizado con ÉXITO!");
            }
        }
    );
});

// Eliminar usuario
app.delete("/delete/:id", (req, res) => {
    const id = req.params.id;

    db.query('DELETE FROM customer WHERE id=?', id,
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Error al eliminar cliente");
            } else {
                res.send("¡Cliente eliminado con ÉXITO!");
            }
        }
    );
});

// Inicio de sesión
app.post("/login", (req, res) => {
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
            user: { name: user.name, email: user.mail }
        });
    });
});

app.listen(3001, () => {
    console.log("Corriendo en el puerto 3001");
});
