const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "cine-aurora"
});

const calculateAge = (birthdate) => {
    const birthDate = new Date(birthdate);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
};

// C = CREATE
app.post("/create", (req, res) => {
    const { mail, name, dni, date, password } = req.body;
    const age = calculateAge(date);

    db.query('INSERT INTO customer (mail, name, dni, date, age, password) VALUES (?, ?, ?, ?, ?, ?)', 
    [mail, name, dni, date, age, password],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Error al registrar cliente");
            } else {
                res.send("cliente registrado con EXITO!");
            }
        }
    );
});

// R = READ
app.get("/customer", (req, res) => {
    db.query('SELECT * FROM customer',
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Error al obtener datos");
            } else {
                res.send(result);
            }
        }
    );
});

// U = UPDATE
app.put("/update", (req, res) => {
    const { id, mail, name, dni, date, password } = req.body;
    const age = calculateAge(date);

    db.query('UPDATE customer SET mail=?, name=?, dni=?, date=?, age=?, password=? WHERE id=?', 
    [mail, name, dni, date, age, password, id],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Error al actualizar cliente");
            } else {
                res.send("cliente actualizado con EXITO!");
            }
        }
    );
});

// DELETE
app.delete("/delete/:id", (req, res) => {
    const id  = req.params.id;

    db.query('DELETE FROM customer WHERE id=?', id,
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("cliente eliminado con EXITO!");
            }
        }
    );
});

app.listen(3001, () => {
    console.log("corriendo en el puerto 3001");
});
