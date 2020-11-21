const express = require('express');

const fileUpload = require('express-fileupload');

const fs = require('fs');

const path = require('path');

const app = express();

const Usuario = require('../models/usuarios');

const Producto = require('../models/productos');

app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files){
        return res.status(400)
         .json({
            ok: false,
            err: {
                message: 'No se ha seleccionado archivo'
            }
        });
    }

    tipos = ['productos','usuarios'];

    if (tipos.indexOf(tipo) < 0){
        return res.status(400).json({
            ok:false,
            err:{
                message: 'Los tipos permitidos son: ' +tipos.toString()
            }
        }
    );
    }

    let archivo = req.files.archivo;

    let extensiones = ['png','jpg','gif','jpeg'];
    let partesArchivo = archivo.name.split('.');
    let extension = partesArchivo[partesArchivo.length-1];
    if (extensiones.indexOf(extension) < 0){
        return res.status(400).json({
                ok:false,
                err:{
                    message: 'Las extensiones permitidas son: ' +extensiones.toString()
                }
            }
        );
    }

    let nuevoArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`uploads/${tipo}/${nuevoArchivo}`, (err) => {
        if (err){
            return res.status(500).json({
               ok: false,
               err
           });          
        }

        if (tipo==='usuarios'){
            imagenUsuario(id,res,nuevoArchivo);
        }else if(tipo==='productos'){
            imagenProduto(id,res,nuevoArchivo);
        }


    });
});

function imagenUsuario(id,res,nuevoArchivo){
    Usuario.findById(id,(err,usuarioDB) => {
        if (err){
            borraArchivo(nuevoArchivo,'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB){
            borraArchivo(nuevoArchivo,'usuarios');
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'Usuario no existe'
                }
            });
        }

        borraArchivo(usuarioDB.img,'usuarios');

        usuarioDB.img = nuevoArchivo;

        usuarioDB.save((err,usuarioGuardado) => {
            if (err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            return res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nuevoArchivo
            });
        });

    });
}

function imagenProduto(id,res,nuevoArchivo){
    Producto.findById(id,(err,productoDB) => {
        if (err){
            borraArchivo(nuevoArchivo,'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB){
            borraArchivo(nuevoArchivo,'productos');
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'Producto no existe'
                }
            });
        }

        borraArchivo(productoDB.img,'productos');

        productoDB.img = nuevoArchivo;

        productoDB.save((err,productoGuardado) => {
            if (err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            return res.json({
                ok: true,
                producto: productoGuardado,
                img: nuevoArchivo
            });
        });

    });  
}

function borraArchivo(nombreImagen,tipo){
    let pathImagen = path.resolve(__dirname,`../../uploads/${ tipo }/${ nombreImagen }`);

    if (fs.existsSync(pathImagen)){
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;