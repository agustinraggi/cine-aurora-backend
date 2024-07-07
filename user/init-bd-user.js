const mysql = require("mysql");

function initDatabase() {
    // Conexión a la base de datos
    const db = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "cine-aurora"
    });

    // Conectar a la base de datos
    db.connect((err) => {
        if (err) {
            console.error("Error al conectar a la base de datos cine-aurora:", err);
            return;
        }

        // Creación de la tabla de usuarios si no existe
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS customer (
                id INT AUTO_INCREMENT PRIMARY KEY,
                mail VARCHAR(50),
                name VARCHAR(50),
                surname VARCHAR(50),
                dni INT,
                date VARCHAR(25),
                age INT,
                password VARCHAR(255),
                tips VARCHAR(25) DEFAULT 'cliente'
            )
        `;
        db.query(createTableQuery, (err, res) => {
            if (err) {
                console.error("Error al crear la tabla customer:", err);
            } else {
                console.log("Tabla customer fue creada o ya existía.");
            }
            db.end();
        });
    });
}

module.exports = initDatabase;
