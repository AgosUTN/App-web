import express, { Request, Response } from "express";
import { socioRouter } from "./socioFinanciero/socio.routes.js";
import { politicaRouter } from "./politicaRecargo/politicaRecargo.routes.js";
import { metodoPagoRouter } from "./metodoPago/metodoPago.routes.js";
import { cuotaRouter } from "./cuota/cuota.routes.js";

const app = express();
const PORT = 8080;

app.use(express.json());

app.use("/servicioCuotas/sociosFinancieros", socioRouter);
app.use("/servicioCuotas/metodosPago", metodoPagoRouter);
app.use("/servicioCuotas/politicasRecargo", politicaRouter);
app.use("/servicioCuotas/cuotas", cuotaRouter);
app.get("/", (req: Request, res: Response) => {
  res.send("Servicio-cuotas en linea");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
