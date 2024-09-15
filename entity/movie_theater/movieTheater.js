const { createConnection, QueryRunner, Table } = require('typeorm');

async function initializeDatabase() {
    const connection = await createConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();

    // Verifica si la tabla ya existe
    const tableExists = await queryRunner.hasTable('movieTheater');

    if (!tableExists) {
        await queryRunner.createTable(
            new Table({
                name: 'movieTheater',
                columns: [
                    {
                        name: 'idMovieTheater',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'codeFilm',
                        type: 'int',
                        isUnique: true,
                    },
                    {
                        name: 'nameFilm',
                        type: 'varchar',
                        length: '50',
                    },
                    {
                        name: 'date',
                        type: 'varchar',
                        length: '50',
                    },
                    {
                        name: 'time',
                        type: 'varchar',
                        length: '50',
                    },
                    {
                        name: 'typeOfFuntion',
                        type: 'varchar',
                        length: '255',
                    },
                    {
                        name: 'language',
                        type: 'varchar',
                        length: '255',
                    },
                    {
                        name: 'price',
                        type: 'int',
                    }
                ],
                indices: [
                    {
                        columnNames: ['codeFilm'],
                        isUnique: true,
                    }
                ]
            })
        );
        console.log('Tabla "movieTheater" creada.');
    } else {
        console.log('La tabla "movieTheater" ya existe.');
    }

    await queryRunner.release();
    await connection.close();
}

initializeDatabase().catch(error => console.error('Error al inicializar la base de datos:', error));
