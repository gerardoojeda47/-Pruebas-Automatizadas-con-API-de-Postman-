import Producto from "../models/producto.js"
import mongoose from "mongoose"

// Crear producto
export async function crearProducto(req, res) {
    try {
        const nuevoProducto = new Producto(req.body);
        const productoGuardado = await nuevoProducto.save();
        console.log(nuevoProducto);
        res.status(201).json(productoGuardado);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// Obtener todos los productos
export async function obtenerProductos(req, res) {
    try {
        const productos = await Producto.find().lean();
        res.json(productos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Obtener un producto por id
export async function obtenerProducto(req, res) {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "ID no válido" });
        }

        const producto = await Producto.findById(req.params.id).lean();
        if (!producto) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.json(producto);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Eliminar producto
export async function eliminarProducto(req, res) {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "ID no válido" });
        }

        const productoEliminado = await Producto.findByIdAndDelete(req.params.id);
        if (!productoEliminado) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        // Ajuste: mensaje con mayúscula inicial para pasar pruebas Postman
        res.json({ mensaje: "Producto Eliminado" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Actualizar producto
export async function actualizarProducto(req, res) {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "ID no válido" });
        }

        const productoActualizado = await Producto.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!productoActualizado) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        res.json({ mensaje: "Producto Actualizado", producto: productoActualizado });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}


 