
## Índice
 
| # | Recurso | Estado |
|---|---------|--------|
| 1 | [Proposal — Descripción del sistema, alcance funcional y técnico](https://github.com/AgosUTN/App-web/blob/main/docs/proposal.md) | ✅ |
| 2 | [Documentación de la API](https://github.com/AgosUTN/App-web/blob/main/docs/API-Documentaci%C3%B3n.md) | ✅ |
| 3 | [Casos de uso y reglas de negocio](https://github.com/AgosUTN/App-web/tree/main/docs) | ✅ |
| 4 | Modelo entidad relación (DER) | ⏳ Pendiente |
| 5 | Vídeo de la aplicación funcionando | ⏳ Pendiente |
| 6 | Link de la aplicación deployada | ⏳ Pendiente |
 
---
 
## Credenciales de acceso
 
| Rol | Usuario | Contraseña |
|-----|---------|------------|
| USER | ⏳ Pendiente | ⏳ Pendiente |
| ADMIN | ⏳ Pendiente | ⏳ Pendiente |
 
---

# Pasos de instalación
 
---
 
### 1) Instalar Docker
Tener instalado [Docker Desktop](https://www.docker.com/products/docker-desktop/) (incluye Docker Compose).
 
---
 
### 2) Configurar variables de entorno
 
Copiar `.env.example` a `.env` y configurar al menos:
 
- `API_PORT`, `FRONT_PORT`
- `DB_HOST`, `DB_PORT`, `MYSQL_ROOT_PASSWORD`
- `API_DB_USER`, `API_DB_PASSWORD`, `API_DB_NAME`
- `JWT_SECRET`
- `FRONTEND_URL`, `BASE_URL` → reemplazar la IP por la de tu máquina (ej: `http://192.168.X.X`)
 
---
### 3) Hardcodear la IP de la máquina + el API PORT en el enviroment.ts del frotend.

export const environment = {
  production: false,
  apiUrl: `http://192.168.100.8:3000`,
};
 
### 4) Levantar los servicios
 
```bash
docker compose up --build
```
 
> La primera vez puede tardar varios minutos mientras se construyen las imágenes y se inicializa la base de datos.
 
- API: `http://localhost:3000`
- Frontend: `http://IP-Maquina:4200` NO USAR LOCALHOST. El cors espera la IP de la máquina. (La misma del front url / base url)
- MySQL (acceso externo desde Workbench): `localhost:3307`
 
---
 
### 5) Detener los servicios
 
```bash
# Solo detener
docker compose down
 
# Detener y eliminar la base de datos (volumen)
docker compose down -v
```
 
---
 
