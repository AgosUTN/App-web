## Endpoints resumen

### Auth

**Base URL:** `/api/auth`
| Método | Endpoint  | Descripción                             | Rol requerido |
|--------|-----------|-----------------------------------------|---------------|
| GET    | /verify   | Verificar que el token actual es válido | público*      |
| POST   | /login    | Loguear usuario                         | público       |
| POST   | /logout   | Borrar cookie http only (Cerrar sesión) | público       |


Nota: El endpoint de verify se usa para evitar que un usuario logueado entre a la pantalla de login, en el guard de login.

*: Si no esta logueado, da error de autenticación (401) que es usado en la lógica del loginGuard.

---

### Autores

**Base URL:** `/api/autores`

| Método | Endpoint | Descripción                            | Rol requerido |
|--------|----------|----------------------------------------|---------------|
| GET    | /        | Obtener autores paginados              | admin         |
| GET    | /:id     | Obtener un autor por ID                | admin         |
| POST   | /        | Crear un nuevo autor                   | admin         |
| PATCH  | /:id     | Actualizar un autor                    | admin         |
| DELETE | /:id     | Eliminar un autor (baja lógica/física) | admin         |

### Editoriales

**Base URL:** `/api/editoriales`

| Método | Endpoint       | Descripción                          | Rol requerido |
|--------|----------------|--------------------------------------|---------------|
| GET    | /              | Obtener editoriales paginadas        | admin         |
| GET    | /:id           | Obtener una editorial por ID         | admin         |
| POST   | /              | Crear una nueva editorial            | admin         |
| PATCH  | /:id           | Actualizar una editorial             | admin         |
| DELETE | /:id           | Eliminar una editorial (baja física) | admin         |

---

### Libros

**Base URL:** `/api/libros`

| Método | Endpoint       | Descripción                              | Rol requerido |
|--------|----------------|------------------------------------------|---------------|
| GET    | /              | Obtener libros paginados                 | admin         |
| GET    | /:id           | Obtener un libro por ID                  | admin         |
| GET    | /:id/detail    | Obtener detalle completo de un libro     | admin         |
| POST   | /              | Crear un nuevo libro                     | admin         |
| PATCH  | /:id           | Actualizar un libro                      | admin         |
| DELETE | /:id           | Eliminar un libro     (baja fisica)      | admin         |

---

### Ejemplares

**Base URL:** `/api/libros/:idLibro/ejemplares`

| Método | Endpoint               | Descripción                                              | Rol requerido |
|--------|------------------------|----------------------------------------------------------|---------------|
| GET    | /:idEjemplar/loanable  | Validar si un ejemplar puede prestarse a un cierto socio | admin         |
| GET    | /:idEjemplar/pendiente | Verificar si el ejemplar esta pendiente                  | admin         |
| POST   | /                      | Crear un ejemplar manualmente                            | admin         |
| DELETE | /:idEjemplar           | Eliminar un ejemplar   (baja lógica/física)              | admin         |

---

### Politica de Biblioteca

Clase parámetrica

**Base URL:** `/api/politicaBiblioteca`

| Método | Endpoint | Descripción                                 | Rol requerido |
|--------|----------|---------------------------------------------|---------------|
| GET    | /        | Obtener la política actual de la biblioteca | admin         |
| PATCH  | /        | Actualizar la política de la biblioteca     | admin         |

---

### Politicas de Sanción

**Base URL:** `/api/politicasSancion`

| Método | Endpoint | Descripción                                   | Rol requerido |
|--------|----------|-----------------------------------------------|---------------|
| GET    | /        | Obtener políticas de sanción paginadas        | admin         |
| GET    | /:id     | Obtener una política de sanción por ID        | admin         |
| POST   | /        | Crear una nueva política de sanción           | admin         |
| PATCH  | /:id     | Actualizar una política de sanción            | admin         |
| DELETE | /:id     | Eliminar (baja lógica) una política de sanción| admin         |


---

### Préstamos

**Base URL:** `/api/prestamos`

