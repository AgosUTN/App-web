// Objeto de codigos personalizado para "eventos" que ocurren en el backend.

export const SOCKET_EVENTS = {
  CACHE_INVALIDATE: "cache:invalidate",
} as const; // Lo convierte en objeto inmutable.

// Tipos para lo que debe recibir el socket service en los eventos.

export interface InvalidateCacheData {
  crud: string;
}

// Archivo duplicado en la API
