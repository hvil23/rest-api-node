// Import extern library's
const express = require('express');

const _ = require('underscore');

// Import model DB
const Producto = require('../models/productos');

const { verificaToken,verificaAdminRole } = require('../middlewares/autenticacion');

// Declare express in app
const app = express();

// Routing API
app.get('/productos/buscar/:termino', verificaToken, (req,res) => {
    
    let termino = req.params.termino;

    let regex = new RegExp(termino,'i');

    Producto.find({nombre: regex})
        .populate('usuario','nombre email')
        .populate('categoria','descripcion')
        .exec( (err,productos) => {
            if (err){
                return  res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
                
            });

        });

});

app.get('/productos', verificaToken, (req,res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;    
    limite = Number(limite);

    let filtro = { disponible: true};

    Producto.find(filtro)
        .sort('descripcion')
        .skip(desde)
        .limit(limite)
        .populate('usuario','nombre email')
        .populate('categoria','descripcion')
        .exec( (err,productos) => {
        if (err){
            return  res.status(400).json({
                  ok: false,
                  err
              });
        }

        Producto.countDocuments(filtro,(err, conteo)=> {
            if (err){
                return  res.status(500).json({
                      ok: false,
                      err
                  });
            }

            res.json({
                ok: true,
                registros: conteo,
                productos
                
            });
    
        })

    });

});


app.get('/producto/:id', verificaToken, (req,res) => {

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario','nombre email')
        .populate('categoria','descripcion')
        .exec( (err,productoDB) => {
            if (err){
            return  res.status(500).json({
                  ok: false,
                  err
              });
            }

            if (!productoDB){
                return  res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se encontro el id'
                    }
                });
            } 

            res.json({
                ok: true,
                productoDB
                
            });
  
         });

});

app.post('/producto', verificaToken, (req,res) => {
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err){
          return  res.status(500).json({
                ok: false,
                err
            });
        } 

        if (!productoDB){
            return  res.status(400).json({
                  ok: false,
                  err
              });
        } 

        res.json({
            ok: true,
            producto: productoDB
        });
    });

});

app.put('/producto/:id',verificaToken, (req,res) => {

    let id = req.params.id;
    let body =  req.body;

    Producto.findByIdAndUpdate(id, body,{new: true,useFindAndModify: false, runValidators: false}, (err,productoDB) => {
        if (err){
            return  res.status(500).json({
                  ok: false,
                  err: {
                      message: 'Error al actualizar el registro '
                  }
              })
        }

        if (!productoDB){
            return  res.status(400).json({
                  ok: false,
                  err: {
                      message: 'El id no existe'
                  }
              });
        } 

        res.json({ 
            ok: true,
            producto: productoDB 
        });

    });

});

app.delete('/producto/:id',[verificaToken,verificaAdminRole], (req,res) => {
    let id = req.params.id;

    // Borrado fisico
    Producto.findById(id, (err,productoDB) => {
        if (err){
            return  res.status(500).json({
                  ok: false,
                  err
              })
        }

        if ( !productoDB ){
            return  res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            })
        }

        productoDB.disponible = false;

        productoDB.save((err,productoBorrado) => {
            if (err){
                return  res.status(500).json({
                      ok: false,
                      err
                  });
            }

            res.json({ 
                ok: true,
                producto: productoBorrado 
            });
        });


    });
});

module.exports = app;