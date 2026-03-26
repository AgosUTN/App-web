# Propuesta TP DSW

## Grupo
### Integrantes

50757 - Montini Agostino. Comisión 303 del ciclo 2024 con los profesores Meca y Butti.

### Repositorios
* [Fullstack app](https://github.com/AgosUTN/App-web)

## Tema
### Descripción
Es un sistema de gestión interno para una biblioteca. El sistema está pensado para facilitar las tareas de gestión de un bibliotecario. (Préstamos, sanciones, gestión de socios, autores, libros, editoriales). 
El sistema:
  - NO está pensado para que un socio saque préstamos de forma virtual, los préstamos se deben realizar de forma              presencial, por ello no existe un cátalogo de libros.
  - NO Maneja cuestiones financieras.

### Modelo

Pendiente.

## Alcance Funcional 

- CRUD Autor, Editorial, Politica de Sanción.
- CRUD socio + user.
- CRUD libro (dependiente de autor y editorial) + ejemplar.
- "CRUD" préstamo + línea préstamo, sanción.
- Clase parámetrica "Política de Biblioteca".

- Filtrado por estado en CRUD préstamo y CRUD sanción. (Sumado al filtrado base que tienen todos los CRUD).
- Detalle Socio.
- Detalle Préstamo.
- Detalle Libro.

- CU "Retirar varios libros".
- CU "Devolver un libro".

---

### Alcance Técnico

Back:

- Paginación, filtrado por ID o nombre y ordenamiento del lado del servidor para todas las grillas.
- Filtrado por Estado (del lado del servidor) en CRUD préstamo y CRUD sancion. El filtrado del CRUD sanción supuso el uso del query builder de MikroOrm. 
- Caché del lado del cliente para las páginas ya cargadas. (Con vaciamiento si se navega entre CRUDS dentro del front end).
- Web sockets para invalidar el cache del lado del cliente si se actualiza, elimina o da de alta una instancia del CRUD donde está "parado" el cliente. De forma tal de que un usuario no tenga una página que contenga un registro que ya no existe, este modificado o no tenga un registro que ahora sí existe.
- Manejo adecuado de concurrencia en los dos puntos donde se pueden originar condiciones de carrera:
    - En el alta manual de un ejemplar no se necesita bloquear el registro del libro asociado, ya que si se diera de alta en paralelo otro ejemplar del mismo libro, se daría un error de clave primaria duplicada. No obstante, se tiene en cuenta dicho error y se maneja con un 409.
    - En el alta préstamo (paso 3 del CU retirar varios libros), podría pasar que se preste 2 veces el mismo ejemplar por 2 requests concurrentes con al menos 1 ejemplar en común. Desde el punto de vista de la BD, un ejemplar puede tener varias líneas de préstamo, por lo que no habría un error de la DB que evite que se preste 2 veces el mismo ejemplar. Para evitarlo, se bloquean los registros (se bloquea la lectura for update) de los ejemplares seleccionados hasta que termine la transacción del alta préstamo. De está forma, si existen 2 requests concurrentes que tienen 1 ejemplar en común, la segunda no se lleva adelante hasta que no termine la primera, logrando así que la segunda sea rechazada por la validación en memoria de ejemplar ya prestado.
       
- Autorización y Autenticación con JWT, protección de endpoints por rol. Uso de una cookie http only para guardar el token.
- Uso del patrón DTO para definir exactamente que información se retorna en cada endpoint, y para evitar exponer información sensible + Capa de mapeo.
- Validación con Zod para req.body, req.params y req.query.
- Manejo centralizado de los errores no contemplados, con un middleware que devuelve un 500.
- Seguridad extra en endpoints que tengan permiso de USER para evitar que un USER manipule los query params para conseguir información de otro socio. (2 Endpoints de préstamo y 1 de sanción).
- Uso de transacciones explícitas para cuando se necesita un contexto de transacción más grande que el de solo una operación. EJ: En retirar varios libros para el manejo de la concurrencia o en el alta socio para deshacer la creación del socio si se repitió el email en la creación del usuario.

---
Front:

- Interceptor que captura todos los errores que no son devueltos por el controlador. (A excepción de política de biblioteca no accesible, que es devuelto por controladores). Este interceptor redirige a una página de error que cambia según el tipo de error.
- Guard de login para evitar que un usuario logueado vea la pantalla de login.
- Interfaces para respuestas de la API y para los objetos que se envían y llegan. 
- Clase abstracta "Base Paged Component", la cual posee la mayoría de las funciones y variables necesarias para utilizar la mat table con paginación del lado del servidor.
- Clase abstracta "Base Crud Service", que implementa el getById, getAllByPage, update, delete, post. Se usa en todos los servicios que sean de un CRUD que tenga las 4 operaciones.
- Auth Guard.
- Interceptor + Servicio para implementar el cache del lado del cliente.
- Crud tracking service, usado para vaciar la cache si se navega a otro CRUD.
- Socket service. Permite que el front reciba la orden de borrar la cache por parte de la API. Nota: Solo se borra la cache si el usuario está parado en el CRUD que la API informó.

- CARD LAYOUT en mobile para todos los CRUD.
- Transición sin colapsamiento de mobile a desktop y viceversa en TODAS la pantallas. Con el detalle de que de mobile a desktop se aplica primero el cambio del media query, generando un efecto visual no satisfactorio durante un breve momento. 
