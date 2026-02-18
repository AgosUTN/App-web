export const environment = {
  production: false,
  apiUrl: `http://localhost:3000`,
};

// No se puede acceder a las variables de entorno, pero se podría mejorar con un script de configuración.
// Las solicitudes se mandan desde el navegador a el puerto 3000 del host, luego docker lo mapea al 3000 del contenedor de la API.
