const mysql = require("mysql");

function initDatabase() {
    const db = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    db.connect((err) => {
        if (err) {
            console.error("Error al conectar a la base de datos cine-aurora:", err);
            return;
        }

        console.log("Conectado a la base de datos cine-aurora");

        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS ticket (
                idTicket INT AUTO_INCREMENT PRIMARY KEY,
                nameFilm VARCHAR(50),
                chair VARCHAR(255),
                finalPrice DECIMAL(10, 2),
                voucher VARCHAR(100),
                idUser INT,
                purchaseDate DATETIME DEFAULT CURRENT_TIMESTAMP,
                status ENUM('pending', 'paid', 'canceled') DEFAULT 'pending',
                FOREIGN KEY (idUser) REFERENCES customer(idUser)
            )
        `;

        db.query(createTableQuery, (err, result) => {
            if (err) {
                console.error("Error al crear la tabla ticket:", err);
            } else {
                console.log("Tabla ticket creada o ya existía.");
            }
            db.end();
        });
    });
}

module.exports = initDatabase;
