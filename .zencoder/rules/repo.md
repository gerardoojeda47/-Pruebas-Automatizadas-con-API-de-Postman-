# Repo Overview

## App

- **Framework**: Express (type: module)
- **Entry**: app.js
- **CORS**: enabled
- **JSON body parsing**: enabled
- **Routes base**: /api/productos

## DB

- **ODM**: Mongoose
- **Connection**: process.env.MONGODB_URI (dotenv)

## Model

- **Producto**:
  - **codigo**: Number, required, unique
  - **nombre**: String, required
  - **precio**: Number, required
  - **categoria**: String, enum ['Ropa','Calzado','Electrodomestico'], required

## Controllers

- **crearProducto (POST /api/productos)**: returns created doc (201)
- **obtenerProductos (GET /api/productos)**: returns array of productos
- **obtenerProducto (GET /api/productos/:id)**: returns doc or 404
- **actualizarProducto (PUT /api/productos/:id)**: returns { mensaje:"Producto Actualizado", producto }
- **eliminarProducto (DELETE /api/productos/:id)**: returns { mensaje:"Producto Eliminado" }

## Package

- **start**: node app.js
- **deps**: express ^5.1.0, mongoose ^8.16.1, cors ^2.8.5, dotenv ^17.0.0

## Postman Notes

- **BASE_URL**: http://localhost:3000 (sugerido)
- **Variable colección**: CANTIDAD_PRODUCTOS
- **Validaciones**:
  - GET /api/productos: set CANTIDAD_PRODUCTOS = length
  - POST/DELETE: recalcular vía GET
  - DELETE: verificar body.mensaje === "Producto Eliminado"
  - PUT: body.producto es objeto
