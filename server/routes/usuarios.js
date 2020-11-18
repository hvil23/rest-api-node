// Import extern library's
const express = require('express');

const bcrypt = require('bcrypt');

const _ = require('underscore');

// Import model DB
const Usuario = require('../models/usuarios');

const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

// Declare express in app
const app = express();

// Routing API
app.get('/usuario', verificaToken, (req,res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;    
    limite = Number(limite);

    let filtro = {google: false};

    let campos = 'nombre email role estado google img';

    Usuario.find(filtro,campos)
        .skip(desde)
        .limit(limite)
        .exec( (err,usuarios) => {
        if (err){
            return  res.status(400).json({
                  ok: false,
                  err
              });
        }

        Usuario.countDocuments(filtro,(err, conteo)=> {
            res.json({
                ok: true,
                registros: conteo,
                usuarios
                
            });
    
        })

  
    });

});

app.post('/usuario', [verificaToken, verificaAdminRole], (req,res) => {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password,10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err){
          return  res.status(400).json({
                ok: false,
                err
            })
        } 

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

    /*
    if (body.nombre === undefined){
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario',
        });
    }else{
        res.json({ persona: body });
    }
    */

    
});

app.put('/usuario/:id',[verificaToken, verificaAdminRole], (req,res) => {

    let id = req.params.id;
    let body =  _.pick(req.body,['nombre','email','img','role','estado']);

    //delete body.password;

    Usuario.findByIdAndUpdate(id, body,{new: true,useFindAndModify: false, runValidators: false}, (err,usuarioDB) => {
        if (err){
            return  res.status(400).json({
                  ok: false,
                  err: {
                      message: 'Error al actualizar el registro '
                  }
              })
        }

        res.json({ ok: true,
            usuario: usuarioDB 
        });

    });

});

app.delete('/usuario/:id',[verificaToken, verificaAdminRole], (req,res) => {
    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    };

    // Borrado logico
    Usuario.findByIdAndUpdate(id, cambiaEstado,{new: true,useFindAndModify: false}, (err,usuarioDB) => {

    // Borrado fisico
    //Usuario.findByIdAndRemove(id, (err,usuarioDB) => {
        if (err){
            return  res.status(400).json({
                  ok: false,
                  err
              })
        }


        if ( !usuarioDB ){
            return  res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        res.json({ ok: true,
            usuario: usuarioDB 
        });

    });
});

module.exports = app;