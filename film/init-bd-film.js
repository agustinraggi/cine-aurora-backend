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

        // Creación de la tabla de películas si no existe
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS film (
                id INT AUTO_INCREMENT PRIMARY KEY,
                codeFilm INT,
                nameFilm VARCHAR(50)
            )
        `;
        db.query(createTableQuery, (err, res) => {
            if (err) {
                console.error("Error al crear la tabla film:", err);
            } else {
                console.log("Tabla film fue creada o ya existía.");
            }
            db.end();
        });
    });
}

module.exports = initDatabase;
