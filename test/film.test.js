import request from "supertest";
import app from "../src/index"; // Importa la instancia de la aplicación Express

describe("Film API", () => {
    // Test para la ruta GET /allFilm
    it("debería devolver todas las películas", async () => {
        const response = await request(app).get("/allFilm");
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    // Test para la ruta POST /createFilm
it("debería crear una nueva película", async () => {
    // Realizar login para obtener el token JWT
    const loginResponse = await request(app)
        .post("/login")
        .send({
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,
        });

    // Mostrar la respuesta para diagnóstico
    console.log("Login Response:", loginResponse.body); // Agregado para depuración

    // Verificar que el login fue exitoso y obtener el token
    expect(loginResponse.status).toBe(200);
    const token = loginResponse.body.token;

    // Simulando la navegación a /adminActive
    const adminActiveResponse = await request(app)
        .get("/adminActive")
        .set("Authorization", `Bearer ${token}`); 

    expect(adminActiveResponse.status).toBe(200);

    // Simulando la navegación a /addFilmAdmin para agregar una nueva película
    const newFilm = { codeFilm: "718821", nameFilm: "Tornados" };
    const response = await request(app)
        .post("/addFilmAdmin")
        .send(newFilm)
        .set("Authorization", `Bearer ${token}`); 

    expect(response.status).toBe(200);
    expect(response.text).toBe("¡Película registrada con ÉXITO!");
});
});
