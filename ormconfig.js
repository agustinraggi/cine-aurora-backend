module.exports = {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [
        require("./entity/film/film"),
        require("./entity/customer/customer"),
        require("./entity/movie_theater/movieTheater"),
        require("./entity/ticket/ticket_user")
    ],
    migrations: [],
    subscribers: []
};