| Método | Endpoint                    | Descripción                                      | Rol requerido |
|--------|-----------------------------|--------------------------------------------------|---------------|
| GET    | /                           | Obtener préstamos paginados                      | user/admin    |
| GET    | /:id/detail                 | Obtener detalle de un préstamo por ID            | user/admin    |
| GET    | /detail                     | Obtener detalle de un préstamo por ejemplar      | admin         |
| POST   | /                           | Crear un nuevo préstamo                          | admin         |
| POST   | /deadlockTest               | Crear préstamo (testing de concurrencia/deadlock)| admin         |
| PATCH  | /:id/lineas/:idLP/devolver  | Registrar devolución de un ejemplar prestado     | admin         |

Nota: Los dos endpoints que tienen permiso para el rol "USER", usan el idSocio del payload del token que viaja en 
la cookie para evitar que un usuario logueado consiga información de otros socios.

---

### Sanciones

**Base URL:** `/api/sanciones`

| Método | Endpoint | Descripción                          | Rol requerido |
|--------|----------|--------------------------------------|---------------|
| GET    | /        | Obtener sanciones paginadas          | user/admin    | 
| DELETE | /:id     | Eliminar una sanción (baja lógica)   | admin         |

Nota: Misma aclaración que en el CRUD anterior.

---

### Socios

**Base URL:** `/api/socios`

| Método | Endpoint      | Descripción                                    | Rol requerido |
|--------|---------------|------------------------------------------------|---------------|
| GET    | /             | Obtener socios paginados                       | admin         |
| GET    | /:id          | Obtener un socio por ID                        | admin         |
| GET    | /:id/detail   | Obtener detalle completo de un socio           | admin         |
| GET    | /:id/validate | Validar que el socio puede realizar un préstamo| admin         |
| POST   | /             | Crear un nuevo socio (y usuario con rol USER)  | admin         |
| PATCH  | /:id          | Actualizar un socio                            | admin         |
| DELETE | /:id          | Eliminar un socio (baja lógica/física)         | admin         |

---
## Endpoints en detalle

Aclaraciones:
- Solo puede que se usen query params en endpoints GET. T
- Todos los req params son números enteros mayores a 0.
- Los update y delete no devuelven la instancia.
- Los update y delete que no encuentren la instancia a modificar/eliminar, devuelven 200 igual por seguridad.

## Formato de respuesta de error

```json
{
  "message": "string",
  "code": "string" --> SOLO SI HAY MÁS DE UN ERROR CON EL MISMO CÓDIGO DE STATUS.
}
```
Los 400 que maneja el controlador, se diferencian con un código obligatoriamente, puesto que existe un middlewares que devuelve 400. Se lo documenta al final.

### Auth

---

#### 1) GET /verify

- No query params.
- Requiere cookie http only `access_token` con JWT válido.
  
- Respuesta:
  - 200 → token válido
  - 401 → token inválido o ausente (lo devuelve el middleware)

---

#### 2) POST /login

- Body (schema):

```json
{
  "email": "string",
  "password": "string"
}
```

Respuesta:
200 → login exitoso (setea cookie access_token)
401 + INVALID_TOKEN → credenciales inválidas (lo devuelve el middleware)
401 + no code --> Contraseña o email incorrectos

---

#### 3) POST /logout

- No query params.
- No req body
- Requiere cookie http only `access_token` con JWT válido.
  
- Respuesta:
  - 200 → token válido
  - 401 → token inválido o ausente (lo devuelve el middleware)

---
### Autor
---
#### 1) GET / -- Query params 

```json
{
  "pageIndex": "number (int >= 0)",
  "pageSize": "number (int >= 1)",
  "sortOrder": "asc | desc",
  "sortColumn": "nombrecompleto | cantlibros | id",
  "filterValue": "string (max 100)"
}

- Respuesta:
  - 200 → Página con autores.


```json
{
  "message": "string",
  "data": AutorTableDTO[],
  "total": "number" --> Cantidad de registros totales de autor con los parámetros enviados.
}

```
Nota: Todos los endpoints de get all con paginación tienen esa estructura de respuesta, no se repetirá.

#### 2) GET /:id

- Respuesta:
  - 200 → Autor encontrado.
  - 404 → Autor no encontrado.
  - 
```json
 {
  "message": "string",
  "data": AutorReadDTO
}

