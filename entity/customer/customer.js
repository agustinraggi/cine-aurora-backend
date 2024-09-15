const { createConnection, QueryRunner, Table } = require('typeorm');
const bcrypt = require('bcrypt');

async function initializeCustomerTable() {
    const connection = await createConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();

    // Definir la estructura de la tabla
    const customerTable = new Table({
        name: 'customer',
        columns: [
            {
                name: 'idUser',
                type: 'int',
                isPrimary: true,
                isGenerated: true,
                generationStrategy: 'increment'
            },
            {
                name: 'mail',
                type: 'varchar',
                length: '50',
                isNullable: false
            },
            {
                name: 'name',
                type: 'varchar',
                length: '50',
                isNullable: false
            },
            {
                name: 'surname',
                type: 'varchar',
                length: '50',
                isNullable: false
            },
            {
                name: 'dni',
                type: 'int',
                isNullable: false
            },
            {
                name: 'age',
                type: 'int',
                isNullable: true
            },
            {
                name: 'password',
                type: 'varchar',
                length: '255',
                isNullable: false
            },
            {
                name: 'tips',
                type: 'varchar',
                length: '25',
                isNullable: false,
                default: "'cliente'"
            }
        ],
        indices: [
            {
                name: 'UQ_13efa74e6b320c6c4a4d3f0ec0c',
                columnNames: ['mail'],
                isUnique: true
            },
            {
                name: 'UQ_4fbd35975cb4ad42e0fa011406b',
                columnNames: ['dni'],
                isUnique: true
            }
        ]
    });

    try {
        // Verificar si la tabla ya existe
        const tableExists = await queryRunner.hasTable('customer');
        if (!tableExists) {
            console.log('Creando tabla customer');
            await queryRunner.createTable(customerTable);
            console.log('Tabla customer creada exitosamente');

            // Leer las variables de entorno para el correo y la contraseña del administrador
            const adminEmail = process.env.ADMIN_EMAIL;
            const adminPasswordPlain = process.env.ADMIN_PASSWORD;
            const adminDniPlain = process.env.ADMIN_DNI;

            if (!adminEmail || !adminPasswordPlain || !adminDniPlain) {
                console.error("ADMIN_EMAIL, ADMIN_PASSWORD o ADMIN_DNI no están definidos en el archivo .env");
                return;
            }

            // Verificar si el usuario admin ya existe
            const customerRepository = connection.getRepository('customer');
            const existingAdmin = await customerRepository.findOne({ where: { mail: adminEmail } });

            if (!existingAdmin) {
                // Crear usuario admin si no existe
                const hashedPassword = await bcrypt.hash(adminPasswordPlain, 10);
                const newAdmin = customerRepository.create({
                    mail: adminEmail,
                    name: 'Admin',
                    surname: 'User',
                    dni: adminDniPlain,
                    password: hashedPassword,
                    tips: 'admin'
                });
                await customerRepository.save(newAdmin);
                console.log('Usuario administrador creado exitosamente.', { adminEmail });
            } else {
                console.log('Usuario administrador ya existe.', { adminEmail });
            }
        } else {
            console.log('La tabla "customer" ya existe');
        }
    } catch (error) {
        console.error('Error al inicializar la tabla customer:', error);
    } finally {
        await queryRunner.release();
        await connection.close();
    }
}

initializeCustomerTable().catch(error => console.error('Error al inicializar la base de datos:', error));
