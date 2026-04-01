## Funcionalidades pendientes
---

Durante el transcurso del TP fui identificando cosas que estaban mal o eran mejorables. La inmensa mayoría las solucioné o implementé, pero algunas quedaron pendientes.

- Dashboard.
- CU cambiar contraseña. 
- Notificación por mail de préstamo por vencer / vencido.
- Permitir carga masiva de libros, utilizando algún formato estandarizado para sistemas que alberguen información de libros.
- QR asociado a un ejemplar, que al leerlo se cargue el libro en el paso 2 del CU "retirar varios libros".
- Funcionalidades relativas a la gestión de cuotas.

Dado que el alcance del sistema superaba por mucho al solicitado, incluso para un grupo de 4 integrantes, no implementé esas cuestiones. 

---

## Backend
---

1) No hay centralización de errores en la API. (Si bien está el middleware que agarra los errores no manejados por el controlador, se podría haber dejado que el controlador tire el error y se maneje el formato de respuesta en un middleware. De forma tal que se pueda estandarizar más fácil el formato de respuesta).

2) No se estandarizó el formato de respuesta. A veces hay message + data, otras veces solo message o message + code.

3) Uso de findAndCount en getByPage:
   - Realiza dos queries (find + count).
   - Para cambios de página debería hacerse solo find.
   - Para cambios de filtros u orden, sí corresponde findAndCount.
   - En tablas grandes, el count tiene un costo alto.

4) No se respeta completamente la consistencia de dominio:
   - Atributos como ISBN o título no deberían modificarse.
   - Cambiarlos puede afectar el histórico (por ejemplo, préstamos asociados).

5) No hay lógica de reintento de conexión a la base de datos.

6) Se pueden saltear restricciones unique utilizando espacios en blanco.
   - Falta normalización/validación de datos (trim, lowercase, etc.).

7) No se realizó versionado de la API.

8) No se modeló el estado "Atrasado" en préstamos y LP. El estado existe implícitamente, ya que si se devuelve una LP atrasada hay sanción. Pero no realicé filtrado por ese estado.

9) Uso de PATCH para updates con todos los campos opcionales:
   - En la práctica muchas veces se envía el objeto completo.
   - Puede no ser la mejor decisión semántica.

10) La emisión de eventos (io.emit) se realiza en controladores:
    - Podría delegarse a hooks del ciclo de vida de entidades en MikroORM para así dejar más limpio el controlador.

---

## Frontend
---

1) No se realizó una función "isOverflow" para mostrar tooltip de forma condicional en celdas de tablas con overflow.  
Se intentó pero daba problemas el sistema de detección de cambios de Angular. Actualmente se muestra el tooltip siempre (solo en celdas que puedan tener overflow según mi criterio).

2) En lugar de pedir una sola página en los getByPage, se deberían pedir múltiples páginas (por ejemplo de 3 a 5 si el pageSize es 6):
   - Reduce la frecuencia de skeleton loaders.
   - Mejora la experiencia de usuario.

3) Se podría refinar la regla de vaciamiento de cache, por ejemplo, con manejo de caché por grupo en lugar de por CRUD:
   - Ejemplo: sanción, préstamo y socio como grupo relacionado.
   - Evita vaciar el cache al navegar entre ellos.

4) Invalidación de caché más precisa:
   - Actualmente se eliminan todas las páginas cacheadas.
   - Debería eliminarse solo la página que contiene el registro afectado.

5) En el cambio de mobile a desktop:
   - Las clases CSS cambian antes que el template y genera un efecto visual feo al pasar de mobile a desktop, no pasa de desktop a mobile.
   - Ocurre porque el media query es más rápido que Angular.
   - Idealmente debería manejarse desde Angular.

6) Evitar doble click en acciones como "detail":
   - Puede abrir múltiples veces el mismo diálogo.
