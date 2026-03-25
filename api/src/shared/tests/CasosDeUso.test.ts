import request from "supertest";
import { app } from "../../app.js";

// IMPORTANTE - Hay que sacar a un archivo aparte el httpServer.listen() para poder correr los testeos.

const userTesting = {
  // Rol admin
  email: "agosMonti2@hotmail.com",
  password: "password12345",
};
const socioTest = {
  idSocio: 22,
};
const libroTest = {
  idEjemplar: 2,
  idLibro: 17,
};

describe("Prueba camino básico del CU [Retirar varios libros] y del CU [Devolver un libro]", () => {
  let cookie: string;
  let idPrestamo: number;

  it("login y guardar cookie", async () => {
    const res = await request(app).post("/api/auth/login").send(userTesting);

    cookie = res.headers["set-cookie"];
    expect(res.status).toBe(200);
  });

  it("Confirmar que la politica de biblioteca permite prestar al menos 1 libro", async () => {
    const res = await request(app)
      .get("/api/politicaBiblioteca")
      .set("Cookie", cookie);
    expect(res.status).toBe(200);
    expect(res.body.data.cantPendientesMaximo).toBeGreaterThanOrEqual(1);
  });

  it("Validar socio - Paso 1", async () => {
    const res = await request(app)
      .get(`/api/socios/${socioTest.idSocio}/validate`)
      .set("Cookie", cookie);
    expect(res.status).toBe(200);
  });

  it("Valida ejemplar para préstamo del socio del paso 1 - paso 2", async () => {
    const res = await request(app)
      .get(
        `/api/libros/${libroTest.idLibro}/ejemplares/${libroTest.idEjemplar}/loanable?idSocio=${socioTest.idSocio}`,
      )
      .set("Cookie", cookie);
    expect(res.status).toBe(200);
  });

  it("Confirmar préstamo - Paso 3", async () => {
    const prestamoDTO = {
      idSocio: socioTest.idSocio,
      ejemplares: [
        { idEjemplar: libroTest.idEjemplar, idLibro: libroTest.idLibro },
      ],
    };

    const res = await request(app)
      .post(`/api/prestamos`)
      .send(prestamoDTO)
      .set("Cookie", cookie);
    expect(res.status).toBe(201);
    idPrestamo = res.body.data.id;
  });

  it("Devolver préstamo - CU [Devolver un libro]", async () => {
    const devolverDTO = {
      idSocio: socioTest.idSocio,
      idEjemplar: libroTest.idEjemplar,
      idLibro: libroTest.idLibro,
    };
    const res = await request(app)
      .patch(`/api/prestamos/${idPrestamo}/lineas/${1}/devolver`)
      .send(devolverDTO)
      .set("Cookie", cookie);
    expect(res.status).toBe(200);
  });
});
