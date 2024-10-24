import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

// Configuración de variables
const adminEmail = process.env.ADMIN_EMAIL;
const adminPasswordPlain = process.env.ADMIN_PASSWORD;
const adminDniPlain = process.env.ADMIN_DNI;

export const createAdmin = async () => {
    if (!adminEmail || !adminPasswordPlain || !adminDniPlain) {
        console.error("ADMIN_EMAIL, ADMIN_PASSWORD o ADMIN_DNI no están definidos en el archivo .env");
    }

    try {
        // Verificar si el usuario admin ya existe
        const existingAdmin = await prisma.customer.findUnique({
            where: { mail: adminEmail },
        });

        if (!existingAdmin) {
            // Crear usuario admin si no existe
            const hashedPassword = await bcrypt.hash(adminPasswordPlain, 10);

            await prisma.customer.create({
                data: {
                    mail: adminEmail,
                    name: 'Admin',
                    surname: 'User',
                    dni: parseInt(adminDniPlain, 10),
                    password: hashedPassword,
                    tips: 'admin',
                },
            });

            console.log("Usuario administrador creado y su email es:", process.env.ADMIN_EMAIL, "y su contraseña es:",process.env.ADMIN_PASSWORD);
        } else {
            console.log("Usuario administrador ya existe y su email es:", process.env.ADMIN_EMAIL, "y su contraseña es:",process.env.ADMIN_PASSWORD);
        }
    } catch (error) {
        console.error("Error al inicializar la base de datos:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
};
