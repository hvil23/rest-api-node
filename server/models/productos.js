const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let productoSchema = new Schema({
    nombre: { type: String, required: [true, 'Se requiere el nombre'] },
    precioUni: { type: Number, required: [true, 'Se requiere el precio u.'] },
    descripcion: { type: String, required: false },
    disponible: { type: Boolean, required: true, default: true },
    categoria: { type: Schema.Types.ObjectId, ref: 'Categoria' },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    img: { type: String, required: false }
});

module.exports = mongoose.model('Producto', productoSchema);