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
        
        // Creación de la tabla de ticket si no existe
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS ticket (
                idTicket INT AUTO_INCREMENT PRIMARY KEY,
                nameFilm VARCHAR(50),
                chair VARCHAR(50),
                finalPrice DECIMAL(10, 2),
                voucher VARCHAR(100),
                idUser INT,
                purchaseDate DATETIME DEFAULT CURRENT_TIMESTAMP,
                status VARCHAR(20) DEFAULT 'active',
                FOREIGN KEY (idUser) REFERENCES customer(idUser)
            )
        `;

        db.query(createTableQuery, (err, res) => {
            if (err) {
                console.error("Error al crear la tabla ticket:", err);
            } else {
                console.log("Tabla ticket fue creada o ya existía.");
            }
            db.end();
        });
    });
}

module.exports = initDatabase;
