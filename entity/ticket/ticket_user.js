const { createConnection, QueryRunner, Table, TableForeignKey } = require('typeorm');

async function initializeTicketTable() {
    const connection = await createConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();

    // Definir la estructura de la tabla
    const ticketTable = new Table({
        name: 'ticket',
        columns: [
            {
                name: 'idTicket',
                type: 'int',
                isPrimary: true,
                isGenerated: true,
                generationStrategy: 'increment'
            },
            {
                name: 'nameFilm',
                type: 'varchar',
                length: '50',
                isNullable: true
            },
            {
                name: 'chair',
                type: 'varchar',
                length: '255',
                isNullable: true
            },
            {
                name: 'finalPrice',
                type: 'decimal',
                precision: 10,
                scale: 2,
                isNullable: true
            },
            {
                name: 'date',
                type: 'varchar',
                length: '50',
                isNullable: true
            },
            {
                name: 'time',
                type: 'varchar',
                length: '50',
                isNullable: true
            },
            {
                name: 'typeOfFunction',
                type: 'varchar',
                length: '50',
                isNullable: true
            },
            {
                name: 'language',
                type: 'varchar',
                length: '50',
                isNullable: true
            },
            {
                name: 'voucher',
                type: 'varchar',
                length: '100',
                isNullable: true
            },
            {
                name: 'purchaseDate',
                type: 'datetime',
                default: 'CURRENT_TIMESTAMP'
            },
            {
                name: 'status',
                type: 'enum',
                enum: ['pending', 'paid', 'canceled'],
                default: "'pending'"
            },
            {
                name: 'idUser',
                type: 'int',
                isNullable: false
            }
        ],
        indices: [
            {
                name: 'IDX_TICKET_USER',
                columnNames: ['idUser']
            }
        ]
    });

    try {
        // Verificar si la tabla ya existe
        const tableExists = await queryRunner.hasTable('ticket');
        if (!tableExists) {
            console.log('Creando tabla ticket');
            await queryRunner.createTable(ticketTable);
            console.log('Tabla ticket creada exitosamente');

            // Configura la relación con Customer
            await queryRunner.createForeignKey('ticket', new TableForeignKey({
                columnNames: ['idUser'],
                referencedTableName: 'customer',
                referencedColumnNames: ['idUser'],
                onDelete: 'CASCADE',
            }));

            console.log('Relación con Customer creada exitosamente');
        } else {
            console.log('La tabla "ticket" ya existe');
        }
    } catch (error) {
        console.error('Error al inicializar la tabla ticket:', error);
    } finally {
        await queryRunner.release();
        await connection.close();
    }
}

initializeTicketTable().catch(error => console.error('Error al inicializar la base de datos:', error));
