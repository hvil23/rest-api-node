// Import extern library's
const express = require('express');

const _ = require('underscore');

// Import model DB
const Categoria = require('../models/categorias');

const { verificaToken,verificaAdminRole } = require('../middlewares/autenticacion');

// Declare express in app
const app = express();

// Routing API
app.get('/categoria', verificaToken, (req,res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;    
    limite = Number(limite);

    let filtro = {};

    let campos = 'descripcion';

    Categoria.find(filtro,campos)
        .sort('descripcion')
        .skip(desde)
        .limit(limite)
        .populate('usuario','nombre email')
        .exec( (err,categorias) => {
        if (err){
            return  res.status(400).json({
                  ok: false,
                  err
              });
        }

        Categoria.countDocuments(filtro,(err, conteo)=> {
            res.json({
                ok: true,
                registros: conteo,
                categorias
                
            });
    
        })

  
    });

});


app.get('/categoria/:id', verificaToken, (req,res) => {

    let id = req.params.id;

    Categoria.findById(id, (err,categoriaDB) => {
        if (err){
            return  res.status(500).json({
                  ok: false,
                  err
              });
        }

        if (!categoriaDB){
            return  res.status(400).json({
                  ok: false,
                  err: {
                      message: 'No se encontro el id'
                  }
              });
        } 

        res.json({
            ok: true,
            categoriaDB
            
        });
  
    });

});

app.post('/categoria', verificaToken, (req,res) => {
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err){
          return  res.status(500).json({
                ok: false,
                err
            });
        } 

        if (!categoriaDB){
            return  res.status(400).json({
                  ok: false,
                  err
              });
        } 

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });


    
});

app.put('/categoria/:id',verificaToken, (req,res) => {

    let id = req.params.id;
    let body =  _.pick(req.body,['descripcion']);

    Categoria.findByIdAndUpdate(id, body,{new: true,useFindAndModify: false, runValidators: false}, (err,categoriaDB) => {
        if (err){
            return  res.status(500).json({
                  ok: false,
                  err: {
                      message: 'Error al actualizar el registro '
                  }
              })
        }

        if (!categoriaDB){
            return  res.status(400).json({
                  ok: false,
                  err
              });
        } 

        res.json({ ok: true,
            categoria: categoriaDB 
        });

    });

});

app.delete('/categoria/:id',[verificaToken,verificaAdminRole], (req,res) => {
    let id = req.params.id;

    // Borrado fisico
    Categoria.findByIdAndRemove(id, (err,categoriaDB) => {
        if (err){
            return  res.status(500).json({
                  ok: false,
                  err
              })
        }

        if ( !categoriaDB ){
            return  res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            })
        }

        res.json({ 
            ok: true,
            categoria: categoriaDB 
        });

    });
});

module.exports = app;