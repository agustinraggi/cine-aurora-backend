import "reflect-metadata";
import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { DataSource } from "typeorm";
import { Customer } from "./customer/models/classes/customer.entity.js";

const app = express();
const router = express.Router();

// Cargar variables de entorno
config();

app.use(cors());
app.use(express.json());

// Configuración de la base de datos con TypeORM
export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,  // Asegura un valor predeterminado para el puerto
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Customer],
});

// Inicializar la base de datos
AppDataSource.initialize()
    .then(() => {
        console.log("Conexión establecida con la base de datos.");
    })
    .catch((error) => console.log("Error al conectar a la base de datos:", error));

// Definir el repositorio y las rutas
router.get("/:idUser", async (req, res) => {
    const idUser = req.params.idUser;

    try {
        // Acceder al repositorio
        const customerController = AppDataSource.getRepository(Customer);
        
        // Buscar al cliente por ID
        const customer = await customerController.findOneOrFail({ where:  idUser  });

        // Enviar la respuesta
        res.json(customer);
    } catch (error) {
        res.status(404).json({ message: "Cliente no encontrado", error });
    }
});

// Configurar el router
app.use(router);

// Iniciar el servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

export default app;
