const { createConnection, QueryRunner, Table } = require('typeorm');

async function initializeFilmTable() {
    const connection = await createConnection();
    const queryRunner = connection.createQueryRunner();
    
    await queryRunner.connect();

    // Definir la estructura de la tabla
    const filmTable = new Table({
        name: 'film',
        columns: [
            {
                name: 'idFilm',
                type: 'int',
                isPrimary: true,
                isGenerated: true,
                generationStrategy: 'increment'
            },
            {
                name: 'codeFilm',
                type: 'int',
                isNullable: false
            },
            {
                name: 'nameFilm',
                type: 'varchar',
                length: '50',
                isNullable: false
            }
        ]
    });

    try {
        // Verificar si la tabla ya existe
        const tableExists = await queryRunner.hasTable('film');
        if (!tableExists) {
            console.log('Creando tabla film');
            await queryRunner.createTable(filmTable);
        } else {
            console.log('La tabla "film" ya existe');
        }
    } catch (error) {
        console.error('Error al inicializar la tabla film:', error);
    } finally {
        await queryRunner.release();
        await connection.close();
    }
}

initializeFilmTable().catch(error => console.error('Error al inicializar la base de datos:', error));
