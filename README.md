Recordar que todo cambio realizado al schema de la DB sin ORM, va a persistir en el volumen pero eventualmente para compartir la imagen del proyecto con alguien o para deployar, va a haber que realizar un nuevo DUMP de la DB para actualizar el init.sql con los cambios finales.

Para producción en realidad se usan herramientas como FlyWay, pero en mi caso aplica más una solución informal como la que explique.

Por ahora, algunas variables de entorno quedaron expuestas en el init.sql, para evitarlo
habria que crear un script.
