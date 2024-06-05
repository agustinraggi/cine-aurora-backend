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

app.post("/create", (req, res) => {
    const correo = req.body.correo
    const nombre = req.body.nombre
    const dni = req.body.dni
    const fecha = req.body.fecha
    const password = req.body.password
    const edad = calculateAge(fecha);

    db.query('INSERT INTO cliente (correo, nombre, dni, fecha, edad, password) VALUES (?, ?, ?, ?, ?, ?)', [correo, nombre, dni, fecha, edad, password],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("cliente registrado con EXITO!");
            }
        }
    );
});

app.get("/cliente", (req, res) => {
    db.query('SELECT * FROM cliente',
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

app.listen(3001, () => {
    console.log("corriendo en el puerto 3001");
});
