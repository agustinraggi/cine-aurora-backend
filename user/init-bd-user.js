const mysql = require("mysql");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

// Cargar variables de entorno desde el archivo .env
dotenv.config();

function initDatabase() {
    // Conexión a la base de datos
    const db = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    // Conectar a la base de datos
    db.connect((err) => {
        if (err) {
            console.error("Error al conectar a la base de datos cine-aurora:", err);
            return;
        }

        // Creación de la tabla customer si no existe
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS customer (
                idUser INT AUTO_INCREMENT PRIMARY KEY,
                mail VARCHAR(50) UNIQUE NOT NULL,
                name VARCHAR(50),
                surname VARCHAR(50),
                dni INT UNIQUE NOT NULL,
                date VARCHAR(25),
                age INT,
                password VARCHAR(255) NOT NULL,
                tips VARCHAR(25) DEFAULT 'cliente'
            )
        `;
        db.query(createTableQuery, (err, res) => {
            if (err) {
                console.error("Error al crear la tabla customer:", err);
                db.end();
                return;
            }
            console.log("Tabla customer fue creada o ya existía.");

            // Leer las variables de entorno para el correo y la contraseña del administrador
            const adminEmail = process.env.ADMIN_EMAIL;
            const adminPasswordPlain = process.env.ADMIN_PASSWORD;
            const adminDniPlain = process.env.ADMIN_DNI;

            if (!adminEmail || !adminPasswordPlain || !adminDniPlain) {
                console.error("ADMIN_EMAIL, ADMIN_PASSWORD o ADMIN_DNI no están definidos en el archivo .env");
                db.end();
                return;
            }

            // Verificar si el usuario admin ya existe
            const checkAdminQuery = `SELECT * FROM customer WHERE mail = ?`;

            db.query(checkAdminQuery, [adminEmail], (err, results) => {
                if (err) {
                    console.error("Error al verificar el usuario administrador:", err);
                    db.end();
                    return;
                }
            
                if (results.length === 0) {
                    // Crear usuario admin si no existe
                    const adminPassword = bcrypt.hashSync(adminPasswordPlain, 10);
                    const insertAdminQuery = `
                        INSERT INTO customer (mail, name, surname, dni, date, age, password, tips) 
                        VALUES (?, 'Admin', 'User', ?, NULL, NULL, ?, 'admin')
                    `;
                    db.query(insertAdminQuery, [adminEmail, adminDniPlain, adminPassword], (err, result) => {
                        if (err) {
                            console.error("Error al crear el usuario administrador:", err);
                        } else {
                            console.log("Usuario administrador creado.", { adminEmail },
                                "su contraseña es: ", adminPasswordPlain
                            );
                        }
                        db.end();
                    });
                } else {
                    console.log("Usuario administrador ya existe.", { adminEmail },
                        "su contraseña es: ", adminPasswordPlain
                    );
                    db.end();
                }
            });
        });
    });
}

module.exports = initDatabase;
