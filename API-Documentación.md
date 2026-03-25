## Endpoints 

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