```
Nota: Todos los endpoints de get one tienen esa estructura de respuesta, no se repetirá.

---

#### 3) POST /:id

- Body:
```json
{
  "nombrecompleto": "string"
}
```
- Respuesta:

  - 201 → Autor creado correctamente.
  - 409 → Nombre duplicado
  - 
```json
 {
  "message": "string",
  "data": AutorWriteDTO
}

```
Nota: Todos los endpoints de alta tienen esa estructura de respuesta, no se repetirá.

---

#### 4) PATCH /:id

- body:
```json
{
  "nombrecompleto": "string (max 100) [opcional]"
}
```
- Respuesta:

  - 200 → Autor actualizado correctamente
  - 409 → Nombre duplicado
```json
  {
  "message": "string",
}
```
Nota: No se devuelve el objeto. Todos los endpoints de update tienen la misma estructura, no se repetirá.

---
#### 5) DELETE /:id

- Respuesta:

  - 200 → Autor eliminado correctamente
  - 409 → No se puede eliminar un autor que tenga libros
  - 
```json
  {
  "message": "string",
}
```
Nota: Todos los endpoints de delete tienen la misma estructura, no se repetirá.

---
### Libro
---

#### 1) GET / — Query params
 
```json
{
  "pageIndex": "number (int >= 0)",
  "pageSize": "number (int >= 1)",
  "sortOrder": "asc | desc",
  "sortColumn": "titulo | cantprestamos | id | autor | editorial",
  "filterValue": "string (max 100)"
}
```
 
- Respuesta:
  - 200 → Página con libros.
 
---

#### 2) GET /:id
 
- Respuesta:
  - 200 → Libro encontrado.
  - 404 → Libro no encontrado.
 
---

 
#### 3) GET /:id/detail
 
- Respuesta:
  - 200 → Detalle completo del libro encontrado.
  - 404 → Libro no encontrado.
 
```json
{
  "message": "string",
  "data": "LibroDetailDTO"
}
```
---

#### 4) POST /
 
- Body:
 
```json
{
  "titulo": "string (max 100)",
  "descripcion": "string (max 500)",
  "isbn": "string (ISBN-10 o ISBN-13 válido)",
  "miAutor": "number (int > 0)",
  "miEditorial": "number (int > 0)",
  "cantEjemplares": "number (int >= 0) [opcional]"
}
```
 
- Respuesta:
  - 201 → Libro creado correctamente.
  - 409 + ISBN_DUPLICATED → ISBN duplicado.
  - 409 + TITULO_DUPLICATED → Título duplicado.
  - 400 + INVALID_ID_REFRENCE → Autor o Editorial no encontrada.
 
#### 5) PATCH /:id
 
- Body:
 
```json
{
  "titulo": "string [opcional]",
  "descripcion": "string [opcional]",
  "isbn": "string (ISBN-10 o ISBN-13 válido) [opcional]",
  "miAutor": "number (int > 0) [opcional]",
  "miEditorial": "number (int > 0) [opcional]"
}
```
 
- Respuesta:
  - 200 → Libro actualizado correctamente.
  - 409 + ISBN_DUPLICATED → ISBN duplicado.
  - 409 + TITULO_DUPLICATED → Título duplicado.
  - 400 + INVALID_ID_REFRENCE → Autor o Editorial no encontrada.
 
 
#### 6) DELETE /:id
 
- Respuesta:
  - 200 → Libro eliminado correctamente.
  - 409 → No se puede eliminar un libro que tenga un ejemplar que haya sido prestado.
 
---
### Ejemplar
---

#### 1) GET /:idEjemplar/loanable — Query params
 
```json
{
  "idSocio": "number (int >= 0)"
}
```
- Respuesta:
  - 200 → Ejemplar válido para préstamo para ese socio.
  - 409 + BORROWED_EJEMPLAR → Ejemplar ya prestado.
  - 409 + ALREADY_BORROWED_BY_SOCIO → Ese socio ya tiene en préstamo un ejemplar de ese libro.
  - 400 + SOCIO_NOT_FOUND → El socio no fue encontrado. (Se pone como 400 ya que en el paso 1 del CU se válido que existía).
  - 404 + EJEMPLAR_LIBRO_NOT_FOUND → Libro o Ejemplar no encontrados.
 
```json
{
  "message": "string",
  "data": "EjemplarCartDTO"
}
```
 
---
 
#### 2) GET /:idEjemplar/pendiente
 
- Respuesta:
  - 200 → Estado de pendiente verificado.
  - 409 → Ejemplar no pendiente de devolución.
  - 404 + EJEMPLAR_NOT_FOUND --> Ejemplar no encontrado.
 
```json
{
  "message": "string"
}
```
 
---
 
#### 3) POST /
 
- Body: ninguno.
 
- Respuesta:
  - 201 → Ejemplar creado correctamente.
  - 404 → Libro no encontrado.
  - 409 + EJEMPLAR_ID_CONFLICT → Error por concurrencia. El usuario debería reintentar el alta. 
 
---
 
#### 4) DELETE /:idEjemplar
 
- Respuesta:
  - 200 → Ejemplar eliminado correctamente.
  - 409 + BOOKED_EJEMPLAR → No se puede eliminar un ejemplar que está en un préstamo activo.
  - 409 + DELETED_EJEMPLAR → El ejemplar ya posee baja lógica. 
 
```json
{
  "message": "string"
}
```
---
# Política de Biblioteca
---
 
#### 1) GET /
 
- Respuesta:
  - 200 → Política encontrada.
  - 500 + SYSTEM_CONFIGURATION_ERROR → Política no encontrada. Se debe cargar en la migración inicial, por lo que sería un error interno.
    
---
 
#### 2) PATCH /
 
- Body:
 
```json
{
  "diasSancionMaxima": "number (int > 0) [opcional]",
  "diasPrestamo": "number (int > 0) [opcional]",
  "cantPendientesMaximo": "number (int > 0) [opcional]"
}
```
 
- Respuesta:
  - 200 → Política actualizada correctamente.

---
# Políticas de Sanción
---
#### 1) GET / — Query params
 
```json
{
  "pageIndex": "number (int >= 0)",
  "pageSize": "number (int >= 1)",
  "sortOrder": "asc | desc",
  "sortColumn": "diasHasta | diasSancion",
  "filterValue": "number (>= -1) "
}
```
 
- Respuesta:
  - 200 → Página con políticas de sanción.
 
---
 
#### 2) GET /:id
 
- Respuesta:
  - 200 → Política encontrada.
  - 404 → Política de sanción no encontrada.
 
---
 
#### 3) POST /
 
- Body:
 
```json
{
  "diasHasta": "number (int > 0)",
  "diasSancion": "number (int > 0)"
}
```
> Nota: `diasSancion` se valida como `>= 0` en el schema, pero la regla de negocio exige que sea `> 0` (se controla en el controlador).
 
- Respuesta:
  - 201 → Política de sanción creada.
  - 409 + ZERO_DAYS → La sanción debe ser de al menos un día.
  - 409 + DUPLICATED_POLITICA → Ya existe una política con esa cantidad de días hasta.
  
---
 
#### 4) PATCH /:id
 
- Body:
 
```json
{
  "diasSancion": "number (int > 0) [opcional]"
}
```
 
- Respuesta:
  - 200 → Política de sanción actualizada.
  
---
 
#### 5) DELETE /:id
 
- Respuesta:
  - 200 → Política eliminada.
 
---

# Préstamos
---
 
#### 1) GET / — Query params
 
```json
{
  "pageIndex": "number (int >= 0)",
  "pageSize": "number (int >= 1)",
  "sortOrder": "asc | desc",
  "sortColumn": "fechaPrestamo",
  "filterValue": "number (int >= 0) [opcional] -- filtra por idSocio",
  "estado": "PENDIENTE | FINALIZADO [opcional]"
}
```
 
- Respuesta:
  - 200 → Página con préstamos.
 
---
 
#### 2) GET /:id/detail
 
- Respuesta:
  - 200 → Detalle del préstamo encontrado.
  - 403 → El socio intento manipular el req param para acceder a un préstamo que no le corresponde. Permiso denegado.
  - 404 → Préstamo no encontrado
    
```json
{
  "message": "string",
  "data": "PrestamoDetailDTO"
}
```
 
---
 
#### 3) GET /detail — Query params
 
```json
{
  "idEjemplar": "number (int > 0)",
  "idLibro": "number (int > 0)"
}
```
 
- Respuesta:
  - 200 → Detalle del préstamo encontrado.
  - 404 → Préstamo no encontrado. 
---
 
#### 4) POST /
 
- Body:
 
```json
{
  "idSocio": "number (int > 0)",
  "ejemplares": [
    {
      "idEjemplar": "number (int > 0)",
      "idLibro": "number (int > 0)"
    }
  ]
}
```
> Nota: `ejemplares` debe contener al menos 1 elemento.
 
- Respuesta:
  - 201 → Préstamo creado correctamente.
  - 400 + SOCIO_NOT_FOUND → Socio no encontrado.
  - 400 + DUPLICATED_LIBRO → No se pueden retirar dos ejemplares del mismo libro.
  - 400 + EJEMPLAR_NOT_FOUND → Uno de los ejemplares no existe.
  - 400 + ALREADY_BORROWED_BY_SOCIO → El socio tiene pendiente un ejemplar de ese libro.
  - 400 + BORROWED_EJEMPLAR → Uno de los ejemplares ya está prestado.
  - 400 + EXCEDED_EJEMPLARES → Se intentó retirar más ejemplares de los que el socio puede.
  - 409 + DEADLOCK → La base de datos canceló dos requests concurrentes de crear un préstamo, que se habían bloqueado porque estaban esperando que se liberen registros bloqueados de ejemplares mutuamente.
  - 500 → Política biblioteca innacesible.
 
---

#### 6) PATCH /:id/lineas/:idLP/devolver
 
- Params:
  - `id` → ID del préstamo `(int > 0)`
  - `idLP` → ID de la línea de préstamo `(int > 0)`
 
- Body:
 
```json
{
  "idSocio": "number (int > 0)",
  "idEjemplar": "number (int > 0)",
  "idLibro": "number (int > 0)"
}
```
 
- Respuesta:
  - 200 → Devolución registrada correctamente.
  - 404 + ENTITY_NOT_FOUND → Una de las muchas entidades no fue encontrada.
  - 409 + EJEMPLAR_NOT_PENDING → El ejemplar no está pendiente de devolución.
  - 500 → Política biblioteca innacesible.
 
```json
{
  "message": "Devolución registrada correctamente. | Devolución registrada y socio sancionado.",
  "data": {
    "prestamo": "PrestamoDetailDTO",
    "diasSancion": "number -- 0 si no fue sancionado"
  }
}
```

# Sanciones
 
**Base URL:** `/api/sanciones`
 
| Método | Endpoint | Descripción | Rol requerido | Query Params |
|--------|----------|-------------|---------------|--------------|
| GET | / | Obtener sanciones paginadas | user/admin | pageIndex, pageSize, sortOrder, sortColumn, filterValue, estado |
| DELETE | /:id | Eliminar una sanción (baja lógica) | admin | — |
 
> Nota: El GET acepta el rol USER. En ese caso, el idSocio se extrae del payload del token en la cookie, evitando que un usuario acceda a información de otros socios.
 
---
 
#### 1) GET / — Query params
 
```json
{
  "pageIndex": "number (int >= 0)",
  "pageSize": "number (int >= 1)",
  "sortOrder": "asc | desc",
  "sortColumn": "fechaSancion",
  "filterValue": "number (int >= 0) [opcional] -- filtra por idSocio",
  "estado": "REVOCADA | VIGENTE | FINALIZADA [opcional]"
}
```
 
- Respuesta:
  - 200 → Página con sanciones.
 
---
 
#### 2) DELETE /:id
 
- Respuesta:
  - 200 → Sanción eliminada correctamente.
 
---
# Socios
 
---
 
#### 1) GET / — Query params
 
```json
{
  "pageIndex": "number (int >= 0)",
  "pageSize": "number (int >= 1)",
  "sortOrder": "asc | desc",
  "sortColumn": "id",
  "filterValue": "number (int >= 0) -- filtra por id de socio"
}
```
> Nota: Devuelve todos los socios, incluyendo los que tienen baja lógica.
 
- Respuesta:
  - 200 → Página con socios.
---
 
#### 2) GET /:id
 
> Nota: Solo devuelve socios sin baja lógica. Se usa para los CU de retirar libros y actualizar socio.
 
- Respuesta:
  - 200 → Socio encontrado.
  - 404 → Socio no encontrado (o con baja lógica).
 
---
 
#### 3) GET /:id/detail
 
> Nota: Puede devolver socios con baja lógica.
 
- Respuesta:
  - 200 → Detalle del socio encontrado.
  - 404 → Socio no encontrado.
 
```json
{
  "message": "string",
  "data": "SocioDetailDTO"
}
```
 
---
 
#### 4) GET /:id/validate
 
- Respuesta:
  - 200 → Socio habilitado. `data` contiene la cantidad de ejemplares disponibles para pedir prestado.
  - 404 → Socio no encontrado.
  - 409 + `DISABLED_SOCIO` → Socio inhabilitado (tiene préstamos atrasados).
  - 409 + `SANCTIONED_SOCIO` → Socio sancionado. `data` contiene los días restantes de sanción.
  - 500 → Política de biblioteca inaccesible.
 
```json
{
  "message": "string",
  "data": "number"
}
```
 
---
 
#### 5) POST /
 
> Nota: Crea el socio y un usuario con rol USER asociado. La contraseña inicial se genera automáticamente a partir del nombre y teléfono del socio.
 
- Body:
 
```json
{
  "nombre": "string (min 3, max 50)",
  "apellido": "string (max 50)",
  "domicilio": "string (max 50)",
  "telefono": "string (min 4, max 20)",
  "email": "string (email válido, max 50)"
}
```
 
- Respuesta:
  - 201 → Socio creado.
  - 409 + `DUPLICATED_EMAIL` → El email ya está registrado.
 
```json
{
  "message": "string",
  "data": "SocioWriteDTO"
}
```
 
---
 
#### 6) PATCH /:id
 
> Nota: El email no es modificable desde este endpoint.
 
- Body:
 
```json
{
  "nombre": "string (min 3, max 50) [opcional]",
  "apellido": "string (max 50) [opcional]",
  "domicilio": "string (max 50) [opcional]",
  "telefono": "string (min 4, max 20) [opcional]"
}
```
 
- Respuesta:
  - 200 → Socio actualizado.
  
---
 
#### 7) DELETE /:id
 
- Respuesta:
  - 200 con baja lógica → Socio dado de baja (tiene historial de préstamos).
  - 200 con baja física → Socio borrado (no tiene préstamos).
  - 409 → No se puede eliminar un socio con libros sin devolver.

---

 # Middlewares
 
---
 
### validateInput
 
Valida los parámetros de ruta, body y query contra schemas Zod. Se aplica por endpoint según corresponda.
 
| Caso | Status | Code |
|------|--------|------|
| Validación exitosa | — | — |
| Error de validación Zod | 400 | `VALIDATION_ERROR` |
 
---
 
### handleJsonSyntaxError
 
Intercepta errores de sintaxis en el JSON del body antes de que lleguen al controlador.
 
| Caso | Status | Code |
|------|--------|------|
| JSON malformado en el body | 400 | `INVALID_JSON` |
 
---
 
### verifyToken
 
Verifica que la cookie `access_token` exista y contenga un JWT válido. Se aplica en todos los endpoints protegidos.
 
| Caso | Status | Code |
|------|--------|------|
| Cookie ausente | 401 | `INVALID_TOKEN` |
| Token inválido o expirado | 401 | `INVALID_TOKEN` |
 
---
 
### verifyRol
 
Verifica que el rol del usuario autenticado esté entre los roles permitidos para el endpoint.
 
| Caso | Status | Code |
|------|--------|------|
| Rol no autorizado | 403 | — |
 
---
 
### handleInternalError
 
Manejador de último recurso. Captura cualquier error no controlado por los middlewares anteriores o los controladores.
 
| Caso | Status | Code |
|------|--------|------|
| Error no controlado | 500 | `INTERNAL_ERROR` |

