# Postman / Newman

## Colección y entorno

- Importa `postman/Productos-API-collection-simple.json`.
- Importa el entorno `postman/Local-environment.json` y selecciónalo.

La colección ya incluye:
- Variable de colección `CANTIDAD_PRODUCTOS` inicializada en 0 y actualizada en:
  - Obtener Productos (longitud del array)
  - Crear y Eliminar (recalcula haciendo GET y setea la variable)
- Verificación en Eliminar: `mensaje === "Producto Eliminado"`.
- Verificación en Actualizar: respuesta contiene `producto` objeto.

## Ejecutar pruebas por CLI con Newman

Instalado como devDependency. Comandos disponibles:

```bash
npm run test:api
```

Generar reporte HTML en `postman/newman-report.html`:

```bash
npm run test:api:report
```

Asegúrate de tener el servidor en marcha en `http://localhost:3000` o ajusta `baseUrl` en el entorno.

# Guía de Pruebas en Postman

## Requisitos previos

- Node.js en ejecución con el servidor:
  1. Configura `.env` con `MONGODB_URI`.
  2. Inicia el servidor:
     ```bash
     npm start
     ```
  3. Verifica en consola: "Servidor en puerto 3000" y "MongoDB conectado".

## Importación en Postman

1. Importa el environment: `postman/Local-environment.json` (opcional si usas el BASE_URL por defecto).
2. Importa la colección: `postman/Productos-API-collection-simple.json`.
3. Revisa variables de colección:
   - `BASE_URL`: http://localhost:3000
   - `CANTIDAD_PRODUCTOS`: 0
   - `ID_PRODUCTO`: "" (vacío, se autollenará al crear)

## Endpoints disponibles

- POST `/api/productos` → Crea producto
- GET `/api/productos` → Lista productos
- GET `/api/productos/:id` → Obtiene un producto
- PUT `/api/productos/:id` → Actualiza producto
- DELETE `/api/productos/:id` → Elimina producto

## Flujo recomendado de pruebas

1. Obtener Productos

   - Ejecuta "Obtener Productos".
   - Verifica que el test actualiza la variable de colección `CANTIDAD_PRODUCTOS` al tamaño de la lista.

2. Crear Producto

   - Ejecuta "Crear Producto".
   - Usa datos dinámicos para `codigo`, `nombre`, `precio` y `categoria` (evita duplicados por código).
   - URL: `{{baseUrl}}/api/productos`
   - Body (JSON):
     ```json
     {
       "codigo": 12345,
       "nombre": "Camisa",
       "precio": 39990,
       "categoria": "Ropa"
     }
     ```
   - Resultado esperado:
     - Código 200/201.
     - Se captura automáticamente `_id` en la variable de colección `ID_PRODUCTO`.
     - Se recalcula `CANTIDAD_PRODUCTOS` invocando GET.

3. Actualizar Producto

   - Ejecuta "Actualizar Producto".
   - Requiere `ID_PRODUCTO` (ya autollenado por el paso anterior).
   - URL: `{{baseUrl}}/api/productos/{{ID_PRODUCTO}}`
   - Body (JSON):
     ```json
     {
       "nombre": "Camisa Premium",
       "precio": 79990
     }
     ```
   - Resultado esperado:
     - Código 200.
     - Respuesta con `{ mensaje: "Producto Actualizado", producto }` y `producto` es un objeto.

4. Eliminar Producto
   - Ejecuta "Eliminar Producto".
   - URL: `{{baseUrl}}/api/productos/{{ID_PRODUCTO}}`
   - Resultado esperado:
     - Código 200.
     - Respuesta `{ mensaje: "Producto Eliminado" }`.
     - Se recalcula `CANTIDAD_PRODUCTOS` mediante GET.

## Pruebas de errores (robustez)

- Los siguientes endpoints ahora están organizados dentro de la carpeta **“Pruebas de errores”** en la colección.

5. Obtener Producto - ID inválido

   - Ejecuta "Obtener Producto - ID inválido".
   - Resultado esperado:
     - Código 400.
     - `body.error === "ID no válido"`.

6. Obtener Producto - No encontrado

   - Ejecuta "Obtener Producto - No encontrado".
   - Resultado esperado:
     - Código 404.
     - `body.error === "Producto no encontrado"`.

7. Actualizar Producto - ID inválido

   - Ejecuta "Actualizar Producto - ID inválido".
   - Resultado esperado:
     - Código 400.
     - `body.error === "ID no válido"`.

8. Actualizar Producto - No encontrado

   - Ejecuta "Actualizar Producto - No encontrado".
   - Resultado esperado:
     - Código 404.
     - `body.error === "Producto no encontrado"`.

9. Eliminar Producto - ID inválido

   - Ejecuta "Eliminar Producto - ID inválido".
   - Resultado esperado:
     - Código 400.
     - `body.error === "ID no válido"`.

10. Eliminar Producto - No encontrado

   - Ejecuta "Eliminar Producto - No encontrado".
   - Resultado esperado:
     - Código 404.
     - `body.error === "Producto no encontrado"`.

## Notas técnicas

- La colección define `CANTIDAD_PRODUCTOS` y la recalcula haciendo un GET interno a `/api/productos` desde los tests de POST y DELETE.
- "Crear Producto" guarda automáticamente `_id` en `ID_PRODUCTO` para encadenar PUT/DELETE sin intervención manual.

## Solución de problemas

- Si recibes error de conexión a MongoDB:
  - Verifica `MONGODB_URI` en `.env`.
  - Revisa que el clúster/instancia esté accesible.
- Si `ID_PRODUCTO` no se setea tras crear:
  - Asegúrate que el POST responde el documento creado con campo `_id`.
  - Revisa la pestaña Variables de colección para confirmar que se actualizó.
- Si CORS falla al llamar desde clientes externos:
  - El servidor ya tiene `cors()` habilitado en `app.js`.
